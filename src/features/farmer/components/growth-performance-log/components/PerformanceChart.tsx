import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
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
import { type AnimalType } from "../constants";

interface PerformanceChartProps {
  chartData: any[];
  animalType: AnimalType;
  onViewDetails: () => void;
}

export const PerformanceChart = ({
  chartData,
  animalType,
  onViewDetails,
}: PerformanceChartProps) => {
  return (
    <div className="">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium font-display text-sm">Performance Trend</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetails}
          className="text-xs"
        >
          <BarChart3 className="size-3" />
          View Details
        </Button>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="formattedDate"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              width={60}
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
                    <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                      <p className="text-sm font-medium text-foreground mb-2">
                        {label}
                      </p>
                      {payload.map((entry, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center">
                            <div
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-xs text-muted-foreground">
                              {entry.name}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-foreground">
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
            <Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={{ r: 4, fill: "var(--chart-2)" }}
              name={
                animalType === "broiler" ? "Actual Weight" : "Actual Production"
              }
            />
            <Line
              type="monotone"
              dataKey="expected"
              stroke="var(--chart-1)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3, fill: "var(--chart-1)" }}
              name={
                animalType === "broiler" ? "Target Weight" : "Target Production"
              }
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
