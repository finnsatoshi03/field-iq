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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PerformanceMetric, ChartType } from "../constants";
import {
  prepareChartData,
  formatFcr,
  formatWeight,
  formatMortality,
} from "../utils";

interface PerformanceChartProps {
  metrics: PerformanceMetric[];
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

const PerformanceChart = ({
  metrics,
  chartType,
  onChartTypeChange,
}: PerformanceChartProps) => {
  const chartData = prepareChartData(metrics);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{new Date(label).toLocaleDateString()}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}:{" "}
              {entry.dataKey === "fcr"
                ? formatFcr(entry.value)
                : entry.dataKey === "weightGain"
                  ? formatWeight(entry.value)
                  : entry.dataKey === "mortality"
                    ? formatMortality(entry.value)
                    : entry.value.toFixed(1)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case "fcr":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-PH", {
                    month: "short",
                    day: "numeric",
                  })
                }
                fontSize={12}
              />
              <YAxis
                domain={["dataMin - 0.1", "dataMax + 0.1"]}
                tickFormatter={formatFcr}
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="fcr"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Feed Conversion Ratio"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "weightGain":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-PH", {
                    month: "short",
                    day: "numeric",
                  })
                }
                fontSize={12}
              />
              <YAxis tickFormatter={formatWeight} fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="weightGain"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Weight Gain (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "mortality":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-PH", {
                    month: "short",
                    day: "numeric",
                  })
                }
                fontSize={12}
              />
              <YAxis tickFormatter={formatMortality} fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="mortality"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Mortality (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "combined":
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-PH", {
                    month: "short",
                    day: "numeric",
                  })
                }
                fontSize={12}
              />
              <YAxis yAxisId="left" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="fcr"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="FCR"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="weightGain"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Weight Gain (kg)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="mortality"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Mortality (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="w-full sm:w-auto">
          <label className="text-xs font-medium text-gray-700 block mb-1">
            Chart Type
          </label>
          <Select value={chartType} onValueChange={onChartTypeChange}>
            <SelectTrigger className="w-full sm:w-[150px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fcr">Feed Conversion Ratio</SelectItem>
              <SelectItem value="weightGain">Weight Gain</SelectItem>
              <SelectItem value="mortality">Mortality Rate</SelectItem>
              <SelectItem value="combined">Combined View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[200px] sm:h-[250px] lg:h-[300px]">
        {chartData.length > 0 ? (
          renderChart()
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <div className="text-sm">No performance data available</div>
              <div className="text-xs">Adjust your filters to see results</div>
            </div>
          </div>
        )}
      </div>

      {/* Performance Indicators */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg bg-card border">
            <div className="text-lg font-bold text-red-600">
              {formatFcr(chartData[chartData.length - 1]?.fcr || 0)}
            </div>
            <div className="text-xs text-muted-foreground">Latest FCR</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-card border">
            <div className="text-lg font-bold text-green-600">
              {formatWeight(chartData[chartData.length - 1]?.weightGain || 0)}
            </div>
            <div className="text-xs text-muted-foreground">
              Latest Weight Gain
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-card border">
            <div className="text-lg font-bold text-yellow-600">
              {formatMortality(chartData[chartData.length - 1]?.mortality || 0)}
            </div>
            <div className="text-xs text-muted-foreground">
              Latest Mortality
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-card border">
            <div className="text-lg font-bold text-blue-600">
              {chartData.length}
            </div>
            <div className="text-xs text-muted-foreground">Data Points</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;
