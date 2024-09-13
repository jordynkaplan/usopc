import { WellnessBlock } from "./wellness-block";

export function WellnessBlocks() {
  return (
    <div className="flex flex-col gap-2">
        <p className="font-semibold text-md text-center">Wellness Metrics 10-days Before Best Competition</p>
      <WellnessBlock
        title="Resting HR"
        description="You're burning an average of 754 calories per day. Good job!"
        chartData={[
          { date: "2024-01-01", value: 600 },
          { date: "2024-01-02", value: 450 },
          { date: "2024-01-03", value: 748 },
          { date: "2024-01-04", value: 756 },
          { date: "2024-01-05", value: 760 },
          { date: "2024-01-06", value: 752 },
          { date: "2024-01-07", value: 758 }
        ]}
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
          { date: "2024-01-07", value: 758 }
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
          { date: "2024-01-07", value: 758 }
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
          { date: "2024-01-07", value: 758 }
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
          { date: "2024-01-07", value: 758 }
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
          { date: "2024-01-07", value: 758 }
        ]}
        currentValue={754}
        unit="kcal/day"
      />
    </div>
    
  );
}
