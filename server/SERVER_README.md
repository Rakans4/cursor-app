# Task Manager - Express Backend

This document describes the Express.js backend server for the Task Manager application.

## 🚀 Express Server

### Features

- **RESTful API** with full CRUD operations
- **PostgreSQL Database** for persistent data storage
- **Input validation** using Zod schemas
- **Error handling** with proper HTTP status codes
- **CORS support** for cross-origin requests
- **Security headers** with Helmet
- **Request logging** with Morgan
- **Bulk operations** for multiple tasks
- **Statistics endpoint** for task analytics
- **Swagger API documentation** with interactive UI
- **Health check endpoint** for monitoring
- **JWT Authentication** for secure access
- **Database migrations** and seeding
- **Prometheus metrics** for observability

### API Endpoints

#### Health Check
```
GET /api/health
```
Returns server status and timestamp.

#### Authentication
```
POST /api/auth/signup    # Register new user
POST /api/auth/login     # User login
```

#### Tasks
```
GET    /api/tasks          # Get all tasks (with pagination & filters)
GET    /api/tasks/:id      # Get specific task
POST   /api/tasks          # Create new task
PUT    /api/tasks/:id      # Update task
DELETE /api/tasks/:id      # Delete task
```

#### Bulk Operations
```
PATCH  /api/tasks/bulk-status  # Update status of multiple tasks
DELETE /api/tasks/bulk         # Delete multiple tasks
```

#### Statistics
```
GET    /api/stats          # Get task statistics
```

#### API Documentation
```
GET    /api/docs           # Swagger UI documentation
```

### Query Parameters

#### GET /api/tasks
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (pending, in-progress, completed)
- `priority` (string): Filter by priority (low, medium, high)
- `search` (string): Search in title and description

### Request/Response Format

#### Create/Update Task
```json
{
  "title": "Task title",
  "description": "Task description",
  "status": "pending|in-progress|completed",
  "priority": "low|medium|high",
  "dueDate": "2024-02-15"
}
```

#### Response Format
```json
{
  "success": true,
  "message": "Operation message",
  "data": { /* task data */ },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Running the Server

```bash
# Development mode with auto-restart
npm run server:dev

# Production mode
npm run server

# Start with Docker
docker-compose up server
```

The server will start on `http://localhost:3001` by default.

### API Documentation

Access the interactive Swagger UI at `http://localhost:3001/api/docs` when the server is running. This provides:

- Complete endpoint documentation
- Request/response examples
- Interactive testing interface
- Schema definitions
- Authentication documentation (JWT ready)

### Database Management

```bash
# Initialize database (migrations + seed)
npm run db:init

# Run migrations only
npm run db:migrate

# Seed with test data
npm run db:seed
```

### Monitoring & Observability

The server includes comprehensive monitoring capabilities:

- **Prometheus Metrics**: HTTP request counts, response times, error rates
- **Health Checks**: `/api/health` endpoint for container health monitoring
- **Request Logging**: Structured logging with Morgan middleware
- **Error Tracking**: Centralized error handling with detailed logging
- **Performance Monitoring**: Response time tracking and metrics collection

Access monitoring tools:
- **Prometheus**: `http://localhost:9090` - Metrics collection
- **Grafana**: `http://localhost:3000` - Dashboards and visualization
- **Loki**: `http://localhost:3100` - Log aggregation

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
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

## 🔧 Configuration

### Environment Variables

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your_secure_jwt_secret_here
CORS_ORIGIN=http://localhost
DB_HOST=postgres
DB_PORT=5432
DB_NAME=task_manager
DB_USER=postgres
DB_PASSWORD=postgres
```

### Database Connection

The server uses PostgreSQL with connection pooling for optimal performance. The database connection is configured in `server/database/config.js`.

## 🚀 Deployment

### Docker Deployment

The server is containerized using Docker with the following features:

- **Multi-stage build** for optimized image size
- **Health checks** for container orchestration
- **Environment variable configuration**
- **Automatic database initialization**
- **Entrypoint script** for proper startup sequence

### Docker Commands

```bash
# Build the server image
docker build -f server/Dockerfile.server -t task-manager-server ./server

# Run the server container
docker run -p 3001:3001 --env-file .env task-manager-server

# Run with Docker Compose
docker-compose up server
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection**: Ensure PostgreSQL is running and accessible
2. **Port Conflicts**: Check if port 3001 is available
3. **Environment Variables**: Verify all required environment variables are set
4. **Database Migration**: Run `npm run db:init` if tables are missing

### Health Checks

```bash
# Check server health
curl http://localhost:3001/api/health

# Check database connection
docker-compose exec postgres psql -U postgres -d task_manager -c "SELECT version();"

# View server logs
docker-compose logs server
```

### Performance Monitoring

- Monitor response times in Grafana dashboards
- Check Prometheus metrics for request patterns
- Review application logs in Loki
- Monitor database performance and connections

## 📚 Additional Resources

- [API Documentation](http://localhost:3001/api/docs) - Interactive Swagger UI
- [Main README](../README.md) - Project overview and setup
- [Client Documentation](../client/README.md) - Frontend documentation 