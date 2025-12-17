import { Task } from '../types';
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, CalendarClock, ListTodo } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TaskListProps {
    tasks: Task[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onSelect?: (id: string) => void;
}

export function TaskList({ tasks, onToggle, onDelete, onSelect }: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Задач не найдено</p>
            </div>
        );
    }

    const isOverdue = (deadline?: number) => {
        if (!deadline) return false;
        return Date.now() > deadline;
    }

    return (
        <div className="space-y-4">
            {tasks.map((task) => {
                const completedSubtasks = (task.subtasks || []).filter(st => st.completed).length;
                const totalSubtasks = (task.subtasks || []).length;

                return (
                    <Card key={task.id}
                        className={`transition-all hover:shadow-md cursor-pointer ${task.completed ? 'opacity-60 bg-muted/50' : ''}`}
                        onClick={() => onSelect && onSelect(task.id)}
                    >
                        <CardContent className="p-4 flex items-center gap-4">
                            <Checkbox
                                checked={task.completed}
                                onCheckedChange={() => onToggle(task.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />

                            <div className="flex-1 min-w-0">
                                <p className={`font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                    {task.text}
                                </p>
                                <div className="flex items-center gap-4 mt-1">
                                    {task.deadline && (
                                        <div className={`flex items-center text-xs ${!task.completed && isOverdue(task.deadline) ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                                            <CalendarClock className="h-3 w-3 mr-1" />
                                            {format(new Date(task.deadline), 'd MMMM, HH:mm', { locale: ru })}
                                        </div>
                                    )}
                                    {totalSubtasks > 0 && (
                                        <div className="text-xs text-muted-foreground">
                                            {completedSubtasks}/{totalSubtasks} подзадач
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(task.id);
                                }}
                                className="text-muted-foreground hover:text-destructive shrink-0"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
