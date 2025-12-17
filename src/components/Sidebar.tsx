import { LayoutDashboard, CheckCircle2, Circle, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface SidebarProps {
    activeTab: 'all' | 'pending' | 'completed' | 'dashboard';
    onTabChange: (tab: 'all' | 'pending' | 'completed' | 'dashboard') => void;
    className?: string;
}

export function Sidebar({ activeTab, onTabChange, className }: SidebarProps) {
    const items = [
        { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
        { id: 'all', label: 'Все задачи', icon: ListTodo },
        { id: 'pending', label: 'В ожидании', icon: Circle },
        { id: 'completed', label: 'Завершенные', icon: CheckCircle2 },
    ] as const;

    return (
        <div className={cn("pb-12 w-64 border-r bg-background", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Меню
                    </h2>
                    <div className="space-y-1">
                        {items.map((item) => (
                            <Button
                                key={item.id}
                                variant={activeTab === item.id ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => onTabChange(item.id)}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
