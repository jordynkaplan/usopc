import { Card, CardContent } from "@/components/ui/card";
import { useResultsDataByAthlete } from "@/data/results";

export function ResultsCards({ athlete }: { athlete: string | null }) {

  const { data: athleteResults } = useResultsDataByAthlete(athlete);

  const totalCompetitions = athleteResults?.length || 0;
  const bestResult = athleteResults ? Math.min(...athleteResults.map(r => parseFloat(r["Time: Athlete"]) || Infinity)) : 0;
  const highestRank = athleteResults ? Math.min(...athleteResults.map(r => parseInt(r["Rank: Athlete"]) || Infinity)) : 0;
  const averageRank = athleteResults ? athleteResults.reduce((sum, r) => sum + (parseInt(r["Rank: Athlete"]) || 0), 0) / totalCompetitions : 0;
  const bestSplitTimeHeat2 = athleteResults ? Math.min(...athleteResults.map(r => parseFloat(r["Split Time: Athlete Heat 2"]) || Infinity)) : 0;

  return (
          <div className="flex my-4 gap-2">
            <div className="flex-1 flex justify-between gap-2">
              <Card className="flex-1">
                <CardContent className="flex flex-col items-center p-6 justify-center h-full">
                  <p className="text-center">Total Competitions</p>
                  <p className="font-bold text-3xl">{totalCompetitions}</p>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent className="flex flex-col items-center p-6 justify-center h-full">
                  <p className="text-center">Best Result</p>
                  <p className="font-bold text-3xl">{bestResult.toFixed(2)} sec</p>
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
                  <p className="font-bold text-3xl">{averageRank.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent className="flex flex-col items-center p-6 justify-center h-full">
                  <p className="text-center">Best Split: Time Heat 2</p>
                  <p className="font-bold text-3xl">{bestSplitTimeHeat2.toFixed(2)}</p>
                </CardContent>
              </Card>
            </div>
          </div>
  );
}
