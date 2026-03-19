
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, GripVertical, Calendar, Flag, Tag } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: string;
  category?: string;
  createdAt: string;
}

interface KanbanTaskProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function KanbanTask({ task, onToggle, onDelete, onEdit }: KanbanTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string = 'MEDIUM') => {
    switch (priority) {
      case 'HIGH': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'MEDIUM': return 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400';
      case 'LOW': return 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string = 'PERSONAL') => {
    switch (category) {
      case 'URGENT': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'WORK': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'HEALTH': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'SHOPPING': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <div ref={setNodeRef} style={style} className={cn(isDragging && "opacity-50")}>
      <Card className={cn(
        "group relative bg-card hover:border-primary/50 transition-colors shadow-sm mb-3",
        task.completed ? "opacity-75" : ""
      )}>
        <CardContent className="p-4 flex gap-3">
          <div {...attributes} {...listeners} className="cursor-grab hover:text-primary transition-colors flex items-center pt-1 self-start">
            <GripVertical className="h-4 w-4 text-muted-foreground/50" />
          </div>
          
          <div className="pt-1 self-start">
            <Checkbox 
              checked={task.completed} 
              onCheckedChange={() => onToggle(task.id)}
              className="h-5 w-5 rounded-full"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h4 className={cn(
                "font-medium text-sm leading-tight transition-all",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h4>
            </div>

            {task.description && (
              <p className={cn(
                "text-xs text-muted-foreground line-clamp-2",
                task.completed && "line-through"
              )}>
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {task.category && (
                <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5 font-bold uppercase", getCategoryColor(task.category))}>
                  <Tag className="h-2.5 w-2.5 mr-1" />
                  {task.category}
                </Badge>
              )}
              {task.priority && (
                <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5 font-bold uppercase", getPriorityColor(task.priority))}>
                  <Flag className="h-2.5 w-2.5 mr-1" />
                  {task.priority}
                </Badge>
              )}
              
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold">
                <Calendar className="h-3 w-3" />
                <span>Added {format(new Date(task.createdAt), 'MMM d')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" onClick={() => onEdit(task)} className="h-7 w-7 text-primary hover:bg-primary/10">
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="h-7 w-7 text-destructive hover:bg-destructive/10">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
