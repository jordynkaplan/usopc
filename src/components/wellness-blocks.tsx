import {
    getBestResult,
    ResultsData,
    useResultsDataByAthlete,
} from "@/data/results";
import { WellnessBlock } from "./wellness-block";
import {
    calculateAverageMetric,
    getWellnessLeadingUpData,
    useWellnessLoadDataByAthlete,
    WellnessData,
} from "@/data/wellness";
import { useMemo, useState } from "react";
import { Slider } from "./ui/slider";
import { SleepCards } from "./sleep-cards";
import * as portals from "react-reverse-portal";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Info } from "lucide-react";

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

function getMetricDescription(days: number): string {
    return `Avg in the ${days} days leading up to best competition.`;
}

function getLeadingDaysAvailable(
    bestResult?: ResultsData,
    wellnessData?: WellnessData[]
) {
    if (!bestResult || !wellnessData) return 0;

    const bestResultDate = new Date(bestResult.Date);
    const sortedWellnessData = wellnessData
        .filter((entry) => new Date(entry.Date) <= bestResultDate)
        .sort(
            (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime()
        );

    if (sortedWellnessData.length === 0) return 0;

    const oldestEntryDate = new Date(
        sortedWellnessData[sortedWellnessData.length - 1].Date
    );
    const daysDifference = Math.floor(
        (bestResultDate.getTime() - oldestEntryDate.getTime()) /
            (1000 * 3600 * 24)
    );

    return daysDifference + 1; // Include the day of the best result
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

interface WellnessBlocksProps {
    athlete: string | null;
    portalNode: portals.HtmlPortalNode;
}

export function WellnessBlocks({ athlete, portalNode }: WellnessBlocksProps) {
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
            description: getMetricDescription(leadingDays),
            chartData: prepareChartData(wellnessLeadingUpData, metric),
            currentValue: average,
            unit: getMetricUnit(metric),
        };
    });

    const leadingDaysAvailable = useMemo(() => {
        return getLeadingDaysAvailable(bestResult, athleteWellnessData);
    }, [bestResult, athleteWellnessData]);

    return (
        <div className="flex flex-col gap-4">
            <div className="items-center mb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-md">Leading Days</p>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Leading days is the number of days before
                                    the best competition.
                                    <br />
                                    Best competition is determined by the lowest
                                    % time delta in a competition when compared
                                    to best competitor.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="my-2 flex items-center gap-2">
                        <span className="text-sm font-semibold">
                            Days: {leadingDays}
                        </span>
                        <Slider
                            value={[leadingDays]}
                            onValueChange={(value) => setLeadingDays(value[0])}
                            min={1}
                            max={leadingDaysAvailable}
                            step={1}
                            className="w-[100px]"
                        />
                    </div>
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
            <portals.InPortal node={portalNode}>
                <SleepCards
                    wellnessLeadingUpData={wellnessLeadingUpData}
                    leadingDays={leadingDays}
                />
            </portals.InPortal>
        </div>
    );
}
