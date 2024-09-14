import { ResultsData, useResultsDataByAthlete } from "@/data/results";
import { WellnessBlock } from "./wellness-block";
import { useWellnessLoadDataByAthlete, WellnessData } from "@/data/wellness";
import { useMemo, useState } from "react";
import { Slider } from "./ui/slider";

interface WellnessBlocksProps {
    athlete: string | null;
}

function getBestResult(results?: ResultsData[]) {
    if (!results || results.length === 0) {
        return undefined;
    }

    return results.reduce((min, result) => {
        const currentTime = parseFloat(result["Time: Athlete"]);
        const minTime = parseFloat(min["Time: Athlete"]);
        return currentTime < minTime ? result : min;
    }, results[0]);
}

function getWellnessLeadingUpData({
    wellnessData,
    bestResult,
    days,
}: {
    wellnessData?: WellnessData[];
    bestResult?: ResultsData;
    days: number;
}) {
    if (!wellnessData || !bestResult) {
        return [];
    }

    const bestResultDate = bestResult ? new Date(bestResult.Date) : new Date();
    const daysBefore = bestResultDate ? new Date(bestResultDate) : new Date();
    daysBefore.setDate(bestResultDate.getDate() - days);

    return wellnessData.filter((entry) => {
        const entryDate = new Date(entry.Date);
        return entryDate >= daysBefore && entryDate <= bestResultDate;
    });
}

function prepareChartData(
    wellnessLeadingUpData: WellnessData[],
    metric: keyof WellnessData
) {
    return wellnessLeadingUpData
        .map((entry) => ({
            date: entry.Date,
            value: +(entry?.[metric] ?? 0),
        }))
        .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
}

function calculateAverageMetric(
    wellnessLeadingUpData: WellnessData[],
    metric: keyof WellnessData
): number {
    const validValues = wellnessLeadingUpData
        .map((entry) => Number(entry[metric]))
        .filter((value) => !isNaN(value));

    if (validValues.length === 0) return 0;

    const sum = validValues.reduce((acc, value) => acc + value, 0);
    return Number((sum / validValues.length).toFixed(2));
}

function getMetricUnit(metric: string): string {
    switch (metric) {
        case "Resting HR":
            return "bpm";
        case "Motivation":
        case "Soreness":
        case "Fatigue":
        case "Stress":
            return "/100";
        case "Travel Hours":
            return "hours";
        default:
            return "";
    }
}

function getMetricDescription(
    metric: string,
    average: number,
    days: number
): string {
    return `Average ${metric} in the ${days} days leading up to your best performance was ${average}${getMetricUnit(
        metric
    )}.`;
}

export function WellnessBlocks({ athlete }: WellnessBlocksProps) {
    const [leadingDays, setLeadingDays] = useState(10);
    const { data: athleteResults } = useResultsDataByAthlete(athlete);
    const { data: athleteWellnessData } = useWellnessLoadDataByAthlete(athlete);

    const bestResult = useMemo(
        () => getBestResult(athleteResults),
        [athleteResults]
    );
    const wellnessLeadingUpData = useMemo(
        () =>
            getWellnessLeadingUpData({
                wellnessData: athleteWellnessData,
                bestResult: bestResult,
                days: leadingDays,
            }),
        [athleteWellnessData, bestResult, leadingDays]
    );

    const metrics = [
        "Resting HR",
        "Motivation",
        "Soreness",
        "Fatigue",
        "Stress",
        "Travel Hours",
    ] as const;

    const wellnessBlockProps = metrics.map((metric) => {
        const average = calculateAverageMetric(wellnessLeadingUpData, metric);
        return {
            title: metric,
            description: getMetricDescription(metric, average, leadingDays),
            chartData: prepareChartData(wellnessLeadingUpData, metric),
            currentValue: average,
            unit: getMetricUnit(metric),
        };
    });

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-md">
                    Wellness Metrics Before Best Competition
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-sm">Days: {leadingDays}</span>
                    <Slider
                        value={[leadingDays]}
                        onValueChange={(value) => setLeadingDays(value[0])}
                        min={1}
                        max={30}
                        step={1}
                        className="w-[100px]"
                    />
                </div>
            </div>
            {wellnessBlockProps.map((props) => (
                <WellnessBlock
                    key={props.title}
                    title={props.title}
                    description={props.description}
                    chartData={props.chartData}
                    currentValue={props.currentValue}
                    unit={props.unit}
                />
            ))}
        </div>
    );
}
