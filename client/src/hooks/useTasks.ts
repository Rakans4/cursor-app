import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Task, CreateTaskRequest, TaskFilters } from '../types/task';
import { TaskApiService, handleApiError } from '../services/api';

interface UseTasksReturn {
  tasks: Task[];
  filteredTasks: Task[];
  loadingTasks: boolean;
  actionLoading: boolean;
  error: string | null;
  totalTasks: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  createTask: (taskData: CreateTaskRequest) => Promise<Task | null>;
  updateTask: (id: string, taskData: Partial<CreateTaskRequest>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTaskComplete: (id: string) => Promise<void>;
  setPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
}

export const useTasks = (initialFilters?: TaskFilters): UseTasksReturn => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Use ref to track if this is the initial mount
  const isInitialMount = useRef(true);
  const currentFilters = useRef(initialFilters);

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => {
    if (!initialFilters) return null;
    return {
      search: initialFilters.search || '',
      status: initialFilters.status || undefined,
      priority: initialFilters.priority || undefined,
    } as TaskFilters;
  }, [initialFilters]);

  // Memoized filtered tasks to prevent unnecessary recalculations
  const filteredTasks = useMemo(() => {
    if (!memoizedFilters) return allTasks;
    
    return allTasks.filter((task) => {
      const matchesSearch = !memoizedFilters.search || 
        task.title.toLowerCase().includes(memoizedFilters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(memoizedFilters.search.toLowerCase());
      
      const matchesStatus = !memoizedFilters.status || task.status === memoizedFilters.status;
      const matchesPriority = !memoizedFilters.priority || task.priority === memoizedFilters.priority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [allTasks, memoizedFilters]);

  const fetchTasks = useCallback(async (filters?: TaskFilters, page = 1, limit = 10) => {
    try {
      setLoadingTasks(true);
      setError(null);
      
      const response = await TaskApiService.getTasks(filters, page, limit);
      
      setAllTasks(response.data);
      setTotalTasks(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
      setCurrentPage(response.pagination.page);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
    fetchTasks(memoizedFilters || undefined, page, itemsPerPage);
  }, [fetchTasks, memoizedFilters, itemsPerPage]);

  const setItemsPerPageHandler = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
    fetchTasks(memoizedFilters || undefined, 1, newItemsPerPage);
  }, [fetchTasks, memoizedFilters]);

  const createTask = useCallback(async (taskData: CreateTaskRequest): Promise<Task | null> => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await TaskApiService.createTask(taskData);
      
      // Refresh the current page to show the new task
      fetchTasks(memoizedFilters || undefined, currentPage, itemsPerPage);
      
      return response.data;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return null;
    } finally {
      setActionLoading(false);
    }
  }, [fetchTasks, memoizedFilters, currentPage, itemsPerPage]);

  const updateTask = useCallback(async (id: string, taskData: Partial<CreateTaskRequest>): Promise<Task | null> => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await TaskApiService.updateTask(id, taskData);
      
      // Update the task in the current list
      setAllTasks(prev => prev.map(task => 
        task.id === id ? response.data : task
      ));
      
      return response.data;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return null;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      setActionLoading(true);
      setError(null);
      
      await TaskApiService.deleteTask(id);
      
      // Refresh the current page to update the list
      fetchTasks(memoizedFilters || undefined, currentPage, itemsPerPage);
      
      return true;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [fetchTasks, memoizedFilters, currentPage, itemsPerPage]);

  const toggleTaskComplete = useCallback(async (id: string): Promise<void> => {
    try {
      setActionLoading(true);
      setError(null);
      const task = allTasks.find(t => t.id === id);
      if (!task) {
        throw new Error('Task not found');
      }
      
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const response = await TaskApiService.updateTask(id, { ...task, status: newStatus });
      const updatedTask = response.data;
      setAllTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle task status');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [allTasks]);

  // Only fetch on initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      fetchTasks(initialFilters, 1, itemsPerPage);
      isInitialMount.current = false;
    }
  }, [fetchTasks, initialFilters, itemsPerPage]);

  // Handle filter changes separately with proper comparison
  useEffect(() => {
    if (!isInitialMount.current) {
      const filtersChanged = 
        currentFilters.current?.search !== initialFilters?.search ||
        currentFilters.current?.status !== initialFilters?.status ||
        currentFilters.current?.priority !== initialFilters?.priority;
      
      if (filtersChanged) {
        currentFilters.current = initialFilters;
        setCurrentPage(1); // Reset to first page when filters change
        fetchTasks(initialFilters, 1, itemsPerPage);
      }
    }
  }, [initialFilters?.search, initialFilters?.status, initialFilters?.priority, fetchTasks, initialFilters, itemsPerPage]);

  return {
    tasks: allTasks,
    filteredTasks,
    loadingTasks,
    actionLoading,
    error,
    totalTasks,
    currentPage,
    totalPages,
    itemsPerPage,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    setPage,
    setItemsPerPage: setItemsPerPageHandler,
  };
}; 