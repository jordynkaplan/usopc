import { useFlatWellnessData, useResultsData } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface WellnessChartProps {
  athlete?: string | null;
  className?: string;
}

export function WellnessChart({ athlete, className }: WellnessChartProps) {
  const data = useFlatWellnessData();
  const results = useResultsData();

  const filteredResults = results.filter((result) => result.Athlete === athlete);

  const [selectedMetric, setSelectedMetric] = useState("resting_hr");
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 0]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chartData, setChartData] = useState<any[]>([]);

  console.log({ chartData });

  useEffect(() => {
    if (!athlete || !data.length || !results.length) return;

    console.log({ data });
    console.log({ selectedMetric });

    const relevantKey = `${athlete.toLowerCase().replace(/\s+/g, "_")}_${selectedMetric}`;
    console.log({ relevantKey });
    const filteredData = data.filter((entry) => entry[relevantKey] !== undefined && entry[relevantKey] !== null);

    // Create a map of existing dates in filteredData
    const existingDates = new Set(filteredData.map((entry) => entry.date));

    // Get all unique dates from results for the selected athlete
    const resultDates = new Set(results.filter((result) => result.Athlete === athlete).map((result) => result.Date));

    // Combine existing data with missing dates from results
    const combinedData = [...filteredData];
    resultDates.forEach((date) => {
      if (!existingDates.has(date)) {
        combinedData.push({ date, [relevantKey]: undefined });
      }
    });

    const processedData = combinedData.map((entry) => ({
      date: entry.date,
      [selectedMetric]: entry[relevantKey] !== null ? parseFloat(entry[relevantKey] as string) : null,
    }));

    // Sort the processed data by date
    const sortedData = processedData.sort((a, b) => new Date(a.date as string).getTime() - new Date(b.date as string).getTime());

    setChartData(sortedData);
  }, [data, athlete, selectedMetric, results]);

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
    const values = data.map((entry) => parseFloat(entry[relevantKey] as string)).filter((value) => !isNaN(value));

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;

    if (selectedMetric === "resting_hr") {
      setYAxisDomain([20, Math.ceil(maxValue + range * 0.1)]);
    } else {
      setYAxisDomain([Math.floor(minValue - range * 0.1), Math.ceil(maxValue + range * 0.1)]);
    }
  }, [data, selectedMetric, athlete]);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Athlete Metrics Chart</CardTitle>
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
        <CardDescription>May - September 2023</CardDescription>
      </CardHeader>
      <CardContent>
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
                  formatter={(_value, _name, item) => {
                    const indicatorColor = item.payload.fill || item.color;
                    const indicator = "dot";
                    const nestLabel = false;
                    const isNan = isNaN(item.value as number);
                    const innerText = isNan ? "Not reported" : (item.value ?? "Not reported").toLocaleString();

                    return (
                      <>
                        <div
                          className={cn("shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]", {
                            "h-2.5 w-2.5": indicator === "dot",
                          })}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                        <div className={cn("flex flex-1 gap-2 justify-between leading-none", nestLabel ? "items-end" : "items-center")}>
                          <div className="grid gap-1.5">
                            <span className="text-muted-foreground">{item.name}</span>
                          </div>
                          {<span className="font-mono font-medium tabular-nums text-foreground">{innerText}</span>}
                        </div>
                      </>
                    );
                  }}
                  indicator="dot"
                />
              }
            />
            <Legend
              payload={[
                { value: selectedMetric, type: "line", color: "#FF6B6B" },
                { value: "Competition Day", type: "line", color: "#888", payload: { strokeDasharray: "3 3" } },
                { value: "Best Competition Day", type: "line", color: "#4CAF50", payload: { strokeDasharray: "5 5" } },
              ]}
              wrapperStyle={{ fontSize: "14px" }}
              iconSize={20}
              verticalAlign="bottom"
              height={36}
            />
            {athlete && <Line key={`${selectedMetric}`} connectNulls dataKey={`${selectedMetric}`} type="natural" stroke={lineColors[0]} strokeWidth={2} dot={false} />}
            {filteredResults.map((result, index) => {
              console.log({ filteredResults });
              console.log({ result });
              const isFastestTime = Number(result["Time: Athlete"]) === Math.min(...filteredResults.map((r) => Number(r["Time: Athlete"])));
              console.log({ isFastestTime });

              return (
                <ReferenceLine
                  key={`result-${index}`}
                  x={result.Date}
                  stroke={isFastestTime ? "#4CAF50" : "#888"}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{
                    value: `${result.Event} (${result["Time: Athlete"]})`,
                    position: "top",
                    fill: isFastestTime ? "#4CAF50" : "#888",
                    fontSize: 10,
                    offset: 10,
                  }}
                />
              );
            })}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
