import { useResultsData } from "@/lib/data";

export function Individual() {
  const data = useResultsData();
  console.log({ data: data });
  return <>Individual</>;
}
