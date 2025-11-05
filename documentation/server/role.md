# Distributed Messaging Platform — Microservices Architecture

## 1) gateway/ — Go API gateway (entrypoint)

**What it does (brain + bouncer):**  
Terminates HTTPS/WebSocket, validates JWT, rate-limits, and routes to inner services.  
Publishes user messages to Kafka; pushes deliveries to online users via WebSocket.  
Holds ephemeral presence (via Redis) and session fan-out.

**Core endpoints/streams:**  
- POST /v1/login, POST /v1/register → forwards to auth-service  
- GET /v1/keys/:userId → fetches public keys from key-service  
- POST /v1/messages → validates + publishes to kafka.topic=messages.in  
- WebSocket /ws → subscribe to your personal delivery stream  

**Other details:**  
Rate limit buckets (IP, user, route).  
Stores: nothing persistent; only in-memory/Redis presence and WS sessions.  
Security: TLS, mTLS to internal services, JWT verification, HMAC on WebSocket frames optional.  
Scaling: stateless; scale out behind LB; sticky sessions optional for WS.  
Failure patterns: backpressure to Kafka, degrade to “store-and-forward” if a recipient is offline.

---

## 2) auth-service/ — Python (FastAPI/Flask)

**What it does (identity & trust):**  
User registration, login, password hashing (Argon2), email/OTP verification.  
Issues JWT access + refresh tokens; rotates signing keys (JWKS).  
Manages user profile (minimal PII), device records, session revocation.

**Core endpoints:**  
- POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/logout  
- GET /auth/jwks.json (public signing keys for JWT validation)  
- GET /users/me, PATCH /users/me  

**DB (PostgreSQL):**  
- users(id, email, password_hash, created_at, status)  
- devices(id, user_id, device_pubkey_fingerprint, last_seen)  
- revoked_tokens(jti, exp)  

Security: Argon2, email/OTP, device binding, IP throttling.  
Scaling: stateless API; DB has read-replicas; token verification is local via JWKS.  
Failures: lock account after N failed logins, consistent token revocation via cache.

---

## 3) key-service/ — Rust (crypto & key material)

**What it does (E2E guardian):**  
Stores only public keys; validates key ownership using signed challenges.  
Manages session setup (X25519 ECDH), returns ephemeral session parameters.  
Verifies signatures on key-change events; tracks fingerprints to prevent MITM.  
Optional: assists with Double Ratchet state coordination (metadata only, never plaintext).

**Core endpoints (gRPC/REST):**  
- POST /keys/registerPublicKey (upload/verify user device public key)  
- GET /keys/:userId (public key & latest fingerprint)  
- POST /session/handshake (server-assisted ECDH metadata exchange)  
- POST /keys/rotate (key rollover with proof)

**DB:**  
- public_keys(user_id, device_id, pubkey, fingerprint, created_at, active)  
- key_rollovers(user_id, old_fp, new_fp, proof, ts)

Security: memory-safe Rust, constant-time crypto ops, secure RNG, mTLS, audit logs.  
Scaling: CPU-bound; scale by cores; tiny responses; cache hot keys in Redis.  
Failures: reject mismatched fingerprints, alert on suspicious rapid key rotations.

---

## 4) messaging-service/ — Go (Kafka consumer, delivery)

**What it does (message router):**  
Consumes from messages.in (produced by Gateway), validates schema, writes ciphertext to DB.  
Determines recipient delivery: if online → push via Gateway WS; if offline → persist for later.  
Emits delivery receipts & read receipts to Kafka topics.

**Kafka topics:**  
- messages.in (incoming from clients)  
- messages.persisted (after DB write)  
- receipts.delivery / receipts.read  

**DB (PostgreSQL or Cassandra if huge):**  
- messages(id, conv_id, sender_id, recipient_id, ciphertext, nonce, auth_tag, ts)  
- inbox(user_id, message_id, status{queued,delivered,read}, ts)  

**Redis:**  
- presence:userId -> gatewayInstance  
- queue:undelivered:userId (optional fast path)

Security: stores only ciphertext + minimal metadata; strict PII minimization.  
Scaling: partition Kafka by recipient_id (affinity), scale consumers horizontally.  
Failures: exactly-once semantics via idempotent producers + consumer offsets; retry with DLQ (messages.dlq).

---

## 5) file-service/ — Node.js (file/media upload)

**What it does (encrypted media):**  
Accepts client-side encrypted file chunks; verifies MACs; streams to S3/MinIO.  
Generates short-lived pre-signed URLs for download; enforces access to owners/recipients.  
Optional server-side encryption (SSE-S3) on top of client E2E.

**Core endpoints:**  
- POST /files/initiate (negotiate chunking, get upload ID)  
- PUT /files/:uploadId/chunk/:n (streamed upload)  
- POST /files/:uploadId/complete  
- GET /files/:fileId/url (signed URL for download)

**DB:**  
- files(id, owner_id, recipients[], size, media_type, storage_key, checksum, created_at)

Security: client encrypts with AES-GCM/ChaCha20-Poly1305; Node just moves ciphertext; validates auth.  
Scaling: Node excels at streaming I/O; front with CDN; scale horizontally.  
Failures: resumable uploads, dedupe by checksum, virus scanning (optional) on ciphertext envelope.

---

## 6) worker-service/ — Python or JS (async jobs)

**What it does (do the “later” things):**  
Consumes from Kafka notifications, receipts, audit topics.  
Sends push notifications (FCM/APNs), emails, cleans old sessions, retries failed deliveries.  
Periodic jobs: TTL cleanup, compaction, generating daily metrics snapshots.

**Queues/topics:**  
- notifications.push, receipts.delivery, audit.events, compaction.jobs

Security: least-privilege creds; exponential backoff; dedupe keys for idempotency.  
Scaling: scale consumer group by lag; safe to have many replicas.  
Failures: poison-message handling → send to DLQ; alerting on repeated failures.

---

## 7) analytics-service/ — Go or Python (metrics & audit)

**What it does (observability + BI):**  
Listens to event streams and aggregates: DAU, WAU, p50/p95 latencies, delivery time, queue lag.  
Exposes Prometheus /metrics; pushes logs to Loki; traces via OpenTelemetry.  
Optionally builds product analytics views (no content, only metadata) for ops dashboards.

**Pipelines:**  
Kafka events.* → ClickHouse/Timescale → Grafana dashboards  
Exporters for Redis/Kafka/DB health

Security: no plaintext; only technical metadata; access controlled dashboards.  
Scaling: append-only writes, columnar DB (ClickHouse) for high ingest; separate retention policies.  
Failures: backfill jobs if sink was down; alert on lag thresholds.

---

## How they work together (message send example)

Client encrypts message (E2E) → gateway  
gateway verifies JWT, rate-limits → Kafka messages.in  
messaging-service consumes, stores ciphertext, emits messages.persisted  
Checks Redis presence → if online, pushes to gateway for WS delivery; else marks pending  
worker-service triggers push notification  
Client receives cipher, decrypts locally, sends read receipt → receipts.read  
analytics-service updates delivery latency metrics

---

## Testing focus (per service)

- gateway: WS soak tests (k6), JWT/mTLS tests, rate-limit correctness  
- auth-service: unit (Pytest), token rotation, revocation, brute-force defenses  
- key-service: property-based crypto tests (Rust), signature/handshake proofs  
- messaging-service: Kafka integration, idempotency, DLQ flows, race-conditions  
- file-service: chunked upload/download, resumable flows, pre-signed URLs  
- worker-service: retry policies, idempotent handlers, DLQ processing  
- analytics-service: metric correctness, high-ingest backpressure handling
