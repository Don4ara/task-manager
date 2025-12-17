import { useState, useEffect } from 'react';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { Sidebar } from './components/Sidebar';
import { DigitalClock } from './components/DigitalClock';
import { DashboardStats } from './components/DashboardStats';
import { Task } from './types';
import { Separator } from "@/components/ui/separator"

type Tab = 'all' | 'pending' | 'completed' | 'dashboard';

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskDetail } from './components/TaskDetail';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse tasks', e);
        return [];
      }
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as 'light' | 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Check deadlines every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      tasks.forEach(task => {
        if (!task.completed && task.deadline) {
          // Check if deadline passed within the last minute (to avoid spamming)
          const diff = now - task.deadline;
          if (diff > 0 && diff < 60000) {
            new Notification('Дедлайн задачи прошел!', {
              body: `Задача "${task.text}" просрочена.`,
            });
          }
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [tasks]);

  const addTask = (text: string, deadline?: number) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
      deadline,
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t =>
      t.id === id ? {
        ...t,
        completed: !t.completed,
        completedAt: !t.completed ? Date.now() : undefined
      } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (selectedTaskId === id) setSelectedTaskId(null);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'pending') return !task.completed;
    if (activeTab === 'completed') return task.completed;
    return true;
  });

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans antialiased text-foreground">
      {/* Custom Titlebar (Draggable) */}
      <div className="titlebar absolute top-0 left-0 right-0 h-8 z-50 flex justify-end items-center px-4 gap-2">
        <div className="no-drag">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Sidebar - Hidden on mobile, typically controlled by Sheet on mobile, but keeping simple for now */}
      <Sidebar
        className="hidden md:block w-64 flex-shrink-0 pt-8" // pt-8 to account for titlebar
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); setSelectedTaskId(null); }}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden pt-8"> {/* pt-8 to account for titlebar */}
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Задачи</h1>
            <p className="text-muted-foreground">
              {selectedTaskId ? "Подробности задачи" :
                (activeTab === 'dashboard' ? "Обзор вашей продуктивности." :
                  activeTab === 'all' ? "Список всех ваших задач." :
                    activeTab === 'pending' ? "Задачи, которые нужно выполнить." :
                      "Завершенные задачи.")
              }
            </p>
          </div>
          <DigitalClock />
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {selectedTaskId && selectedTask ? (
              <TaskDetail
                task={selectedTask}
                onUpdate={updateTask}
                onBack={() => setSelectedTaskId(null)}
                onDelete={deleteTask}
              />
            ) : activeTab === 'dashboard' ? (
              <DashboardStats tasks={tasks} />
            ) : (
              <>
                <TaskInput onAddTask={addTask} />
                <Separator className="my-6" />
                <TaskList
                  tasks={filteredTasks}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onSelect={(id) => setSelectedTaskId(id)}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
