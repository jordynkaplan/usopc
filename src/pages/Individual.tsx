import { Card, CardContent } from "@/components/ui/card";
import { useGetAthleteGender, useResultsData } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { WellnessChart } from "@/components/wellness-chart";
import { WellnessBlocks } from "@/components/wellness-blocks";

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
                <p className="font-semibold text-xl">Gender: {gender === "m" ? "Male" : "Female"}</p>
              </div>
            </div>
            {/* <div className="flex items-center text-right">
              <p className="font-semibold text-xl">Athlete Wellness and Compeition Metrics</p>
            </div> */}
          </CardContent>
        </Card>
      </div>
      <div className="my-4 flex gap-2">
        <WellnessChart athlete={selectedAthlete} className="grow" />
        <WellnessBlocks />
      </div>
    </>
  );
}
