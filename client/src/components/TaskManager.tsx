import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, Button, Typography, Box, Grid, Dialog, DialogTitle, DialogContent, Snackbar, Alert, Fab } from '@mui/material';
import { Add, Search, Close } from '@mui/icons-material';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { TaskFilters } from './TaskFilters';
import { TaskPagination } from './TaskPagination';
import { useTasks } from '../hooks/useTasks';
import type { Task, TaskFilters as TaskFiltersType } from '../types/task';
import type { TaskFormData } from '../utils/validation';

export const TaskManager: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const [filtersOpen, setFiltersOpen] = useState(true);

  const {
    tasks,
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
    setItemsPerPage,
  } = useTasks(filters);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const modalTriggerRef = useRef<HTMLElement | null>(null);

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const handleSearchInputChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handleFiltersChange = useCallback((newFilters: TaskFiltersType) => {
    setFilters(prev => ({ ...prev, ...newFilters, search: prev.search }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    setFilters({});
  }, []);

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const handleCreateTask = useCallback(async (taskData: TaskFormData) => {
    try {
      await createTask(taskData);
      setShowForm(false);
      showSnackbar('Task created successfully!', 'success');
    } catch {
      showSnackbar('Failed to create task. Please try again.', 'error');
    }
  }, [createTask, showSnackbar]);

  const handleUpdateTask = useCallback(async (taskData: TaskFormData) => {
    if (editingTask) {
      try {
        await updateTask(editingTask.id, taskData);
        setEditingTask(null);
        showSnackbar('Task updated successfully!', 'success');
      } catch {
        showSnackbar('Failed to update task. Please try again.', 'error');
      }
    }
  }, [editingTask, updateTask, showSnackbar]);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      await deleteTask(taskId);
      showSnackbar('Task deleted successfully!', 'success');
    } catch {
      showSnackbar('Failed to delete task. Please try again.', 'error');
    }
  }, [deleteTask, showSnackbar]);

  const handleToggleComplete = useCallback(async (id: string) => {
    try {
      await toggleTaskComplete(id);
      showSnackbar('Task status updated!', 'success');
    } catch {
      showSnackbar('Failed to update task status. Please try again.', 'error');
    }
  }, [toggleTaskComplete, showSnackbar]);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setEditingTask(null);
    if (modalTriggerRef.current) {
      modalTriggerRef.current.focus();
      modalTriggerRef.current = null;
    }
  }, []);

  const handleOpenCreateForm = useCallback((event: React.MouseEvent<Element>) => {
    modalTriggerRef.current = event.currentTarget as HTMLElement;
    setShowForm(true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
  }, [setItemsPerPage]);

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Task Manager
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Organize and track your tasks efficiently
      </Typography>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Filters
            </Typography>
            <Button
              startIcon={<Search />}
              onClick={() => setFiltersOpen((open) => !open)}
            >
              {filtersOpen ? 'Hide' : 'Show'} Filters
            </Button>
          </Box>
          {filtersOpen && (
            <TaskFilters
              searchInput={searchInput}
              onSearchInputChange={handleSearchInputChange}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              totalTasks={totalTasks}
            />
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {loadingTasks && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography color="text.secondary">Loading...</Typography>
        </Box>
      )}

      {/* Tasks Grid */}
      {!loadingTasks && (
        <>
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
                </Typography>
                {tasks.length === 0 && (
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpenCreateForm}
                    sx={{ mt: 2 }}
                  >
                    Add Task
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <Grid container spacing={3}>
                {filteredTasks.map((task) => (
                  <Grid item xs={12} sm={6} lg={4} key={task.id}>
                    <TaskCard
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onToggleComplete={handleToggleComplete}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              <TaskPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalTasks}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </>
          )}
        </>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add task"
        onClick={handleOpenCreateForm}
        disabled={actionLoading}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <Add />
      </Fab>

      {/* Task Form Dialog */}
      <Dialog
        open={showForm || !!editingTask}
        onClose={handleCancelForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Create New Task'}
          <Button
            onClick={handleCancelForm}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </Button>
        </DialogTitle>
        <DialogContent>
          <TaskForm
            task={editingTask || undefined}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCancelForm}
            loading={actionLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 