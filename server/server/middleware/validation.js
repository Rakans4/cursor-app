import { z } from 'zod';

// Task creation validation schema (dueDate must be today or in the future)
const taskCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  status: z.enum(['pending', 'in-progress', 'completed'], {
    required_error: 'Please select a status',
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select a priority',
  }),
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Due date must be today or in the future'),
});

// Task update validation schema (dueDate can be in the past)
const taskUpdateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  status: z.enum(['pending', 'in-progress', 'completed'], {
    required_error: 'Please select a status',
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select a priority',
  }),
  dueDate: z
    .string()
    .min(1, 'Due date is required'),
});

export const validateTaskCreate = (req, res, next) => {
  try {
    const validatedData = taskCreateSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }
    next(error);
  }
};

export const validateTaskUpdate = (req, res, next) => {
  try {
    const validatedData = taskUpdateSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }
    next(error);
  }
}; 