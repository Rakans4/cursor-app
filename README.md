# Task Manager - Full Stack Application

A modern, production-ready task management application built with React, TypeScript, Express.js, PostgreSQL, and Docker. This application provides a complete CRUD interface for managing tasks with advanced filtering, search, bulk operations, and comprehensive monitoring.

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI** with Material-UI components and responsive design
- **CRUD Operations** for tasks with real-time updates
- **Advanced Filtering** by status, priority, and search terms
- **Bulk Operations** for status updates and deletions
- **Pagination** for large task lists
- **Form Validation** with Zod schemas
- **Loading States** and error handling
- **Keyboard Shortcuts** and accessibility features
- **Authentication** with JWT tokens

### Backend (Express.js + Node.js)
- **RESTful API** with full CRUD operations
- **PostgreSQL Database** for persistent data storage with connection pooling
- **JWT Authentication** for secure access
- **Input Validation** using Zod schemas
- **Error Handling** with proper HTTP status codes
- **CORS Support** for cross-origin requests
- **Security Headers** with Helmet
- **Request Logging** with Morgan
- **Swagger API Documentation** with interactive UI
- **Health Check Endpoints** for monitoring
- **Prometheus Metrics** for observability

### DevOps & Monitoring
- **Docker Containerization** for easy deployment
- **Docker Compose** orchestration with network segmentation
- **PostgreSQL Database** with persistent storage
- **Nginx** reverse proxy for production
- **Prometheus** metrics collection
- **Grafana** dashboards and visualization
- **Loki** log aggregation
- **Promtail** log collection
- **Network Security** with separate frontend/backend networks

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Material-UI (MUI)
- **Form Management**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **State Management**: React Hooks
- **Routing**: React Router

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Validation**: Zod schemas
- **Security**: Helmet, CORS, JWT
- **Logging**: Morgan
- **Documentation**: Swagger/OpenAPI
- **Monitoring**: Prometheus client

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15 (Alpine)
- **Web Server**: Nginx (production)
- **Monitoring**: Prometheus, Grafana, Loki, Promtail
- **Development**: ESLint, TypeScript
- **Networking**: Docker DNS with network segmentation

## 📦 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for development)
- npm or yarn (for development)

### Production Deployment with Docker

```bash
# Clone the repository
git clone <repository-url>
cd cursor-app

# Start all services with Docker Compose
docker compose up --build -d

# Access the application
# Frontend: http://localhost:8080
# Backend API: http://localhost:3001
# API Docs: http://localhost:3001/api/docs
# Grafana: http://localhost:3000 (admin/admin)
# Prometheus: http://localhost:9090
# PostgreSQL: localhost:5432
```

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cursor-app
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client && npm install
   
   # Install server dependencies
   cd ../server && npm install
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Option 1: Use Docker for database only
   docker run --name task-manager-postgres \
     -e POSTGRES_DB=task_manager \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -p 5432:5432 \
     -d postgres:15-alpine
   
   # Option 2: Use local PostgreSQL installation
   # Create database: task_manager
   # Create user: postgres (or update config)
   ```

4. **Initialize the database**
   ```bash
   cd server
   npm run db:init
   ```

5. **Start the backend server**
   ```bash
   npm run server:dev
   ```

6. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```

7. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3001`
   - API Docs: `http://localhost:3001/api/docs`

## 🏗️ Architecture

### Network Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND NETWORK                         │
│                    (172.21.0.0/16)                         │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Client        │◄──►│   Server        │                │
│  │ (172.21.0.3)    │    │ (172.21.0.2)    │                │
│  │ Port: 8080      │    │ Port: 3001      │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND NETWORK                          │
│                    (172.20.0.0/16)                         │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Server        │◄──►│   PostgreSQL    │                │
│  │ (172.20.0.5)    │    │ (172.20.0.3)    │                │
│  │                 │    │ Port: 5432      │                │
│  └─────────────────┘    └─────────────────┘                │
│           │                                                    │
│           ▼                                                    │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Grafana       │    │   Prometheus    │                │
│  │ (172.20.0.7)    │    │ (172.20.0.6)    │                │
│  │ Port: 3000      │    │ Port: 9090      │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### Service Communication
- **Client ↔ Server**: Via Docker DNS (`task-manager-server:3001`)
- **Server ↔ Database**: Via Docker DNS (`postgres:5432`)
- **Server ↔ Monitoring**: Via Docker DNS (`prometheus:9090`, `grafana:3000`)

### Security Benefits
- **Frontend Isolation**: Client can only reach the server
- **Backend Isolation**: Database and monitoring tools are protected
- **Server Bridge**: Server acts as controlled bridge between networks
- **Network Segmentation**: Different subnets for different service tiers

