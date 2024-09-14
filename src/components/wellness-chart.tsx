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
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    XAxis,
    YAxis,
} from "recharts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { useState, useMemo } from "react";
import { cn, removeUndefinedOrNull, uniqueValues } from "@/lib/utils";
import { ResultsData, useResultsDataByAthlete } from "@/data/results";
import { useWellnessLoadDataByAthlete, WellnessData } from "@/data/wellness";

interface WellnessChartProps {
    athlete?: string | null;
    className?: string;
}

export const lineColors = ["#b22233"];

function useCleanedWellnessData(
    wellnessData: WellnessData[] | undefined,
    selectedMetric: keyof WellnessData
) {
    return useMemo(() => {
        if (!wellnessData) return [];

        return removeUndefinedOrNull(
            wellnessData,
            (entry) => entry[selectedMetric]
        );
    }, [wellnessData, selectedMetric]);
}

function useWellnessDataWithFilledCompetitionDays({
    wellnessData,
    athleteResults,
    selectedMetric,
}: {
    wellnessData?: WellnessData[];
    athleteResults?: ResultsData[];
    selectedMetric: keyof WellnessData;
}) {
    return useMemo(() => {
        if (!wellnessData || !athleteResults) return [];

        const existingDates = uniqueValues(
            wellnessData.map((entry) => entry.Date)
        );
        const resultDates = uniqueValues(
            athleteResults.map((result) => result.Date)
        );
        const combinedData = [...wellnessData];
        resultDates.forEach((date) => {
            if (!existingDates.includes(date)) {
                combinedData.push({
                    Date: date,
                    [selectedMetric]: undefined,
                } as unknown as WellnessData);
            }
        });
        return combinedData;
    }, [wellnessData, athleteResults, selectedMetric]);
}

export function WellnessChart({ athlete, className }: WellnessChartProps) {
    const [selectedMetric, setSelectedMetric] =
        useState<keyof WellnessData>("Resting HR");

    const { data: wellnessData } = useWellnessLoadDataByAthlete(athlete);
    const cleanedWellnessData = useCleanedWellnessData(
        wellnessData,
        selectedMetric
    );
    console.log({ cleanedWellnessData });
    const { data: athleteResults } = useResultsDataByAthlete(athlete);
    const fastestTime = useMemo(() => {
        if (!athleteResults) return null;
        return Math.min(
            ...athleteResults
                .map((result) => Number(result["Time: Athlete"]))
                .filter((time) => !!time)
        );
    }, [athleteResults]);

    const highestRankDates = useMemo(() => {
        if (!athleteResults) return [];
        const ranks = athleteResults
            .map((result) => Number(result["Rank: Athlete"]))
            .filter((rank) => !isNaN(rank));
        const highestRank = Math.min(...ranks);
        return athleteResults
            .filter((result) => Number(result["Rank: Athlete"]) === highestRank)
            .map((result) => result.Date);
    }, [athleteResults]);

    const filledWellnessData = useWellnessDataWithFilledCompetitionDays({
        wellnessData: cleanedWellnessData,
        athleteResults,
        selectedMetric,
    });

    console.log({ filledWellnessData });

    const chartData = useMemo(() => {
        filledWellnessData.sort((a, b) => {
            return new Date(a.Date).getTime() - new Date(b.Date).getTime();
        });

        return filledWellnessData;
    }, [filledWellnessData]);
    const yAxisDomain = useMemo(() => {
        const values = filledWellnessData.map(
            (entry) => +(entry[selectedMetric] ?? 0)
        );
        const min = Math.min(...values);
        const max = Math.max(...values);
        return [min, max];
    }, [filledWellnessData, selectedMetric]);


    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

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

    return (
        <Card className={cn(className)}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Athlete Metrics Chart</CardTitle>
                    <Select
                        value={selectedMetric}
                        onValueChange={(value) =>
                            setSelectedMetric(value as keyof WellnessData)
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
                <CardDescription>May - September 2023</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey="Date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "numeric",
                                    day: "2-digit",
                                });
                            }}
                        />
                        <YAxis domain={yAxisDomain} />
                        <ChartTooltip
                            cursor={false}
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
                                        const innerText = isNan
                                            ? "Not reported"
                                            : (
                                                  item.value ?? "Not reported"
                                              ).toLocaleString();

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
                        <Legend
                            payload={[
                                {
                                    value: selectedMetric,
                                    type: "line",
                                    color: "#b22233",
                                },
                                {
                                    value: "Competition Day (Total Time)",
                                    type: "line",
                                    color: "#888",
                                    payload: { strokeDasharray: "3 3" },
                                },
                                {
                                    value: "Highest Rank Competition(s)",
                                    type: "line",
                                    color: "#4CAF50",
                                    payload: { strokeDasharray: "5 5" },
                                },
                            ]}
                            wrapperStyle={{ fontSize: "14px" }}
                            iconSize={20}
                            verticalAlign="bottom"
                            height={36}
                        />
                        {athlete && (
                            <Line
                                key={`${selectedMetric}`}
                                connectNulls
                                dataKey={`${selectedMetric}`}
                                type="bump"
                                stroke={lineColors[0]}
                                strokeWidth={2}
                                dot={false}
                            />
                        )}
                        {athleteResults?.map((result, index) => {
                            return (
                                <ReferenceLine
                                    key={`result-${index}`}
                                    x={result.Date}
                                    stroke="#888"
                                    strokeWidth={3}
                                    strokeDasharray="5 5"
                                    label={{
                                        value: result["Time: Athlete"]
                                            ? `${result["Time: Athlete"]} sec`
                                            : "DNF",
                                        position: "top",
                                        fill: "#888",
                                        fontSize: 12,
                                        fontWeight: "semibold",
                                        offset: -20 + index * -15,
                                    }}
                                />
                            );
                        })}
                        {highestRankDates.map((date, index) => (
                            <ReferenceLine
                                key={`highest-rank-${index}`}
                                x={date}
                                stroke="#4CAF50"
                                strokeWidth={3}
                                strokeDasharray="5 5"
                                label={{
                                    value: "Highest Rank",
                                    position: "top",
                                    fill: "#4CAF50",
                                    fontSize: 12,
                                    fontWeight: "bold",
                                    offset: 10 + index * 15,
                                }}
                            />
                        ))}
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
