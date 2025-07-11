import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { AlertTriangle, Shield, ShieldAlert } from "lucide-react";
import type { PerformanceMetric } from "../constants";
import {
  prepareRadarData,
  getPerformanceRating,
  getPerformanceColor,
  formatPerformanceScore,
} from "../utils";
import { capitalizeFirstLetter } from "@/lib/helpers/string";

interface RadarChartProps {
  metrics: PerformanceMetric[];
  compareProducts?: string[];
}

const RadarChart = ({ metrics }: RadarChartProps) => {
  const radarData = prepareRadarData(metrics);

  // Calculate overall performance score
  const overallScore =
    radarData.length > 0
      ? radarData.reduce((sum, item) => sum + item.value, 0) / radarData.length
      : 0;

  const performanceRating = getPerformanceRating(overallScore);
  const performanceColor = getPerformanceColor(performanceRating);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.metric}</p>
          <p className="text-sm text-muted-foreground">
            Score: {data.value.toFixed(1)}/100
          </p>
        </div>
      );
    }
    return null;
  };

  const getMetricIcon = (metric: string) => {
    switch (metric.toLowerCase()) {
      case "fcr":
      case "feed conversion ratio":
        return <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0" />;
      case "weight gain":
      case "weight":
        return <Shield className="h-4 w-4 text-green-600 shrink-0" />;
      case "mortality":
      case "verification":
      case "management":
      default:
        return <ShieldAlert className="h-4 w-4 text-blue-600 shrink-0" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Performance Breakdown */}
      {radarData.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {/* First row - 3 columns */}
            {radarData.slice(0, 3).map((item, index) => (
              <div key={index} className="p-3 rounded-lg bg-accent">
                <div className="text-muted-foreground text-sm flex items-center gap-2">
                  {getMetricIcon(item.metric)}
                  {item.metric}
                </div>
                <div className="text-2xl font-semibold font-display">
                  {item.value.toFixed(1)}
                </div>
                <div className="w-full bg-muted-foreground rounded-full h-2 mt-2">
                  <div
                    className="h-2 rounded-full transition-all bg-blue-600"
                    style={{
                      width: `${item.value}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Second row - 2 columns */}
          {radarData.length > 3 && (
            <div className="grid grid-cols-2 gap-2">
              {radarData.slice(3, 5).map((item, index) => (
                <div key={index + 3} className="p-3 rounded-lg bg-accent">
                  <div className="text-muted-foreground text-sm flex items-center gap-2">
                    {getMetricIcon(item.metric)}
                    {item.metric}
                  </div>
                  <div className="text-2xl font-semibold font-display">
                    {item.value.toFixed(1)}
                  </div>
                  <div className="w-full bg-muted-foreground rounded-full h-2 mt-2">
                    <div
                      className="h-2 rounded-full transition-all bg-blue-600"
                      style={{
                        width: `${item.value}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Performance Summary */}
      <div
        className="-mx-6 px-6 py-3 flex items-center justify-between bg-blue-100 border-t border-b border-blue-700"
        style={{ color: performanceColor }}
      >
        <p className="font-semibold font-display">
          {capitalizeFirstLetter(performanceRating)} Performance
        </p>
        <div className="font-semibold font-display">
          {formatPerformanceScore(overallScore)}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="h-[200px] sm:h-[250px] lg:h-[300px]">
        {radarData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fontSize: 12 }}
                className="text-xs"
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                tickCount={5}
              />
              <Radar
                name="Performance"
                dataKey="value"
                stroke={performanceColor}
                fill={performanceColor}
                fillOpacity={0.3}
                strokeWidth={2}
                dot={{ r: 4, fill: performanceColor }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </RechartsRadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <div className="text-sm">No performance data available</div>
              <div className="text-xs">Adjust your filters to see results</div>
            </div>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      {radarData.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-display font-medium">Performance Insights</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Best performing metric */}
            {(() => {
              const bestMetric = radarData.reduce((best, current) =>
                current.value > best.value ? current : best
              );
              return (
                <div className="flex items-center gap-2 p-2 rounded-md bg-green-100 border border-green-700">
                  <ShieldAlert className="size-4 text-green-600 shrink-0" />
                  <span className="text-sm text-muted-foreground font-semibold">
                    <span className="text-black">{bestMetric.metric}</span> is
                    performing excellently ({bestMetric.value.toFixed(1)}/100)
                  </span>
                </div>
              );
            })()}

            {/* Worst performing metric */}
            {(() => {
              const worstMetric = radarData.reduce((worst, current) =>
                current.value < worst.value ? current : worst
              );
              return (
                <div className="flex items-center font-semibold gap-2 p-2 rounded-md bg-red-100 border border-red-700">
                  <ShieldAlert className="size-4 text-red-600 shrink-0" />
                  <span className="text-sm text-muted-foreground font-semibold">
                    <span className="text-black">{worstMetric.metric}</span>{" "}
                    needs improvement ({worstMetric.value.toFixed(1)}/100)
                  </span>
                </div>
              );
            })()}

            {/* Overall assessment */}
            <div className="col-span-2 sm:col-span-1 flex items-center gap-2 p-2 rounded-md bg-blue-100 border border-blue-700">
              <ShieldAlert className="size-4 text-blue-600 shrink-0" />
              <span className="text-sm text-muted-foreground font-semibold">
                Overall performance is{" "}
                <span className="text-black">{performanceRating}</span> with{" "}
                {metrics.length} field observations
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RadarChart;
