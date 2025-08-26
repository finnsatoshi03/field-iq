import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Circle, Egg, Files, Skull, Weight } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type AnimalType, type PerformanceRecord } from "../constants";
import {
  formatEggProduction,
  formatMortalityRate,
  formatWeight,
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

        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 border rounded-md">
              <div className="flex items-center justify-center gap-1">
                <Files className="size-4 text-blue-600" strokeWidth={3} />
                <p className="text-xl font-display font-medium">
                  {stats.totalRecords}
                </p>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Total Records
              </p>
            </div>
            <div className="text-center p-2 border rounded-md">
              <div className="flex items-center justify-center gap-1">
                {animalType === "broiler" ? (
                  <Weight className="size-4 text-gray-600" strokeWidth={3} />
                ) : (
                  <Egg className="size-4 text-gray-600" strokeWidth={3} />
                )}
                <p className="text-xl font-display font-medium">
                  {animalType === "broiler"
                    ? formatWeight(stats.averageWeight)
                    : formatEggProduction(stats.averageEggProduction)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Avg {animalType === "broiler" ? "Weight" : "Production"}
              </p>
            </div>
            <div className="text-center p-2 border rounded-md">
              <div className="flex items-center justify-center gap-1">
                <Skull className="size-4 text-gray-600" strokeWidth={3} />
                <p className="text-xl font-display font-medium">
                  {formatMortalityRate(stats.mortalityRate)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Mortality Rate
              </p>
            </div>
          </div>

          {/* Detailed Performance Chart */}
          <div className="">
            <h4 className="font-medium mb-2 font-display">Performance Chart</h4>
            <div className="h-[200px] w-full">
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
                    stroke="var(--chart-2)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "var(--chart-2)" }}
                    activeDot={{
                      r: 7,
                      stroke: "var(--chart-2)",
                      strokeWidth: 2,
                    }}
                    name={
                      animalType === "broiler"
                        ? "Actual Weight"
                        : "Actual Production"
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="expected"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    dot={{ r: 4, fill: "var(--chart-1)" }}
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
            <h4 className="font-medium mb-2 font-display">Recent Records</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {records
                .slice(-10)
                .reverse()
                .map((record) => (
                  <div
                    key={record.id}
                    className="flex items-start justify-between border rounded-md p-2"
                  >
                    <div>
                      <p className="font-medium font-display">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground font-medium">
                          Day {record.ageInDays}
                        </p>
                        <Circle className="size-1.5 fill-muted-foreground" />
                        <p className="text-sm text-muted-foreground font-medium">
                          {animalType === "broiler"
                            ? `Weight: ${record.measurements.weight ? formatWeight(record.measurements.weight) : "N/A"}`
                            : `Production: ${record.measurements.eggProduction ? formatEggProduction(record.measurements.eggProduction) : "N/A"}`}
                        </p>
                      </div>
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
