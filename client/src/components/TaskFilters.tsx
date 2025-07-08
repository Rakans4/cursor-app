import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, Chip } from '@mui/material';
import type { TaskFilters as TaskFiltersType } from '../types/task';
import { Typography } from '@mui/material';

interface TaskFiltersProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  onClearFilters: () => void;
  totalTasks: number;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchInput,
  onSearchInputChange,
  filters,
  onFiltersChange,
  onClearFilters,
  totalTasks,
}) => {
  const handleChange = (field: keyof TaskFiltersType, value: string) => {
    onFiltersChange({ [field]: value || undefined });
  };

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Search tasks"
            variant="outlined"
            size="small"
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          placeholder="Search by title or description..."
          />

        <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ''}
              label="Status"
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filters.priority || ''}
              label="Priority"
              onChange={(e) => handleChange('priority', e.target.value)}
            >
              <MenuItem value="">All Priorities</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            size="small"
          >
            Clear
          </Button>
      </Box>

      {/* Active filter tags */}
      {(filters.status || filters.priority || filters.search) && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {filters.status && (
                <Chip
                  label={`Status: ${filters.status}`}
                  size="small"
              onDelete={() => handleChange('status', '')}
                />
              )}
              {filters.priority && (
                <Chip
                  label={`Priority: ${filters.priority}`}
                  size="small"
              onDelete={() => handleChange('priority', '')}
                />
              )}
              {filters.search && (
                <Chip
                  label={`Search: "${filters.search}"`}
                  size="small"
              onDelete={() => onSearchInputChange('')}
                />
              )}
            </Box>
          )}
      
      <Typography variant="body2" color="text.secondary">
        {totalTasks} task{totalTasks !== 1 ? 's' : ''} found
        {hasActiveFilters && ' (filtered)'}
      </Typography>
    </Box>
  );
}; 