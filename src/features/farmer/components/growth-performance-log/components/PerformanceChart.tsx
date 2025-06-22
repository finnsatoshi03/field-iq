import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
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
    <div className="bg-muted/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm">Performance Trend</h4>
        <Button variant="outline" size="sm" onClick={onViewDetails}>
          <BarChart3 className="h-4 w-4 mr-2" />
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
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, fill: "#3b82f6" }}
              name={
                animalType === "broiler" ? "Actual Weight" : "Actual Production"
              }
            />
            <Line
              type="monotone"
              dataKey="expected"
              stroke="#e5e7eb"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3, fill: "#e5e7eb" }}
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
