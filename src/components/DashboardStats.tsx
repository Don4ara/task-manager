import { Task } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, ListTodo, TrendingUp } from "lucide-react";
import { ContributionGraph } from "./ContributionGraph";

interface DashboardStatsProps {
    tasks: Task[];
}

export function DashboardStats({ tasks }: DashboardStatsProps) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    const stats = [
        {
            title: "Всего задач",
            value: total,
            icon: ListTodo,
            description: "Общее количество задач",
            color: "text-blue-500 dark:text-blue-400",
        },
        {
            title: "Выполнено",
            value: completed,
            icon: CheckCircle2,
            description: `${percentage}% от общего числа`,
            color: "text-green-500 dark:text-green-400",
        },
        {
            title: "В ожидании",
            value: pending,
            icon: Circle,
            description: "Задачи в работе",
            color: "text-orange-500 dark:text-orange-400",
        },
        {
            title: "Продуктивность",
            value: `${percentage}%`,
            icon: TrendingUp,
            description: "Текущий прогресс",
            color: "text-purple-500 dark:text-purple-400",
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <ContributionGraph tasks={tasks} />
        </div>
    );
}
