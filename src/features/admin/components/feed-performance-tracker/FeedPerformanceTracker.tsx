import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Activity,
  MapPin,
  Maximize2,
} from "lucide-react";
import {
  FilterControls,
  ViewToggle,
  PerformanceChart,
  RadarChart,
  PerformanceMap,
} from "./components";
import {
  MOCK_PERFORMANCE_METRICS,
  MOCK_REGIONAL_PERFORMANCE,
  VIEW_MODES,
  CHART_TYPES,
  type ViewMode,
  type ChartType,
} from "./constants";
import {
  getDefaultFilters,
  filterPerformanceMetrics,
  filterRegionalPerformance,
  calculatePerformanceMetrics,
  getUniqueRegions,
  getUniqueProvinces,
  formatFcr,
  formatWeight,
  formatMortality,
  formatPerformanceScore,
  type FilterOptions,
} from "./utils";

const FeedPerformanceTracker = () => {
  const [filters, setFilters] = useState<FilterOptions>(getDefaultFilters());
  const [currentView, setCurrentView] = useState<ViewMode>(VIEW_MODES.CHART);
  const [chartType, setChartType] = useState<ChartType>(CHART_TYPES.COMBINED);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter data based on current filters
  const filteredMetrics = filterPerformanceMetrics(
    MOCK_PERFORMANCE_METRICS,
    filters
  );
  const filteredRegionalData = filterRegionalPerformance(
    MOCK_REGIONAL_PERFORMANCE,
    filters
  );

  // Calculate performance metrics
  const performanceStats = calculatePerformanceMetrics(filteredMetrics);

  // Get unique regions and provinces for filters
  const regions = getUniqueRegions(MOCK_PERFORMANCE_METRICS);
  const provinces = getUniqueProvinces(MOCK_PERFORMANCE_METRICS);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
  };

  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
  };

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
          <div className="text-center p-3 rounded-lg bg-card border">
            <div className="text-lg font-bold text-red-600">
              {formatFcr(performanceStats.avgFcr)}
            </div>
            <div className="text-xs text-muted-foreground">Avg FCR</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-card border">
            <div className="text-lg font-bold text-green-600">
              {formatWeight(performanceStats.avgWeightGain)}
            </div>
            <div className="text-xs text-muted-foreground">Avg Weight Gain</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-card border">
            <div className="text-lg font-bold text-yellow-600">
              {formatMortality(performanceStats.avgMortality)}
            </div>
            <div className="text-xs text-muted-foreground">Avg Mortality</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-card border">
            <div className="text-lg font-bold text-blue-600">
              {formatPerformanceScore(performanceStats.performanceScore)}
            </div>
            <div className="text-xs text-muted-foreground">
              Performance Score
            </div>
          </div>
        </div>

        {/* Field Validation Summary */}
        <div className="bg-muted/20 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Field Performance Validation
            </h4>
            <Badge variant="outline" className="text-xs">
              {performanceStats.totalTrials} Trials
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="text-muted-foreground">Verified:</span>
              <span className="font-medium">
                {performanceStats.verifiedTrials}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-muted-foreground">Farms:</span>
              <span className="font-medium">{performanceStats.totalFarms}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-muted-foreground">
              Product validation and support for claims
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border pt-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <h3 className="text-foreground font-display font-medium text-base tracking-tight">
          Feed Performance Tracker
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-4xl xl:max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Feed Performance Analytics
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Filter Controls */}
              <FilterControls
                filters={filters}
                onFiltersChange={handleFiltersChange}
                regions={regions}
                provinces={provinces}
              />

              {/* View Toggle */}
              <div className="flex items-center justify-between">
                <ViewToggle
                  currentView={currentView}
                  onViewChange={handleViewChange}
                />
                <Badge variant="outline" className="text-xs">
                  {filteredMetrics.length} observations
                </Badge>
              </div>

              {/* Current View */}
              <div className="min-h-[400px]">{renderCurrentView()}</div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Compact View Content */}
      <div className="px-4">{renderCompactView()}</div>

      {/* Footer */}
      <div className="px-4 bg-muted/20 py-4">
        <div className="text-xs text-muted-foreground">
          Feed performance observations
        </div>
      </div>
    </div>
  );
};

export default FeedPerformanceTracker;
