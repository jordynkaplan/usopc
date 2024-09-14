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
// import { useEffect, useState } from "react";

const MaleCorrelationData = {
    columns: [
        "Fatigue",
        "Soreness",
        "Motivation",
        "Resting HR",
        "Sleep Hours",
        "Sleep Quality",
        "Stress",
    ],
    index: ["Time: Athlete", "Split Time: Athlete Heat 2"],
    data: [
        [
            -0.0515828708, -0.0902387205, 0.0902012788, 0.0013790306,
            -0.1962445906, -0.0952042998, 0.28908467,
        ],
        [
            -0.1340390167, -0.283751562, 0.2520458725, 0.1435612853,
            -0.0818969347, -0.0696786922, 0.4007829913,
        ],
    ],
};

const maleCorrelatinSummary = {
  
}

const FemaleCorrelationData = {
  "columns": [
      "Fatigue",
      "Soreness",
      "Motivation",
      "Resting HR",
      "Sleep Hours",
      "Sleep Quality",
      "Stress"
  ],
  "index": [
      "Time: Athlete",
      "Split Time: Athlete Heat 2"
  ],
  "data": [
      [
          0.0160571175,
          -0.4406158352,
          0.3421687551,
          0.2804482774,
          -0.1689554258,
          0.612856955,
          0.164657757
      ],
      [
          0.2738304488,
          -0.102780947,
          0.0686126478,
          0.3398470198,
          -0.3986861703,
          -0.0886637766,
          -0.0675392513
      ]
  ]
}

type CorrelationData = {
    columns: string[];
    index: string[];
    data: number[][];
};

export function CustomHeatmap({ gender }: { gender: string }) {
    const correlationData: CorrelationData = gender === 'm' ? MaleCorrelationData : FemaleCorrelationData;

    // const [correlationData, setCorrelationData] =
    //     useState<CorrelationData | null>(null);

    // useEffect(() => {
    //     const fetchCorrelationData = async () => {
    //         try {
    //             const response = await fetch(`/api/corr/${gender}`);
    //             if (!response.ok) {
    //                 throw new Error("Network response was not ok");
    //             }
    //             const data: CorrelationData = await response.json();
    //             setCorrelationData(data);
    //         } catch (error) {
    //             console.error("Error fetching correlation data:", error);
    //         }
    //     };

    //     fetchCorrelationData();
    // }, [gender]);

    const getColor = (value: number) => {
        if (value > 0) {
            // Red to White (1 to 0)
            const intensity = Math.round(255 * (1 - value));
            return `rgb(255, ${intensity}, ${intensity})`;
        } else {
            // White to Blue (0 to -1)
            const intensity = Math.round(255 * (1 + value));
            return `rgb(${intensity}, ${intensity}, 255)`;
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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">
                    Total Time and Split Time: Heat 2 - Wellness Correlation Map
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
                                                        <TooltipTrigger className="w-full">
                                                            <div
                                                                className="aspect-square flex items-center justify-center text-xs"
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
                found greater fatigue leads to longer split times, while higher
                motivation is linked to slightly better split times.
            </CardFooter>
        </Card>
    );
}
function getColor(i: number): import("csstype").Property.BackgroundColor | undefined {
  throw new Error("Function not implemented.");
}

