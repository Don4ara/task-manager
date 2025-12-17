import { useState, FormEvent } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface TaskInputProps {
    onAddTask: (text: string, deadline?: number) => void;
}

export function TaskInput({ onAddTask }: TaskInputProps) {
    const [input, setInput] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            const deadlineTimestamp = deadline ? new Date(deadline).getTime() : undefined;
            onAddTask(input.trim(), deadlineTimestamp);
            setInput('');
            setDeadline('');
        }
    };

    return (
        <form className="flex w-full items-end gap-2 mb-6" onSubmit={handleSubmit}>
            <div className="flex-1 space-y-1">
                <Input
                    type="text"
                    placeholder="Добавить новую задачу..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full"
                />
            </div>
            <div className="w-[180px] space-y-1">
                <Input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="text-xs"
                    aria-label="Дедлайн"
                />
            </div>
            <Button type="submit" disabled={!input.trim()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Добавить
            </Button>
        </form>
    );
}
