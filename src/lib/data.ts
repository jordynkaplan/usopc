import { useEffect, useState } from "react";
import Papa from "papaparse";

export interface WellnessLoadData {
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

interface ResultsData {
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

export function useGetAthleteGender(selectedAthlete: string | null) {
  const wellnessData = useWellnessLoadData();

  return wellnessData.find((entry) => entry.Athlete === selectedAthlete)?.Gender;
}

export function useWellnessLoadData() {
  const [data, setData] = useState<WellnessLoadData[]>([]);

  useEffect(() => {
    Papa.parse<WellnessLoadData>("/WellnessLoad.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const processedData = results.data.map((entry) => ({
          ...entry,
          "Resting HR": entry["Resting HR"] === 0 ? undefined : entry["Resting HR"],
        }));

        console.log({ processedData });

        setData(processedData as WellnessLoadData[]);
      },
      error: (error) => console.error("Error fetching WellnessLoad data:", error),
    });
  }, []);

  return data;
}

export function useResultsData() {
  const [data, setData] = useState<ResultsData[]>([]);

  useEffect(() => {
    Papa.parse<ResultsData>("/Results.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setData(results.data);
      },
      error: (error) => console.error("Error fetching Results data:", error),
    });
  }, []);

  return data;
}

export function useFlatWellnessData() {
  const [flatData, setFlatData] = useState<Record<string, string | number | undefined>[]>([]);

  useEffect(() => {
    Papa.parse<WellnessLoadData>("/WellnessLoad.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const groupedByDate = results.data.reduce((acc, entry) => {
          if (!acc[entry.Date]) {
            acc[entry.Date] = {};
          }
          Object.entries(entry).forEach(([key, value]) => {
            if (key !== "Date") {
              const newKey = `${entry.Athlete.toLowerCase().replace(/\s+/g, "_")}_${key.toLowerCase().replace(/\s+/g, "_")}`;
              if (key === "Resting HR") {
                acc[entry.Date][newKey] = value === "0" ? undefined : value;
              } else {
                acc[entry.Date][newKey] = value;
              }
            }
          });
          return acc;
        }, {} as Record<string, Record<string, string | number | undefined>>);

        const flattenedData = Object.entries(groupedByDate).map(([date, data]) => ({
          date,
          ...data,
        }));

        setFlatData(flattenedData);
      },
      error: (error) => console.error("Error fetching WellnessLoad data:", error),
    });
  }, []);

  return flatData;
}
