import { useState, useMemo, useEffect } from "react";
import {
    useWellnessDataByGender,
    WellnessData,
    sportSpecificTrainingTitleMap,
} from "@/data/wellness";
import { useResultsDataByGender } from "@/data/results";
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
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    XAxis,
    YAxis,
    ReferenceLine,
} from "recharts";
import { MultiSelect } from "./ui/multi-select";
import { cn } from "@/lib/utils";

export function WellnessGraphComparison({ gender }: { gender: string }) {
    const [selectedMetric, setSelectedMetric] =
        useState<keyof WellnessData>("Resting HR");
    const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);
    const { data: wellnessData } = useWellnessDataByGender(gender);
    const { data: resultsData } = useResultsDataByGender(gender);

    const metrics = [
        "Resting HR",
        "Motivation",
        "Soreness",
        "Fatigue",
        "Sleep Hours",
        "Sleep Quality",
        "Stress",
        "Travel Hours",
        "Sport Specific Training Volume",
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
                const dataPoint: Record<string, string | number | null> = {
                    Date: date,
                };
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
                    new Date(a.Date as string).getTime() -
                    new Date(b.Date as string).getTime()
            );
    }, [wellnessData, selectedAthletes, selectedMetric]);

    const chartConfig = selectedAthletes.reduce((acc, athlete, index) => {
        acc[athlete] = {
            label: athlete,
            color: `hsl(var(--chart-${(index % 5) + 1}))`,
        };
        return acc;
    }, {} as ChartConfig);

    const competitionDates = useMemo(() => {
        if (!resultsData) return [];
        return Array.from(new Set(resultsData.map((result) => result.Date)));
    }, [resultsData]);

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
                        <YAxis
                            tickFormatter={(value) =>
                                selectedMetric ===
                                "Sport Specific Training Volume"
                                    ? sportSpecificTrainingTitleMap[
                                          value as keyof typeof sportSpecificTrainingTitleMap
                                      ] || value
                                    : value
                            }
                            ticks={
                                selectedMetric ===
                                "Sport Specific Training Volume"
                                    ? [0, 1, 2, 3]
                                    : undefined
                            }
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(
                                            value
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        });
                                    }}
                                    formatter={(_value, _name, item) => {
                                        const indicatorColor =
                                            item.payload.fill || item.color;
                                        const indicator = "dot";
                                        const nestLabel = false;
                                        const isNan = isNaN(
                                            item.value as number
                                        );
                                        let innerText = isNan
                                            ? "Not reported"
                                            : (
                                                  item.value ?? "Not reported"
                                              ).toLocaleString();

                                        if (
                                            selectedMetric ===
                                                "Sport Specific Training Volume" &&
                                            !isNan
                                        ) {
                                            innerText =
                                                sportSpecificTrainingTitleMap[
                                                    item.value as keyof typeof sportSpecificTrainingTitleMap
                                                ] || innerText;
                                        }

                                        return (
                                            <>
                                                <div
                                                    className={cn(
                                                        "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                                                        {
                                                            "h-2.5 w-2.5":
                                                                indicator ===
                                                                "dot",
                                                        }
                                                    )}
                                                    style={
                                                        {
                                                            "--color-bg":
                                                                indicatorColor,
                                                            "--color-border":
                                                                indicatorColor,
                                                        } as React.CSSProperties
                                                    }
                                                />
                                                <div
                                                    className={cn(
                                                        "flex flex-1 gap-2 justify-between leading-none",
                                                        nestLabel
                                                            ? "items-end"
                                                            : "items-center"
                                                    )}
                                                >
                                                    <div className="grid gap-1.5">
                                                        <span className="text-muted-foreground">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    {
                                                        <span className="font-mono font-medium tabular-nums text-foreground">
                                                            {innerText}
                                                        </span>
                                                    }
                                                </div>
                                            </>
                                        );
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        {selectedAthletes.map((athlete, index) => (
                            <Line
                                key={athlete}
                                connectNulls
                                type="monotone"
                                dataKey={athlete}
                                stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
                                activeDot={{ r: 8 }}
                            />
                        ))}
                        {competitionDates.map((date, index) => (
                            <ReferenceLine
                                key={`competition-${index}`}
                                x={date}
                                stroke="#888"
                                strokeWidth={2}
                                strokeDasharray="3 3"
                            />
                        ))}
                        <Legend
                            payload={[
                                ...selectedAthletes.map((athlete, index) => ({
                                    value: athlete,
                                    type: "line" as const,
                                    color: `hsl(var(--chart-${
                                        (index % 5) + 1
                                    }))`,
                                })),
                                {
                                    value: "Competition Day",
                                    type: "line" as const,
                                    color: "#888",
                                },
                            ]}
                            wrapperStyle={{ fontSize: "14px" }}
                            iconSize={20}
                            verticalAlign="bottom"
                            height={36}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
