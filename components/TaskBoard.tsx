"use client";

import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { 
  TaskColumn 
} from "@/components/TaskColumn";
import { 
  getAllTasks, 
  updateTaskStatus, 
  deleteTask 
} from "@/lib/task-service";
import { Task, TaskStatus, TASK_STATUS_LIST } from "@/lib/types";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { TaskFilter } from "@/components/TaskFilter";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignedTo: '',
    searchQuery: ''
  });
  
  // Load tasks on component mount
  useEffect(() => {
    const loadedTasks = getAllTasks();
    setTasks(loadedTasks);
    setFilteredTasks(loadedTasks);
  }, []);
  
  // Apply filters when tasks or filter criteria change
  useEffect(() => {
    let result = tasks;
    
    // Filter by status
    if (filters.status) {
      result = result.filter(task => task.status === filters.status);
    }
    
    // Filter by priority
    if (filters.priority) {
      result = result.filter(task => task.priority === filters.priority);
    }
    
    // Filter by assigned user
    if (filters.assignedTo) {
      result = result.filter(task => 
        task.assignedTo?.toLowerCase().includes(filters.assignedTo.toLowerCase())
      );
    }
    
    // Filter by search query (title or description)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description?.toLowerCase().includes(query)
      );
    }
    
    setFilteredTasks(result);
  }, [tasks, filters]);

  // Handle task drop (status change via drag and drop)
  const handleTaskDrop = (taskId: string, newStatus: TaskStatus) => {
    try {
      const updatedTask = updateTaskStatus(taskId, newStatus);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? updatedTask : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Handle adding new task
  const handleAddTask = (status: TaskStatus) => {
    setCurrentTask(null);
    setIsTaskDialogOpen(true);
  };

  // Handle editing task
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsTaskDialogOpen(true);
  };

  // Handle deleting task
  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  // Confirm task deletion
  const confirmDeleteTask = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDelete));
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  // Handle task save (create or update)
  const handleTaskSave = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    setIsTaskDialogOpen(false);
    setCurrentTask(null);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-4">
      <TaskFilter 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {TASK_STATUS_LIST.map(status => (
            <TaskColumn
              key={status}
              status={status}
              tasks={filteredTasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onTaskDropped={handleTaskDrop}
            />
          ))}
        </div>
      </DndProvider>
      
      {isTaskDialogOpen && (
        <TaskFormDialog
          open={isTaskDialogOpen}
          onOpenChange={setIsTaskDialogOpen}
          task={currentTask}
          allTasks={tasks}
          onSave={handleTaskSave}
        />
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}