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
                <CardContent className="flex gap-4">
                    <div className="grid auto-rows-min gap-2">
                        <div>Sleep Quality</div>
                        <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                            {avgSleepQuality.toFixed(2)}
                            <span className="text-sm font-normal text-muted-foreground">
                                /100
                            </span>
                        </div>
                        <ChartContainer
                            config={{
                                steps: {
                                    label: "Steps",
                                    color: "hsl(var(--chart-1))",
                                },
                            }}
                            className="aspect-auto h-[32px] w-full"
                        >
                            <BarChart
                                accessibilityLayer
                                layout="vertical"
                                margin={{
                                    left: 0,
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                }}
                                data={[
                                    {
                                        date: "2024",
                                        steps: 12435,
                                    },
                                ]}
                            >
                                <Bar
                                    dataKey="steps"
                                    fill="#a32135"
                                    radius={4}
                                    barSize={32}
                                >
                                    <LabelList
                                        position="insideLeft"
                                        dataKey="date"
                                        offset={8}
                                        fontSize={12}
                                        fill="white"
                                    />
                                </Bar>
                                <YAxis
                                    dataKey="date"
                                    type="category"
                                    tickCount={1}
                                    hide
                                />
                                <XAxis dataKey="steps" type="number" hide />
                            </BarChart>
                        </ChartContainer>
                    </div>
                    <div className="grid auto-rows-min gap-2">
                        <div>Sleep Hours</div>
                        <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                            {avgSleepHours.toFixed(2)}
                            <span className="text-sm font-normal text-muted-foreground">
                                hours/night
                            </span>
                        </div>
                        <ChartContainer
                            config={{
                                steps: {
                                    label: "Steps",
                                    color: "hsl(var(--muted))",
                                },
                            }}
                            className="aspect-auto h-[32px] w-full"
                        >
                            <BarChart
                                accessibilityLayer
                                layout="vertical"
                                margin={{
                                    left: 0,
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                }}
                                data={[
                                    {
                                        date: "2023",
                                        steps: 10103,
                                    },
                                ]}
                            >
                                <Bar
                                    dataKey="steps"
                                    fill="var(--color-steps)"
                                    radius={4}
                                    barSize={32}
                                >
                                    <LabelList
                                        position="insideLeft"
                                        dataKey="date"
                                        offset={8}
                                        fontSize={12}
                                        fill="hsl(var(--muted-foreground))"
                                    />
                                </Bar>
                                <YAxis
                                    dataKey="date"
                                    type="category"
                                    tickCount={1}
                                    hide
                                />
                                <XAxis dataKey="steps" type="number" hide />
                            </BarChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
