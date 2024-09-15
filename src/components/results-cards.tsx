import { Card, CardContent } from "@/components/ui/card";
import { useResultsDataByAthlete } from "@/data/results";
import { Badge } from "./ui/badge";

export function ResultsCards({ athlete }: { athlete: string | null }) {
    const { data: athleteResults } = useResultsDataByAthlete(athlete);

    const totalCompetitions = athleteResults?.length || 0;
    const timeDeltaBest = athleteResults
        ? Math.min(
              ...athleteResults.map(
                  (r) => r["Percentage Time Delta: Best"] || Infinity
              )
          )
        : 0;
    const timeDeltaHeat1 = athleteResults
        ? Math.min(
              ...athleteResults.map(
                  (r) => r["Percentage Time Delta: Heat 1"] || Infinity
              )
          )
        : 0;
    const timeDeltaHeat2 = athleteResults
        ? Math.min(
              ...athleteResults.map(
                  (r) => r["Percentage Time Delta: Heat 2"] || Infinity
              )
          )
        : 0;
    const highestRank = athleteResults
        ? Math.min(...athleteResults.map((r) => r["Rank: Athlete"] || Infinity))
        : 0;
    const averageRank = athleteResults
        ? athleteResults.reduce(
              (sum, r) => sum + (r["Rank: Athlete"] || 0),
              0
          ) / totalCompetitions
        : 0;

    return (
        <div className="flex flex-col my-4 gap-2 sm:flex-row">
            <div className="flex flex-col sm:flex-row flex-1 gap-2">
                <Card className="flex-1">
                    <CardContent className="flex flex-col items-center p-6 justify-center h-full">
                        <p className="text-center">Total Competitions</p>
                        <p className="font-bold text-3xl">
                            {totalCompetitions}
                        </p>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardContent className="flex flex-col items-center p-6 justify-center h-full">
                        <p className="text-center">Highest Rank</p>
                        <p className="font-bold text-3xl">{highestRank}</p>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardContent className="flex flex-col items-center p-6 justify-center h-full">
                        <p className="text-center">Average Rank</p>
                        <p className="font-bold text-3xl">
                            {averageRank.toFixed(2)}
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-col sm:flex-row flex-1 gap-2">
                <Card className="flex-1 whitespace-nowrap">
                    <CardContent className="flex flex-col items-center p-6 justify-center h-full">
                        <div className="flex flex-col items-center gap-2">
                            <Badge variant="secondary">Total Time</Badge>
                            <p className="text-center">
                                Lowest Delta from Leader
                            </p>
                            <p className="font-bold text-3xl">
                                {timeDeltaBest.toFixed(2)}%
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex-1 whitespace-nowrap">
                    <CardContent className="flex flex-col items-center p-6 justify-center h-full">
                        <div className="flex flex-col items-center gap-2">
                            <Badge variant="secondary">Heat 1</Badge>
                            <p className="text-center">
                                Lowest Delta from Leader
                            </p>
                            <p className="font-bold text-3xl">
                                {timeDeltaHeat1.toFixed(2)}%
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex-1 whitespace-nowrap">
                    <CardContent className="flex flex-col items-center p-6 justify-center h-full">
                        <div className="flex flex-col items-center gap-2">
                            <Badge variant="secondary">Heat 2</Badge>
                            <p className="text-center">
                                Lowest Delta from Leader
                            </p>
                            <p className="font-bold text-3xl">
                                {timeDeltaHeat2.toFixed(2)}%
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