## 📁 Project Structure

```
cursor-app/
├── client/                    # React frontend
│   ├── src/                   # React source code
│   │   ├── components/        # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API services
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   ├── Dockerfile            # Client Docker configuration
│   ├── package.json          # Client dependencies
│   └── vite.config.ts        # Vite configuration
├── server/                   # Express backend
│   ├── server/               # Server source code
│   │   ├── controllers/      # API controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── database/         # Database configuration
│   │   └── swagger/          # API documentation
│   ├── Dockerfile.server     # Server Docker configuration
│   ├── package.json          # Server dependencies
│   ├── init-db.js            # Database initialization
│   └── swagger.config.js     # API documentation config
├── docker-compose.yml        # Docker orchestration
├── nginx.conf               # Nginx configuration
├── prometheus.yml           # Prometheus configuration
├── promtail-config.yaml     # Promtail configuration
└── README.md                # Project documentation
```

## 🔧 Configuration

### Environment Variables

#### Server Environment
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your_secure_jwt_secret_here
CORS_ORIGIN=http://task-manager-client
DB_HOST=postgres
DB_PORT=5432
DB_NAME=task_manager
DB_USER=postgres
DB_PASSWORD=postgres
```

#### Client Environment
```env
VITE_API_URL=http://task-manager-server:3001/api
```

### Docker Services & Networks

#### Frontend Network (172.21.0.0/16)
- **client**: React frontend served by Nginx (Port 8080)
- **server**: Express.js API server (Port 3001) - Bridge service

#### Backend Network (172.20.0.0/16)
- **postgres**: PostgreSQL database (Port 5432)
- **server**: Express.js API server (Port 3001) - Bridge service
- **prometheus**: Metrics collection (Port 9090)
- **grafana**: Monitoring dashboards (Port 3000)
- **loki**: Log aggregation (Port 3100)
- **promtail**: Log collection agent

### Network Communication
- **Client → Server**: `http://task-manager-server:3001/api` (Docker DNS)
- **Server → Database**: `postgres:5432` (Docker DNS)
- **Server → Monitoring**: `prometheus:9090`, `grafana:3000` (Docker DNS)

## 🗄️ Database

### Schema

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tasks Table
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Management

```bash
# Initialize database (migrations + seed)
npm run db:init

# Run migrations only
npm run db:migrate

# Seed with test data
npm run db:seed

# Connect to database (Docker)
docker compose exec postgres psql -U postgres -d task_manager

# Backup database
docker compose exec postgres pg_dump -U postgres task_manager > backup.sql

# Restore database
docker compose exec -T postgres psql -U postgres task_manager < backup.sql
```

### Test Data
The application includes sample data:
- **Test User**: `username=testuser, password=password123`
- **Sample Tasks**: 5 pre-created tasks with various statuses and priorities

## 📊 Monitoring & Observability

### Prometheus Metrics
- HTTP request counts
- Response times
- Error rates
- Custom business metrics

### Grafana Dashboards
- Application performance metrics
- Request/response statistics
- Error tracking
- Custom business dashboards

### Log Aggregation
- Centralized logging with Loki
- Container log collection with Promtail
- Structured JSON logging
- Log correlation and search

### Network Monitoring
- Container-to-container communication
- Network latency and throughput
- Service discovery via Docker DNS

## 🎯 Usage

### Web Interface
1. **Creating Tasks**: Click "Add Task" and fill in the form
2. **Managing Tasks**: Use task cards for quick actions or menus for advanced options
3. **Filtering**: Use search box and filter dropdowns
4. **Bulk Operations**: Select multiple tasks for batch actions
5. **Pagination**: Navigate through large task lists with pagination controls

### API Endpoints
- `GET /api/tasks` - List all tasks (with pagination)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/stats` - Task statistics
- `GET /api/docs` - API documentation

## 🚀 Deployment

### Production with Docker Compose
```bash
# Build and start all services
docker compose up --build -d

# Run health check
./health-check.sh

# View logs
docker compose logs -f

# Stop services
docker compose down

# View specific service logs
docker compose logs -f server
docker compose logs -f postgres
```

### Development with Hot Reload
```bash
# Start development environment with hot reload
./dev.sh start

# Check development environment health
./health-check-dev.sh

# View development logs
./dev.sh logs

# Stop development environment
./dev.sh stop

# Restart development environment
./dev.sh restart
```

### Environment Configuration
```bash
# Copy example environment file
cp env.example .env

# Edit environment variables
nano .env

# Start with custom environment
docker compose --env-file .env up -d
```

### Health Monitoring
```bash
# Run comprehensive health check
./health-check.sh

