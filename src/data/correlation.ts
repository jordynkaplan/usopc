import { useState, useEffect } from "react";

type CorrelationData = {
    columns: string[];
    index: string[];
    data: number[][];
};

const cachedMaleCorrelationData = {
    columns: [
        "Fatigue",
        "Soreness",
        "Motivation",
        "Resting HR",
        "Sleep Hours",
        "Sleep Quality",
        "Stress",
    ],
    index: [
        "Percentage Time Delta: Best",
        "Percentage Time Delta: Heat 2",
        "Percentage Time Delta: Heat 1",
    ],
    data: [
        [
            -0.3789438896, -0.1811082117, 0.1932912075, -0.3007379299,
            -0.2406907311, 0.2027165718, -0.0939638352,
        ],
        [
            -0.3424711287, -0.0938457923, 0.1198377144, -0.3427892647,
            -0.2757009355, 0.0739520813, -0.0400443954,
        ],
        [
            -0.3257204471, -0.2014199935, 0.2298868596, -0.1614794226,
            -0.1182042438, 0.2944914103, -0.1085442965,
        ],
    ],
};

const cachedFemaleCorrelationData = {
    columns: [
        "Fatigue",
        "Soreness",
        "Motivation",
        "Resting HR",
        "Sleep Hours",
        "Sleep Quality",
        "Stress",
    ],
    index: [
        "Percentage Time Delta: Best",
        "Percentage Time Delta: Heat 2",
        "Percentage Time Delta: Heat 1",
    ],
    data: [
        [
            -0.6416790975, 0.2925715951, -0.6844831985, 0.4895090329,
            0.6471436139, -0.4623537486, 0.6740889048,
        ],
        [
            -0.5288874389, 0.1582725272, -0.4451729936, -0.010927879,
            0.5344447802, -0.327130642, 0.3783003504,
        ],
        [
            -0.4699364564, 0.2869554443, -0.6946582024, 0.7776727283,
            0.5082496877, -0.4839364726, 0.7293246463,
        ],
    ],
};

export function useCorrelationData(
    gender: "m" | "f",
    useCachedData: boolean = false
) {
    const [correlationData, setCorrelationData] =
        useState<CorrelationData | null>(null);

    useEffect(() => {
        const fetchCorrelationData = async () => {
            if (useCachedData) {
                setCorrelationData(
                    gender === "m"
                        ? cachedMaleCorrelationData
                        : cachedFemaleCorrelationData
                );
                return;
            }

            try {
                const response = await fetch(`/api/corr/${gender}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data: CorrelationData = await response.json();
                setCorrelationData(data);
            } catch (error) {
                console.error("Error fetching correlation data:", error);
            }
        };

        fetchCorrelationData();
    }, [gender, useCachedData]);

    return { correlationData };
}
