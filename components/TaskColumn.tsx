"use client";

import { useMemo } from "react";
import { Task, TaskStatus, STATUS_COLORS } from "@/lib/types";
import { TaskCard } from "@/components/TaskCard";
import { useDrop } from "react-dnd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onTaskDropped: (taskId: string, newStatus: TaskStatus) => void;
}

export function TaskColumn({
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onTaskDropped,
}: TaskColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item: { id: string }) => {
      onTaskDropped(item.id, status);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const columnTasks = useMemo(() => 
    tasks.filter(task => task.status === status), 
    [tasks, status]
  );

  return (
    <div
      ref={drop}
      className={`bg-card rounded-lg p-4 min-h-[500px] w-full ${
        isOver ? "bg-muted/50" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="font-semibold text-lg">{status}</h3>
          <Badge variant="outline" className="ml-2">
            {columnTasks.length}
          </Badge>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAddTask(status)}
          className={`${STATUS_COLORS[status]} border-none`}
        >
          <Plus size={16} className="mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-3">
        {columnTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
        {columnTasks.length === 0 && (
          <div className="flex items-center justify-center h-20 border border-dashed rounded-md border-muted-foreground/50">
            <p className="text-sm text-muted-foreground">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}