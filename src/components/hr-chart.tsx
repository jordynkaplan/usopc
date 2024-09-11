import { useFlatResultsData } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState, useEffect, useCallback } from "react";

export function HrChart() {
  const data = useFlatResultsData();
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState("resting_hr");
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 0]);

  console.log({ data });

  const lineColors = [
    "#FF6B6B", // Coral Red
    "#4ECDC4", // Caribbean Green
    "#45B7D1", // Sky Blue
    "#FFA07A", // Light Salmon
    "#98D8C8", // Seafoam Green
    "#F7B801", // Amber
    "#7B68EE", // Medium Slate Blue
    "#FF69B4", // Hot Pink
    "#20B2AA", // Light Sea Green
    "#FF7F50", // Coral
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const metrics = [
    "resting_hr",
    "motivation",
    "soreness",
    "fatigue",
    "sleep_hours",
    "sleep_quality",
    "stress",
    "travel_hours",
    "sport_specific_training_volume",
  ];

  const athletes = ["all", ...Object.keys(data[0] || {})
    .filter((key) => key.startsWith("athlete_") && key.endsWith(selectedMetric))
    .map((key) => key.split("_")[1])];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : athletes.length - 1));
    } else if (event.key === "ArrowRight") {
      setSelectedIndex((prevIndex) => (prevIndex < athletes.length - 1 ? prevIndex + 1 : 0));
    }
  }, [athletes.length]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedAthlete(athletes[selectedIndex]);
  }, [selectedIndex, athletes]);

  useEffect(() => {
    const relevantKeys = Object.keys(data[0] || {}).filter(
      (key) =>
        key.startsWith("athlete_") &&
        key.endsWith(selectedMetric) &&
        (selectedAthlete === "all" || key.includes(selectedAthlete || ""))
    );

    const values = data.flatMap((entry) =>
      relevantKeys.map((key) => parseFloat(entry[key]))
    ).filter((value) => !isNaN(value));

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    
    setYAxisDomain([
      Math.floor(minValue - range * 0.1),
      Math.ceil(maxValue + range * 0.1)
    ]);
  }, [data, selectedMetric, selectedAthlete]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Athlete Metrics Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <Select value={selectedAthlete || undefined} onValueChange={(value: string) => {
            setSelectedAthlete(value);
            setSelectedIndex(athletes.indexOf(value));
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select an athlete" />
            </SelectTrigger>
            <SelectContent>
              {athletes.map((athlete) => (
                <SelectItem key={athlete} value={athlete}>
                  {athlete === "all" ? "All Athletes" : athlete}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a metric" />
            </SelectTrigger>
            <SelectContent>
              {metrics.map((metric) => (
                <SelectItem key={metric} value={metric}>
                  {metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis domain={yAxisDomain} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Legend />
            {Object.keys(data[0] || {})
              .filter(
                (key) =>
                  key.startsWith("athlete_") &&
                  key.endsWith(selectedMetric) &&
                  (selectedAthlete === "all" ||
                    key.includes(selectedAthlete || ""))
              )
              .map((key, index) => {
                console.log({ key });
                return (
                  <Line
                    key={key}
                    dataKey={key}
                    type="natural"
                    stroke={lineColors[index % lineColors.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                );
              })}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
