import { useResultsData, useWellnessLoadData, WellnessLoadData } from "@/lib/data";
import { WellnessBlock } from "./wellness-block";

interface WellnessBlocksProps {
  athlete: string | null;
}

export function WellnessBlocks({ athlete }: WellnessBlocksProps) {
  const results = useResultsData();
  const wellnessData = useWellnessLoadData();

  const athleteWellnessData = wellnessData.filter((entry) => entry.Athlete === athlete);

  const athleteResults = results.filter((result) => result.Athlete === athlete);
  // Find the entry with the minimum value of Time: Athlete
  const bestResult = athleteResults.reduce((min, result) => {
    const currentTime = parseFloat(result["Time: Athlete"]);
    const minTime = parseFloat(min["Time: Athlete"]);
    return currentTime < minTime ? result : min;
  }, athleteResults?.[0] ?? null);

  const bestResultDate = bestResult ? new Date(bestResult.Date) : new Date();
  const tenDaysBefore = bestResultDate ? new Date(bestResultDate) : new Date();
  tenDaysBefore.setDate(bestResultDate.getDate() - 10);

  console.log({athleteResults})
  console.log({bestResultDate})
  console.log({tenDaysBefore})
  console.log({wellnessData})

  // Filter wellness data for the 10 days leading up to the best result
  const tenDaysWellnessData = athleteWellnessData.filter((entry) => {
    const entryDate = new Date(entry.Date);
    return entryDate >= tenDaysBefore && entryDate <= bestResultDate;
  });

  const prepareChartData = (metric: keyof WellnessLoadData) => {
    return tenDaysWellnessData
      .map((entry) => ({
        date: entry.Date,
        value: +(entry?.[metric] ?? 0),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const restingHrChartData = prepareChartData("Resting HR");

  console.log({tenDaysWellnessData})
  console.log({restingHrChartData})

  console.log("Best result:", bestResult);
  console.log("10 days before best result:", tenDaysBefore);

  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold text-md text-center">Wellness Metrics 10-days Before Best Competition</p>
      <WellnessBlock
        title="Resting HR"
        description="You're burning an average of 754 calories per day. Good job!"
        chartData={restingHrChartData}
        currentValue={754}
        unit="kcal/day"
      />
      <WellnessBlock
        title="Motivation"
        description="You're burning an average of 754 calories per day. Good job!"
        chartData={[
          { date: "2024-01-01", value: 600 },
          { date: "2024-01-02", value: 450 },
          { date: "2024-01-03", value: 748 },
          { date: "2024-01-04", value: 756 },
          { date: "2024-01-05", value: 760 },
          { date: "2024-01-06", value: 752 },
          { date: "2024-01-07", value: 758 },
        ]}
        currentValue={754}
        unit="kcal/day"
      />
      <WellnessBlock
        title="Soreness"
        description="You're burning an average of 754 calories per day. Good job!"
        chartData={[
          { date: "2024-01-01", value: 600 },
          { date: "2024-01-02", value: 450 },
          { date: "2024-01-03", value: 748 },
          { date: "2024-01-04", value: 756 },
          { date: "2024-01-05", value: 760 },
          { date: "2024-01-06", value: 752 },
          { date: "2024-01-07", value: 758 },
        ]}
        currentValue={754}
        unit="kcal/day"
      />
      <WellnessBlock
        title="Fatigue"
        description="You're burning an average of 754 calories per day. Good job!"
        chartData={[
          { date: "2024-01-01", value: 600 },
          { date: "2024-01-02", value: 450 },
          { date: "2024-01-03", value: 748 },
          { date: "2024-01-04", value: 756 },
          { date: "2024-01-05", value: 760 },
          { date: "2024-01-06", value: 752 },
          { date: "2024-01-07", value: 758 },
        ]}
        currentValue={754}
        unit="kcal/day"
      />
      <WellnessBlock
        title="Stress"
        description="You're burning an average of 754 calories per day. Good job!"
        chartData={[
          { date: "2024-01-01", value: 600 },
          { date: "2024-01-02", value: 450 },
          { date: "2024-01-03", value: 748 },
          { date: "2024-01-04", value: 756 },
          { date: "2024-01-05", value: 760 },
          { date: "2024-01-06", value: 752 },
          { date: "2024-01-07", value: 758 },
        ]}
        currentValue={754}
        unit="kcal/day"
      />
      <WellnessBlock
        title="Travel Hours"
        description="You're burning an average of 754 calories per day. Good job!"
        chartData={[
          { date: "2024-01-01", value: 600 },
          { date: "2024-01-02", value: 450 },
          { date: "2024-01-03", value: 748 },
          { date: "2024-01-04", value: 756 },
          { date: "2024-01-05", value: 760 },
          { date: "2024-01-06", value: 752 },
          { date: "2024-01-07", value: 758 },
        ]}
        currentValue={754}
        unit="kcal/day"
      />
    </div>
  );
}
