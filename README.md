# End-to-End Encrypted Messaging App

A secure, real-time messaging application with end-to-end encryption, built with a microservices architecture. This project ensures that all messages are encrypted on the client-side and can only be decrypted by the intended recipient.

## 🚀 Features

- **End-to-End Encryption**: Messages are encrypted using TweetNaCl.js before being sent to the server
- **Real-Time Messaging**: Socket.io-based real-time communication
- **User Authentication**: Secure authentication with JWT tokens and Google OAuth
- **User Profiles**: Search and find users by username
- **Personal Chats**: Support for Persional conversations (encrypted)
- **Message History**: Persistent encrypted message storage
- **Responsive UI**: Modern, responsive Next.js frontend
- **Microservices Architecture**: Separated services for auth, users, messaging, and real-time updates
- **Dark/Light Theme**: Theme switching support

## 🏗️ Architecture

The application follows a microservices architecture with the following components:

```
┌─────────────────────────────────────────────────────┐
│                    Next.js Client                    │
│              (Port 3000 - React Frontend)            │
└─────────────┬───────────────────────────────────────┘
              │
    ┌─────────┼─────────────────┬─────────────────┐
    │         │                 │                 │
    ▼         ▼                 ▼                 ▼
┌────────┐ ┌──────────┐ ┌────────────┐ ┌──────────────┐
│ Auth   │ │  User    │ │ Messaging  │ │ Realtime     │
│Service │ │ Service  │ │ Service    │ │ Service      │
│:5000   │ │ :5001    │ │ :5002      │ │ (Socket.io)  │
│        │ │          │ │            │ │ :5004        │
└───┬────┘ └────┬─────┘ └─────┬──────┘ └──────┬───────┘
    │           │             │               │
    └───────────┼─────────────┼───────────────┘
                │             │
    ┌───────────┼─────────────┼───────────────┐
    │           │             │               │
    ▼           ▼             ▼               ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
│MongoDB │ │MongoDB │ │MongoDB │ │  Redis   │
│ Auth   │ │ Users  │ │Messages│ │  Cache   │
│:27017  │ │:27018  │ │:27019  │ │ :6379    │
└────────┘ └────────┘ └────────┘ └──────────┘
```

### Services Overview

| Service | Port | Purpose |
|---------|------|---------|
| **Auth Service** | 5000 | User authentication, JWT token management, OTP verification |
| **User Service** | 5001 | User profiles, user search, friend management |
| **Messaging Service** | 5002 | Encrypted message storage and retrieval |
| **Realtime Service** | 5004 | Socket.io server for real-time updates |
| **Client (Next.js)** | 3000 | Web frontend with encryption/decryption logic |

### Databases

| Database | Port | Service |
|----------|------|---------|
| MongoDB Auth | 27017 | Auth Service |
| MongoDB User | 27018 | User Service |
| MongoDB Message | 27019 | Messaging Service |
| Redis | 6379 | Caching & Session Management |

## 💻 Tech Stack

### Frontend
- **Next.js 14+**: React framework for production
- **TweetNaCl.js**: End-to-end encryption library
- **Socket.io Client**: Real-time bidirectional communication
- **Tailwind CSS**: Utility-first CSS framework
- **IndexedDB**: Client-side encrypted message caching

### Backend
- **Node.js + Express**: REST API servers
- **MongoDB**: Document database for persistence
- **Redis**: In-memory cache and session store
- **Socket.io**: Real-time WebSocket communication
- **JWT**: Secure token-based authentication
- **Nodemailer**: Email services for OTP

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **PM2**: Process manager for production

## 📋 Prerequisites

### For Docker Deployment
- Docker 20.10+
- Docker Compose 2.0+

### For Local Development
- Node.js 18+
- npm or yarn
- MongoDB 7.0+
- Redis 7.0+

## 🚀 Quick Start with Docker

### 1. Clone the Repository
```bash
git clone <repository-url>
cd app
```

### 2. Create Environment File
Create a `.env` file in the project root:

```env
# Email Service
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# JWT Secrets
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_here_min_32_chars

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=your_turnstile_secret_key

# Optional: Custom MongoDB URLs (if using external MongoDB)
# MONGO_AUTH_SERVICES_URL=mongodb://user:pass@host:port/auth-service
# MONGO_USER_SERVICES_URI=mongodb://user:pass@host:port/user-service
# MONGO_MESSAGE_SERVICES_URI=mongodb://user:pass@host:port/message-service

# Optional: Custom Redis URL (if using external Redis)
# REDIS_URL=redis://user:pass@host:port
```

