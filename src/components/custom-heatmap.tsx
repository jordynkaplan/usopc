import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { useEffect, useState } from "react";
import { useResultsData } from "@/data/results";
import { useWellnessLoadData } from "@/data/wellness";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Line,
    ComposedChart,
} from "recharts";

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
    const { data: resultsData } = useResultsData();
    const { data: wellnessData } = useWellnessLoadData();

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
        if (value > 0) {
            const intensity = Math.round(255 * (1 - value));
            return `rgb(255, ${intensity}, ${intensity})`;
        } else {
            const intensity = Math.round(255 * (1 + value));
            return `rgb(${intensity}, 255, ${intensity})`;
        }
    };

    const renderLegend = () => {
        const legendItems = [];
        for (let i = -1; i <= 1; i += 0.25) {
            legendItems.push(
                <div key={i} className="flex items-center">
                    <div
                        className="w-6 h-6 mr-2"
                        style={{ backgroundColor: getColor(i) }}
                    ></div>
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

    console.log({ selectedElement });

    const getScatterData = () => {
        if (!selectedElement || !resultsData || !wellnessData) return [];

        const scatterData = resultsData
            .map((result) => {
                const wellnessEntry = wellnessData.find(
                    (w) =>
                        w.Date === result.Date && w.Athlete === result.Athlete
                );
                const yValue = wellnessEntry
                    ? Number(
                          wellnessEntry[
                              selectedElement.column as keyof typeof wellnessEntry
                          ]
                      )
                    : null;

                if (!yValue) return null;

                let xValue;

                if (selectedElement.row === "Time Delta: Best") {
                    xValue = Number(result["Time Delta: Best"]);
                } else if (selectedElement.row === "Time Delta: Heat 2") {
                    xValue = Number(result["Time Delta: Heat 2"]);
                }

                return { x: xValue as number, y: yValue as number };
                // return null;
            })
            .filter(Boolean);

        const { slope, intercept } = calculateLinearRegression(scatterData);

        // Calculate best fit line for each data point
        scatterData.forEach((point, index) => {
            point.bestFitY = slope * point.x + intercept;
        });

        // console.log({ slope, intercept });
        // const minX = Math.min(...scatterData.map((d) => d.x));
        // const minY = slope * minX + intercept;
        // console.log({ minX, minY });
        // scatterData[0].slope = minY;

        // const maxX = Math.max(
        //     ...scatterData.map((d) => d.x).filter((d) => !!d)
        // );
        // const maxY = slope * maxX + intercept;
        // console.log({ maxX, maxY });
        // scatterData[1].slope = maxY;
        // // scatterData[scatterData.length - 1].slope = maxY;

        return scatterData;
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

    const scatterData = getScatterData();
    const { slope, intercept } = calculateLinearRegression(scatterData);

    const lineData = [
        {
            // x: Math.min(...scatterData.map((d) => d.x)),
            slope: slope,
            // y: slope * Math.min(...scatterData.map((d) => d.x)) + intercept,
        },
        // {
        //     x: Math.max(...scatterData.map((d) => d.x)),
        //     slope: slope,
        //     y: slope * Math.max(...scatterData.map((d) => d.x)) + intercept,
        // },
    ];

    console.log({ slope, intercept });
    console.log({ lineData });

    console.log({ resultsData, wellnessData });
    console.log({ data: getScatterData() });

    return (
        <div className="flex">
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle className="text-center">
                        Total Time and Split Time: Heat 2 - Wellness Correlation
                        Map
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-8 mt-16 flex">
                        {correlationData ? (
                            <TooltipProvider>
                                <div className="flex-grow">
                                    <div
                                        className="grid"
                                        style={{
                                            gridTemplateColumns: `auto repeat(${correlationData.columns.length}, 1fr)`,
                                            gap: "1px",
                                        }}
                                    >
                                        <div></div>
                                        {correlationData.columns.map(
                                            (column, index) => (
                                                <Tooltip key={index}>
                                                    <TooltipTrigger className="w-full">
                                                        <div className="text-xs font-semibold text-center transform -rotate-45 origin-left whitespace-nowrap">
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
                                                            <div className="text-xs font-semibold text-right pr-2 whitespace-nowrap">
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
                                                                <div
                                                                    className={`aspect-square flex items-center justify-center text-xs ${
                                                                        selectedElement?.row ===
                                                                            row &&
                                                                        selectedElement?.column ===
                                                                            correlationData
                                                                                .columns[
                                                                                colIndex
                                                                            ]
                                                                            ? "border-2 border-black"
                                                                            : ""
                                                                    }`}
                                                                    style={{
                                                                        backgroundColor:
                                                                            getColor(
                                                                                value
                                                                            ),
                                                                    }}
                                                                >
                                                                    {value.toFixed(
                                                                        2
                                                                    )}
                                                                </div>
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
                                <div className="ml-8">{renderLegend()}</div>
                            </TooltipProvider>
                        ) : (
                            <p>Loading correlation data...</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="text-center">
                    Total Time found increased soreness and higher stress are
                    associated with longer performance times. Split Time: Heat 2
                    found greater fatigue leads to longer split times, while
                    higher motivation is linked to slightly better split times.
                </CardFooter>
            </Card>
            <Card className="flex-1 ml-4">
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
                        <ResponsiveContainer
                            className="graph-wrapper"
                            width="100%"
                            height="90%"
                        >
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
                                    name={selectedElement?.row}
                                    unit="s"
                                    label={{
                                        value: selectedElement?.row,
                                        position: "bottom",
                                        offset: 0,
                                    }}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="y"
                                    name={selectedElement?.column}
                                    label={{
                                        value: selectedElement?.column,
                                        angle: -90,
                                        position: "insideLeft",
                                    }}
                                />
                                <RechartsTooltip
                                    cursor={{ strokeDasharray: "3 3" }}
                                />
                                <Scatter
                                    name="Athletes"
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
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
