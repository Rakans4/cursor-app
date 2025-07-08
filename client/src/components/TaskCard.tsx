import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { Edit, Delete, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  const getStatusColor = (status: string): 'success' | 'warning' | 'default' => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in-progress':
      return 'warning';
    default:
      return 'default';
  }
};

  const getPriorityColor = (priority: string): 'error' | 'warning' | 'default' => {
  switch (priority) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    default:
      return 'default';
  }
};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: isOverdue ? 2 : 1,
        borderColor: isOverdue ? 'error.main' : 'divider'
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3" sx={{ flexGrow: 1, mr: 1 }}>
            {task.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Chip
              label={task.status.replace('-', ' ')}
              color={getStatusColor(task.status)}
              size="small"
            />
            <Chip
              label={task.priority}
              color={getPriorityColor(task.priority)}
              size="small"
            />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {task.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary">
            Due: {formatDate(task.dueDate)}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => onToggleComplete(task.id)}
              color={task.status === 'completed' ? 'success' : 'default'}
            >
              {task.status === 'completed' ? <CheckCircle /> : <RadioButtonUnchecked />}
            </IconButton>
        
            <IconButton
              size="small"
              onClick={() => onEdit(task)}
              color="primary"
            >
              <Edit />
            </IconButton>
            
            <IconButton
              size="small"
              onClick={() => onDelete(task.id)}
              color="error"
            >
              <Delete />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}; 