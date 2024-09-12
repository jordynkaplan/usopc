import { useFlatWellnessData, useResultsData } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState, useEffect } from "react";

interface WellnessChartProps {
  athlete?: string;
}

export function WellnessChart({ athlete }: WellnessChartProps) {
  const data = useFlatWellnessData();
  const results = useResultsData();

  const filteredResults = results.filter((result) => result.Athlete === athlete);

  const [selectedMetric, setSelectedMetric] = useState("resting_hr");
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 0]);

  const [chartData, setChartData] = useState<any[]>([]);

  console.log({ chartData });

  useEffect(() => {
    if (!athlete || !data.length) return;

    console.log({ data });
    console.log({ selectedMetric });

    const relevantKey = `${athlete.toLowerCase().replace(/\s+/g, "_")}_${selectedMetric}`;
    console.log({ relevantKey });
    const filteredData = data.filter((entry) => entry[relevantKey] !== undefined && entry[relevantKey] !== null);

    const processedData = filteredData.map((entry) => ({
      date: entry.date,
      [selectedMetric]: parseFloat(entry[relevantKey]),
    }));

    // Sort the processed data by date
    const sortedData = processedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setChartData(sortedData);
  }, [data, athlete, selectedMetric]);

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

  const metrics = ["resting_hr", "motivation", "soreness", "fatigue", "sleep_hours", "sleep_quality", "stress", "travel_hours", "sport_specific_training_volume"];

  useEffect(() => {
    if (!athlete) return;

    const relevantKey = `athlete_${athlete}_${selectedMetric}`;
    const values = data.map((entry) => parseFloat(entry[relevantKey])).filter((value) => !isNaN(value));

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;

    if (selectedMetric === 'resting_hr') {
      setYAxisDomain([20, Math.ceil(maxValue + range * 0.1)]);
    } else {
      setYAxisDomain([Math.floor(minValue - range * 0.1), Math.ceil(maxValue + range * 0.1)]);
    }
  }, [data, selectedMetric, athlete]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Athlete Metrics Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a metric" />
            </SelectTrigger>
            <SelectContent>
              {metrics.map((metric) => (
                <SelectItem key={metric} value={metric}>
                  {metric.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
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
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "numeric",
                  day: "2-digit",
                });
              }}
            />
            <YAxis domain={yAxisDomain} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Legend
              payload={[
                { value: selectedMetric, type: "line", color: "#FF6B6B" },
                { value: "Competition Day", type: "line", color: "#888", payload: { strokeDasharray: "3 3" } },
              ]}
              wrapperStyle={{ fontSize: "14px" }}
              iconSize={20}
              verticalAlign="bottom"
              height={36}
            />
            {athlete && <Line key={`${selectedMetric}`} dataKey={`${selectedMetric}`} type="natural" stroke={lineColors[0]} strokeWidth={2} dot={false} />}
            {filteredResults.map((result, index) => (
              <ReferenceLine
                key={`result-${index}`}
                x={result.Date}
                stroke="#888"
                strokeDasharray="3 3"
                label={{
                  value: `${result.Event} (${result["Time: Athlete"]})`,
                  position: "top",
                  fill: "#888",
                  fontSize: 10,
                  offset: 10,
                }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
