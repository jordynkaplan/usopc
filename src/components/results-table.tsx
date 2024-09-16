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
            <Card>
                <CardContent>
                    <div>
                        <Table>
                            <TableCaption>
                                All times recorded in seconds. "Difference from
                                best" is the difference between the athlete's
                                time and the best time in the event. Best ranks
                                higlighted in green, worst ranks in red, and
                                missing data in yellow.
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px] text-right font-bold">
                                        Date
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        Rank
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        Total Time
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        Difference from Best Total Time
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        Heat 1
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        Difference from Best Heat 1
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        Split Time: Heat 1
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        Split Rank: Heat 1
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        Heat 2
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        Difference from Best Heat 2
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        Split Time: Heat 2
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        Split Rank: Heat 2
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {athleteResults?.map(
                                    (athlete, _index, array) => {
                                        const bestOverallRank = Math.min(
                                            ...array.map(
                                                (a) =>
                                                    a["Rank: Athlete"] ||
                                                    Infinity
                                            )
                                        );
                                        const worstOverallRank = Math.max(
                                            ...array.map(
                                                (a) =>
                                                    a["Rank: Athlete"] ||
                                                    -Infinity
                                            )
                                        );
                                        const bestSplitRankHeat1 = Math.min(
                                            ...array.map(
                                                (a) =>
                                                    a[
                                                        "Split Rank: Athlete Heat 1"
                                                    ] || Infinity
                                            )
                                        );
                                        const worstSplitRankHeat1 = Math.max(
                                            ...array.map(
                                                (a) =>
                                                    a[
                                                        "Split Rank: Athlete Heat 1"
                                                    ] || -Infinity
                                            )
                                        );
                                        const bestSplitRankHeat2 = Math.min(
                                            ...array.map(
                                                (a) =>
                                                    a[
                                                        "Split Rank: Athlete Heat 2"
                                                    ] || Infinity
                                            )
                                        );
                                        const worstSplitRankHeat2 = Math.max(
                                            ...array.map(
                                                (a) =>
                                                    a[
                                                        "Split Rank: Athlete Heat 2"
                                                    ] || -Infinity
                                            )
                                        );

                                        return (
                                            <TableRow key={athlete.Date}>
                                                <TableCell
                                                    className={`text-right ${
                                                        athlete.Date === ""
                                                            ? "bg-yellow-200/50"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="font-mono">
                                                        {athlete.Date}
                                                    </span>
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right ${
                                                        athlete[
                                                            "Rank: Athlete"
                                                        ] === null
                                                            ? "bg-yellow-200/50"
                                                            : athlete[
                                                                  "Rank: Athlete"
                                                              ] ===
                                                              bestOverallRank
                                                            ? "bg-green-200"
                                                            : athlete[
                                                                  "Rank: Athlete"
                                                              ] ===
                                                              worstOverallRank
                                                            ? "bg-red-200"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="font-mono">
                                                        {
                                                            athlete[
                                                                "Rank: Athlete"
                                                            ]
                                                        }
                                                    </span>
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right ${
                                                        athlete[
                                                            "Time: Athlete"
                                                        ] === null
                                                            ? "bg-yellow-200/50"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="font-mono">
                                                        {athlete[
                                                            "Time: Athlete"
                                                        ] !== null
                                                            ? `${athlete[
                                                                  "Time: Athlete"
                                                              ]?.toFixed(2)}s`
                                                            : ""}
                                                    </span>
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right ${
                                                        athlete[
                                                            "Time Delta: Best"
                                                        ] === null
                                                            ? "bg-yellow-200/50"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="font-mono">
                                                        {athlete[
                                                            "Time Delta: Best"
                                                        ] !== null
                                                            ? `${athlete[
                                                                  "Time Delta: Best"
                                                              ]?.toFixed(2)}s`
                                                            : ""}
                                                    </span>
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right ${
                                                        athlete[
                                                            "Time: Athlete Heat 1"
                                                        ] === null
                                                            ? "bg-yellow-200/50"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="font-mono">
                                                        {athlete[
                                                            "Time: Athlete Heat 1"
                                                        ] !== null
                                                            ? `${athlete[
                                                                  "Time: Athlete Heat 1"
                                                              ]?.toFixed(2)}s`
                                                            : ""}
                                                    </span>
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right ${
                                                        athlete[
                                                            "Time Delta: Heat 1"
                                                        ] === null
                                                            ? "bg-yellow-200/50"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="font-mono">
                                                        {athlete[
                                                            "Time Delta: Heat 1"
                                                        ] !== null
                                                            ? `${athlete[
                                                                  "Time Delta: Heat 1"
                                                              ]?.toFixed(2)}s`
                                                            : ""}
                                                    </span>
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right ${
                                                        athlete[
                                                            "Split Time: Athlete Heat 1"
                                                        ] === null
                                                            ? "bg-yellow-200/50"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="font-mono">
                                                        {athlete[
                                                            "Split Time: Athlete Heat 1"
                                                        ] !== null
                                                            ? `${athlete[
                                                                  "Split Time: Athlete Heat 1"
                                                              ]?.toFixed(2)}s`
                                                            : ""}
                                                    </span>
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right ${
                                                        athlete[
                                                            "Split Rank: Athlete Heat 1"
                                                        ] === null
                                                            ? "bg-yellow-200/50"
                                                            : athlete[
                                                                  "Split Rank: Athlete Heat 1"
                                                              ] ===
                                                              bestSplitRankHeat1
                                                            ? "bg-green-200"
                                                            : athlete[
                                                                  "Split Rank: Athlete Heat 1"
                                                              ] ===
                                                              worstSplitRankHeat1
                                                            ? "bg-red-200"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="font-mono">
                                                        {
                                                            athlete[
                                                                "Split Rank: Athlete Heat 1"
                                                            ]
                                                        }
                                                    </span>
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right ${
                                                        athlete[
                                                            "Time: Athlete Heat 2"
                                                        ] === null
                                                            ? "bg-yellow-200/50"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="font-mono">
                                                        {athlete[
                                                            "Time: Athlete Heat 2"
                                                        ] !== null
                                                            ? `${athlete[
                                                                  "Time: Athlete Heat 2"
                                                              ]?.toFixed(2)}s`
                                                            : ""}
                                                    </span>
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right ${
                                                        athlete[
                                                            "Time Delta: Heat 2"
                                                        ] === null
                                                            ? "bg-yellow-200/50"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="font-mono">
                                                        {athlete[
                                                            "Time Delta: Heat 2"
                                                        ] !== null
                                                            ? `${athlete[
                                                                  "Time Delta: Heat 2"
                                                              ]?.toFixed(2)}s`
                                                            : ""}
                                                    </span>
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right ${
                                                        athlete[
                                                            "Split Time: Athlete Heat 2"
                                                        ] === null
                                                            ? "bg-yellow-200/50"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="font-mono">
                                                        {athlete[
                                                            "Split Time: Athlete Heat 2"
                                                        ] !== null
                                                            ? `${athlete[
                                                                  "Split Time: Athlete Heat 2"
                                                              ]?.toFixed(2)}s`
                                                            : ""}
                                                    </span>
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right ${
                                                        athlete[
                                                            "Split Rank: Athlete Heat 2"
                                                        ] === null
                                                            ? "bg-yellow-200/50"
                                                            : athlete[
                                                                  "Split Rank: Athlete Heat 2"
                                                              ] ===
                                                              bestSplitRankHeat2
                                                            ? "bg-green-200"
                                                            : athlete[
                                                                  "Split Rank: Athlete Heat 2"
                                                              ] ===
                                                              worstSplitRankHeat2
                                                            ? "bg-red-200"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="font-mono">
                                                        {
                                                            athlete[
                                                                "Split Rank: Athlete Heat 2"
                                                            ]
                                                        }
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
