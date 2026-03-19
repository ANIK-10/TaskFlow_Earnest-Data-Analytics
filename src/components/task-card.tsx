
"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Card className={cn(
      "group transition-all duration-200 hover:shadow-md border-l-4",
      task.completed ? "border-l-muted opacity-80" : "border-l-primary"
    )}>
      <CardContent className="p-4 flex items-start gap-4">
        <div className="pt-1">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={() => onToggle(task.id)}
            className="h-5 w-5 rounded-full"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold text-lg leading-tight transition-all",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className={cn(
              "text-sm mt-1 text-muted-foreground line-clamp-2",
              task.completed && "line-through"
            )}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-3 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(task.createdAt), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(new Date(task.createdAt), 'h:mm a')}
            </div>
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => onEdit(task)} className="h-8 w-8 text-primary hover:bg-primary/10">
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(task.id)} 
            disabled={isDeleting}
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
