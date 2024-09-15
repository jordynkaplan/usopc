"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useResultsDataByAthlete } from "@/data/results";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { Badge } from "./ui/badge";

export function ResultGraph({ athlete }: { athlete: string | null }) {
    const { data: athleteResults } = useResultsDataByAthlete(athlete);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const dates = useMemo(() => {
        if (!athleteResults) return [];
        return [...new Set(athleteResults.map((result) => result.Date))];
    }, [athleteResults]);

    useEffect(() => {
        if (dates.length > 0 && !selectedDate) {
            setSelectedDate(dates[0]);
        }
    }, [dates, selectedDate]);

    const chartData = useMemo(() => {
        if (!athleteResults || !selectedDate) return [];
        const selectedResult = athleteResults.find(
            (result) => result.Date === selectedDate
        );
        if (!selectedResult) return [];

        return [
            {
                name: "Heat 1",
                best: selectedResult["Time: Best Heat 1"] || 0,
                timeDifference: selectedResult["Time Delta: Heat 1"] || 0,
            },
            {
                name: "Heat 2",
                best: selectedResult["Time: Best Heat 2"] || 0,
                timeDifference: selectedResult["Time Delta: Heat 2"] || 0,
            },
        ];
    }, [athleteResults, selectedDate]);

    const chartConfig = {
        best: {
            label: "Best Time",
            color: "hsl(var(--chart-1))",
        },
        timeDifference: {
            label: "Time Difference",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Competition Heat Times vs. Best Times</CardTitle>
                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="competition-date-select"
                            className="text-sm font-medium"
                        >
                            Competition Dates:
                        </label>
                        <Select
                            value={selectedDate || ""}
                            onValueChange={setSelectedDate}
                        >
                            <SelectTrigger
                                id="competition-date-select"
                                className="w-[180px]"
                            >
                                <SelectValue placeholder="Select competition date" />
                            </SelectTrigger>
                            <SelectContent>
                                {dates.map((date) => (
                                    <SelectItem key={date} value={date}>
                                        {date}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <CardDescription>
                    <div className="flex items-center gap-4 font-medium">
                        <div className="flex items-center gap-2">
                            <span>Heat 1:</span>
                            <Badge
                                variant={
                                    chartData[0]?.timeDifference > 0
                                        ? "destructive"
                                        : "default"
                                }
                            >
                                {chartData[0]?.timeDifference > 0 ? "+" : ""}
                                {chartData[0]?.timeDifference.toFixed(2)}s
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Heat 2:</span>
                            <Badge
                                variant={
                                    chartData[1]?.timeDifference > 0
                                        ? "destructive"
                                        : "default"
                                }
                            >
                                {chartData[1]?.timeDifference > 0 ? "+" : ""}
                                {chartData[1]?.timeDifference.toFixed(2)}s
                            </Badge>
                        </div>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        width={600}
                        height={300}
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient
                                id="fillBest"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor={chartConfig.best.color}
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="40%"
                                    stopColor={chartConfig.best.color}
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient
                                id="fillTimeDifference"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor={chartConfig.timeDifference.color}
                                    stopOpacity={0.5}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={chartConfig.timeDifference.color}
                                    stopOpacity={0.05}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            label={{
                                value: "Seconds",
                                angle: -90,
                                position: "insideLeft",
                            }}
                            domain={[
                                Math.min(...chartData.map((d) => d.best)) - 2,
                                Math.max(
                                    ...chartData.map(
                                        (d) => d.best + d.timeDifference
                                    )
                                ) + 2,
                            ]}
                            allowDataOverflow={true}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="best"
                            stackId="1"
                            stroke={chartConfig.best.color}
                            fill="none"
                            fillOpacity={1}
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="timeDifference"
                            stackId="1"
                            stroke={chartConfig.timeDifference.color}
                            fill="url(#fillTimeDifference)"
                            fillOpacity={1}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
