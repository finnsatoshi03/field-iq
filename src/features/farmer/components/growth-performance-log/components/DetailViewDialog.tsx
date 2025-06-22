import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { type AnimalType, type PerformanceRecord } from "../constants";
import {
  formatWeight,
  formatEggProduction,
  formatMortalityRate,
} from "../utils";

interface DetailViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  animalType: AnimalType;
  stats: any;
  chartData: any[];
  records: PerformanceRecord[];
}

export const DetailViewDialog = ({
  isOpen,
  onOpenChange,
  animalType,
  stats,
  chartData,
  records,
}: DetailViewDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            Performance Analytics
          </DialogTitle>
          <DialogDescription>
            Detailed {animalType} performance analysis and trends
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <p className="text-lg font-bold text-blue-600">
                {stats.totalRecords}
              </p>
              <p className="text-xs text-muted-foreground">Total Records</p>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <p className="text-lg font-bold text-green-600">
                {animalType === "broiler"
                  ? formatWeight(stats.averageWeight)
                  : formatEggProduction(stats.averageEggProduction)}
              </p>
              <p className="text-xs text-muted-foreground">
                Avg {animalType === "broiler" ? "Weight" : "Production"}
              </p>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <p className="text-lg font-bold text-orange-600">
                {formatMortalityRate(stats.mortalityRate)}
              </p>
              <p className="text-xs text-muted-foreground">Mortality Rate</p>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <p className="text-lg font-bold text-purple-600">
                {stats.performanceIndex}
              </p>
              <p className="text-xs text-muted-foreground">Performance Index</p>
            </div>
          </div>

          <Separator />

          {/* Detailed Performance Chart */}
          <div className="bg-muted/10 rounded-lg p-4">
            <h4 className="font-semibold mb-4">Performance Chart</h4>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="formattedDate"
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                    tickFormatter={(value) => {
                      if (animalType === "broiler") {
                        return value < 1
                          ? `${Math.round(value * 1000)}g`
                          : `${value.toFixed(1)}kg`;
                      }
                      return `${value}`;
                    }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-card border border-border rounded-lg shadow-lg p-4">
                            <p className="text-sm font-medium text-foreground mb-3">
                              {label}
                            </p>
                            {payload.map((entry, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between gap-6 mb-2"
                              >
                                <div className="flex items-center">
                                  <div
                                    className="w-3 h-3 rounded-full mr-3"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    {entry.name}
                                  </span>
                                </div>
                                <span className="text-sm font-medium text-foreground">
                                  {animalType === "broiler"
                                    ? entry.value &&
                                      typeof entry.value === "number" &&
                                      entry.value < 1
                                      ? `${Math.round(entry.value * 1000)}g`
                                      : `${Number(entry.value).toFixed(2)}kg`
                                    : `${entry.value} eggs/day`}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "14px" }} iconType="line" />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#3b82f6" }}
                    activeDot={{ r: 7, stroke: "#3b82f6", strokeWidth: 2 }}
                    name={
                      animalType === "broiler"
                        ? "Actual Weight"
                        : "Actual Production"
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="expected"
                    stroke="#9ca3af"
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    dot={{ r: 4, fill: "#9ca3af" }}
                    name={
                      animalType === "broiler"
                        ? "Target Weight"
                        : "Target Production"
                    }
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Records */}
          <div>
            <h4 className="font-semibold mb-3">Recent Records</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {records
                .slice(-10)
                .reverse()
                .map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {new Date(record.date).toLocaleDateString()} (Day{" "}
                        {record.ageInDays})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {animalType === "broiler"
                          ? `Weight: ${record.measurements.weight ? formatWeight(record.measurements.weight) : "N/A"}`
                          : `Production: ${record.measurements.eggProduction ? formatEggProduction(record.measurements.eggProduction) : "N/A"}`}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      {record.notes && (
                        <p className="text-muted-foreground">{record.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
