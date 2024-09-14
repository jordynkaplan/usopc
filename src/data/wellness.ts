import Papa from "papaparse";
import { useQuery } from "@tanstack/react-query";

export interface WellnessData {
    Date: string;
    Athlete: string;
    Gender: string;
    Fatigue: number;
    Soreness: number;
    Motivation: number;
    "Resting HR": number | undefined;
    "Sleep Hours": number;
    "Sleep Quality": number;
    Stress: number;
    "Travel Hours": number;
    "Sport Specific Training Volume": number;
}

const fetchWellnessLoadData = async (): Promise<WellnessData[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse<WellnessData>("/WellnessLoad.csv", {
            download: true,
            header: true,
            complete: (results) => {
                const processedData = results.data.map((entry) => ({
                    ...entry,
                    "Resting HR":
                        entry["Resting HR"] === 0
                            ? undefined
                            : entry["Resting HR"],
                }));
                resolve(processedData as WellnessData[]);
            },
            error: (error) => reject(error),
        });
    });
};

export function useWellnessLoadData() {
    return useQuery<WellnessData[], Error>({
        queryKey: ["wellnessLoadData"],
        queryFn: fetchWellnessLoadData,
        staleTime: Infinity,
    });
}

export function useWellnessLoadDataByAthlete(athlete?: string | null) {
    return useQuery<WellnessData[], Error>({
        queryKey: ["wellnessLoadDataByAthlete", athlete],
        queryFn: () =>
            fetchWellnessLoadData().then((data) =>
                data.filter((entry) => entry.Athlete === athlete)
            ),
        enabled: !!athlete,
        staleTime: Infinity,
    });
}

export function useFlatWellnessData() {
    return useQuery<Record<string, string | number | undefined>[], Error>({
        queryKey: ["flatWellnessData"],
        queryFn: async () => {
            return new Promise((resolve, reject) => {
                Papa.parse<WellnessData>("/WellnessLoad.csv", {
                    download: true,
                    header: true,
                    complete: (results) => {
                        const groupedByDate = results.data.reduce(
                            (acc, entry) => {
                                if (!acc[entry.Date]) {
                                    acc[entry.Date] = {};
                                }
                                Object.entries(entry).forEach(
                                    ([key, value]) => {
                                        if (key !== "Date") {
                                            const newKey = `${entry.Athlete.toLowerCase().replace(
                                                /\s+/g,
                                                "_"
                                            )}_${key
                                                .toLowerCase()
                                                .replace(/\s+/g, "_")}`;
                                            if (key === "Resting HR") {
                                                acc[entry.Date][newKey] =
                                                    value === "0"
                                                        ? undefined
                                                        : value;
                                            } else {
                                                acc[entry.Date][newKey] = value;
                                            }
                                        }
                                    }
                                );
                                return acc;
                            },
                            {} as Record<
                                string,
                                Record<string, string | number | undefined>
                            >
                        );

                        const flattenedData = Object.entries(groupedByDate).map(
                            ([date, data]) => ({
                                date,
                                ...data,
                            })
                        );

                        resolve(flattenedData);
                    },
                    error: (error) => reject(error),
                });
            });
        },
        staleTime: Infinity,
    });
}

export function useGetAthleteGender(athlete?: string | null) {
    const wellnessData = useWellnessLoadData();
    const athleteData = wellnessData.data?.find(
        (entry) => entry.Athlete === athlete
    );
    return athleteData?.Gender;
}
