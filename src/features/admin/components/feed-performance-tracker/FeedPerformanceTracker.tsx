import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Activity,
  AlertTriangle,
  Loader2,
  MapPin,
  Maximize2,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import {
  FilterControls,
  PerformanceChart,
  PerformanceMap,
  RadarChart,
  ViewToggle,
} from "./components";
import {
  CHART_TYPES,
  VIEW_MODES,
  type ChartType,
  type ViewMode,
} from "./constants";
import { useAdminFarmPerformance } from "./hooks";
import {
  calculatePerformanceMetrics,
  filterPerformanceMetrics,
  filterRegionalPerformance,
  formatFcr,
  formatMortality,
  formatPerformanceScore,
  formatWeight,
  getDefaultFilters,
  getUniqueProvinces,
  getUniqueRegions,
  transformApiDataToPerformanceData,
  type FilterOptions,
} from "./utils";

interface FeedPerformanceTrackerProps {
  className?: string;
  companyId?: number;
}

const FeedPerformanceTracker: React.FC<FeedPerformanceTrackerProps> = ({
  className,
  companyId = 1, // Default company ID
}) => {
  const [filters, setFilters] = useState<FilterOptions>(getDefaultFilters());
  const [currentView, setCurrentView] = useState<ViewMode>(VIEW_MODES.CHART);
  const [chartType, setChartType] = useState<ChartType>(CHART_TYPES.COMBINED);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch data using our hook
  const {
    data: performanceData,
    isLoading,
    error,
    refetch,
  } = useAdminFarmPerformance(companyId);

  // Transform API data to component format
  const transformedData = performanceData
    ? transformApiDataToPerformanceData(performanceData.data)
    : null;
  const allMetrics = transformedData?.metrics || [];
  const allRegionalData = transformedData?.regional || [];

  // Filter data based on current filters
  const filteredMetrics = filterPerformanceMetrics(allMetrics, filters);
  const filteredRegionalData = filterRegionalPerformance(
    allRegionalData,
    filters,
  );

  // Calculate performance metrics
  const performanceStats = calculatePerformanceMetrics(filteredMetrics);

  // Get unique regions and provinces for filters
  const regions = getUniqueRegions(allMetrics);
  const provinces = getUniqueProvinces(allMetrics);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
  };

  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border pt-4 space-y-4">
        <div className="flex items-center justify-between px-4">
          <div>
            <h3 className="text-foreground font-display font-medium text-base tracking-tight">
              Feed Performance Tracker
            </h3>
            <p className="text-muted-foreground text-xs font-sans">
              Track feed performance and field validation
            </p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>

        <div className="h-96 w-full flex items-center justify-center px-4">
          <div className="text-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading performance data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-card rounded-lg border border-border pt-4 space-y-4">
        <div className="flex items-center justify-between px-4">
          <div>
            <h3 className="text-foreground font-display font-medium text-base tracking-tight">
              Feed Performance Tracker
            </h3>
            <p className="text-muted-foreground text-xs font-sans">
              Track feed performance and field validation
            </p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Error loading data</span>
          </div>
        </div>

        <div className="h-96 w-full flex items-center justify-center px-4">
          <div className="text-center text-muted-foreground">
            <p className="text-sm mb-2">
              Failed to load performance data: {error.message}
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

  // Empty state
  if (allMetrics.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border pt-4 space-y-4">
        <div className="flex items-center justify-between px-4">
          <div>
            <h3 className="text-foreground font-display font-medium text-base tracking-tight">
              Feed Performance Tracker
            </h3>
            <p className="text-muted-foreground text-xs font-sans">
              Track feed performance and field validation
            </p>
          </div>
        </div>

        <div className="h-96 w-full flex items-center justify-center px-4">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-display font-medium text-foreground mb-2">
              No performance data found
            </h3>
            <p className="text-sm">
              Performance data will appear here once available for company ID{" "}
              {companyId}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case VIEW_MODES.CHART:
        return (
          <PerformanceChart
            metrics={filteredMetrics}
            chartType={chartType}
            onChartTypeChange={handleChartTypeChange}
          />
        );
      case VIEW_MODES.RADAR:
        return <RadarChart metrics={filteredMetrics} />;
      case VIEW_MODES.MAP:
        return (
          <PerformanceMap
            metrics={filteredMetrics}
            regionalData={filteredRegionalData}
          />
        );
      default:
        return (
          <PerformanceChart
            metrics={filteredMetrics}
            chartType={chartType}
            onChartTypeChange={handleChartTypeChange}
          />
        );
    }
  };

  const renderCompactView = () => {
    return (
      <div className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg border border-black">
            <div className="text-2xl font-semibold font-display text-red-600">
              {formatFcr(performanceStats.avgFcr)}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Avg FCR
            </div>
          </div>
          <div className="text-center p-3 rounded-lg border border-black">
            <div className="text-2xl font-semibold font-display text-green-600">
              {formatWeight(performanceStats.avgWeightGain)}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Avg Weight Gain
            </div>
          </div>
          <div className="text-center p-3 rounded-lg border border-black">
            <div className="text-2xl font-semibold font-display text-yellow-600">
              {formatMortality(performanceStats.avgMortality)}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Avg Mortality
            </div>
          </div>
          <div className="text-center p-3 rounded-lg border border-black">
            <div className="text-2xl font-semibold font-display text-blue-600">
              {formatPerformanceScore(performanceStats.performanceScore)}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Performance Score
            </div>
          </div>
        </div>

        {/* Field Validation Summary */}
        <div className="bg-accent rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium font-display">
              Field Performance Validation
            </h4>
            <Badge
              variant="outline"
              className="font-display font-medium rounded-full border-black text-xs"
            >
              {performanceStats.totalTrials} Trials
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-green-600" />
                <span className="text-muted-foreground font-semibold">
                  Verified:
                </span>
              </div>
              <span className="font-medium font-display text-sm">
                {performanceStats.verifiedTrials}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-blue-600" />
                <span className="text-muted-foreground font-semibold">
                  Farms:
                </span>
              </div>
              <span className="font-medium font-display text-sm">
                {performanceStats.totalFarms}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-purple-600" />
            <span className="text-sm text-muted-foreground font-semibold">
              Product validation and support for claims
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-card rounded-lg border border-border pt-4 space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <div>
          <h3 className="text-foreground font-display font-medium text-base tracking-tight">
            Feed Performance Tracker
          </h3>
          <p className="text-muted-foreground text-xs font-sans">
            Track feed performance and field validation
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-4xl xl:max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="gap-0 space-y-0">
              <DialogTitle className="font-semibold font-display text-lg">
                Feed Performance Analytics
              </DialogTitle>
              <DialogDescription>
                Track feed performance and field validation
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Filter Controls */}
              <div className="-mx-6 px-6 py-4 bg-accent">
                <FilterControls
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  regions={regions}
                  provinces={provinces}
                />
              </div>

              {/* View Toggle */}
              <ViewToggle
                currentView={currentView}
                onViewChange={handleViewChange}
              />

              {/* Current View */}
              <div className="space-y-2">
                {/* Title */}
                <div className="flex items-center justify-between">
                  <h4 className="font-medium font-display">
                    {currentView === VIEW_MODES.CHART
                      ? "Chart Type"
                      : currentView === VIEW_MODES.RADAR
                        ? "Radar Chart View"
                        : "Map View"}
                  </h4>
                  <Badge
                    variant="outline"
                    className="font-display font-medium rounded-full border-black text-xs"
                  >
                    {filteredMetrics.length} observations
                  </Badge>
                </div>
                {renderCurrentView()}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Compact View Content */}
      <div className="px-4">{renderCompactView()}</div>

      {/* Footer */}
      <div className="px-4 bg-muted/20 py-4">
        <div className="text-xs text-muted-foreground">
          Feed performance observations: {allMetrics.length} total,{" "}
          {filteredMetrics.length} filtered
        </div>
      </div>
    </div>
  );
};

export default FeedPerformanceTracker;
