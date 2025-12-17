import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

export function DigitalClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <Card className="px-4 py-2 bg-secondary/50 border-none shadow-inner">
            <div className="text-2xl font-mono font-bold tracking-wider text-primary">
                {time.toLocaleTimeString('ru-RU')}
            </div>
            <div className="text-xs text-muted-foreground text-center font-medium">
                {time.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
        </Card>
    );
}
