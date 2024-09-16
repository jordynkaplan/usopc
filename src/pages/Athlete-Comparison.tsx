import { CustomHeatmap } from "@/components/custom-heatmap";
import ResultGraphComparison from "@/components/result-graph-comparison";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { WellnessGraphComparison } from "@/components/wellness-graph-comparions";
import { useWellnessDataByGender } from "@/data/wellness";
import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

export function AthleteComparison() {
    const [selectedGender, setSelectedGender] = useState<"m" | "f">("m");
    const { data: genderData } = useWellnessDataByGender(
        selectedGender || undefined
    );
    useEffect(() => {}, [genderData]);

    return (
        <div>
            <Card>
                <CardContent>
                    <div className="p-6 flex items-center gap-4">
                        <p className="font-semibold text-xl">Select Gender:</p>
                        <Select
                            value={selectedGender || undefined}
                            onValueChange={(value: "m" | "f") => {
                                setSelectedGender(value as "m" | "f");
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="m">Male</SelectItem>
                                <SelectItem value="f">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
            <div className="my-4 justify-center">
                <Routes>
                    <Route
                        path="wellness"
                        element={
                            <div className="gap-4">
                                <CustomHeatmap gender={selectedGender} />
                                <div className="my-4">
                                    <WellnessGraphComparison
                                        gender={selectedGender}
                                    />
                                </div>
                            </div>
                        }
                    />
                    <Route
                        path="results"
                        element={
                            <ResultGraphComparison gender={selectedGender} />
                        }
                    />
                </Routes>
            </div>
        </div>
    );
}
