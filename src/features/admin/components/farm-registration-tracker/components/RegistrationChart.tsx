import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Sprout,
  DollarSign,
  Map,
} from "lucide-react";
import type { ChartType, TimePeriod } from "../constants";
import { getChartData, formatCurrency, formatNumber } from "../utils";

interface RegistrationChartProps {
  chartType: ChartType;
  timePeriod: TimePeriod;
  className?: string;
}

const getChartConfig = (chartType: ChartType) => {
  switch (chartType) {
    case "registrations":
      return {
        title: "Farm Registrations",
        description: "New farms registered over time",
        color: "#22c55e",
        icon: Sprout,
        formatValue: (value: number) => formatNumber(value),
        suffix: "farms",
      };
    case "revenue":
      return {
        title: "Registration Revenue",
        description: "Monthly revenue from new registrations",
        color: "#3b82f6",
        icon: DollarSign,
        formatValue: (value: number) => formatCurrency(value),
        suffix: "",
      };
    case "farmSize":
      return {
        title: "Average Farm Size",
        description: "Average size of registered farms",
        color: "#a855f7",
        icon: Map,
        formatValue: (value: number) => `${value} ha`,
        suffix: "hectares",
      };
  }
};

const CustomTooltip = ({ active, payload, label, chartType }: any) => {
  if (active && payload && payload.length) {
    const config = getChartConfig(chartType);
    const value = payload[0].value;

    return (
      <div className="bg-white p-2 sm:p-3 border border-gray-200 rounded-lg shadow-lg max-w-[200px]">
        <p className="text-xs sm:text-sm text-gray-600 mb-1">{label}</p>
        <p className="text-xs sm:text-sm font-semibold text-gray-900">
          {config.formatValue(value)}
        </p>
      </div>
    );
  }
  return null;
};

const RegistrationChart: React.FC<RegistrationChartProps> = ({
  chartType,
  timePeriod,
  className = "",
}) => {
  const chartData = getChartData(chartType, timePeriod);
  const config = getChartConfig(chartType);
  const IconComponent = config.icon;

  // Calculate trend
  const currentValue = chartData[chartData.length - 1]?.value || 0;
  const previousValue = chartData[chartData.length - 2]?.value || 0;
  const trend = currentValue - previousValue;
  const trendPercentage =
    previousValue > 0 ? ((trend / previousValue) * 100).toFixed(1) : "0";
  const isPositiveTrend = trend >= 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gray-50 flex-shrink-0">
                <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-semibold truncate">
                  {config.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  {config.description}
                </p>
              </div>
            </div>
            <Badge
              variant={isPositiveTrend ? "default" : "destructive"}
              className="flex items-center gap-1 text-xs flex-shrink-0"
            >
              {isPositiveTrend ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trendPercentage}%
            </Badge>
          </div>

          <div className="mb-3 sm:mb-4">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              {config.formatValue(currentValue)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isPositiveTrend ? "+" : ""}
              {config.formatValue(trend)} vs previous period
            </p>
          </div>

          <div className="h-[150px] sm:h-[200px] lg:h-[250px] w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 5,
                  left: 5,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient
                    id={`gradient-${chartType}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={config.color}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={config.color}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="formattedDate"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  interval="preserveStartEnd"
                  minTickGap={20}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  width={35}
                  tickFormatter={(value) => {
                    if (chartType === "revenue") {
                      return `₱${(value / 1000).toFixed(0)}k`;
                    }
                    return formatNumber(value);
                  }}
                />
                <Tooltip content={<CustomTooltip chartType={chartType} />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={config.color}
                  strokeWidth={2}
                  fill={`url(#gradient-${chartType})`}
                  dot={{ fill: config.color, strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 4, stroke: config.color, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="min-w-0">
                <span className="text-muted-foreground">Peak:</span>
                <div className="font-medium truncate">
                  {config.formatValue(
                    Math.max(...chartData.map((d) => d.value))
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-muted-foreground">Average:</span>
                <div className="font-medium truncate">
                  {config.formatValue(
                    chartData.reduce((sum, d) => sum + d.value, 0) /
                      chartData.length
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationChart;
