import { useState } from 'react';
import { Task, Subtask } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from 'date-fns/locale';

interface TaskDetailProps {
    task: Task;
    onUpdate: (task: Task) => void;
    onBack: () => void;
    onDelete: (id: string) => void;
}

export function TaskDetail({ task, onUpdate, onBack, onDelete }: TaskDetailProps) {
    const [description, setDescription] = useState(task.description || '');
    const [subtaskInput, setSubtaskInput] = useState('');

    // Auto-save description on blur or unmount could be added, but for now we save on change
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        onUpdate({ ...task, description: e.target.value });
    };

    const addSubtask = () => {
        if (!subtaskInput.trim()) return;
        const newSubtask: Subtask = {
            id: crypto.randomUUID(),
            text: subtaskInput.trim(),
            completed: false
        };
        const updatedSubtasks = [...(task.subtasks || []), newSubtask];
        onUpdate({ ...task, subtasks: updatedSubtasks });
        setSubtaskInput('');
    };

    const toggleSubtask = (subtaskId: string) => {
        const updatedSubtasks = (task.subtasks || []).map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        onUpdate({ ...task, subtasks: updatedSubtasks });
    };

    const deleteSubtask = (subtaskId: string) => {
        const updatedSubtasks = (task.subtasks || []).filter(st => st.id !== subtaskId);
        onUpdate({ ...task, subtasks: updatedSubtasks });
    };

    const completedSubtasks = (task.subtasks || []).filter(st => st.completed).length;
    const totalSubtasks = (task.subtasks || []).length;

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-2xl font-bold truncate flex-1">{task.text}</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Описание</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Добавьте описание задачи..."
                                className="min-h-[150px] resize-none"
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Подзадачи ({completedSubtasks}/{totalSubtasks})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Новая подзадача..."
                                    value={subtaskInput}
                                    onChange={(e) => setSubtaskInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                                />
                                <Button size="icon" onClick={addSubtask} disabled={!subtaskInput.trim()}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {(task.subtasks || []).map(st => (
                                    <div key={st.id} className="flex items-center space-x-2 group p-2 rounded-md hover:bg-muted/50 transition-colors">
                                        <Checkbox
                                            checked={st.completed}
                                            onCheckedChange={() => toggleSubtask(st.id)}
                                        />
                                        <span className={`flex-1 text-sm ${st.completed ? 'line-through text-muted-foreground' : ''}`}>
                                            {st.text}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive"
                                            onClick={() => deleteSubtask(st.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Инфо</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Дедлайн</p>
                                <div className="flex items-center text-sm">
                                    <Calendar className="mr-2 h-4 w-4 opacity-70" />
                                    {task.deadline ? (
                                        format(new Date(task.deadline), 'd MMMM yyyy, HH:mm', { locale: ru })
                                    ) : (
                                        <span className="text-muted-foreground">Не установлен</span>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Создано</p>
                                <p className="text-sm">
                                    {format(new Date(task.createdAt), 'd MMM yyyy', { locale: ru })}
                                </p>
                            </div>

                            <Separator />

                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => { onDelete(task.id); onBack(); }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Удалить задачу
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
