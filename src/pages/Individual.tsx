import { Card, CardContent } from "@/components/ui/card";
import { useResultsData } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { AthleteWellnessGraphs } from "@/components/athlete-wellness-graphs";
import { WellnessChart } from "@/components/wellness-chart";

export function Individual() {
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);

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
          <CardContent className="p-6 flex gap-4 text-center">
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
                      {athlete}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="my-4">
        {/* <AthleteWellnessGraphs athlete={selectedAthlete} /> */}
        <WellnessChart athlete={selectedAthlete} />
      </div>
    </>
  );
}
