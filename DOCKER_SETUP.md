# Docker Compose Setup Guide

## Project Overview

This is an **End-to-End Encrypted Messaging Application** with the following architecture:

### Services & Ports

| Service | Port | Technology | Description |
|---------|------|-----------|-------------|
| **Client** | 3000 | Next.js + React | Frontend application |
| **Auth Service** | 5000 | Node.js/Express | Authentication & OTP |
| **User Service** | 5001 | Node.js/Express | User profiles & keys |
| **Message Service** | 5002 | Node.js/Express | Message storage & retrieval |
| **Realtime Service** | 5004 | Node.js/Socket.io | Real-time messaging |
| **MongoDB Auth** | 27017 | MongoDB 7.0 | Auth database |
| **MongoDB User** | 27018 | MongoDB 7.0 | User database |
| **MongoDB Message** | 27019 | MongoDB 7.0 | Message database |
| **Redis** | 6379 | Redis 7 Alpine | Cache & session store |

---

## Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (for local development)
- Git

---

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "End to end encrypted messaging app/app"
```

### 2. Setup Environment Variables

Copy the environment template and update with your credentials:

```bash
cp .env.docker .env.local
```

**Important**: Update these variables in `.env.local`:

```env
# Email Service
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

Get credentials from:
- **Google OAuth**: https://console.cloud.google.com/
- **Turnstile**: https://dash.cloudflare.com/
- **Email**: Gmail App Password (enable 2FA, then generate app password)

### 3. Build and Start Services

```bash
# Build all services
docker-compose build

# Start all services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Auth API**: http://localhost:5000/api/auth
- **User API**: http://localhost:5001/api/user
- **Message API**: http://localhost:5002/api/message
- **Realtime**: http://localhost:5004

### 5. Access MongoDB Databases

Use MongoDB Compass or mongosh:

```bash
# Connection URI
mongodb://admin:admin123@localhost:27017/auth-service?authSource=admin
```

**Credentials**:
- Username: `admin`
- Password: `admin123`

### 6. Access Redis Cache

```bash
# Using Redis CLI
docker exec -it redis-cache redis-cli

# Common commands
PING
KEYS *
GET <key>
```

---

## Development Workflow

### Running Specific Services

```bash
# Start only backend services (no client)
docker-compose up -d mongo-auth mongo-user mongo-message redis auth-service user-service message-service realtime-service

# Start only databases
docker-compose up -d mongo-auth mongo-user mongo-message redis

# Start only one service
docker-compose up -d auth-service
```

### View Service Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f auth-service
docker-compose logs -f client

# Last 100 lines
docker-compose logs --tail=100 auth-service

# Real-time log streaming
docker-compose logs -f --timestamps
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart auth-service

# Full rebuild (removes containers)
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Clear Data & Reset

```bash
# Remove all containers and volumes (⚠️ Clears all data)
docker-compose down -v

# Remove only containers (keeps volumes)
docker-compose down

# Prune unused Docker resources
docker system prune -a --volumes
```

---

## Environment Variables

### Service Configuration

Each service uses the following environment variables:

```env
# Database URLs (automatically configured for Docker)
MONGO_AUTH_SERVICES_URL=mongodb://admin:admin123@mongo-auth:27017/auth-service?authSource=admin
MONGO_USER_SERVICES_URI=mongodb://admin:admin123@mongo-user:27017/user-service?authSource=admin
MONGO_MESSAGE_SERVICES_URI=mongodb://admin:admin123@mongo-message:27017/message-service?authSource=admin

# Redis (automatically configured for Docker)
REDIS_URL=redis://redis:6379

# Authentication
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Email Service
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=xxx
```

---

## Service Details

### 1. **Auth Service** (Port 5000)

**Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/otp/send` - Send OTP
- `POST /api/otp/verify` - Verify OTP
- `POST /api/auth/refresh` - Refresh token

**Dependencies:**
- MongoDB Auth
- Redis
- Email Service

### 2. **User Service** (Port 5001)

**Endpoints:**
- `GET /api/user/profile` - Get user profile
- `POST /api/user/update` - Update profile
- `POST /api/keys/store` - Store encryption keys
- `GET /api/user/search` - Search users

**Dependencies:**
- MongoDB User
- Redis
- Auth Service (verification)

### 3. **Message Service** (Port 5002)

**Endpoints:**
- `GET /api/message/chat/:id` - Get chat messages
- `POST /api/message/send` - Send message
- `GET /api/message/history` - Get message history

