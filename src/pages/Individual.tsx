import { Card, CardContent } from "@/components/ui/card";
import { useGetAthleteGender, useResultsData } from "@/lib/data";
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
import { SleepCards } from "@/components/sleep-cards";

export function Individual() {
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);
  const gender = useGetAthleteGender(selectedAthlete);

  const results = useResultsData();

  // Use useMemo to memoize the set of unique athletes
  const athletes = useMemo(() => {
    return Array.from(
      results.reduce((acc, result) => {
        acc.add(result.Athlete);
        return acc;
      }, new Set())
    ).sort() as string[];
  }, [results]);

  useEffect(() => {
    if (athletes.length > 0) {
      setSelectedAthlete(athletes[0]);
    }
  }, [athletes]);

  return (
    <>
      <div className="my-2">
        <Card>
          <CardContent className="p-6 flex">
            <div className="flex items-center gap-4">
              <p className="font-semibold text-xl">Select Athlete: </p>
              <div className="flex">
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
                    {athletes.map((athlete) => (
                      <SelectItem key={athlete} value={athlete}>
                        <span className="font-semibold text-xl">{athlete}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center">
                <p className="font-semibold text-xl">
                  Gender: {gender === "m" ? "Male" : "Female"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="my-2 justify-center">
          <Tabs defaultValue="wellness">
            <div className="flex items-center">
              <TabsList className="w-full">
                <TabsTrigger
                  value="wellness"
                  className="flex-1 data-[state=active]:bg-card-foreground data-[state=active]:text-background"
                >
                  Wellness Analysis
                </TabsTrigger>
                <TabsTrigger
                  value="results"
                  className="flex-1 data-[state=active]:bg-card-foreground data-[state=active]:text-background"
                >
                  Results Analysis
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="wellness">
              <div className="my-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <WellnessChart athlete={selectedAthlete} className="w-full" />
                  <SleepCards />
                </div>
                <div className="lg:col-span-1">
                  <WellnessBlocks />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="results">
              <div>
                <ResultsTable />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
