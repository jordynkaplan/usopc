import { useState, useMemo, useEffect } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    useResultsDataByGender,
    getAvailableCompetitions,
} from "@/data/results";
import { ChartContainer, ChartTooltipContent, ChartConfig } from "./ui/chart";
import { MultiSelect } from "./ui/multi-select";

export default function ResultGraphComparison({
    gender,
}: {
    gender: string | undefined;
}) {
    const { data: resultsData } = useResultsDataByGender(gender);
    const [selectedCompetition, setSelectedCompetition] = useState<
        string | null
    >(null);
    const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);

    const competitions = useMemo(() => {
        if (!resultsData) return [];
        return getAvailableCompetitions(resultsData);
    }, [resultsData]);

    const athletes = useMemo(() => {
        if (!resultsData) return [];
        return [...new Set(resultsData.map((result) => result.Athlete))].sort();
    }, [resultsData]);

    useEffect(() => {
        if (competitions.length > 0) {
            setSelectedCompetition(competitions[0].competitionId.toString());
        }
    }, [competitions]);

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

    const { chartData, deltas, totalTimes, ranks } = useMemo(() => {
        if (!resultsData || !selectedCompetition)
            return { chartData: [], deltas: {}, totalTimes: {}, ranks: {} };
        const competitionResults = resultsData.filter(
            (result) => result["Competition ID"] === +selectedCompetition
        );

        const heat1Data: { [key: string]: number | string | null } = {
            name: "Heat 1",
            best: Math.min(
                ...competitionResults.map(
                    (r) => r["Time: Best Heat 1"] || Infinity
                )
            ),
        };

        const heat2Data: { [key: string]: number | string | null } = {
            name: "Heat 2",
            best: Math.min(
                ...competitionResults.map(
                    (r) => r["Time: Best Heat 2"] || Infinity
                )
            ),
        };

        const deltas: Record<string, number | null | "DNF"> = {};
        const totalTimes: Record<string, number | null | "DNF"> = {};
        const ranks: Record<string, number> = {};

        selectedAthletes.forEach((athlete) => {
            const athleteResult = competitionResults.find(
                (r) => r.Athlete === athlete
            );
            if (athleteResult) {
                const heat1Time = athleteResult["Time: Athlete Heat 1"] || null;
                const heat2Time = athleteResult["Time: Athlete Heat 2"] || null;
                heat1Data[athlete] = heat1Time;
                heat2Data[athlete] = heat2Time;
                if (heat1Time !== null && heat2Time !== null) {
                    deltas[athlete] = heat2Time - heat1Time;
                    totalTimes[athlete] = heat1Time + heat2Time;
                } else if (heat1Time !== null && heat2Time === null) {
                    deltas[athlete] = "DNF";
                    totalTimes[athlete] = "DNF";
                } else {
                    deltas[athlete] = null;
                    totalTimes[athlete] = null;
                }
                ranks[athlete] = athleteResult["Rank: Athlete"];
            }
        });

        return { chartData: [heat1Data, heat2Data], deltas, totalTimes, ranks };
    }, [resultsData, selectedCompetition, selectedAthletes]);

    const chartConfig: ChartConfig = useMemo(() => {
        const config: ChartConfig = {
            best: {
                label: "Best Time",
                color: "hsl(var(--chart-1))",
            },
        };

        const athletesInChart = selectedAthletes.filter(
            (athlete) =>
                chartData[0]?.[athlete] !== undefined ||
                chartData[1]?.[athlete] !== undefined
        );

        athletesInChart.forEach((athlete, index) => {
            config[athlete] = {
                label: athlete,
                color: `hsl(var(--chart-${(index % 4) + 2}))`,
            };
        });

        return config;
    }, [selectedAthletes, chartData]);

    const rankedTotalTimes = useMemo(() => {
        return Object.entries(totalTimes)
            .filter(([_, time]) => typeof time === "number")
            .sort(([a, _], [b, __]) => ranks[a] - ranks[b])
            .map(([athlete, time]) => ({
                athlete,
                time,
                rank: ranks[athlete],
            }));
    }, [totalTimes, ranks]);

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle>Competition Results Comparison</CardTitle>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <label
                                htmlFor="competition-date-select"
                                className="text-sm font-medium whitespace-nowrap"
                            >
                                Competition Dates:
                            </label>
                            <Select
                                value={selectedCompetition || ""}
                                onValueChange={setSelectedCompetition}
                            >
                                <SelectTrigger
                                    id="competition-date-select"
                                    className="w-full sm:w-[180px]"
                                >
                                    <SelectValue placeholder="Select competition" />
                                </SelectTrigger>
                                <SelectContent>
                                    {competitions.map((competition) => {
                                        const duplicateCount =
                                            competitions.filter(
                                                (c) =>
                                                    c.date === competition.date
                                            ).length;
                                        const index = competitions
                                            .filter(
                                                (c) =>
                                                    c.date === competition.date
                                            )
                                            .indexOf(competition);
                                        const suffix =
                                            duplicateCount > 1
                                                ? ` Competition #${index + 1}`
                                                : "";
                                        return (
                                            <SelectItem
                                                key={competition.competitionId}
                                                value={competition.competitionId.toString()}
                                            >
                                                {competition.date}
                                                {suffix}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <MultiSelect
                            options={athleteOptions}
                            onValueChange={setSelectedAthletes}
                            defaultValue={selectedAthletes}
                            placeholder="Select athletes"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col lg:flex-row">
                    <ChartContainer
                        config={chartConfig}
                        className="w-full lg:w-2/3 mb-4 lg:mb-0"
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis
                                    label={{
                                        value: "Seconds",
                                        angle: -90,
                                        position: "insideLeft",
                                    }}
                                    domain={["dataMin", "dataMax + 10"]}
                                />
                                <Tooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="best"
                                    name="Best Time"
                                    stroke={chartConfig.best.color}
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                />
                                {Object.keys(chartConfig)
                                    .filter((key) => key !== "best")
                                    .sort()
                                    .map((athlete) => (
                                        <Line
                                            key={athlete}
                                            type="monotone"
                                            dataKey={athlete}
                                            name={athlete}
                                            stroke={chartConfig[athlete].color}
                                            strokeWidth={2}
                                            connectNulls={true}
                                        />
                                    ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                    <div className="lg:ml-4 lg:w-1/3">
                        <h3 className="text-lg font-semibold mb-2">
                            Heat Time Δ
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1">
                            {Object.entries(deltas)
                                .sort(([a], [b]) => a.localeCompare(b))
                                .map(([athlete, delta]) => (
                                    <div
                                        key={athlete}
                                        className="flex items-center mb-1"
                                    >
                                        <div
                                            className="w-4 h-4 mr-2 flex-shrink-0"
                                            style={{
                                                backgroundColor:
                                                    chartConfig[athlete]?.color,
                                            }}
                                        ></div>
                                        <span className="truncate">
                                            {athlete}:{" "}
                                        </span>
                                        <span
                                            className={`ml-2 font-semibold ${
                                                delta === "DNF"
                                                    ? "text-yellow-500"
                                                    : delta && delta < 0
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {delta === "DNF"
                                                ? "DNF"
                                                : delta !== null
                                                ? delta > 0
                                                    ? `+${delta.toFixed(2)}s`
                                                    : `${delta.toFixed(2)}s`
                                                : "N/A"}
                                        </span>
                                    </div>
                                ))}
                        </div>
                        <h3 className="text-lg font-semibold mt-4 mb-2">
                            Total Times / Rank
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1">
                            {rankedTotalTimes.map(({ athlete, time, rank }) => (
                                <div
                                    key={athlete}
                                    className="flex items-center mb-1 whitespace-nowrap"
                                >
                                    <div
                                        className="w-4 h-4 mr-2 flex-shrink-0"
                                        style={{
                                            backgroundColor:
                                                chartConfig[athlete]?.color,
                                        }}
                                    ></div>
                                    <span className="truncate">
                                        {athlete}:{" "}
                                    </span>
                                    <span className="ml-2 font-semibold text-blue-500 w-[6ch]">
                                        {typeof time === "number"
                                            ? `${time.toFixed(2)}s`
                                            : "N/A"}
                                    </span>
                                    <span className="ml-2 px-2 py-[1px] text-xs font-semibold text-gray-600 bg-gray-200 rounded-full">
                                        {(() => {
                                            const suffixes = [
                                                "th",
                                                "st",
                                                "nd",
                                                "rd",
                                            ];
                                            const v = rank % 100;
                                            return (
                                                rank +
                                                (suffixes[(v - 20) % 10] ||
                                                    suffixes[v] ||
                                                    suffixes[0])
                                            );
                                        })()}
                                    </span>
                                </div>
                            ))}
                            {Object.entries(totalTimes)
                                .filter(
                                    ([_, time]) =>
                                        time === "DNF" || time === null
                                )
                                .sort(([a], [b]) => a.localeCompare(b))
                                .map(([athlete, totalTime]) => (
                                    <div
                                        key={athlete}
                                        className="flex items-center mb-1"
                                    >
                                        <div
                                            className="w-4 h-4 mr-2 flex-shrink-0"
                                            style={{
                                                backgroundColor:
                                                    chartConfig[athlete]?.color,
                                            }}
                                        ></div>
                                        <span className="truncate">
                                            {athlete}:{" "}
                                        </span>
                                        <span
                                            className={`ml-2 font-semibold ${
                                                totalTime === "DNF"
                                                    ? "text-yellow-500"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {totalTime === "DNF"
                                                ? "DNF"
                                                : "N/A"}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-xs text-center text-gray-500">
                    Multiple competitions may be present on the same date. They
                    are denoted by (Competition #x) in the dropdown menu.
                    <br />
                    Note: DNF means did not finish.
                </p>
            </CardFooter>
        </Card>
    );
}
