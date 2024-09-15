import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useResultsDataByGender } from "@/data/results";
import { useWellnessDataByGender } from "@/data/wellness";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
    CartesianGrid,
    ComposedChart,
    Line,
    Scatter,
    XAxis,
    YAxis,
} from "recharts";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "./ui/chart";

type CorrelationData = {
    columns: string[];
    index: string[];
    data: number[][];
};

export function CustomHeatmap({ gender }: { gender: string }) {
    const [correlationData, setCorrelationData] =
        useState<CorrelationData | null>(null);
    const [selectedElement, setSelectedElement] = useState<{
        row: string;
        column: string;
    } | null>(null);
    const { data: resultsData } = useResultsDataByGender(gender);
    const { data: wellnessData } = useWellnessDataByGender(gender);

    useEffect(() => {
        const fetchCorrelationData = async () => {
            try {
                const response = await fetch(`/api/corr/${gender}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data: CorrelationData = await response.json();
                setCorrelationData(data);
                // Set default selected element to top right
                if (data.index.length > 0 && data.columns.length > 0) {
                    setSelectedElement({
                        row: data.index[0],
                        column: data.columns[data.columns.length - 1],
                    });
                }
            } catch (error) {
                console.error("Error fetching correlation data:", error);
            }
        };

        fetchCorrelationData();
    }, [gender]);

    const getColor = (value: number) => {
        const intensity = Math.abs(value);
        if (value > 0) {
            return cn(
                "bg-red-400/10 hover:bg-red-500",
                intensity > 0.1 && "bg-red-400/20 hover:bg-red-500",
                intensity > 0.2 && "bg-red-400/30 hover:bg-red-500",
                intensity > 0.3 && "bg-red-400/40 hover:bg-red-500",
                intensity > 0.4 && "bg-red-400/50 hover:bg-red-500",
                intensity > 0.5 && "bg-red-400/60 hover:bg-red-500",
                intensity > 0.6 && "bg-red-400/70 hover:bg-red-500",
                intensity > 0.7 && "bg-red-400/80 hover:bg-red-500",
                intensity > 0.8 && "bg-red-400/90 hover:bg-red-500",
                intensity > 0.9 && "bg-red-400 hover:bg-red-500"
            );
        } else {
            return cn(
                "bg-green-400/10 hover:bg-green-500",
                intensity > 0.1 && "bg-green-400/20 hover:bg-green-500",
                intensity > 0.2 && "bg-green-400/30 hover:bg-green-500",
                intensity > 0.3 && "bg-green-400/40 hover:bg-green-500",
                intensity > 0.4 && "bg-green-400/50 hover:bg-green-500",
                intensity > 0.5 && "bg-green-400/60 hover:bg-green-500",
                intensity > 0.6 && "bg-green-400/70 hover:bg-green-500",
                intensity > 0.7 && "bg-green-400/80 hover:bg-green-500",
                intensity > 0.8 && "bg-green-400/90 hover:bg-green-500",
                intensity > 0.9 && "bg-green-400 hover:bg-green-500"
            );
        }
    };

    const getRingColor = (value: number) => {
        const intensity = Math.abs(value);
        if (value > 0) {
            return cn(
                "ring-red-500",
                intensity > 0.1 && "ring-red-500",
                intensity > 0.2 && "ring-red-500",
                intensity > 0.3 && "ring-red-500",
                intensity > 0.4 && "ring-red-500",
                intensity > 0.5 && "ring-red-500",
                intensity > 0.6 && "ring-red-500",
                intensity > 0.7 && "ring-red-500",
                intensity > 0.8 && "ring-red-500",
                intensity > 0.9 && "ring-red-500"
            );
        } else {
            return cn(
                "ring-green-500",
                intensity > 0.1 && "ring-green-500",
                intensity > 0.2 && "ring-green-500",
                intensity > 0.3 && "ring-green-500",
                intensity > 0.4 && "ring-green-500",
                intensity > 0.5 && "ring-green-500",
                intensity > 0.6 && "ring-green-500",
                intensity > 0.7 && "ring-green-500",
                intensity > 0.8 && "ring-green-500",
                intensity > 0.9 && "ring-green-500"
            );
        }
    };

    const renderLegend = () => {
        const legendItems = [];
        for (let i = -1; i <= 1; i += 0.25) {
            legendItems.push(
                <div key={i} className="flex items-center">
                    <div className={cn("w-6 h-6 mr-2", getColor(i))}></div>
                    <span>{i.toFixed(2)}</span>
                </div>
            );
        }
        return (
            <div className="flex flex-col items-start">
                <h3 className="text-sm font-semibold mb-2">
                    Correlation Scale
                </h3>
                {legendItems}
            </div>
        );
    };

    const getScatterData = () => {
        if (!selectedElement || !resultsData || !wellnessData) return [];

        const scatterData = resultsData
            .map((result) => {
                const wellnessEntry = wellnessData.find(
                    (w) =>
                        w.Date === result.Date && w.Athlete === result.Athlete
                );

                if (!wellnessEntry) return null;

                const xValue =
                    wellnessEntry[
                        selectedElement.column as keyof typeof wellnessEntry
                    ];

                if (xValue === null || xValue === undefined) return null;

                let yValue;

                if (selectedElement.row === "Time Delta: Best") {
                    yValue = result["Time Delta: Best"];
                } else if (selectedElement.row === "Time Delta: Heat 2") {
                    yValue = result["Time Delta: Heat 2"];
                } else if (selectedElement.row === "Time Delta: Heat 1") {
                    yValue = result["Time Delta: Heat 1"];
                }

                if (yValue === null || yValue === undefined) return null;

                return { x: xValue as number, y: yValue as number };
            })
            .filter(Boolean) as { x: number; y: number; bestFitY?: number }[];

        const { slope, intercept } = calculateLinearRegression(scatterData);

        // Calculate best fit line for each data point
        scatterData.forEach((point) => {
            if (point) {
                point.bestFitY = slope * point.x + intercept;
            }
        });

        return scatterData as { x: number; y: number; bestFitY: number }[];
    };

    const calculateLinearRegression = (data: { x: number; y: number }[]) => {
        const n = data.length;
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumXX = 0;

        for (let i = 0; i < n; i++) {
            sumX += data[i].x;
            sumY += data[i].y;
            sumXY += data[i].x * data[i].y;
            sumXX += data[i].x * data[i].x;
        }

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return { slope, intercept };
    };

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    return (
        <div className="flex flex-col lg:flex-row">
            <Card className="flex-1 mb-4 lg:mb-0 lg:mr-4 basis-1/3">
                <CardHeader>
                    <CardTitle className="text-center">
                        Total Time and Split Time: Heat 1 & 2 - Wellness
                        Correlation Map
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mt-8 lg:mt-16 flex flex-col lg:flex-row">
                        {correlationData ? (
                            <TooltipProvider>
                                <div className="flex-grow">
                                    <div
                                        className="grid gap-1"
                                        style={{
                                            gridTemplateColumns: `auto repeat(${correlationData.columns.length}, minmax(60px, 1fr))`,
                                        }}
                                    >
                                        <div></div>
                                        {correlationData.columns.map(
                                            (column, index) => (
                                                <Tooltip key={index}>
                                                    <TooltipTrigger className="w-full">
                                                        <div
                                                            className={cn(
                                                                "text-xs font-semibold text-center transform -rotate-45 origin-left whitespace-nowrap",
                                                                selectedElement?.column ===
                                                                    column &&
                                                                    "font-extrabold"
                                                            )}
                                                        >
                                                            {column}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent
                                                        className={cn(
                                                            "flex min-w-[8rem] flex-col gap-2 rounded-lg border bg-background p-4 text-popover-foreground shadow-md outline-none",
                                                            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                                                            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                                                        )}
                                                    >
                                                        <p className="text-sm font-semibold leading-none tracking-tight">
                                                            {column}
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )
                                        )}
                                        {correlationData.index.map(
                                            (row, rowIndex) => (
                                                <>
                                                    <Tooltip
                                                        key={`row-${rowIndex}`}
                                                    >
                                                        <TooltipTrigger className="w-full">
                                                            <div
                                                                className={cn(
                                                                    "text-xs font-semibold text-right pr-2 whitespace-nowrap",
                                                                    selectedElement?.row ===
                                                                        row &&
                                                                        "font-bold"
                                                                )}
                                                            >
                                                                {row}
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent
                                                            className={cn(
                                                                "flex min-w-[8rem] flex-col gap-2 rounded-lg border bg-background p-4 text-popover-foreground shadow-md outline-none",
                                                                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                                                                "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                                                            )}
                                                        >
                                                            <p className="text-sm font-semibold leading-none tracking-tight">
                                                                {row}
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    {correlationData.data[
                                                        rowIndex
                                                    ].map((value, colIndex) => (
                                                        <Tooltip
                                                            key={`${rowIndex}-${colIndex}`}
                                                        >
                                                            <TooltipTrigger
                                                                className="w-full"
                                                                onClick={() =>
                                                                    setSelectedElement(
                                                                        {
                                                                            row,
                                                                            column: correlationData
                                                                                .columns[
                                                                                colIndex
                                                                            ],
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    className={cn(
                                                                        "p-0 text-xs w-full h-full aspect-square",
                                                                        getColor(
                                                                            value
                                                                        ),
                                                                        "transition-all duration-200 hover:scale-105",
                                                                        selectedElement?.row ===
                                                                            row &&
                                                                            selectedElement?.column ===
                                                                                correlationData
                                                                                    .columns[
                                                                                    colIndex
                                                                                ] &&
                                                                            "ring-2 focus:ring-4",
                                                                        getRingColor(
                                                                            value
                                                                        )
                                                                    )}
                                                                >
                                                                    {value.toFixed(
                                                                        2
                                                                    )}
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent
                                                                className={cn(
                                                                    "flex min-w-[8rem] flex-col gap-2 rounded-lg border bg-background p-4 text-popover-foreground shadow-md outline-none",
                                                                    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                                                                    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                                                                )}
                                                            >
                                                                <p className="text-sm font-semibold leading-none tracking-tight">{`${row} vs ${
                                                                    correlationData
                                                                        .columns[
                                                                        colIndex
                                                                    ]
                                                                }: ${value.toFixed(
                                                                    4
                                                                )}`}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    ))}
                                                </>
                                            )
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 lg:mt-0 lg:ml-8">
                                    {renderLegend()}
                                </div>
                            </TooltipProvider>
                        ) : (
                            <p>Loading correlation data...</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="text-center">
                    <p className="text-sm">
                        Total Time found increased soreness and higher stress
                        are associated with longer performance times. Split
                        Time: Heat 2 found greater fatigue leads to longer split
                        times, while higher motivation is linked to slightly
                        better split times.
                    </p>
                </CardFooter>
            </Card>
            <Card className="flex-1 basis-1/3">
                <CardHeader>
                    <CardTitle className="text-center">
                        Scatter Plot:{" "}
                        {selectedElement
                            ? `${selectedElement.row} vs ${selectedElement.column}`
                            : "Select an element from the heatmap"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div style={{ width: "100%", height: 400 }}>
                        <ChartContainer config={chartConfig}>
                            <ComposedChart
                                data={getScatterData()}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    bottom: 20,
                                    left: 20,
                                }}
                            >
                                <CartesianGrid />
                                <XAxis
                                    type="number"
                                    dataKey="x"
                                    name={selectedElement?.column}
                                    unit="s"
                                    domain={["dataMin", "dataMax"]}
                                    label={{
                                        value: selectedElement?.column,
                                        position: "bottom",
                                        offset: 0,
                                    }}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="y"
                                    name={selectedElement?.row}
                                    unit="s"
                                    label={{
                                        value: selectedElement?.row,
                                        angle: -90,
                                        position: "insideLeft",
                                    }}
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent indicator="dot" />
                                    }
                                />
                                <Scatter
                                    name={selectedElement?.row}
                                    dataKey="y"
                                    fill="#8884d8"
                                />
                                <Line
                                    type="linear"
                                    dataKey="bestFitY"
                                    stroke="red"
                                    dot={false}
                                />
                            </ComposedChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
