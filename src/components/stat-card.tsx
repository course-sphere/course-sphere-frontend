import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    icon: React.ReactNode;
}

export default function StatCard({
    title,
    value,
    change,
    icon,
}: StatCardProps) {
    return (
        <Card className="border-border/50 from-card to-background bg-linear-to-br transition-shadow hover:shadow-lg">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-muted-foreground mb-1 text-sm font-medium">
                            {title}
                        </p>
                        <p className="text-foreground mb-2 text-2xl font-bold">
                            {value}
                        </p>
                        <p className="text-primary text-xs font-medium">
                            {change}
                        </p>
                    </div>
                    <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                        {icon}
                    </div>{' '}
                </div>
            </CardContent>
        </Card>
    );
}
