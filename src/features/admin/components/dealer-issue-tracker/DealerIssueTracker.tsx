import { cn } from "@/lib/utils";
import { AlertTriangle, Loader2, MapPin } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  DealerMap,
  FilterControls,
  HeatmapView,
  IssueList,
  ViewToggle,
} from "./components";
import type {
  DealerIssue,
  IssueTypeKey,
  SeverityLevel,
  ViewMode,
} from "./constants";
import { VIEW_MODES } from "./constants";
import { useAdminDealerIssues } from "./hooks";
import {
  calculateIssueMetrics,
  calculateResolutionRate,
  filterDealersByIssueType,
  filterDealersBySeverity,
  sortDealersBySeverity,
  transformApiDataToDealerIssues,
  transformApiDataToDealerIssuesWithGeocoding,
} from "./utils";

interface DealerIssueTrackerProps {
  className?: string;
  companyId: number;
}

const DealerIssueTracker: React.FC<DealerIssueTrackerProps> = ({
  className,
  companyId,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(VIEW_MODES.MAP);
  const [selectedSeverity, setSelectedSeverity] = useState<
    SeverityLevel | undefined
  >();
  const [selectedIssueType, setSelectedIssueType] = useState<
    IssueTypeKey | undefined
  >();
  const [selectedDealer, setSelectedDealer] = useState<
    DealerIssue | undefined
  >();
  const [processedDealers, setProcessedDealers] = useState<DealerIssue[]>([]);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Fetch data using our hook
  const {
    data: dealerIssuesData,
    isLoading,
    error,
    refetch,
  } = useAdminDealerIssues(companyId);

  // Process data with geocoding when API data changes
  useEffect(() => {
    const processDealer = async () => {
      if (dealerIssuesData?.data) {
        setIsGeocoding(true);
        try {
          // First, quickly transform without geocoding for immediate display
          const initialDealers = transformApiDataToDealerIssues(
            dealerIssuesData.data,
          );
          setProcessedDealers(initialDealers);

          // Then enhance with geocoding for dealers that need it
          const geocodedDealers =
            await transformApiDataToDealerIssuesWithGeocoding(
              dealerIssuesData.data,
            );
          setProcessedDealers(geocodedDealers);
        } catch (error) {
          console.warn("Error during geocoding:", error);
          // Fallback to basic transformation
          const basicDealers = transformApiDataToDealerIssues(
            dealerIssuesData.data,
          );
          setProcessedDealers(basicDealers);
        } finally {
          setIsGeocoding(false);
        }
      } else {
        setProcessedDealers([]);
      }
    };

    processDealer();
  }, [dealerIssuesData]);

  // Filter and sort dealers
  const filteredDealers = useMemo(() => {
    let dealers = processedDealers;

    if (selectedSeverity) {
      dealers = filterDealersBySeverity(dealers, selectedSeverity);
    }

    if (selectedIssueType) {
      dealers = filterDealersByIssueType(dealers, selectedIssueType);
    }

    return sortDealersBySeverity(dealers);
  }, [processedDealers, selectedSeverity, selectedIssueType]);

  const metrics = calculateIssueMetrics(filteredDealers);
  const resolutionRate = calculateResolutionRate(filteredDealers);

  const handleViewChange = (newView: ViewMode) => {
    setViewMode(newView);
  };

  const handleDealerSelect = (dealer: DealerIssue) => {
    setSelectedDealer(dealer);
    setViewMode(VIEW_MODES.MAP); // Switch to map view when dealer is selected
  };

  const renderMapView = () => {
    switch (viewMode) {
      case VIEW_MODES.HEATMAP:
        return <HeatmapView dealers={filteredDealers} />;
      case VIEW_MODES.LIST:
        return (
          <div className="h-full overflow-y-auto">
            <IssueList
              dealers={filteredDealers}
              onDealerSelect={handleDealerSelect}
            />
          </div>
        );
      default:
        return (
          <DealerMap
            dealers={filteredDealers}
            selectedDealer={selectedDealer}
            onDealerSelect={handleDealerSelect}
          />
        );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-card space-y-4 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
            Sales Rep Issue Tracker
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>

        <div className="h-96 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading sales rep issues...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-card space-y-4 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
            Sales Rep Issue Tracker
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Error loading data</span>
          </div>
        </div>

        <div className="h-96 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-sm mb-2">
              Failed to load sales rep issues: {error.message}
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
  if (processedDealers.length === 0) {
    return (
      <div className="bg-card space-y-4 rounded-lg border border-border p-4">
        <div>
          <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
            Sales Rep Issue Tracker
          </h3>
        </div>

        <div className="h-96 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-display font-medium text-foreground mb-2">
              No sales rep issues found
            </h3>
            <p className="text-sm">
              Sales rep issue data will appear here once available for company
              ID {companyId}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card space-y-4 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
          Sales Rep Issue Tracker
        </h3>
        {isGeocoding && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 animate-pulse" />
            <span className="text-xs">Locating addresses...</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="-mx-4">
        <div className="bg-accent p-4">
          <div className="mb-2">
            <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
              Filters
            </h3>
          </div>
          <FilterControls
            selectedSeverity={selectedSeverity}
            selectedIssueType={selectedIssueType}
            onSeverityChange={setSelectedSeverity}
            onIssueTypeChange={setSelectedIssueType}
          />
        </div>
      </div>

      <div className={cn("space-y-4", className)}>
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.4fr] gap-4">
          {/* Left Column - Map/List View */}
          <div className="space-y-4">
            {/* Main Map/List View */}
            <div className="bg-card rounded-lg border border-border p-2">
              <div className="mb-2">
                <div className="flex flex-wrap gap-2 justify-between">
                  <div>
                    <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
                      Sales Rep Locations
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Interactive map and issue tracking
                      {isGeocoding && (
                        <span className="ml-2 text-blue-600 dark:text-blue-400">
                          • Geocoding addresses...
                        </span>
                      )}
                    </p>
                  </div>
                  <ViewToggle
                    currentView={viewMode}
                    onViewChange={handleViewChange}
                  />
                </div>
              </div>

              <div className="h-96 w-full bg-muted/10 rounded-lg overflow-hidden border border-border">
                {renderMapView()}
              </div>
            </div>

            {/* Issue Distribution */}
            <div className="bg-card rounded-lg border border-border p-2">
              <div className="mb-2">
                <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
                  Issue Distribution
                </h3>
                <p className="text-xs text-muted-foreground">
                  Breakdown by issue type and severity
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-muted/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-xs text-muted-foreground font-sans">
                      Stock Out
                    </span>
                  </div>
                  <span className="text-lg font-medium text-foreground font-sans">
                    {metrics.stockoutIssues}
                  </span>
                </div>

                <div className="rounded-lg bg-muted/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-xs text-muted-foreground font-sans">
                      Delivery
                    </span>
                  </div>
                  <span className="text-lg font-medium text-foreground font-sans">
                    {metrics.deliveryIssues}
                  </span>
                </div>

                <div className="rounded-lg bg-muted/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                    <span className="text-xs text-muted-foreground font-sans">
                      Pricing
                    </span>
                  </div>
                  <span className="text-lg font-medium text-foreground font-sans">
                    {metrics.pricingIssues}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Filters and Summary */}
          <div className="space-y-4">
            {/* Summary Metrics */}
            <div className="bg-card rounded-lg border border-border p-2">
              <div className="mb-2">
                <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
                  Summary
                </h3>
                <p className="text-xs text-muted-foreground">
                  Key performance indicators
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-sans">
                    Total Sales Reps
                  </span>
                  <span className="text-sm font-medium text-foreground font-display">
                    {metrics.totalDealers}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-sans">
                    Total Issues
                  </span>
                  <span className="text-sm font-medium text-foreground font-display">
                    {metrics.totalIssues}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-sans">
                    Critical Issues
                  </span>
                  <span className="text-sm font-medium text-foreground font-display">
                    {metrics.criticalIssues}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-sans">
                    Resolution Rate
                  </span>
                  <span className="text-sm font-medium text-foreground font-display">
                    {resolutionRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Supply Chain Health */}
            <div className="bg-card rounded-lg border border-border p-2">
              <div className="mb-2">
                <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
                  Supply Chain Health
                </h3>
                <p className="text-xs text-muted-foreground">
                  Overall system performance
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-sans">
                    Issues Resolved
                  </span>
                  <span className="text-sm font-semibold text-foreground font-display">
                    {metrics.resolvedIssues}/{metrics.totalIssues}
                  </span>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-chart-3 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${resolutionRate}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-sans">
                    Supply Chain Issues
                  </span>
                  <span className="text-sm font-semibold text-foreground font-display">
                    {metrics.stockoutIssues + metrics.deliveryIssues}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-optimized stacked view on smaller screens */}
        <div className="lg:hidden">
          <div className="text-xs text-muted-foreground text-center py-2">
            Swipe or scroll to view all sections
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerIssueTracker;
