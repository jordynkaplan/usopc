import { useState, useMemo, useEffect } from "react";
import { useWellnessDataByGender, WellnessData } from "@/data/wellness";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "./ui/chart";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import { MultiSelect } from "./ui/multi-select";

export function WellnessGraphComparison({ gender }: { gender: string }) {
    const [selectedMetric, setSelectedMetric] =
        useState<keyof WellnessData>("Resting HR");
    const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);
    const { data: wellnessData } = useWellnessDataByGender(gender);

    const metrics = [
        "Resting HR",
        "Motivation",
        "Soreness",
        "Fatigue",
        "Sleep Hours",
        "Sleep Quality",
        "Stress",
        "Travel Hours",
    ] as (keyof WellnessData)[];

    const athletes = useMemo(() => {
        if (!wellnessData) return [];
        return Array.from(new Set(wellnessData.map((data) => data.Athlete)));
    }, [wellnessData]);

    useEffect(() => {
        if (athletes.length > 0) {
            setSelectedAthletes(athletes);
        }
    }, [athletes]);

    const athleteOptions = useMemo(() => {
        return athletes.map((athlete) => ({
            label: athlete,
            value: athlete,
        }));
    }, [athletes]);

    const chartData = useMemo(() => {
        if (!wellnessData) return [];
        const filteredData = wellnessData.filter((data) =>
            selectedAthletes.includes(data.Athlete)
        );
        const dates = Array.from(
            new Set(filteredData.map((data) => data.Date))
        );
        return dates
            .map((date) => {
                const dataPoint: any = { Date: date };
                selectedAthletes.forEach((athlete) => {
                    const athleteData = filteredData.find(
                        (d) => d.Date === date && d.Athlete === athlete
                    );
                    dataPoint[athlete] = athleteData
                        ? athleteData[selectedMetric]
                        : null;
                });
                return dataPoint;
            })
            .sort(
                (a, b) =>
                    new Date(a.Date).getTime() - new Date(b.Date).getTime()
            );
    }, [wellnessData, selectedAthletes, selectedMetric]);

    const chartConfig = selectedAthletes.reduce((acc, athlete, index) => {
        acc[athlete] = {
            label: athlete,
            color: `hsl(var(--chart-${(index % 5) + 1}))`,
        };
        return acc;
    }, {} as ChartConfig);

    return (
        <Card>
            <CardHeader>
                <div className="flex gap-4 my-2 justify-between">
                    <CardTitle>Athlete Wellness Comparison</CardTitle>
                    <div className="flex gap-2">
                        <div>
                            <Select
                                value={selectedMetric}
                                onValueChange={(value) =>
                                    setSelectedMetric(
                                        value as keyof WellnessData
                                    )
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a metric" />
                                </SelectTrigger>
                                <SelectContent>
                                    {metrics.map((metric) => (
                                        <SelectItem key={metric} value={metric}>
                                            {metric}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2">
                            <MultiSelect
                                options={athleteOptions}
                                onValueChange={setSelectedAthletes}
                                defaultValue={selectedAthletes}
                                placeholder="Select athletes"
                            />
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="Date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        {selectedAthletes.map((athlete, index) => (
                            <Line
                                key={athlete}
                                type="monotone"
                                dataKey={athlete}
                                stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
                                activeDot={{ r: 8 }}
                            />
                        ))}
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
