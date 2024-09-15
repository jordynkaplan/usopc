import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts";
import { useResultsDataByGender } from "@/data/results";
import { ChartContainer, ChartTooltipContent, ChartConfig } from "./ui/chart";
import { MultiSelect } from "./ui/multi-select";

export default function ResultGraphComparison({ gender }: { gender: string | undefined }) {
  const { data: resultsData } = useResultsDataByGender(gender);
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(null);
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);

  const competitions = useMemo(() => {
    if (!resultsData) return [];
    return [...new Set(resultsData.map(result => result.Date))];
  }, [resultsData]);

  const athletes = useMemo(() => {
    if (!resultsData) return [];
    return [...new Set(resultsData.map(result => result.Athlete))];
  }, [resultsData]);

  useEffect(() => {
    if (competitions.length > 0) {
      setSelectedCompetition(competitions[0]);
    }
  }, [competitions]);

  const athleteOptions = useMemo(() => {
    return athletes.map(athlete => ({
      label: athlete,
      value: athlete,
    }));
  }, [athletes]);

  const chartData = useMemo(() => {
    if (!resultsData || !selectedCompetition) return [];
    const competitionResults = resultsData.filter(result => result.Date === selectedCompetition);
    
    return [
      { 
        name: "Heat 1", 
        best: Math.min(...competitionResults.map(r => parseFloat(r["Time: Best Heat 1"]))),
        ...selectedAthletes.reduce<Record<string, number | null>>((acc, athlete) => {
          const athleteResult = competitionResults.find(r => r.Athlete === athlete);
          if (athleteResult) {
            acc[athlete] = parseFloat(athleteResult["Time: Athlete Heat 1"]) || null;
          }
          return acc;
        }, {}),
      },
      { 
        name: "Heat 2", 
        best: Math.min(...competitionResults.map(r => parseFloat(r["Time: Best Heat 2"]) || Infinity)),
        ...selectedAthletes.reduce<Record<string, number | null>>((acc, athlete) => {
          const athleteResult = competitionResults.find(r => r.Athlete === athlete);
          if (athleteResult) {
            acc[athlete] = parseFloat(athleteResult["Time: Athlete Heat 2"]) || null;
          }
          return acc;
        }, {}),
      },
      { 
        name: "Total", 
        best: Math.min(...competitionResults.map(r => parseFloat(r["Time: Best"]))),
        ...selectedAthletes.reduce<Record<string, number | null>>((acc, athlete) => {
          const athleteResult = competitionResults.find(r => r.Athlete === athlete);
          if (athleteResult) {
            acc[athlete] = parseFloat(athleteResult["Time: Athlete"]) || null;
          }
          return acc;
        }, {}),
      },
    ];
  }, [resultsData, selectedCompetition, selectedAthletes]);

  const chartConfig: { [key: string]: { label: string; color: string } } = {
    best: {
      label: "Best Time",
      color: "hsl(var(--chart-1))",
    },
    ...selectedAthletes.reduce((acc, athlete, index) => {
      acc[athlete] = {
        label: athlete,
        color: `hsl(var(--chart-${(index % 4) + 2}))`,
      };
      return acc;
    }, {} as { [key: string]: { label: string; color: string } }),
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Competition Results Comparison</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="competition-date-select" className="text-sm font-medium whitespace-nowrap">Competition Dates:</label>
              <Select value={selectedCompetition || ""} onValueChange={setSelectedCompetition}>
                <SelectTrigger id="competition-date-select" className="w-[180px]">
                  <SelectValue placeholder="Select competition" />
                </SelectTrigger>
                <SelectContent>
                  {competitions.map((date) => (
                    <SelectItem key={date} value={date}>
                      {date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <MultiSelect
              options={athleteOptions}
              onValueChange={setSelectedAthletes}
              defaultValue={selectedAthletes}
              placeholder="Select athletes"
            />
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
            <Legend />
            <Line type="monotone" dataKey="best" name="Best Time" stroke={chartConfig.best.color} strokeWidth={2} strokeDasharray="5 5" />
            {selectedAthletes.map((athlete, index) => (
              <Line
                key={athlete}
                type="monotone"
                dataKey={athlete}
                name={athlete}
                stroke={chartConfig[athlete].color}
                strokeWidth={2}
                connectNulls={true}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}