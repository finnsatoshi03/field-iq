import ExpandableCard from "@/components/ui/expandable-card";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { Loader2, TrendingUp } from "lucide-react";
import React from "react";
import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomLabel } from "./components";
import { useMonthlySales } from "./hooks";
import {
  calculateAverageVolumeInfluenced,
  calculateTotalClosedSales,
  calculateTotalVolumeInfluenced,
} from "./utils";

interface MonthlySalesChartProps {
  userId: number;
}

const MonthlySalesChart: React.FC<MonthlySalesChartProps> = ({ userId }) => {
  const isMobile = useIsMobile();

  const {
    data: salesData,
    isLoading,
    error,
    refetch,
  } = useMonthlySales(userId);

  // Show loading state if no data
  if (isLoading) {
    return (
      <ExpandableCard
        title="Monthly Sales Performance"
        summary={
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        }
        className="sm:h-fit"
      >
        <div className="h-72 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading sales data...</p>
          </div>
        </div>
      </ExpandableCard>
    );
  }

  // Show error state
  if (error) {
    return (
      <ExpandableCard
        title="Monthly Sales Performance"
        summary={
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Error loading data</span>
          </div>
        }
        className="sm:h-fit"
      >
        <div className="h-72 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-sm mb-2">
              Failed to load sales data: {error.message}
            </p>
            <button
              onClick={() => refetch()}
              className="text-xs text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </ExpandableCard>
    );
  }

  // Extract data from API response
  const monthlySalesData = salesData?.data?.monthly_sales || [];
  const averageSales = salesData?.data?.average_sales || 0;

  // Calculate metrics
  const totalVolumeInfluenced =
    calculateTotalVolumeInfluenced(monthlySalesData);
  const totalClosedSales = calculateTotalClosedSales(monthlySalesData);
  const avgVolumeInfluenced =
    calculateAverageVolumeInfluenced(monthlySalesData);
  const avgClosedSales = averageSales; // Use API provided average

  // Show empty state if no data
  if (!monthlySalesData || monthlySalesData.length === 0) {
    return (
      <ExpandableCard
        title="Monthly Sales Performance"
        summary={
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">No data available</span>
          </div>
        }
        className="sm:h-fit"
      >
        <div className="h-72 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-display font-medium text-foreground mb-2">
              No sales data yet
            </h3>
            <p className="text-sm">
              Monthly sales data will appear here once you have sales
              activities.
            </p>
          </div>
        </div>
      </ExpandableCard>
    );
  }

  // Summary content - only the key numbers
  const summaryContent = (
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-chart-1" />
            <span className="text-xs font-semibold text-muted-foreground font-sans">
              Volume Influenced
            </span>
          </div>
          <span className="text-2xl font-bold text-foreground font-sans">
            ₱{totalVolumeInfluenced.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-chart-2" />
            <span className="text-xs font-semibold text-muted-foreground font-sans">
              Closed Sales
            </span>
          </div>
          <span className="text-2xl font-bold text-foreground font-sans">
            ₱{totalClosedSales.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );

  // Full chart content
  const chartContent = (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={monthlySalesData}
          margin={{
            top: 20,
            right: 10,
            left: 10,
            bottom: 10,
          }}
          barGap={8}
        >
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 11,
              fill: "var(--muted-foreground)",
              fontFamily: "var(--font-sans)",
            }}
            dy={8}
          />
          <YAxis axisLine={false} tickLine={false} tick={false} width={0} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card border border-border rounded-lg shadow-lg p-3 min-w-48">
                    <p className="text-sm font-medium text-foreground mb-3 font-display">
                      {label}
                    </p>
                    <div className="space-y-2">
                      {payload.map((entry, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-xs text-muted-foreground font-sans">
                              {entry.name}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-foreground font-sans ml-4">
                            ₱{entry.value?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Average reference lines */}
          <ReferenceLine
            y={avgVolumeInfluenced}
            stroke="var(--chart-1)"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
            label={
              <CustomLabel
                label="AVG"
                avgValue={avgVolumeInfluenced}
                isMobile={isMobile}
              />
            }
          />
          <ReferenceLine
            y={avgClosedSales}
            stroke="var(--chart-2)"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
            label={
              <CustomLabel
                label="AVG"
                avgValue={avgClosedSales}
                isMobile={isMobile}
              />
            }
          />

          <Bar
            dataKey="volumeInfluenced"
            name="Volume Influenced"
            fill="var(--chart-1)"
            radius={[3, 3, 0, 0]}
            maxBarSize={32}
          >
            {monthlySalesData.map((entry, index) => (
              <Cell
                key={`volume-${index}`}
                fillOpacity={
                  (entry?.volumeInfluenced || 0) >= avgVolumeInfluenced
                    ? 1
                    : 0.4
                }
              />
            ))}
          </Bar>
          <Bar
            dataKey="closedSales"
            name="Closed Sales"
            fill="var(--chart-2)"
            radius={[3, 3, 0, 0]}
            maxBarSize={32}
          >
            {monthlySalesData.map((entry, index) => (
              <Cell
                key={`sales-${index}`}
                fillOpacity={
                  (entry?.closedSales || 0) >= avgClosedSales ? 1 : 0.4
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <ExpandableCard
      title="Monthly Sales Performance"
      summary={summaryContent}
      className="sm:h-fit"
    >
      {chartContent}
    </ExpandableCard>
  );
};

export default MonthlySalesChart;
