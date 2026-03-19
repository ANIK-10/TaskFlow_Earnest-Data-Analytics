"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { KanbanTask } from '@/components/kanban-task';
import { TaskDialog } from '@/components/task-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  Plus, Search, LogOut, ListTodo, 
  CheckCircle2, Clock, Kanban
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';

export default function DashboardPage() {
  const { user, loading, logout, authorizedFetch } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<any[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setIsTasksLoading(true);
    try {
      const queryParams = new URLSearchParams({ q: search });
      const res = await authorizedFetch(`/api/tasks?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsTasksLoading(false);
    }
  }, [authorizedFetch, search, toast, user]);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(fetchTasks, 300);
      return () => clearTimeout(timer);
    }
  }, [user, fetchTasks]);

  const handleToggle = async (id: string) => {
    const originalTasks = [...tasks];
    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;

    // Optimistic UI update
    const updatedTasks = tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);

    try {
      const res = await authorizedFetch(`/api/tasks/${id}/toggle`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Toggle failed');
      const serverTask = await res.json();
      // Sync with server response
      setTasks(prev => prev.map(t => t.id === id ? serverTask : t));
    } catch (error: any) {
      setTasks(originalTasks);
      toast({ variant: 'destructive', title: 'Error', description: "Failed to update task status." });
    }
  };

  const handleDelete = async (id: string) => {
    const originalTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== id));

    try {
      const res = await authorizedFetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast({ title: 'Task deleted' });
    } catch (error: any) {
      setTasks(originalTasks);
      toast({ variant: 'destructive', title: 'Error', description: "Failed to delete task." });
    }
  };

  const handleSaveTask = async (data: { title: string; description: string; priority: string; category: string }) => {
    const isEditing = !!editingTask;
    const tempId = isEditing ? editingTask.id : 'temp-' + Date.now();
    const originalTasks = [...tasks];
    
    // Optimistic UI Update
    const optimisticTask = { 
      id: tempId, 
      ...data, 
      completed: isEditing ? editingTask.completed : false, 
      createdAt: isEditing ? editingTask.createdAt : new Date().toISOString() 
    };

    if (isEditing) {
      setTasks(tasks.map(t => t.id === editingTask.id ? optimisticTask : t));
    } else {
      setTasks([optimisticTask, ...tasks]);
    }
    
    setIsDialogOpen(false);
    setEditingTask(null);

    try {
      const url = isEditing ? `/api/tasks/${editingTask.id}` : '/api/tasks';
      const method = isEditing ? 'PATCH' : 'POST';
      const res = await authorizedFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Save failed');
      }
      
      const savedTask = await res.json();
      // Replace optimistic task with actual saved task from server
      setTasks(prev => prev.map(t => t.id === tempId ? savedTask : t));
      toast({ title: isEditing ? 'Task updated' : 'Task created' });
    } catch (error: any) {
      setTasks(originalTasks);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: error.message || "Failed to save task." 
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // This handles reordering within the SAME column
    setTasks((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const pendingTasks = useMemo(() => tasks.filter(t => !t.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(t => t.completed), [tasks]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Clock className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b bg-card h-16 sticky top-0 z-40 flex items-center px-4 md:px-8 shadow-sm transition-colors">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg shadow-sm">
            <Kanban className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:inline-block">TaskFlow Pro</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          <div className="h-8 w-[1px] bg-border mx-1 hidden sm:block" />
          <div className="hidden md:flex flex-col items-end">
            <p className="text-sm font-semibold leading-none mb-1">{user.name}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{user.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">My Dashboard</h1>
            <p className="text-muted-foreground">Manage your workflow with ease</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-none shadow-sm focus-visible:ring-1 focus-visible:ring-primary/20"
              />
            </div>
            <Button onClick={() => { setEditingTask(null); setIsDialogOpen(true); }} className="shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
              <Plus className="mr-2 h-4 w-4" /> New Task
            </Button>
          </div>
        </div>

        {isTasksLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((col) => (
              <div key={col} className="space-y-4">
                <Skeleton className="h-8 w-32 mb-4" />
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Pending Column */}
            <div className="bg-muted/30 p-4 rounded-2xl min-h-[500px]">
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-400" />
                  <h2 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Pending</h2>
                  <span className="bg-card text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm">
                    {pendingTasks.length}
                  </span>
                </div>
              </div>
              
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={pendingTasks.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {pendingTasks.map((task) => (
                      <KanbanTask
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onEdit={(t) => {
                          setEditingTask(t);
                          setIsDialogOpen(true);
                        }}
                      />
                    ))}
                    {pendingTasks.length === 0 && (
                      <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted-foreground/10">
                        <ListTodo className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground font-medium">No pending tasks</p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Completed Column */}
            <div className="bg-muted/30 p-4 rounded-2xl min-h-[500px]">
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  <h2 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Completed</h2>
                  <span className="bg-card text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm">
                    {completedTasks.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <KanbanTask
                    key={task.id}
                    task={task}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onEdit={(t) => {
                      setEditingTask(t);
                      setIsDialogOpen(true);
                    }}
                  />
                ))}
                {completedTasks.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted-foreground/10">
                    <CheckCircle2 className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground font-medium">No completed tasks yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
}