### 3. Build and Start All Services
```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Auth Service API**: http://localhost:5000
- **User Service API**: http://localhost:5001
- **Messaging Service API**: http://localhost:5002
- **Realtime Service**: http://localhost:5004

### 5. Stop All Services
```bash
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v
```

## 🛠️ Local Development Setup

### 1. Install Dependencies

```bash
# Install client dependencies
cd client
npm install

# Install auth-service dependencies
cd ../server/auth-service
npm install

# Install user-service dependencies
cd ../user-service
npm install

# Install messaging-service dependencies
cd ../messaging-service
npm install

# Install realtime-service dependencies
cd ../realtime-service
npm install
```

### 2. Setup Environment Variables

Create `.env.local` files in each service directory:

**client/.env.local**
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL_AUTH=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL_USER=http://localhost:5001
NEXT_PUBLIC_BACKEND_URL_MESSAGES=http://localhost:5002
NEXT_PUBLIC_BACKEND_URL_REALTIME=http://localhost:5004
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

**server/auth-service/.env**
```env
PORT_AUTH=5000
PORT_USER=5001
PORT_MESSAGE=5002
PORT_REALTIME=5004
MONGO_AUTH_SERVICES_URL=mongodb://admin:admin123@localhost:27017/auth-service?authSource=admin
REDIS_URL=redis://localhost:6379
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
NODE_ENV=development
```

(Repeat similar setup for user-service, messaging-service, and realtime-service)

### 3. Start Services

**Terminal 1: Start MongoDB (if not using Docker)**
```bash
mongod
```

**Terminal 2: Start Redis (if not using Docker)**
```bash
redis-server
```

**Terminal 3: Start Auth Service**
```bash
cd server/auth-service
npm run dev
```

**Terminal 4: Start User Service**
```bash
cd server/user-service
npm run dev
```

**Terminal 5: Start Messaging Service**
```bash
cd server/messaging-service
npm run dev
```

**Terminal 6: Start Realtime Service**
```bash
cd server/realtime-service
npm run dev
```

**Terminal 7: Start Client**
```bash
cd client
npm run dev
```

## 📁 Project Structure

```
app/
├── client/                          # Next.js Frontend
│   ├── src/
│   │   ├── app/                    # Next.js app directory
│   │   │   ├── auth/               # Authentication pages
│   │   │   ├── home/               # Home/chat pages
│   │   │   └── username/           # User profile pages
│   │   ├── components/             # React components
│   │   │   ├── ChatWindow.js       # Main chat UI
│   │   │   ├── ChatList.js         # List of conversations
│   │   │   ├── FindUsersPage.js    # User search
│   │   │   └── Auth/               # Auth components
│   │   ├── context/                # React context (AppContext, AuthContext, ThemeContext)
│   │   ├── utils/                  # Utility functions
│   │   │   ├── crypto.js           # Encryption/decryption logic
│   │   │   ├── encryptionMessage.js
│   │   │   ├── decryptMessage.js
│   │   │   └── socket.js           # Socket.io setup
│   │   ├── services/               # API service calls
│   │   │   ├── auth/
│   │   │   ├── message/
│   │   │   ├── token/
│   │   │   ├── user/
│   │   │   └── ui/
│   │   ├── DB/                     # IndexedDB management
│   │   └── hooks/                  # Custom React hooks
│   └── package.json
│
├── server/
│   ├── auth-service/               # Authentication & Authorization Service
│   │   ├── controllers/            # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── otp.controller.js
│   │   │   └── refresh.controller.js
│   │   ├── models/                 # MongoDB schemas
│   │   ├── routes/                 # API routes
│   │   ├── middleware/             # JWT verification, etc.
│   │   ├── utils/                  # Helper functions
│   │   │   ├── generateOtp.js
│   │   │   ├── sendEmail.js
│   │   │   └── Token.js
│   │   ├── events/                 # Event publishers (Redis pub/sub)
│   │   └── app.js
│   │
│   ├── user-service/               # User Profile & Search Service
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── app.js
│   │
│   ├── messaging-service/          # Message Storage & Retrieval Service
│   │   ├── controllers/            # Message handlers
│   │   ├── models/                 # Chat and Message schemas
│   │   ├── routes/                 # Message API routes
│   │   ├── middleware/
│   │   └── app.js
│   │
│   └── realtime-service/           # Socket.io Real-Time Service
│       ├── events/                 # Socket event handlers
│       ├── middleware/
│       └── app.js
│
├── docker-compose.yml              # Multi-container orchestration
├── ecosystem.config.js             # PM2 config (production)
├── DOCKER_SETUP.md                 # Docker setup guide
└── README.md                        # This file
```

## 🔐 Encryption Architecture

### End-to-End Encryption Flow

1. **Key Generation** (Client-side):
   - User generates a key pair (public/private) using TweetNaCl.js
   - Private key stored securely in browser's IndexedDB
   - Public key shared with other users

2. **Message Encryption**:
   - Before sending, message is encrypted using recipient's public key
   - Only encrypted message is transmitted to server
   - Server cannot read message content

3. **Message Decryption**:
   - Recipient receives encrypted message
   - Decrypted using recipient's private key (stored locally)
   - Only recipient can decrypt the message

### Key Files
- [utils/crypto.js](client/src/utils/crypto.js) - Encryption/decryption utilities
- [DB/keyProtection.js](client/src/DB/keyProtection.js) - Secure key storage
- [utils/encryptionMessage.js](client/src/utils/encryptionMessage.js) - Message encryption
- [utils/decryptMessage.js](client/src/utils/decryptMessage.js) - Message decryption

## 🔌 API Endpoints

### Auth Service (Port 5000)
```
POST   /api/auth/register         - Register new user
POST   /api/auth/login            - Login user
POST   /api/auth/logout           - Logout user
POST   /api/auth/google           - Google OAuth
POST   /api/auth/refresh-token    - Refresh access token
POST   /api/otp/send              - Send OTP
POST   /api/otp/verify            - Verify OTP
```

### User Service (Port 5001)
```
GET    /api/user/profile          - Get user profile
PUT    /api/user/profile          - Update user profile
GET    /api/user/search?q=name    - Search users
GET    /api/user/:userId          - Get user by ID
GET    /api/user/friends/list     - List friends
```

### Messaging Service (Port 5002)
```
POST   /api/message/send          - Send encrypted message
GET    /api/message/chat/:chatId  - Get chat messages
GET    /api/message/list          - List all chats
POST   /api/message/group/create  - Create group chat
```

### Realtime Service (Port 5004)
```
Socket Events:
- connect                          - User connects
- disconnect                       - User disconnects
- message:send                     - Send real-time message
- message:receive                  - Receive message
- typing:start                     - User typing
- typing:stop                      - User stopped typing
- user:status                      - User online/offline status
```

## 🔧 Environment Variables Reference

### Required for All Services
```env
JWT_SECRET                  # Minimum 32 characters
JWT_REFRESH_SECRET         # Minimum 32 characters
NODE_ENV                   # development or production
```

### Email Service (Gmail)
```env
EMAIL_USER                 # Gmail address
EMAIL_PASS                 # Gmail app password (not regular password)
```

### Google OAuth
```env
GOOGLE_CLIENT_ID           # From Google Cloud Console
GOOGLE_CLIENT_SECRET       # From Google Cloud Console
```

### Cloudflare Turnstile (Bot Protection)
```env
TURNSTILE_SECRET_KEY       # From Cloudflare Dashboard
NEXT_PUBLIC_TURNSTILE_SITE_KEY
```

### Database URLs (Optional - use Docker defaults if not specified)
```env
MONGO_AUTH_SERVICES_URL
MONGO_USER_SERVICES_URI
MONGO_MESSAGE_SERVICES_URI
REDIS_URL
```

## 🐛 Troubleshooting

### Docker Issues

**Services won't start**
```bash
# Check logs
docker-compose logs [service-name]

# Rebuild images
docker-compose build --no-cache

# Remove containers and restart
docker-compose down
docker-compose up -d
```

**Port already in use**
```bash
# Change port in docker-compose.yml or kill process using port
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Connection Issues

**Cannot connect to services**
- Verify all services are running: `docker-compose ps`
- Check network: `docker network inspect messaging-network`
- Verify environment variables are set correctly

**Database connection failed**
- Ensure MongoDB/Redis containers are healthy
- Check database credentials in environment variables
- Verify connection strings match service names

## 📚 Development Guidelines

### Code Style
- Use ES6+ syntax
- Follow ESLint configuration
- Use consistent naming conventions

### Git Workflow
1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit: `git commit -m "Add feature"`
3. Push to repository: `git push origin feature/feature-name`
4. Create Pull Request

### Testing
```bash
# Frontend
cd client && npm run test

# Backend services
cd server/auth-service && npm run test
```

### Deployment
Use `ecosystem.config.js` with PM2 for production:
```bash
pm2 start ecosystem.config.js --env production
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Last Updated**: May 2026
**Version**: 1.0.0
