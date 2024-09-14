import { CustomHeatmap } from "@/components/custom-heatmap";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WellnessGraphComparison } from "@/components/wellness-graph-comparions";
import { useWellnessDataByGender } from "@/data/wellness";
import { useState, useEffect } from "react";

export function AthleteComparison() {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
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
              onValueChange={(value: string) => {
                setSelectedGender(value);
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
      <div className="my-2 justify-center">
        <Tabs defaultValue="wellness">
          <div className="flex items-center">
            <TabsList className="w-full">
              <TabsTrigger
                className="grow data-[state=active]:bg-card-foreground data-[state=active]:text-background"
                value="wellness"
              >
                Wellness Analysis
              </TabsTrigger>
              <TabsTrigger
                className="grow data-[state=active]:bg-card-foreground data-[state=active]:text-background"
                value="results"
              >
                Results Analysis
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="wellness">
            <div className="gap-4">
            <CustomHeatmap gender={selectedGender} />
            <WellnessGraphComparison gender={selectedGender} />
            </div>
          </TabsContent>
          <TabsContent value="results"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
