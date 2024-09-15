import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Label,
} from "recharts";
import { useResultsDataByAthlete } from "@/data/results";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from "./ui/chart";
import { lineColors } from "./wellness-chart";

export function ResultGraph({ athlete }: { athlete: string | null }) {
  const { data: athleteResults } = useResultsDataByAthlete(athlete);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const dates = useMemo(() => {
    if (!athleteResults) return [];
    return [...new Set(athleteResults.map(result => result.Date))];
  }, [athleteResults]);

  const chartData = useMemo(() => {
    if (!athleteResults || !selectedDate) return [];
    const selectedResult = athleteResults.find(result => result.Date === selectedDate);
    if (!selectedResult) return [];

    return [
      {
        name: "Heat 1",
        athlete: parseFloat(selectedResult["Time: Athlete Heat 1"]) || null,
        best: parseFloat(selectedResult["Time: Best Heat 1"]) || null,
        timeDelta: parseFloat(selectedResult["Time Delta: Heat 1"]) || null,
      },
      {
        name: "Heat 2",
        athlete: parseFloat(selectedResult["Time: Athlete Heat 2"]) || null,
        best: parseFloat(selectedResult["Time: Best Heat 2"]) || null,
        timeDelta: parseFloat(selectedResult["Time Delta: Heat 2"]) || null,
      },
      {
        name: "Total",
        athlete: parseFloat(selectedResult["Time: Athlete"]) || null,
        best: parseFloat(selectedResult["Time: Best"]) || null,
        timeDelta: parseFloat(selectedResult["Time Delta: Best"]) || null,
      },
    ];
  }, [athleteResults, selectedDate]);

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Competition Heat and Total Times vs. Best Times in Competition</CardTitle>
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
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart width={600} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend
              payload={[
                { value: 'Athlete Time', type: 'line', color: lineColors[0] },
                { value: 'Best Time', type: 'line', color: lineColors[1] },
                { value: 'Time Difference', type: 'line', color: '#4b90ad' }
              ]}
            />
            <Line type="monotone" dataKey="athlete" name="Athlete Time" stroke={lineColors[0]} strokeWidth={2} />
            <Line type="monotone" dataKey="best" name="Best Time" stroke={lineColors[1]} strokeWidth={2} />
            {chartData.map((entry, index) => (
              <ReferenceLine
                key={`time-delta-${index}`}
                x={entry.name}
                stroke="#4b90ad"
                strokeWidth={3}
                strokeDasharray="5 5"
              >
                <Label
                  value={entry.timeDelta !== null ? `+${entry.timeDelta.toFixed(2)}s` : ''}
                  position="insideTopRight"
                  fill="#4b90ad"
                  fontSize={12}
                  fontWeight="bold"
                  offset={25}
                />
              </ReferenceLine>
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
