import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";


export function AthleteComparison() {

    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    

  return <div>
    <Card>
        <CardContent>
            <div className="p-6 flex items-center gap-4">
                <p className="font-semibold text-xl">
                    Select Gender:
                </p>
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
  </div>;
}