# Check specific service
docker compose logs -f [service-name]

# Monitor resource usage
docker stats
```

### Development
```bash
# Start backend
cd server && npm run server:dev

# Start frontend
cd client && npm run dev
```

### Database Operations
```bash
# Initialize database
cd server && npm run db:init

# Run migrations
npm run db:migrate

# Seed data
npm run db:seed
```

## 🔥 Hot Reload Development

### Features
- **⚡ Instant Updates**: Changes to React components reflect immediately in the browser
- **🔄 Server Restart**: Backend changes trigger automatic server restart
- **📁 Live Editing**: Edit files directly and see changes without rebuilding
- **🐳 Docker Integration**: Hot reload works seamlessly within Docker containers
- **📊 Development Monitoring**: Full monitoring stack available during development

### How It Works

#### Frontend Hot Reload (Vite)
- **Vite Dev Server**: Runs on port 5173 with HMR (Hot Module Replacement)
- **File Watching**: Monitors source files for changes
- **Instant Updates**: Updates browser without full page reload
- **Source Maps**: Full debugging support with source maps

#### Backend Hot Reload (Nodemon)
- **File Monitoring**: Watches server directory for `.js` and `.json` changes
- **Automatic Restart**: Restarts server when files change
- **Fast Restart**: Only restarts the Node.js process, not the container
- **Error Recovery**: Automatically restarts on crashes

### Development Workflow
```bash
# 1. Start development environment
./dev.sh start

# 2. Make changes to your code
# Edit files in client/src/ or server/server/

# 3. See changes immediately
# Frontend: http://localhost:5173
# Backend: http://localhost:3001

# 4. Check logs if needed
./dev.sh logs

# 5. Stop when done
./dev.sh stop
```

### Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| **Frontend** | Vite Dev Server (Port 5173) | Nginx (Port 8080) |
| **Backend** | Nodemon with hot reload | Node.js with PM2 |
| **Hot Reload** | ✅ Enabled | ❌ Disabled |
| **Source Maps** | ✅ Enabled | ❌ Disabled |
| **Monitoring** | ✅ Available | ✅ Available |
| **Performance** | Optimized for development | Optimized for production |

### Troubleshooting Hot Reload

#### Frontend Issues
```bash
# Check Vite dev server
curl http://localhost:5173

# View client logs
docker logs task-manager-client-dev

# Restart client only
docker restart task-manager-client-dev
```

#### Backend Issues
```bash
# Check server logs
docker logs task-manager-server-dev

# Restart server only
docker restart task-manager-server-dev

# Check nodemon status
docker exec task-manager-server-dev ps aux | grep nodemon
```

#### File Permission Issues
```bash
# Fix file permissions (Linux/Mac)
chmod -R 755 ./client
chmod -R 755 ./server

# On Windows, ensure Docker Desktop has access to the project directory
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 8080, 3001, 3000, 9090, 3100, 5432 are available
2. **Database Connection**: Check PostgreSQL is running and accessible
3. **CORS Errors**: Check CORS_ORIGIN environment variable
4. **Container Networking**: Verify all services are on the correct Docker networks
5. **Database Migration**: Run `npm run db:init` if tables are missing
6. **Log Access**: Use `docker compose logs [service-name]` to view logs
7. **Docker Build Issues**: Ensure package-lock.json exists before building

### Health Checks
- Server: `http://localhost:3001/api/health`
- PostgreSQL: `docker compose exec postgres pg_isready -U postgres`
- Prometheus: `http://localhost:9090/-/healthy`
- Grafana: `http://localhost:3000/api/health`

### Network Troubleshooting
```bash
# Check network connectivity
docker exec task-manager-client ping task-manager-server
docker exec task-manager-server ping postgres

# Inspect networks
docker network inspect cursor-app_frontend-network
docker network inspect cursor-app_backend-network

# Check container IPs
docker inspect task-manager-server | grep IPAddress
```

### Database Issues
```bash
# Check database connection
docker compose exec postgres psql -U postgres -d task_manager -c "SELECT version();"

# Reset database
docker compose down -v
docker compose up -d postgres
docker compose exec server npm run db:init

# View database logs
docker compose logs postgres
```

### Docker Build Issues
```bash
# Ensure package-lock.json exists
cd server && npm install

# Clean Docker cache
docker system prune -f

# Rebuild without cache
docker compose build --no-cache

# Check build logs
docker compose build server --progress=plain
```

## 📚 Documentation

- [Client README](./client/README.md) - Frontend documentation
- [Server README](./server/SERVER_README.md) - Backend documentation
- [API Documentation](http://localhost:3001/api/docs) - Interactive Swagger UI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 