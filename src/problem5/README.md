# Problem 5: Modern CRUD API Server

A production-ready RESTful API server built with Express.js, TypeScript, and Drizzle ORM. Features comprehensive validation, pagination, search capabilities, and containerized deployment.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Docker Commands](#-docker-commands)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)

---

## 🛠 Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.7+
- **Framework**: Express.js 4.19+
- **ORM**: Drizzle ORM (type-safe SQL toolkit)
- **Database**: SQLite with better-sqlite3
- **Validation**: Zod
- **Containerization**: Docker & Docker Compose
- **Module System**: ES Modules (ESM)
- **Testing**: Jest + Supertest

---

## ✨ Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Request validation with Zod schemas
- ✅ Type-safe database queries with Drizzle ORM
- ✅ Pagination support
- ✅ Search functionality
- ✅ Status filtering
- ✅ Comprehensive error handling
- ✅ Docker support with multi-stage builds
- ✅ Health check endpoint
- ✅ CORS enabled
- ✅ Graceful shutdown handling
- ✅ SQLite with WAL mode for better performance

---

## 📦 Prerequisites

- **Node.js**: v20.0.0 or higher
- **npm**: v9.0.0 or higher
- **Docker**: v24.0.0 or higher (for containerized deployment)
- **Docker Compose**: v2.0.0 or higher

---

## 🚀 Installation

### 1. Clone the Repository

```bash
cd problem5
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate Database Schema

```bash
npm run db:generate
```

---

## ▶️ Running the Application

### Option 1: Local Development

```bash
# Start the development server (with auto-reload)
npm run dev
```

Server will start at: `http://localhost:3031`

### Option 2: Production Build (Local)

```bash
# Build TypeScript
npm run build

# Run migrations
npm run db:migrate

# Start production server
npm start
```

### Option 3: Docker (Recommended for Production)

```bash
# Build Docker image
npm run docker:build

# Start with Docker Compose
npm run docker:compose

# Or manually
docker-compose up -d
```

Server will start at: `http://localhost:3031`

---

## 📖 API Documentation

### Base URL

```
http://localhost:3031
```

---

### Endpoints

#### 1. Health Check

```http
GET /health
```

**Response:**

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-12-29T14:30:00.000Z",
  "environment": "development"
}
```

---

#### 2. Create Resource

```http
POST /api/resources
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "User Authentication Module",
  "description": "OAuth 2.0 implementation with JWT tokens",
  "status": "active"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "User Authentication Module",
    "description": "OAuth 2.0 implementation with JWT tokens",
    "status": "active",
    "createdAt": "2025-12-29 14:30:00",
    "updatedAt": "2025-12-29 14:30:00"
  },
  "message": "Resource created successfully"
}
```

**Validation Rules:**

- `name`: Required, 1-255 characters
- `description`: Optional, max 1000 characters
- `status`: Optional, enum: `"active"` | `"inactive"` (default: `"active"`)

---

#### 3. Get All Resources

```http
GET /api/resources
```

**Query Parameters:**

| Parameter | Type     | Description                        | Default |
| --------- | -------- | ---------------------------------- | ------- |
| `status`  | string   | Filter by status: `active` or `inactive` | -       |
| `search`  | string   | Search in name and description     | -       |
| `limit`   | number   | Items per page (1-100)             | 20      |
| `offset`  | number   | Number of items to skip            | 0       |

**Example Request:**

```http
GET /api/resources?status=active&search=auth&limit=10&offset=0
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "resources": [
      {
        "id": 1,
        "name": "User Authentication Module",
        "description": "OAuth 2.0 implementation",
        "status": "active",
        "createdAt": "2025-12-29 14:30:00",
        "updatedAt": "2025-12-29 14:30:00"
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 10,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

---

#### 4. Get Resource by ID

```http
GET /api/resources/:id
```

**Example:**

```http
GET /api/resources/1
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "User Authentication Module",
    "description": "OAuth 2.0 implementation",
    "status": "active",
    "createdAt": "2025-12-29 14:30:00",
    "updatedAt": "2025-12-29 14:30:00"
  }
}
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "error": "Resource not found"
}
```

---

#### 5. Update Resource

```http
PUT /api/resources/:id
Content-Type: application/json
```

**Request Body (all fields optional, but at least one required):**

```json
{
  "name": "Updated Module Name",
  "description": "Updated description",
  "status": "inactive"
}
```

**Example:**

```http
PUT /api/resources/1
Content-Type: application/json

{
  "name": "Enhanced Authentication Module",
  "status": "active"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Enhanced Authentication Module",
    "description": "OAuth 2.0 implementation",
    "status": "active",
    "createdAt": "2025-12-29 14:30:00",
    "updatedAt": "2025-12-29 14:35:00"
  },
  "message": "Resource updated successfully"
}
```

---

#### 6. Delete Resource

```http
DELETE /api/resources/:id
```

**Example:**

```http
DELETE /api/resources/1
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Resource deleted successfully"
}
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "error": "Resource not found"
}
```

---

## 📁 Project Structure

```
problem5/
├── src/
│   ├── controllers/          # Request handlers
│   │   └── resource.controller.ts
│   ├── db/                   # Database configuration
│   │   ├── index.ts         # Database connection & migrations
│   │   └── schema.ts        # Drizzle schema definitions
│   ├── middleware/          # Express middleware
│   │   └── validate.ts      # Validation middleware
│   ├── routes/              # API routes
│   │   └── resource.routes.ts
│   ├── types/               # TypeScript type definitions
│   │   └── api.types.ts
│   ├── validators/          # Zod validation schemas
│   │   └── resource.validator.ts
│   └── server.ts            # Express server setup
├── tests/                   # Test files
│   ├── integration/         # Integration tests
│   ├── validators/          # Validator tests
│   └── setup.ts            # Test configuration
├── drizzle/                 # Database migrations (generated)
├── data/                    # SQLite database files
├── .env                     # Environment variables
├── .env.example            # Environment template
├── Dockerfile              # Docker build configuration
├── docker-compose.yml      # Docker Compose setup
├── drizzle.config.ts       # Drizzle ORM configuration
├── jest.config.js          # Jest test configuration
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

---

## 🐳 Docker Commands

### Build Image

```bash
npm run docker:build
# or
docker build -t crud-server .
```

### Run with Docker Compose

```bash
# Start in detached mode
docker-compose up -d

# View logs
docker logs crud-api-server

# Follow logs
docker logs -f crud-api-server

# Stop container
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Manual Docker Run

```bash
docker run -d \
  --name crud-api \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  crud-server
```

---

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

**Available Variables:**

```env
# Server Configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# Database
DATABASE_PATH=./data/database.sqlite
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run integration tests only
npm run test:integration

# Run unit tests only
npm run test:unit
```

### Test Coverage

Tests include:

- ✅ Validator unit tests (Zod schemas)
- ✅ Integration tests (Full API workflows)
- ✅ Error handling tests
- ✅ Pagination tests
- ✅ Search & filter tests

---

## 🔧 NPM Scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start development server with auto-reload |
| `npm run build`     | Build TypeScript to JavaScript           |
| `npm start`         | Run production server                    |
| `npm run db:generate` | Generate Drizzle migrations             |
| `npm run db:migrate`  | Run database migrations                 |
| `npm run db:studio`   | Open Drizzle Studio (database GUI)      |
| `npm test`          | Run all tests                            |
| `npm run test:coverage` | Run tests with coverage report       |
| `npm run docker:build`  | Build Docker image                     |
| `npm run docker:compose` | Start with Docker Compose            |

---

## 🎯 cURL Examples

### Create a Resource

```bash
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Payment Gateway",
    "description": "Stripe integration for payments",
    "status": "active"
  }'
```

### Get All Resources

```bash
curl http://localhost:3000/api/resources
```

### Search Active Resources

```bash
curl "http://localhost:3000/api/resources?status=active&search=payment"
```

### Update Resource

```bash
curl -X PUT http://localhost:3000/api/resources/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Payment Gateway Pro",
    "status": "inactive"
  }'
```

### Delete Resource

```bash
curl -X DELETE http://localhost:3000/api/resources/1
```

---

## 🚦 API Response Codes

| Code | Description                                          |
| ---- | ---------------------------------------------------- |
| 200  | OK - Request successful                              |
| 201  | Created - Resource created successfully              |
| 400  | Bad Request - Invalid input or validation failed     |
| 404  | Not Found - Resource does not exist                  |
| 500  | Internal Server Error - Server encountered an error  |

---

## 📝 Notes

- Database uses SQLite with WAL (Write-Ahead Logging) mode for better concurrent performance
- All timestamps are stored in ISO 8601 format
- The API uses ES Modules (ESM) for better tree-shaking and modern JavaScript features
- Docker image uses multi-stage builds for optimized production size
- Server implements graceful shutdown for SIGTERM and SIGINT signals
- CORS is enabled for all origins in development (configure for production)

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Database Locked Error

```bash
# Stop all running instances
docker-compose down
pkill node

# Remove database lock files
rm data/*.sqlite-shm data/*.sqlite-wal
```

### Docker Build Issues

```bash
# Clean rebuild
docker-compose down -v
docker rmi crud-server
npm run docker:build
docker-compose up -d
```

---

## 📄 License

This project is part of a technical assessment for 99tech.co

---

## 👤 Author

**Muhammad Amir Qushairi Jais**

---

## 🙏 Acknowledgments

- Built with modern TypeScript and Express.js best practices
- Uses Drizzle ORM for type-safe database operations
- Containerized with Docker for easy deployment