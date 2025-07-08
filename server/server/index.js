import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { TaskController } from './controllers/TaskController.js';
import { errorHandler } from './middleware/errorHandler.js';
import { validateTaskCreate, validateTaskUpdate } from './middleware/validation.js';
import { UserController } from './controllers/UserController.js';
import { authenticateJWT } from './middleware/auth.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger.config.js';
import client from 'prom-client';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost',
  'http://127.0.0.1:5173',
  'http://127.0.0.1'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Initialize controllers
const taskController = new TaskController();
const userController = new UserController();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Task Manager API is running 🔥 Hot Reload ✅ Working!',
    timestamp: new Date().toISOString()
  });
});

// Task routes (protected)
app.get('/api/tasks', authenticateJWT, taskController.getTasks.bind(taskController));
app.get('/api/tasks/:id', authenticateJWT, taskController.getTask.bind(taskController));
app.post('/api/tasks', authenticateJWT, validateTaskCreate, taskController.createTask.bind(taskController));
app.put('/api/tasks/:id', authenticateJWT, validateTaskUpdate, taskController.updateTask.bind(taskController));
app.delete('/api/tasks/:id', authenticateJWT, taskController.deleteTask.bind(taskController));

// Bulk operations (protected)
app.patch('/api/tasks/bulk-status', authenticateJWT, taskController.bulkUpdateStatus.bind(taskController));
app.delete('/api/tasks/bulk', authenticateJWT, taskController.bulkDelete.bind(taskController));

// Statistics (protected)
app.get('/api/stats', authenticateJWT, taskController.getStats.bind(taskController));

// Auth routes
app.post('/api/auth/signup', userController.signup.bind(userController));
app.post('/api/auth/login', userController.login.bind(userController));

// Prometheus metrics setup
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Create a Counter metric for HTTP requests
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});
register.registerMetric(httpRequestCounter);

// Middleware to count requests
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode
    });
  });
  next();
});

// Expose /metrics endpoint
app.get('/metrics', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
}, async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`Metrics: http://localhost:${PORT}/metrics`);
});

export default app;
