import { useState } from "react";
import { SalesChart, ViewToggle } from "./components";
import { MOCK_SALES_DATA, VIEW_MODES } from "./constants";
import type { ViewMode } from "./constants";
import { calculateSalesMetrics, getChartData, sortChartData } from "./utils";

const SalesActivitySummary = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(VIEW_MODES.REGION);

  const salesMetrics = calculateSalesMetrics(MOCK_SALES_DATA);
  const chartData = sortChartData(getChartData(MOCK_SALES_DATA, viewMode));

  const handleViewChange = (newView: ViewMode) => {
    setViewMode(newView);
  };

  return (
    <div className="bg-card space-y-6 rounded-lg border border-border p-4">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
            Sales Activity Summary
          </h3>
          <ViewToggle currentView={viewMode} onViewChange={handleViewChange} />
        </div>
        <p className="text-muted-foreground text-sm font-sans mb-4">
          Sales volume influenced or closed
        </p>

        {/* Summary moved to top */}
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-1" />
                <span className="text-xs font-semibold text-muted-foreground font-sans">
                  Total Influenced Volume
                </span>
              </div>
              <span className="text-2xl font-bold text-foreground font-sans">
                ₱{salesMetrics.totalInfluencedVolume.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-2" />
                <span className="text-xs font-semibold text-muted-foreground font-sans">
                  Total Closed Sales
                </span>
              </div>
              <span className="text-2xl font-bold text-foreground font-sans">
                ₱{salesMetrics.totalClosedSales.toLocaleString()}
              </span>
            </div>
          </div>
          {/* Additional Metrics */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-1">
                <div className="w-2 h-2 rounded-full bg-chart-3" />
                <span className="text-xs font-semibold text-muted-foreground font-sans">
                  Conversion Rate
                </span>
              </div>
              <span className="text-2xl font-bold text-foreground font-sans">
                {(
                  (salesMetrics.totalClosedSales /
                    salesMetrics.totalInfluencedVolume) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-1">
                <div className="w-2 h-2 rounded-full bg-chart-4" />
                <span className="text-xs font-semibold text-muted-foreground font-sans">
                  Avg Growth Rate
                </span>
              </div>
              <span className="text-2xl font-bold text-foreground font-sans">
                {salesMetrics.averageGrowthRate.toFixed(1)}%
              </span>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-1">
                <div className="w-2 h-2 rounded-full bg-chart-5" />
                <span className="text-xs font-semibold text-muted-foreground font-sans">
                  Active {viewMode === VIEW_MODES.REGION ? "Regions" : "Reps"}
                </span>
              </div>
              <span className="text-2xl font-bold text-foreground font-sans">
                {chartData.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-96 w-full">
        <SalesChart data={chartData} height={384} />
      </div>
    </div>
  );
};

export default SalesActivitySummary;
