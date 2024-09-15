"use client"

import { useState, useMemo, useEffect } from "react";
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useResultsDataByAthlete } from "@/data/results";

export function ResultGraph({ athlete }: { athlete: string | null }) {
  const { data: athleteResults } = useResultsDataByAthlete(athlete);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const dates = useMemo(() => {
    if (!athleteResults) return [];
    return [...new Set(athleteResults.map(result => result.Date))];
  }, [athleteResults]);

  useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0]);
    }
  }, [dates, selectedDate]);

  const chartData = useMemo(() => {
    if (!athleteResults || !selectedDate) return [];
    const selectedResult = athleteResults.find(result => result.Date === selectedDate);
    if (!selectedResult) return [];

    return [
      {
        name: "Heat 1",
        best: parseFloat(selectedResult["Time: Best Heat 1"]) || 0,
        timeDifference: parseFloat(selectedResult["Time Delta: Heat 1"]) || 0,
      },
      {
        name: "Heat 2",
        best: parseFloat(selectedResult["Time: Best Heat 2"]) || 0,
        timeDifference: parseFloat(selectedResult["Time Delta: Heat 2"]) || 0,
      },
    ];
  }, [athleteResults, selectedDate]);

  const chartConfig = {
    best: {
      label: "Best Time",
      color: "hsl(var(--chart-1))",
    },
    timeDifference: {
      label: "Time Difference",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Competition Heat Times vs. Best Times</CardTitle>
          <div className="flex items-center gap-2">
            <label htmlFor="competition-date-select" className="text-sm font-medium">Competition Dates:</label>
            <Select value={selectedDate || ""} onValueChange={setSelectedDate}>
              <SelectTrigger id="competition-date-select" className="w-[180px]">
                <SelectValue placeholder="Select competition date" />
              </SelectTrigger>
              <SelectContent>
                {dates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardDescription>
        <div className="flex items-center gap-2 font-medium leading-none">
              Time difference: {chartData[0]?.timeDifference.toFixed(2)}s in Heat 1, {chartData[1]?.timeDifference.toFixed(2)}s in Heat 2.
            </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            width={600}
            height={300}
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} domain={["dataMin - 5", "dataMax + 5"]} />
            <ChartTooltip
              content={<ChartTooltipContent />}
            />
            <Legend />
            <Area type="monotone" dataKey="best" stackId="1" stroke={chartConfig.best.color} fill={chartConfig.best.color} />
            <Area type="monotone" dataKey="timeDifference" stackId="1" stroke={chartConfig.timeDifference.color} fill={chartConfig.timeDifference.color} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
