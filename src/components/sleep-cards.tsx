import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts";
import { ChartContainer } from "./ui/chart";
import { calculateAverageMetric, WellnessData } from "@/data/wellness";

export function SleepCards({
    wellnessLeadingUpData,
    leadingDays,
}: {
    wellnessLeadingUpData: WellnessData[];
    leadingDays: number;
}) {
    const avgSleepQuality = calculateAverageMetric(
        wellnessLeadingUpData,
        "Sleep Quality"
    );
    const avgSleepHours = calculateAverageMetric(
        wellnessLeadingUpData,
        "Sleep Hours"
    );

    return (
        <div className="my-2 grid w-full flex-1 gap-6">
            <Card className="">
                <CardHeader>
                    <CardTitle>Sleep Assessment</CardTitle>
                    <CardDescription>
                        Your average sleep quality and hours over the last{" "}
                        {leadingDays} days leading up to your best competition.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-6">
                    <div className="flex items-center gap-4 w-full">
                        <div className="flex-1">
                            <div className="text-lg font-semibold">Sleep Quality</div>
                            <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none mt-2">
                                {avgSleepQuality.toFixed(2)}
                                <span className="text-sm font-normal text-muted-foreground">
                                    /100
                                </span>
                            </div>
                        </div>
                        <ChartContainer
                            config={{
                                calories: {
                                    label: "Calories",
                                    color: "#a32135",
                                },
                            }}
                            className="flex-1 h-[100px]"
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
                    </div>
                    <div className="flex items-center gap-4 w-full">
                        <div className="flex-1">
                            <div className="text-lg font-semibold">Sleep Hours</div>
                            <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none mt-2">
                                {avgSleepHours.toFixed(2)}
                                <span className="text-sm font-normal text-muted-foreground">
                                    hours/night
                                </span>
                            </div>
                        </div>
                        <ChartContainer
                            config={{
                                calories: {
                                    label: "Calories",
                                    color: "#a32135",
                                },
                            }}
                            className="flex-1 h-[100px]"
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
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
