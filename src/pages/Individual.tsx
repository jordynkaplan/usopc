import { HrChart } from "@/components/hr-chart";
import { useResultsData } from "@/lib/data";

export function Individual() {
  const data = useResultsData();
  console.log({ data: data });
  return (
    <>
      Individual
      <HrChart />
      {/* <DemoChart /> */}
    </>
  );
}
