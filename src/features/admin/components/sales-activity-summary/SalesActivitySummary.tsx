import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { SalesChart, ViewToggle } from "./components";
import type { ViewMode } from "./constants";
import { VIEW_MODES } from "./constants";
import { useAdminSales } from "./hooks";
import {
  calculateSalesMetrics,
  getChartData,
  sortChartData,
  transformApiDataToSalesData,
} from "./utils";

interface SalesActivitySummaryProps {
  companyId: number;
}

const SalesActivitySummary: React.FC<SalesActivitySummaryProps> = ({
  companyId,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(VIEW_MODES.REGION);

  // Fetch data using our hook
  const {
    data: salesData,
    isLoading,
    error,
    refetch,
  } = useAdminSales(companyId);

  const handleViewChange = (newView: ViewMode) => {
    setViewMode(newView);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-card space-y-4 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
              Sales Activity Summary
            </h3>
            <p className="text-muted-foreground text-sm font-sans">
              Sales volume influenced or closed
            </p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>

        <div className="h-96 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading sales data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-card space-y-4 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
              Sales Activity Summary
            </h3>
            <p className="text-muted-foreground text-sm font-sans">
              Sales volume influenced or closed
            </p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Error loading data</span>
          </div>
        </div>

        <div className="h-96 w-full flex items-center justify-center">
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
      </div>
    );
  }

  // Transform API data to component format
  const transformedData = salesData
    ? transformApiDataToSalesData(salesData.data)
    : [];
  const salesMetrics = calculateSalesMetrics(transformedData);
  const chartData = sortChartData(getChartData(transformedData, viewMode));

  // Empty state
  if (transformedData.length === 0) {
    return (
      <div className="bg-card space-y-4 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
              Sales Activity Summary
            </h3>
            <p className="text-muted-foreground text-sm font-sans">
              Sales volume influenced or closed
            </p>
          </div>
          <ViewToggle currentView={viewMode} onViewChange={handleViewChange} />
        </div>

        <div className="h-96 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-display font-medium text-foreground mb-2">
              No sales data available
            </h3>
            <p className="text-sm">
              Sales data will appear here once available for company ID{" "}
              {companyId}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card space-y-4 rounded-lg border border-border p-4">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
              Sales Activity Summary
            </h3>
            <p className="text-muted-foreground text-sm font-sans">
              Sales volume influenced or closed
            </p>
          </div>
          <ViewToggle currentView={viewMode} onViewChange={handleViewChange} />
        </div>

        {/* Summary moved to top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
          </div>
          <div className="flex items-center gap-3">
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

      {/* Chart */}
      <div className="h-96">
        <SalesChart data={chartData} height={384} />
      </div>
    </div>
  );
};

export default SalesActivitySummary;
