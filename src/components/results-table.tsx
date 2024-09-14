import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useResultsDataByAthlete } from "@/data/results";

export function ResultsTable({ athlete }: { athlete: string | null }) {
  const { data: athleteResults } = useResultsDataByAthlete(athlete);
  return (
    <>
      <Card className="my-2">
        <CardContent>
          <div>
            <Table>
              <TableCaption>
                Lowest/fastest times and ranks higlighted in green,
                slowest/highest times and ranks in red, and missing data in
                yellow.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] text-right font-bold">
                    Date
                  </TableHead>
                  <TableHead className="text-right font-bold">Rank</TableHead>
                  <TableHead className="text-right font-bold">
                    Total Time (sec)
                  </TableHead>
                  <TableHead className="text-right font-bold">
                    Heat 1 (sec)
                  </TableHead>
                  <TableHead className="text-right font-bold">
                    Split Time: Heat 1 (sec)
                  </TableHead>
                  <TableHead className="text-right font-bold">
                    Split Rank: Heat 1
                  </TableHead>
                  <TableHead className="text-right font-bold">
                    Heat 2 (sec)
                  </TableHead>
                  <TableHead className="text-right font-bold">
                    Split Time: Heat 2 (sec)
                  </TableHead>
                  <TableHead className="text-right font-bold">
                    Split Rank: Heat 2
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {athleteResults?.map((athlete, _index, array) => {
                  const bestRank = Math.min(
                    ...array.map(
                      (a) => parseInt(a["Rank: Athlete"]) || Infinity
                    )
                  );
                  const bestTime = Math.min(
                    ...array.map(
                      (a) => parseFloat(a["Time: Athlete"]) || Infinity
                    )
                  );
                  const bestTimeHeat1 = Math.min(
                    ...array.map(
                      (a) => parseFloat(a["Time: Athlete Heat 1"]) || Infinity
                    )
                  );
                  const bestSplitTimeHeat1 = Math.min(
                    ...array.map(
                      (a) =>
                        parseFloat(a["Split Time: Athlete Heat 1"]) || Infinity
                    )
                  );
                  const bestSplitRankHeat1 = Math.min(
                    ...array.map(
                      (a) =>
                        parseInt(a["Split Rank: Athlete Heat 1"]) || Infinity
                    )
                  );
                  const bestTimeHeat2 = Math.min(
                    ...array.map(
                      (a) => parseFloat(a["Time: Athlete Heat 2"]) || Infinity
                    )
                  );
                  const bestSplitTimeHeat2 = Math.min(
                    ...array.map(
                      (a) =>
                        parseFloat(a["Split Time: Athlete Heat 2"]) || Infinity
                    )
                  );
                  const bestSplitRankHeat2 = Math.min(
                    ...array.map(
                      (a) =>
                        parseInt(a["Split Rank: Athlete Heat 2"]) || Infinity
                    )
                  );

                  const worstRank = Math.max(
                    ...array.map(
                      (a) => parseInt(a["Rank: Athlete"]) || -Infinity
                    )
                  );
                  const worstTime = Math.max(
                    ...array.map(
                      (a) => parseFloat(a["Time: Athlete"]) || -Infinity
                    )
                  );
                  const worstTimeHeat1 = Math.max(
                    ...array.map(
                      (a) => parseFloat(a["Time: Athlete Heat 1"]) || -Infinity
                    )
                  );
                  const worstSplitTimeHeat1 = Math.max(
                    ...array.map(
                      (a) =>
                        parseFloat(a["Split Time: Athlete Heat 1"]) || -Infinity
                    )
                  );
                  const worstSplitRankHeat1 = Math.max(
                    ...array.map(
                      (a) =>
                        parseInt(a["Split Rank: Athlete Heat 1"]) || -Infinity
                    )
                  );
                  const worstTimeHeat2 = Math.max(
                    ...array.map(
                      (a) => parseFloat(a["Time: Athlete Heat 2"]) || -Infinity
                    )
                  );
                  const worstSplitTimeHeat2 = Math.max(
                    ...array.map(
                      (a) =>
                        parseFloat(a["Split Time: Athlete Heat 2"]) || -Infinity
                    )
                  );
                  const worstSplitRankHeat2 = Math.max(
                    ...array.map(
                      (a) =>
                        parseInt(a["Split Rank: Athlete Heat 2"]) || -Infinity
                    )
                  );

                  return (
                    <TableRow key={athlete.Date}>
                      <TableCell className="text-right">
                        {athlete.Date}
                      </TableCell>
                      <TableCell
                        className={`text-right ${
                          athlete["Rank: Athlete"] === ""
                            ? "bg-yellow-200/50"
                            : parseInt(athlete["Rank: Athlete"]) === bestRank
                            ? "bg-green-200"
                            : parseInt(athlete["Rank: Athlete"]) === worstRank
                            ? "bg-red-200"
                            : ""
                        }`}
                      >
                        {athlete["Rank: Athlete"]}
                      </TableCell>
                      <TableCell
                        className={`font-medium text-right ${
                          athlete["Time: Athlete"] === ""
                            ? "bg-yellow-200/50"
                            : parseFloat(athlete["Time: Athlete"]) === bestTime
                            ? "bg-green-200"
                            : parseFloat(athlete["Time: Athlete"]) === worstTime
                            ? "bg-red-200"
                            : ""
                        }`}
                      >
                        {athlete["Time: Athlete"]}
                      </TableCell>
                      <TableCell
                        className={`text-right ${
                          athlete["Time: Athlete Heat 1"] === ""
                            ? "bg-yellow-200/50"
                            : parseFloat(athlete["Time: Athlete Heat 1"]) ===
                              bestTimeHeat1
                            ? "bg-green-200"
                            : parseFloat(athlete["Time: Athlete Heat 1"]) ===
                              worstTimeHeat1
                            ? "bg-red-200"
                            : ""
                        }`}
                      >
                        {athlete["Time: Athlete Heat 1"]}
                      </TableCell>
                      <TableCell
                        className={`text-right ${
                          athlete["Split Time: Athlete Heat 1"] === ""
                            ? "bg-yellow-200/50"
                            : parseFloat(
                                athlete["Split Time: Athlete Heat 1"]
                              ) === bestSplitTimeHeat1
                            ? "bg-green-200"
                            : parseFloat(
                                athlete["Split Time: Athlete Heat 1"]
                              ) === worstSplitTimeHeat1
                            ? "bg-red-200"
                            : ""
                        }`}
                      >
                        {athlete["Split Time: Athlete Heat 1"]}
                      </TableCell>
                      <TableCell
                        className={`text-right ${
                          athlete["Split Rank: Athlete Heat 1"] === ""
                            ? "bg-yellow-200/50"
                            : parseInt(
                                athlete["Split Rank: Athlete Heat 1"]
                              ) === bestSplitRankHeat1
                            ? "bg-green-200"
                            : parseInt(
                                athlete["Split Rank: Athlete Heat 1"]
                              ) === worstSplitRankHeat1
                            ? "bg-red-200"
                            : ""
                        }`}
                      >
                        {athlete["Split Rank: Athlete Heat 1"]}
                      </TableCell>
                      <TableCell
                        className={`text-right ${
                          athlete["Time: Athlete Heat 2"] === ""
                            ? "bg-yellow-200/50"
                            : parseFloat(athlete["Time: Athlete Heat 2"]) ===
                              bestTimeHeat2
                            ? "bg-green-200"
                            : parseFloat(athlete["Time: Athlete Heat 2"]) ===
                              worstTimeHeat2
                            ? "bg-red-200"
                            : ""
                        }`}
                      >
                        {athlete["Time: Athlete Heat 2"]}
                      </TableCell>
                      <TableCell
                        className={`text-right ${
                          athlete["Split Time: Athlete Heat 2"] === ""
                            ? "bg-yellow-200/50"
                            : parseFloat(
                                athlete["Split Time: Athlete Heat 2"]
                              ) === bestSplitTimeHeat2
                            ? "bg-green-200"
                            : parseFloat(
                                athlete["Split Time: Athlete Heat 2"]
                              ) === worstSplitTimeHeat2
                            ? "bg-red-200"
                            : ""
                        }`}
                      >
                        {athlete["Split Time: Athlete Heat 2"]}
                      </TableCell>
                      <TableCell
                        className={`text-right ${
                          athlete["Split Rank: Athlete Heat 2"] === ""
                            ? "bg-yellow-200/50"
                            : parseInt(
                                athlete["Split Rank: Athlete Heat 2"]
                              ) === bestSplitRankHeat2
                            ? "bg-green-200"
                            : parseInt(
                                athlete["Split Rank: Athlete Heat 2"]
                              ) === worstSplitRankHeat2
                            ? "bg-red-200"
                            : ""
                        }`}
                      >
                        {athlete["Split Rank: Athlete Heat 2"]}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
