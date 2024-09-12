import { useResultsData, useWellnessLoadData } from "@/lib/data";

export function Heatmap() {

    const results = useResultsData();
    const wellness = useWellnessLoadData();

    return <div>Heatmap</div>

}
