import { Task, TaskStatus } from './types';
import { v4 as uuidv4 } from 'uuid';

// Storage key for tasks
const TASKS_STORAGE_KEY = 'collaborative-tasks';

// Initialize with some demo tasks if none exist
const initializeDemoTasks = (): Task[] => {
  const now = new Date().toISOString();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return [
    {
      id: uuidv4(),
      title: 'Design the task board UI',
      description: 'Create a clean, intuitive interface for the task board with drag and drop functionality',
      status: 'Done',
      priority: 'High',
      assignedTo: 'Jane Smith',
      dueDate: new Date().toISOString(),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: 'Implement task filtering',
      description: 'Add the ability to filter tasks by status, priority, and assignee',
      status: 'In Progress',
      priority: 'Medium',
      assignedTo: 'John Doe',
      dueDate: tomorrow.toISOString(),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: 'Write unit tests for CRUD operations',
      description: 'Ensure all task operations have proper test coverage',
      status: 'To Do',
      priority: 'Medium',
      dueDate: nextWeek.toISOString(),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: 'Deploy application to production',
      description: 'Prepare and deploy the application to the production environment',
      status: 'To Do',
      priority: 'High',
      dueDate: nextWeek.toISOString(),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: 'Create documentation',
      description: 'Write comprehensive documentation for the application',
      status: 'To Do',
      priority: 'Low',
      assignedTo: 'Alex Johnson',
      createdAt: now,
      updatedAt: now,
    }
  ];
};

// Load tasks from localStorage
export const loadTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!storedTasks) {
      const demoTasks = initializeDemoTasks();
      saveTasks(demoTasks);
      return demoTasks;
    }
    return JSON.parse(storedTasks);
  } catch (error) {
    console.error('Failed to load tasks:', error);
    return [];
  }
};

// Save tasks to localStorage
export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks:', error);
  }
};

// Create a new task
export const createTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
  const tasks = loadTasks();
  const now = new Date().toISOString();
  
  const newTask: Task = {
    ...task,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  
  const updatedTasks = [...tasks, newTask];
  saveTasks(updatedTasks);
  return newTask;
};

// Update an existing task
export const updateTask = (updatedTask: Task): Task => {
  const tasks = loadTasks();
  const now = new Date().toISOString();
  
  const taskIndex = tasks.findIndex(task => task.id === updatedTask.id);
  if (taskIndex === -1) {
    throw new Error(`Task with id ${updatedTask.id} not found`);
  }
  
  const newTask = {
    ...updatedTask,
    updatedAt: now,
  };
  
  tasks[taskIndex] = newTask;
  saveTasks(tasks);
  return newTask;
};

// Delete a task
export const deleteTask = (id: string): void => {
  const tasks = loadTasks();
  const updatedTasks = tasks.filter(task => task.id !== id);
  saveTasks(updatedTasks);
};

// Update task status
export const updateTaskStatus = (id: string, newStatus: TaskStatus): Task => {
  const tasks = loadTasks();
  const now = new Date().toISOString();
  
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    throw new Error(`Task with id ${id} not found`);
  }
  
  const updatedTask = {
    ...tasks[taskIndex],
    status: newStatus,
    updatedAt: now,
  };
  
  tasks[taskIndex] = updatedTask;
  saveTasks(tasks);
  return updatedTask;
};

// Get tasks by status
export const getTasksByStatus = (status: TaskStatus): Task[] => {
  const tasks = loadTasks();
  return tasks.filter(task => task.status === status);
};

// Get all tasks
export const getAllTasks = (): Task[] => {
  return loadTasks();
};