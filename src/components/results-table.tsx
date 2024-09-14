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
                Lowest ranks higlighted in green,
                highest ranks in red, and missing data in
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
                  const worstRank = Math.max(
                    ...array.map(
                      (a) => parseInt(a["Rank: Athlete"]) || -Infinity
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
                      <TableCell className="font-medium text-right">
                        {athlete["Time: Athlete"]}
                      </TableCell>
                      <TableCell className="text-right">
                        {athlete["Time: Athlete Heat 1"]}
                      </TableCell>
                      <TableCell className="text-right">
                        {athlete["Split Time: Athlete Heat 1"]}
                      </TableCell>
                      <TableCell
                        className={`text-right ${
                          athlete["Split Rank: Athlete Heat 1"] === ""
                            ? "bg-yellow-200/50"
                            : parseInt(athlete["Split Rank: Athlete Heat 1"]) === bestRank
                            ? "bg-green-200"
                            : parseInt(athlete["Split Rank: Athlete Heat 1"]) === worstRank
                            ? "bg-red-200"
                            : ""
                        }`}
                      >
                        {athlete["Split Rank: Athlete Heat 1"]}
                      </TableCell>
                      <TableCell className="text-right">
                        {athlete["Time: Athlete Heat 2"]}
                      </TableCell>
                      <TableCell className="text-right">
                        {athlete["Split Time: Athlete Heat 2"]}
                      </TableCell>
                      <TableCell
                        className={`text-right ${
                          athlete["Split Rank: Athlete Heat 2"] === ""
                            ? "bg-yellow-200/50"
                            : parseInt(athlete["Split Rank: Athlete Heat 2"]) === bestRank
                            ? "bg-green-200"
                            : parseInt(athlete["Split Rank: Athlete Heat 2"]) === worstRank
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
