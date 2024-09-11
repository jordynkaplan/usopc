import { useEffect, useState } from 'react';
import Papa from 'papaparse';

interface WellnessLoadData {
  Date: string;
  Athlete: string;
  Gender: string;
  Fatigue: number;
  Soreness: number;
  Motivation: number;
  "Resting HR": number;
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

export function useWellnessLoadData() {
  const [data, setData] = useState<WellnessLoadData[]>([]);

  useEffect(() => {
    Papa.parse<WellnessLoadData>('/WellnessLoad.csv', {
      download: true,
      header: true,
      complete: (results) => {
        setData(results.data);
      },
      error: (error) => console.error('Error fetching WellnessLoad data:', error)
    });
  }, []);

  return data;
}

export function useResultsData() {
  const [data, setData] = useState<ResultsData[]>([]);

  useEffect(() => {
    Papa.parse<ResultsData>('/Results.csv', {
      download: true,
      header: true,
      complete: (results) => {
        setData(results.data);
      },
      error: (error) => console.error('Error fetching Results data:', error)
    });
  }, []);

  return data;
}
