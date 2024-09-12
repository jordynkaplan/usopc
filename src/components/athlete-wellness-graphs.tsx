import { useWellnessLoadData } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import { useState, useEffect } from "react";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const metrics = ["resting_hr", "motivation", "soreness", "fatigue", "sleep_hours", "sleep_quality", "stress", "travel_hours", "sport_specific_training_volume"];

interface AthleteWellnessGraphsProps {
  athlete: string | null;
}

export function AthleteWellnessGraphs({ athlete }: AthleteWellnessGraphsProps) {
  const [selectedMetric, setSelectedMetric] = useState("resting_hr");
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 0]);

  //   const results = useResultsData();
  const wellness = useWellnessLoadData();

  const processWellnessData = () => {
    if (!athlete || !wellness) return [];

    const athleteData = wellness.filter((entry) => entry.Athlete === athlete);

    return athleteData.map((entry) => ({
      date: entry.Date,
      [selectedMetric]: entry[selectedMetric as keyof typeof entry],
    }));
  };

  const data = processWellnessData();

  // Update yAxisDomain based on the data
  useEffect(() => {
    if (data.length === 0) return;

    const values = data.map((entry) => Number(entry[selectedMetric])).filter((value) => !isNaN(value));
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;

    setYAxisDomain([Math.floor(minValue - range * 0.1), Math.ceil(maxValue + range * 0.1)]);
  }, [data, selectedMetric]);

  return (
    <div>
      <Card>
        <CardContent>
          <CardHeader>
            <CardTitle>Wellness Metrics</CardTitle>
            <CardDescription>Shown against competition dates</CardDescription>
          </CardHeader>
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
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
              <YAxis domain={yAxisDomain} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              {/* <Legend
                payload={[
                  { value: selectedMetric, type: "line", color: "#FF6B6B" },
                  { value: "Competition Day", type: "line", color: "#888", payload: { strokeDasharray: "3 3" } },
                ]}
              /> */}
              <Line key={selectedMetric} dataKey={selectedMetric} type="natural" stroke="#FF6B6B" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
