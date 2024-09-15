import Papa from "papaparse";
import { useQuery } from "@tanstack/react-query";

export interface ResultsData {
    Date: string;
    Athlete: string;
    Event: string;
    "Time: Athlete": number;
    "Time: Best": number;
    "Rank: Athlete": number;
    "Time: Athlete Heat 1": number;
    "Time: Best Heat 1": number;
    "Split Time: Athlete Heat 1": number;
    "Split Rank: Athlete Heat 1": number;
    "Time: Athlete Heat 2": number;
    "Time: Best Heat 2": number;
    "Split Time: Athlete Heat 2": number;
    "Split Rank: Athlete Heat 2": number;
    "Time Delta: Best": number;
    "Time Delta: Heat 1": number;
    "Time Delta: Heat 2": number;
}

const fetchResultsData = async (): Promise<ResultsData[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse<ResultsData>("/ResultsWithFeatures.csv", {
            dynamicTyping: true,
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

export function useResultsDataByGender(gender?: string) {
    return useQuery<ResultsData[], Error>({
        queryKey: ["resultsDataByGender", gender],
        queryFn: () => {
            const genderKey = gender === "m" ? "Men's" : "Women's";
            console.log({ genderKey });

            return fetchResultsData().then((data) =>
                data.filter((entry) => entry.Event?.startsWith(genderKey || ""))
            );
        },
        enabled: !!gender,
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
