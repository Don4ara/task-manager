import { Task } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { startOfDay, subDays, format, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ContributionGraphProps {
    tasks: Task[];
}

export function ContributionGraph({ tasks }: ContributionGraphProps) {
    // Generate last 100 days (roughly 3 months + a bit) to fit typical dashboard width
    const today = startOfDay(new Date());
    const days = Array.from({ length: 112 }).map((_, i) => subDays(today, 111 - i)); // 16 weeks * 7 days

    const getIntensity = (count: number) => {
        if (count === 0) return 'bg-secondary';
        if (count <= 2) return 'bg-green-300 dark:bg-green-900/40';
        if (count <= 4) return 'bg-green-400 dark:bg-green-800/60';
        if (count <= 6) return 'bg-green-500 dark:bg-green-700/80';
        return 'bg-green-600 dark:bg-green-600';
    };

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>История продуктивности</CardTitle>
            </CardHeader>
            <CardContent>
                <TooltipProvider>
                    <div className="flex flex-wrap gap-1 justify-center sm:justify-start overflow-x-auto py-4">
                        {days.map((day) => {
                            const count = tasks.filter(t =>
                                t.completedAt && isSameDay(new Date(t.completedAt), day)
                            ).length;

                            return (
                                <Tooltip key={day.toISOString()}>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={`w-3 h-3 rounded-sm ${getIntensity(count)} transition-colors hover:ring-2 hover:ring-ring hover:ring-offset-1`}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">
                                            {count === 0 ? 'Нет задач' : `${count} задач выполнено`}
                                            <br />
                                            <span className="text-muted-foreground">
                                                {format(day, 'd MMM yyyy', { locale: ru })}
                                            </span>
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
                        <span>Меньше</span>
                        <div className="w-3 h-3 rounded-sm bg-secondary" />
                        <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-900/40" />
                        <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-700/80" />
                        <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-600" />
                        <span>Больше</span>
                    </div>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
}
