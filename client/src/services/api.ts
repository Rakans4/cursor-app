import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { Task, CreateTaskRequest, TaskFilters, ApiResponse, PaginatedResponse } from '../types/task';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service class
export class TaskApiService {
  // Get all tasks with optional filters
  static async getTasks(filters?: TaskFilters, page = 1, limit = 10): Promise<PaginatedResponse<Task>> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await apiClient.get<PaginatedResponse<Task>>(`/tasks?${params.toString()}`);
    return response.data;
  }

  // Create a new task
  static async createTask(taskData: CreateTaskRequest): Promise<ApiResponse<Task>> {
    const response = await apiClient.post<ApiResponse<Task>>('/tasks', taskData);
    return response.data;
  }

  // Update an existing task
  static async updateTask(id: string, taskData: Partial<CreateTaskRequest>): Promise<ApiResponse<Task>> {
    const response = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, taskData);
    return response.data;
  }

  // Delete a task
  static async deleteTask(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/tasks/${id}`);
    return response.data;
  }

  // User signup
  static async signup(username: string, password: string): Promise<ApiResponse<{ user: string }>> {
    const response = await apiClient.post<ApiResponse<{ user: string }>>('/auth/signup', { username, password });
    return response.data;
  }

  // User login
  static async login(username: string, password: string): Promise<{ token: string }> {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data;
  }
}

// Error handling utility
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Utility function to handle API errors
export const handleApiError = (error: unknown): ApiError => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string; code?: string }, status?: number } };
    return new ApiError(
      axiosError.response?.data?.message || 'An error occurred',
      axiosError.response?.status,
      axiosError.response?.data?.code
    );
  } else if (error && typeof error === 'object' && 'request' in error) {
    return new ApiError('Network error - please check your connection');
  } else {
    return new ApiError(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
};

export default apiClient; 