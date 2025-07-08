# Task Manager - React Frontend

A modern React frontend for the Task Manager application built with TypeScript, Material-UI, and Vite. This component provides a responsive web interface for managing tasks with advanced filtering, search, bulk operations, and real-time updates.

## 🚀 Features

### Frontend (React)
- **Create, Read, Update, Delete (CRUD)** operations for tasks
- **Real-time search** with debounced input
- **Advanced filtering** by status and priority
- **Bulk operations** for status updates and deletions
- **Pagination** for large task lists
- **Responsive design** that works on all devices
- **Modern UI** with Material-UI components

### API Integration
- **RESTful API** communication with Express.js backend
- **Real-time updates** with automatic data synchronization
- **Error handling** with user-friendly error messages
- **Loading states** for better user experience
- **Offline support** with graceful degradation

### Task Management
- **Task status tracking**: Pending, In Progress, Completed
- **Priority levels**: High, Medium, Low with color coding
- **Due date management** with overdue indicators
- **Rich task descriptions** with character limits
- **Quick status updates** directly from task cards

### User Experience
- **Loading states** and error handling
- **Form validation** with Zod schema validation
- **Modal dialogs** for create/edit operations
- **Keyboard shortcuts** and accessibility features
- **Dark/Light theme support** (configurable)

### Technical Features
- **TypeScript** for type safety
- **React Hook Form** for efficient form handling
- **Axios** for API communication with interceptors
- **Custom hooks** for state management
- **Docker containerization** for easy deployment
- **Responsive grid layout** with CSS Grid

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Material-UI (MUI)
- **Form Management**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **State Management**: React Hooks

### Development Tools
- **Build Tool**: Vite for fast development and optimized builds
- **Type Checking**: TypeScript for type safety
- **Code Quality**: ESLint for code linting
- **Package Manager**: npm for dependency management

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker & Docker Compose (for containerized deployment)

### Quick Start with Docker

```bash
# From the project root directory
docker-compose up --build

# Access the frontend
# Frontend: http://localhost
```

### Development Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

**Note**: Make sure the backend server is running on `http://localhost:3001` for full functionality.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the client directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
```

### API Configuration

The frontend communicates with the Express.js backend API. Make sure the backend server is running and accessible at the configured API URL.

## 📁 Project Structure

```
client/
├── src/                   # React source code
│   ├── components/        # React components
│   │   ├── TaskCard.tsx   # Individual task display
│   │   ├── TaskForm.tsx   # Task creation/editing form
│   │   ├── TaskFilters.tsx # Search and filter controls
│   │   └── TaskManager.tsx # Main task management component
│   ├── hooks/             # Custom React hooks
│   │   └── useTasks.ts    # Task data management hook
│   ├── services/          # API services
│   │   └── api.ts         # Axios API client
│   ├── types/             # TypeScript type definitions
│   │   └── task.ts        # Task-related types
│   ├── utils/             # Utility functions
│   │   ├── helpers.ts     # Helper functions
│   │   └── validation.ts  # Form validation utilities
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── index.html             # Main HTML file
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── Dockerfile             # Docker configuration
```

## 🎯 Usage

### Web Interface
1. **Creating a Task**: Click "Add Task" button and fill in the form
2. **Managing Tasks**: Use the task cards for quick actions or the three-dot menu for more options
3. **Filtering and Search**: Use the search box and filter dropdowns
4. **Bulk Operations**: Select multiple tasks and use bulk actions

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### API Endpoints

#### Health Check
```
GET /api/health
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

## 🔌 API Documentation

The API documentation is available at `http://localhost:3001/api/docs` when the server is running. This interactive Swagger UI provides:

- Complete endpoint documentation
- Request/response examples
- Interactive testing interface
- Schema definitions

## 🧪 Development

### Available Scripts

```bash
# Frontend Development
npm run dev              # Start frontend development server
npm run build            # Build frontend for production
npm run preview          # Preview production build

# Backend Development
npm run server           # Start backend server
npm run server:dev       # Start backend with auto-restart

# CLI
npm run cli              # Start command line interface

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
```

### Development Workflow

1. **Start the backend server**:
   ```bash
   npm run server:dev
   ```

2. **Start the frontend development server**:
   ```bash
   npm run dev
   ```

3. **Test the CLI**:
   ```bash
   npm run cli
   ```

## 🚀 Deployment

### Docker Deployment (Recommended)

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Start the backend**:
   ```bash
   npm run server
   ```

3. **Serve the frontend** using a web server like Nginx

### Deployment Options

- **Vercel**: Deploy frontend and backend separately
- **Netlify**: Frontend deployment with backend functions
- **Heroku**: Full-stack deployment
- **AWS**: EC2 for backend, S3 for frontend
- **Docker**: Containerized deployment to any cloud provider

## 🐳 Docker Features

- **Multi-stage builds** for optimized images
- **Nginx** for serving the React app with caching
- **Security headers** and gzip compression
- **Health checks** for both services
- **Non-root user** execution for security
- **Alpine Linux** for smaller image sizes

For detailed Docker documentation, see [README-Docker.md](README-Docker.md).

## 🔒 Security Features

- **Helmet.js** for security headers
- **CORS** configuration for cross-origin requests
- **Input validation** with Zod schemas
- **Error handling** without exposing sensitive information
- **Request logging** for monitoring
- **JWT authentication** (ready for implementation)

## 📊 Monitoring

The application includes:

- **Request logging** with Morgan
- **Error logging** with stack traces in development
- **Health check endpoint** for monitoring
- **Statistics endpoint** for analytics
- **Swagger documentation** for API monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🔮 Future Enhancements

- [ ] User authentication and authorization (JWT ready)
- [ ] Task categories and tags
- [ ] File attachments
- [ ] Task comments and collaboration
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Mobile app (React Native)
- [ ] Offline support with PWA
- [ ] Advanced analytics and reporting
- [ ] Team workspaces
- [ ] Database integration (PostgreSQL, MongoDB)
- [ ] Real-time updates with WebSockets
