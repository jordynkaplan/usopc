import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { WellnessChart } from "@/components/wellness-chart";
import { WellnessBlocks } from "@/components/wellness-blocks";
import { ResultsTable } from "@/components/results-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultsCards } from "@/components/results-cards";
import { useGetAthleteGender } from "@/data/wellness";
import { useResultsData } from "@/data/results";
import { uniqueValues } from "@/lib/utils";
import * as portals from "react-reverse-portal";

export function Individual() {
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
            <div className="my-2">
                <Card>
                    <CardContent className="p-6 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <p className="font-semibold text-xl">
                                Select Athlete:
                            </p>
                            <Select
                                value={selectedAthlete || undefined}
                                onValueChange={(value: string) => {
                                    setSelectedAthlete(value);
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
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

                <div className="my-2 justify-center">
                    <Tabs defaultValue="wellness">
                        <div className="flex items-center">
                            <TabsList className="w-full">
                                <TabsTrigger
                                    className="grow data-[state=active]:bg-card-foreground data-[state=active]:text-background"
                                    value="wellness"
                                    // className="flex-1 data-[state=active]:bg-card-foreground data-[state=active]:text-background"
                                >
                                    Wellness Analysis
                                </TabsTrigger>
                                <TabsTrigger
                                    className="grow data-[state=active]:bg-card-foreground data-[state=active]:text-background"
                                    value="results"
                                    // className="flex-1 data-[state=active]:bg-card-foreground data-[state=active]:text-background"
                                >
                                    Results Analysis
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="wellness">
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
                        </TabsContent>
                        <TabsContent value="results">
                            <div>
                                <ResultsCards />
                                <ResultsTable />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
