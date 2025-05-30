import { z } from 'zod';
import { TASK_PRIORITY_LIST, TASK_STATUS_LIST } from './types';

export const taskSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, {
    message: "Title must be at least 3 characters",
  }).max(100, {
    message: "Title must not exceed 100 characters",
  }),
  description: z.string().max(500, {
    message: "Description must not exceed 500 characters",
  }).optional(),
  status: z.enum(TASK_STATUS_LIST as [string, ...string[]]),
  priority: z.enum(TASK_PRIORITY_LIST as [string, ...string[]]),
  dueDate: z.string().optional(),
  assignedTo: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;