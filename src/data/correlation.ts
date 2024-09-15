import { useState, useEffect } from "react";

type CorrelationData = {
    columns: string[];
    index: string[];
    data: number[][];
};

const cachedCorrelationData = {
    columns: [
        "Fatigue",
        "Soreness",
        "Motivation",
        "Resting HR",
        "Sleep Hours",
        "Sleep Quality",
        "Stress",
    ],
    index: ["Time Delta: Best", "Time Delta: Heat 2", "Time Delta: Heat 1"],
    data: [
        [
            -0.3595656706, -0.1745344774, 0.1864559214, -0.2579379639,
            -0.2655484218, 0.1621728389, -0.0287879259,
        ],
        [
            -0.3265456924, -0.0887369852, 0.1196323758, -0.308877168,
            -0.295458406, 0.0451021545, 0.0202084021,
        ],
        [
            -0.3106559017, -0.1981070161, 0.2193935054, -0.1256934603,
            -0.1467007027, 0.2512107319, -0.0519623951,
        ],
    ],
};

export function useCorrelationData(
    gender: string,
    useCachedData: boolean = false
) {
    const [correlationData, setCorrelationData] =
        useState<CorrelationData | null>(null);

    useEffect(() => {
        const fetchCorrelationData = async () => {
            if (useCachedData) {
                setCorrelationData(cachedCorrelationData);
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
