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
import { Badge } from "@/components/ui/badge";
import type { PerformanceMetric } from "../constants";
import {
  prepareRadarData,
  getPerformanceRating,
  getPerformanceColor,
  formatPerformanceScore,
} from "../utils";

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

  return (
    <div className="space-y-4">
      {/* Performance Summary */}
      <div className="text-center space-y-2">
        <div className="text-2xl font-bold" style={{ color: performanceColor }}>
          {formatPerformanceScore(overallScore)}
        </div>
        <Badge
          variant="outline"
          className="text-sm"
          style={{
            borderColor: performanceColor,
            color: performanceColor,
          }}
        >
          {performanceRating.toUpperCase()} Performance
        </Badge>
        <div className="text-xs text-muted-foreground">
          Overall Performance Score
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

      {/* Performance Breakdown */}
      {radarData.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Performance Breakdown</h4>
          <div className="space-y-2">
            {radarData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded bg-muted/10"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: getPerformanceColor(
                        getPerformanceRating(item.value)
                      ),
                    }}
                  />
                  <span className="text-sm font-medium">{item.metric}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{item.value.toFixed(1)}</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor: getPerformanceColor(
                          getPerformanceRating(item.value)
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Insights */}
      {radarData.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Performance Insights</h4>
          <div className="space-y-2">
            {/* Best performing metric */}
            {(() => {
              const bestMetric = radarData.reduce((best, current) =>
                current.value > best.value ? current : best
              );
              return (
                <div className="flex items-center gap-2 p-2 rounded bg-green-50 border border-green-200">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">
                    <strong>{bestMetric.metric}</strong> is performing
                    excellently ({bestMetric.value.toFixed(1)}/100)
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
                <div className="flex items-center gap-2 p-2 rounded bg-red-50 border border-red-200">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm">
                    <strong>{worstMetric.metric}</strong> needs improvement (
                    {worstMetric.value.toFixed(1)}/100)
                  </span>
                </div>
              );
            })()}

            {/* Overall assessment */}
            <div className="flex items-center gap-2 p-2 rounded bg-blue-50 border border-blue-200">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm">
                Overall performance is <strong>{performanceRating}</strong> with{" "}
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
