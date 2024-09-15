import Papa from "papaparse";
import { useQuery } from "@tanstack/react-query";
import { ResultsData } from "./results";

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

const sportSpecificTrainingVolumeMap = {
    None: 0,
    Low: 1,
    Moderate: 2,
    High: 3,
};

export const sportSpecificTrainingTitleMap = {
    0: "None",
    1: "Low",
    2: "Moderate",
    3: "High",
};

const fetchWellnessLoadData = async (): Promise<WellnessData[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse<WellnessData>("/WellnessLoad.csv", {
            download: true,
            header: true,
            dynamicTyping: true,
            transform(value, field) {
                if (field === "Sport Specific Training Volume") {
                    return sportSpecificTrainingVolumeMap[
                        value as keyof typeof sportSpecificTrainingVolumeMap
                    ];
                }
                return value;
            },
            complete: (results) => {
                // Calculate mean and standard deviation for Resting HR
                const validRestingHRs = results.data
                    .map((entry) => entry["Resting HR"])
                    .filter((hr) => hr !== 0 && hr !== undefined) as number[];
                const mean =
                    validRestingHRs.reduce((sum, hr) => sum + Number(hr), 0) /
                    validRestingHRs.length;
                const variance =
                    validRestingHRs.reduce(
                        (sum, hr) => sum + Math.pow(Number(hr) - mean, 2),
                        0
                    ) / validRestingHRs.length;
                const stdDev = Math.sqrt(variance);

                const processedData = results.data.map((entry) => {
                    const restingHR = entry["Resting HR"];
                    const isWithin3SD =
                        restingHR !== 0 &&
                        restingHR !== undefined &&
                        Math.abs(restingHR - mean) <= 3 * stdDev;

                    return {
                        ...entry,
                        "Resting HR": isWithin3SD ? restingHR : undefined,
                    };
                });
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

export function getWellnessLeadingUpData({
    wellnessData,
    bestResult,
    days,
}: {
    wellnessData?: WellnessData[];
    bestResult?: ResultsData;
    days: number;
}) {
    if (!wellnessData || !bestResult) {
        return [];
    }

    const bestResultDate = bestResult ? new Date(bestResult.Date) : new Date();
    const daysBefore = bestResultDate ? new Date(bestResultDate) : new Date();
    daysBefore.setDate(bestResultDate.getDate() - days);

    return wellnessData.filter((entry) => {
        const entryDate = new Date(entry.Date);
        return entryDate >= daysBefore && entryDate <= bestResultDate;
    });
}

export function calculateAverageMetric(
    wellnessLeadingUpData: WellnessData[],
    metric: keyof WellnessData
): number {
    const validValues = wellnessLeadingUpData
        .map((entry) => Number(entry[metric]))
        .filter((value) => !isNaN(value));

    if (validValues.length === 0) return 0;

    const sum = validValues.reduce((acc, value) => acc + value, 0);
    return Number((sum / validValues.length).toFixed(2));
}

export function useWellnessDataByGender(gender?: string) {
    return useQuery<WellnessData[], Error>({
        queryKey: ["wellnessDataByGender", gender],
        queryFn: () =>
            fetchWellnessLoadData().then((data) =>
                data.filter((entry) => entry.Gender === gender)
            ),
        enabled: !!gender,
        staleTime: Infinity,
    });
}
