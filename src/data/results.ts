import Papa from "papaparse";
import { useQuery } from "@tanstack/react-query";

export interface ResultsData {
    Date: string;
    Athlete: string;
    Event: string;
    "Time: Athlete": string;
    "Time: Best": string;
    "Rank: Athlete": string;
    "Time: Athlete Heat 1": string;
    "Time: Best Heat 1": string;
    "Split Time: Athlete Heat 1": string;
    "Split Rank: Athlete Heat 1": string;
    "Time: Athlete Heat 2": string;
    "Time: Best Heat 2": string;
    "Split Time: Athlete Heat 2": string;
    "Split Rank: Athlete Heat 2": string;
}

const fetchResultsData = async (): Promise<ResultsData[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse<ResultsData>("/Results.csv", {
            download: true,
            header: true,
            complete: (results) => resolve(results.data as ResultsData[]),
            error: (error) => reject(error),
        });
    });
};

export function useResultsData() {
    return useQuery<ResultsData[], Error>({
        queryKey: ["resultsData"],
        queryFn: fetchResultsData,
        staleTime: Infinity,
    });
}

export function useResultsDataByAthlete(athlete?: string | null) {
    return useQuery<ResultsData[], Error>({
        queryKey: ["resultsDataByAthlete", athlete],
        queryFn: () =>
            fetchResultsData().then((data) =>
                data.filter((entry) => entry.Athlete === athlete)
            ),
        enabled: !!athlete,
        staleTime: Infinity,
    });
}

export function getBestResult(results?: ResultsData[]) {
    if (!results || results.length === 0) {
        return undefined;
    }

    return results.reduce((min, result) => {
        const currentTime = parseFloat(result["Time: Athlete"]);
        const minTime = parseFloat(min["Time: Athlete"]);
        return currentTime < minTime ? result : min;
    }, results[0]);
}
