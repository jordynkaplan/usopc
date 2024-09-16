import { ResultGraph } from "@/components/result-graph";
import { ResultsCards } from "@/components/results-cards";
import { ResultsTable } from "@/components/results-table";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { WellnessBlocks } from "@/components/wellness-blocks";
import { WellnessChart } from "@/components/wellness-chart";
import { useResultsData } from "@/data/results";
import { useGetAthleteGender } from "@/data/wellness";
import { uniqueValues } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import * as portals from "react-reverse-portal";
import { Route, Routes } from "react-router-dom";

export function Athlete() {
    const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);
    const gender = useGetAthleteGender(selectedAthlete);

    const { data: results } = useResultsData();

    const uniqueAthletes = useMemo(() => {
        return uniqueValues(
            results?.map((result) => result.Athlete) || []
        ).sort();
    }, [results]);

    useEffect(() => {
        if (uniqueAthletes.length > 0) {
            setSelectedAthlete(uniqueAthletes[0]);
        }
    }, [uniqueAthletes]);

    const portalNode = useMemo(() => portals.createHtmlPortalNode(), []);

    return (
        <>
            <div>
                <Card>
                    <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center">
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-0">
                            <p className="font-semibold text-xl text-center sm:text-left">
                                Select Athlete:
                            </p>
                            <Select
                                value={selectedAthlete || undefined}
                                onValueChange={(value: string) => {
                                    setSelectedAthlete(value);
                                }}
                            >
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Select an athlete" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueAthletes.map((athlete) => (
                                        <SelectItem
                                            key={athlete}
                                            value={athlete}
                                        >
                                            <span className="font-semibold text-xl">
                                                {athlete}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center">
                            <p className="font-semibold text-xl">
                                Profile: {gender === "m" ? "Male" : "Female"}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="my-4 justify-center">
                    <Routes>
                        <Route
                            path="wellness"
                            element={
                                <div className="my-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <div className="lg:col-span-2">
                                        <WellnessChart
                                            athlete={selectedAthlete}
                                            className="w-full"
                                        />
                                        <portals.OutPortal node={portalNode} />
                                    </div>
                                    <div className="lg:col-span-1">
                                        <WellnessBlocks
                                            athlete={selectedAthlete}
                                            portalNode={portalNode}
                                        />
                                    </div>
                                </div>
                            }
                        />
                        <Route
                            path="results"
                            element={
                                <div className="space-y-4">
                                    <ResultsCards athlete={selectedAthlete} />
                                    <div className="overflow-x-auto">
                                        <ResultsTable
                                            athlete={selectedAthlete}
                                        />
                                    </div>
                                    <ResultGraph athlete={selectedAthlete} />
                                </div>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </>
    );
}
