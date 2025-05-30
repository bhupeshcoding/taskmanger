"use client";

import { Task, PRIORITY_COLORS } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useDrag } from "react-dnd";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const dueDate = task.dueDate 
    ? new Date(task.dueDate) 
    : null;
    
  const dueDateDisplay = dueDate
    ? formatDistanceToNow(dueDate, { addSuffix: true })
    : null;
    
  const isPastDue = dueDate && new Date() > dueDate;

  return (
    <Card
      ref={drag}
      className={`mb-3 cursor-move ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-base truncate">{task.title}</h3>
            <Badge className={PRIORITY_COLORS[task.priority]}>
              {task.priority}
            </Badge>
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-col gap-1 mt-2">
            {task.assignedTo && (
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground">
                  Assigned to: {task.assignedTo}
                </span>
              </div>
            )}
            
            {dueDateDisplay && (
              <div className="flex items-center">
                <span className={`text-xs ${isPastDue ? 'text-destructive' : 'text-muted-foreground'}`}>
                  Due {dueDateDisplay}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
            >
              <Edit size={16} className="mr-1" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}