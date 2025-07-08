import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, Alert } from '@mui/material';
import type { Task } from '../types/task';
import type { TaskFormData } from '../utils/validation';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  loading,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'pending',
      priority: task?.priority || 'medium',
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    },
  });

  const handleFormSubmit = async (data: TaskFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2 }}>
      <Controller
        name="title"
        control={control}
        rules={{ required: 'Title is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Title"
            variant="outlined"
            margin="normal"
            error={!!errors.title}
            helperText={errors.title?.message}
            disabled={loading}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        rules={{ required: 'Description is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Description"
            variant="outlined"
            margin="normal"
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
            disabled={loading}
          />
        )}
      />

      <Controller
        name="status"
        control={control}
        rules={{ required: 'Status is required' }}
        render={({ field }) => (
          <FormControl fullWidth margin="normal" error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Select
              {...field}
              label="Status"
              disabled={loading}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
            {errors.status && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.status.message}
              </Alert>
            )}
          </FormControl>
        )}
      />

      <Controller
        name="priority"
        control={control}
        rules={{ required: 'Priority is required' }}
        render={({ field }) => (
          <FormControl fullWidth margin="normal" error={!!errors.priority}>
            <InputLabel>Priority</InputLabel>
            <Select
              {...field}
              label="Priority"
              disabled={loading}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
            {errors.priority && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.priority.message}
              </Alert>
            )}
          </FormControl>
        )}
      />

      <Controller
        name="dueDate"
        control={control}
        rules={{ required: 'Due date is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Due Date"
            type="date"
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.dueDate}
            helperText={errors.dueDate?.message}
            disabled={loading}
          />
        )}
      />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? (task ? 'Updating...' : 'Creating...') : (task ? 'Update Task' : 'Create Task')}
        </Button>
        {task && (
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
}; 