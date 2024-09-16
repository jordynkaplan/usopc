import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { calculateAverageMetric, WellnessData } from "@/data/wellness";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { ZoomIn } from "lucide-react";

export function SleepCards({
    wellnessLeadingUpData,
    leadingDays,
}: {
    wellnessLeadingUpData: WellnessData[];
    leadingDays: number;
}) {
    const [isQualityDialogOpen, setIsQualityDialogOpen] = useState(false);
    const [isHoursDialogOpen, setIsHoursDialogOpen] = useState(false);

    const avgSleepQuality = calculateAverageMetric(
        wellnessLeadingUpData,
        "Sleep Quality"
    );
    const avgSleepHours = calculateAverageMetric(
        wellnessLeadingUpData,
        "Sleep Hours"
    );

    const DetailedChart = ({ dataKey }: { dataKey: string }) => (
        <ChartContainer
            config={{
                [dataKey]: {
                    label: dataKey,
                    color: "#a32135",
                },
            }}
            className="h-[300px] w-full"
        >
            <BarChart data={wellnessLeadingUpData}>
                <XAxis
                    dataKey="Date"
                    label={{
                        value: "Date",
                        position: "insideBottom",
                        offset: -5,
                    }}
                />
                <YAxis
                    label={{
                        value: dataKey,
                        angle: -90,
                        position: "insideLeft",
                    }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                    dataKey={dataKey}
                    fill="#a32135"
                    radius={2}
                    fillOpacity={0.6}
                />
            </BarChart>
        </ChartContainer>
    );

    return (
        <div className="my-4 w-full flex-1">
            <Card className="">
                <CardHeader>
                    <CardTitle>Sleep Assessment</CardTitle>
                    <CardDescription>
                        Your average sleep quality and hours over the last{" "}
                        {leadingDays} days leading up to your best competition.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                        <div className="flex-1 w-full sm:w-auto">
                            <div className="text-lg font-semibold">
                                Sleep Quality
                            </div>
                            <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none mt-2">
                                {avgSleepQuality.toFixed(2)}
                                <span className="text-sm font-normal text-muted-foreground">
                                    /100
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 grow w-full sm:w-auto">
                            <ChartContainer
                                config={{
                                    calories: {
                                        label: "Calories",
                                        color: "#a32135",
                                    },
                                }}
                                className="w-full sm:w-[64px] grow"
                            >
                                <BarChart
                                    accessibilityLayer
                                    margin={{
                                        left: 0,
                                        right: 0,
                                        top: 0,
                                        bottom: 0,
                                    }}
                                    data={wellnessLeadingUpData}
                                >
                                    <Bar
                                        dataKey="Sleep Quality"
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
                            <Dialog
                                open={isQualityDialogOpen}
                                onOpenChange={setIsQualityDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="p-0"
                                    >
                                        <ZoomIn className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[720px]">
                                    <CardTitle>Sleep Quality</CardTitle>
                                    <CardDescription>
                                        Detailed view of your sleep quality over
                                        time
                                    </CardDescription>
                                    <DetailedChart dataKey="Sleep Quality" />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                        <div className="flex-1 w-full sm:w-auto">
                            <div className="text-lg font-semibold">
                                Sleep Hours
                            </div>
                            <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none mt-2">
                                {avgSleepHours.toFixed(2)}
                                <span className="text-sm font-normal text-muted-foreground">
                                    hours/night
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 grow w-full sm:w-auto">
                            <ChartContainer
                                config={{
                                    calories: {
                                        label: "Calories",
                                        color: "#a32135",
                                    },
                                }}
                                className="w-full sm:w-[64px] grow"
                            >
                                <BarChart
                                    accessibilityLayer
                                    margin={{
                                        left: 0,
                                        right: 0,
                                        top: 0,
                                        bottom: 0,
                                    }}
                                    data={wellnessLeadingUpData}
                                >
                                    <Bar
                                        dataKey="Sleep Hours"
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
                            <Dialog
                                open={isHoursDialogOpen}
                                onOpenChange={setIsHoursDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="p-0"
                                    >
                                        <ZoomIn className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[720px]">
                                    <CardTitle>Sleep Hours</CardTitle>
                                    <CardDescription>
                                        Detailed view of your sleep hours over
                                        time
                                    </CardDescription>
                                    <DetailedChart dataKey="Sleep Hours" />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
