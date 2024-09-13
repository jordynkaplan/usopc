import { Card, CardContent } from "@/components/ui/card";

export function ResultsCards() {
  return (
    <div>
      <Card className="my-2">
        <CardContent>
          <div className="p-6 flex gap-2">
            <div className="flex-1 flex justify-between gap-2">
              <Card className="flex-1">
                <CardContent>
                  <p>Total Competition #</p>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent>
                  <p>Best Result</p>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent>
                  <p>Highest Rank</p>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent>
                  <p>Average Rank</p>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent>
                  <p>Best Split 1</p>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent>
                  <p>Best Split 2</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