**Dependencies:**
- MongoDB Message
- Redis
- Auth Service (verification)

### 4. **Realtime Service** (Port 5004)

**Socket.io Events:**
- `send-message` - Send real-time message
- `user-online` - User online status
- `user-offline` - User offline status
- `typing` - User typing indicator

**Dependencies:**
- Redis (for cross-server communication)
- Auth Service (verification)

### 5. **Client** (Port 3000)

**Features:**
- User authentication UI
- Chat interface
- User search
- Real-time messaging
- End-to-end encryption (frontend)

**Dependencies:**
- All backend services

---

## Database Schema

### MongoDB Collections

#### Auth Service (`auth-service`)
- `users` - User credentials
- `refresh_tokens` - Refresh token storage
- `otps` - OTP records

#### User Service (`user-service`)
- `users` - User profiles
- `encryption_keys` - Public/private keys
- `user_preferences` - User settings

#### Message Service (`message-service`)
- `chats` - Chat conversations
- `messages` - Encrypted messages
- `chat_preferences` - Chat settings

---

## Debugging & Troubleshooting

### Service Won't Start

```bash
# Check service logs
docker-compose logs auth-service

# Check if ports are in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                # macOS/Linux

# Verify service health
docker-compose ps
```

### MongoDB Connection Issues

```bash
# Test MongoDB connection
docker exec mongo-auth mongosh -u admin -p admin123 --authSource admin

# Check MongoDB logs
docker-compose logs mongo-auth

# Verify volumes
docker volume ls | grep mongo
```

### Redis Connection Issues

```bash
# Test Redis connection
docker exec redis-cache redis-cli ping

# Check Redis logs
docker-compose logs redis

# Clear Redis cache (⚠️ removes all cached data)
docker exec redis-cache redis-cli FLUSHALL
```

### Service Health Checks

```bash
# View health status
docker-compose ps

# Check specific service health
docker inspect auth-service --format='{{.State.Health.Status}}'
```

---

## Production Considerations

### For Production Deployment:

1. **Use External Databases**
   - Replace local MongoDB with MongoDB Atlas
   - Replace Redis with AWS ElastiCache or Upstash

2. **Environment Variables**
   - Use actual strong credentials
   - Implement secrets management (AWS Secrets Manager, Vault)
   - Never commit `.env` files

3. **Security**
   - Add rate limiting
   - Implement request validation
   - Use HTTPS/TLS
   - Configure CORS properly
   - Add API authentication headers

4. **Monitoring & Logging**
   - Implement centralized logging (ELK, Datadog)
   - Add health check endpoints
   - Monitor database performance
   - Track API response times

5. **Scaling**
   - Use load balancing for services
   - Implement database indexing
   - Cache frequently accessed data
   - Consider message queue (RabbitMQ, Kafka)

---

## Docker Commands Reference

```bash
# Build services
docker-compose build
docker-compose build --no-cache auth-service

# Start services
docker-compose up                    # Foreground
docker-compose up -d                 # Background
docker-compose up --scale auth-service=3  # Scale service

# View status
docker-compose ps
docker-compose images
docker-compose config

# View logs
docker-compose logs -f
docker-compose logs --tail=50 auth-service

# Execute commands in container
docker-compose exec auth-service npm test
docker-compose exec redis-cache redis-cli

# Stop/Remove
docker-compose stop                  # Stop containers
docker-compose restart               # Restart containers
docker-compose down                  # Remove containers
docker-compose down -v              # Remove containers & volumes

# Cleanup
docker system prune
docker volume prune
docker network prune
```

---

## File Structure

```
app/
├── docker-compose.yml          # Docker orchestration config
├── .env.docker                 # Docker environment template
├── client/
│   ├── Dockerfile              # Next.js container config
│   └── ...
├── server/
│   ├── auth-service/
│   │   ├── Dockerfile
│   │   └── app.js
│   ├── user-service/
│   │   ├── Dockerfile
│   │   └── app.js
│   ├── messaging-service/
│   │   ├── Dockerfile
│   │   └── app.js
│   └── realtime-service/
│       ├── Dockerfile
│       └── app.js
```

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Specification](https://docs.docker.com/compose/compose-file/)
- [MongoDB Docker](https://hub.docker.com/_/mongo)
- [Redis Docker](https://hub.docker.com/_/redis)
- [Next.js Docker](https://nextjs.org/docs/deployment/docker)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Docker Compose logs
3. Check individual service logs
4. Verify environment variables are set correctly

---

**Created**: 2024
**Last Updated**: May 13, 2026
