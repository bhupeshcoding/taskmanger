export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // ISO string
  assignedTo?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export const TASK_STATUS_LIST: TaskStatus[] = ['To Do', 'In Progress', 'Done'];
export const TASK_PRIORITY_LIST: TaskPriority[] = ['Low', 'Medium', 'High'];

// Priority colors
export const PRIORITY_COLORS = {
  Low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  High: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

// Status colors
export const STATUS_COLORS = {
  'To Do': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  'In Progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'Done': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};