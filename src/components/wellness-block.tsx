import { Bar, BarChart, Rectangle, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ChartContainer } from "./ui/chart";

interface ChartData {
  date: string;
  value: number;
}

interface WellnessBlockProps {
  title: string;
  description: string;
  chartData: ChartData[];
  currentValue: number;
  unit: string;
}

export function WellnessBlock({
  title,
  description,
  chartData,
  currentValue,
  unit,
}: WellnessBlockProps) {
  return (
    <Card className="">
      <CardHeader className="p-4 pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
        <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
          {currentValue}
          <span className="text-sm font-normal text-muted-foreground">
            {unit}
          </span>
        </div>
        <ChartContainer
          config={{
            calories: {
              label: "Calories",
              color: "#a32135",
            },
          }}
          className="ml-auto w-[64px]"
        >
          <BarChart
            accessibilityLayer
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            data={chartData}
          >
            <Bar
              dataKey="value"
              fill="#a32135"
              radius={2}
              fillOpacity={0.6}
              activeIndex={6}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              hide
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
