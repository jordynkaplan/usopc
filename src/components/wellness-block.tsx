import { useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "./ui/chart";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { ZoomIn } from "lucide-react";

interface ChartData {
    date: string;
    value: number;
}

interface WellnessBlockProps {
    title: string;
    description: string;
    chartData: ChartData[];
    currentValue: number;
    unit: string;
}

export function WellnessBlock({
    title,
    description,
    chartData,
    currentValue,
    unit,
}: WellnessBlockProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    const DetailedChart = () => (
        <ChartContainer config={chartConfig} className="grow">
            <BarChart data={chartData}>
                <XAxis
                    dataKey="date"
                    label={{
                        value: "Date",
                        position: "insideBottom",
                        offset: -5,
                    }}
                />
                <YAxis
                    label={{ value: unit, angle: -90, position: "insideLeft" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                    dataKey="value"
                    fill="#a32135"
                    radius={2}
                    fillOpacity={0.6}
                />
            </BarChart>
        </ChartContainer>
    );

    return (
        <Card className="">
            <CardHeader className="p-4 pb-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row items-baseline justify-between gap-4 p-4 pt-2">
                <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
                    {currentValue}
                    <span className="text-sm font-normal text-muted-foreground">
                        {unit}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <ChartContainer
                        config={{
                            calories: {
                                label: "Calories",
                                color: "#a32135",
                            },
                        }}
                        className="w-[64px]"
                    >
                        <BarChart
                            accessibilityLayer
                            margin={{
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                            }}
                            data={chartData}
                        >
                            <Bar
                                dataKey="value"
                                fill="#a32135"
                                radius={2}
                                fillOpacity={0.6}
                                activeIndex={6}
                            />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={4}
                                hide
                            />
                        </BarChart>
                    </ChartContainer>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="p-0">
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[720px]">
                            <CardTitle>{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                            <DetailedChart />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}
