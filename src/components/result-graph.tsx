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
} from "recharts";
import { useResultsDataByAthlete} from "@/data/results";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from "./ui/chart";
import { lineColors } from "./wellness-chart";

const metrics = [
  "Heat Times",
  "Split Times",
];

export function ResultGraph({ athlete }: { athlete: string | null }) {
  const [selectedMetric, setSelectedMetric] = useState(metrics[0]);
  const { data: athleteResults } = useResultsDataByAthlete(athlete);

  const chartData = useMemo(() => {
    if (!athleteResults) return [];
    return athleteResults.map((result) => ({
      date: new Date(result.Date).toLocaleDateString(),
      "Time: Heat 1": parseFloat(result["Time: Athlete Heat 1"] as string) || null,
      "Time: Heat 2": parseFloat(result["Time: Athlete Heat 2"] as string) || null,
      "Split Time: Heat 1": parseFloat(result["Split Time: Athlete Heat 1"] as string) || null,
      "Split Time: Heat 2": parseFloat(result["Split Time: Athlete Heat 2"] as string) || null,
    }));
  }, [athleteResults]);

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
          <CardTitle>Competition Heat and Split Times</CardTitle>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {metrics.map((metric) => (
                <SelectItem key={metric} value={metric}>
                  {metric}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart width={600} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            {selectedMetric === "Heat Times" ? (
              <>
                <Line type="monotone" dataKey="Time: Heat 1" stroke={lineColors[0]} strokeWidth={2}/>
                <Line type="monotone" dataKey="Time: Heat 2" stroke={lineColors[1]} strokeWidth={2}/>
              </>
            ) : (
              <>
                <Line type="monotone" dataKey="Split Time: Heat 1" stroke={lineColors[0]} strokeWidth={2}/>
                <Line type="monotone" dataKey="Split Time: Heat 2" stroke={lineColors[1]} strokeWidth={2}/>
              </>
            )}
            {chartData.length > 0 && (
              <>
                {/* Heat 1 Reference Lines */}
                <ReferenceLine
                  x={chartData.find(data => data["Time: Heat 1"] === Math.min(...chartData.filter(d => d["Time: Heat 1"] != null).map(d => Number(d["Time: Heat 1"]))))?.date}
                  stroke="green"
                  strokeDasharray="5 5"
                />
                <ReferenceLine
                  x={chartData.find(data => data["Time: Heat 1"] === Math.max(...chartData.filter(d => d["Time: Heat 1"] != null).map(d => Number(d["Time: Heat 1"]))))?.date}
                  stroke="red"
                  strokeDasharray="5 5"
                />

                {/* Heat 2 Reference Lines */}
                <ReferenceLine
                  x={chartData.find(data => data["Time: Heat 2"] === Math.min(...chartData.filter(d => d["Time: Heat 2"] != null).map(d => Number(d["Time: Heat 2"]))))?.date}
                  stroke="green"
                  strokeDasharray="5 5"
                />
                <ReferenceLine
                  x={chartData.find(data => data["Time: Heat 2"] === Math.max(...chartData.filter(d => d["Time: Heat 2"] != null).map(d => Number(d["Time: Heat 2"]))))?.date}
                  stroke="red"
                  strokeDasharray="5 5"
                />
              </>
            )}
            <Legend
              payload={
                selectedMetric === "Heat Times"
                  ? [
                      { value: 'Fastest Time: Heat 1', type: 'line', color: '#4CAF50', payload: { strokeDasharray: "5 5" } },
                      { value: 'Fastest Time: Heat 2', type: 'line', color: '#66BB6A', payload: { strokeDasharray: "5 5" } },
                      { value: 'Slowest Time: Heat 1', type: 'line', color: '#D32F2F', payload: { strokeDasharray: "5 5" } },
                      { value: 'Slowest Time: Heat 2', type: 'line', color: '#E57373', payload: { strokeDasharray: "5 5" } },
                      { value: 'Time: Heat 1', type: 'line', color: lineColors[0] },
                      { value: 'Time: Heat 2', type: 'line', color: lineColors[1] }
                    ]
                  : [
                      { value: 'Split Time: Heat 1', type: 'line', color: lineColors[0] },
                      { value: 'Split Time: Heat 2', type: 'line', color: lineColors[1] }
                    ]
              }
              wrapperStyle={{ fontSize: "14px" }}
              iconSize={20}
              verticalAlign="bottom"
              height={36}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
