import React, { useState, useMemo } from "react";
import {
  DealerMap,
  HeatmapView,
  IssueList,
  ViewToggle,
  FilterControls,
} from "./components";
import { MOCK_DEALER_ISSUES, VIEW_MODES } from "./constants";
import type {
  ViewMode,
  SeverityLevel,
  IssueTypeKey,
  DealerIssue,
} from "./constants";
import {
  calculateIssueMetrics,
  filterDealersBySeverity,
  filterDealersByIssueType,
  sortDealersBySeverity,
  calculateResolutionRate,
} from "./utils";
import { cn } from "@/lib/utils";

interface DealerIssueTrackerProps {
  className?: string;
}

const DealerIssueTracker: React.FC<DealerIssueTrackerProps> = ({
  className,
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

  // Filter and sort dealers
  const filteredDealers = useMemo(() => {
    let dealers = MOCK_DEALER_ISSUES;

    if (selectedSeverity) {
      dealers = filterDealersBySeverity(dealers, selectedSeverity);
    }

    if (selectedIssueType) {
      dealers = filterDealersByIssueType(dealers, selectedIssueType);
    }

    return sortDealersBySeverity(dealers);
  }, [selectedSeverity, selectedIssueType]);

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
            onDealerSelect={handleDealerSelect}
          />
        );
    }
  };

  return (
    <div className="bg-card space-y-6 rounded-lg border border-border p-4">
      <div>
        <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
          Dealer Issue Tracker
        </h3>
      </div>

      <div className={cn("space-y-6", className)}>
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.4fr] gap-6">
          {/* Left Column - Map/List View */}
          <div className="space-y-6">
            {/* Main Map/List View */}
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
                    Dealer Locations
                  </h3>
                  <ViewToggle
                    currentView={viewMode}
                    onViewChange={handleViewChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Interactive map and issue tracking
                </p>
              </div>

              <div className="h-96 w-full bg-muted/10 rounded-lg overflow-hidden border border-border">
                {renderMapView()}
              </div>
            </div>

            {/* Issue Distribution */}
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="mb-4">
                <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
                  Issue Distribution
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Breakdown by issue type and severity
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="mb-4">
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

            {/* Summary Metrics */}
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="mb-4">
                <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
                  Summary
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Key performance indicators
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-sans">
                    Total Dealers
                  </span>
                  <span className="text-sm font-medium text-foreground font-sans">
                    {metrics.totalDealers}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-sans">
                    Total Issues
                  </span>
                  <span className="text-sm font-medium text-foreground font-sans">
                    {metrics.totalIssues}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-sans">
                    Critical Issues
                  </span>
                  <span className="text-sm font-medium text-foreground font-sans">
                    {metrics.criticalIssues}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-sans">
                    Resolution Rate
                  </span>
                  <span className="text-sm font-medium text-foreground font-sans">
                    {resolutionRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Supply Chain Health */}
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="mb-4">
                <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
                  Supply Chain Health
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Overall system performance
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-sans">
                    Issues Resolved
                  </span>
                  <span className="text-sm font-medium text-foreground font-sans">
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
                  <span className="text-sm font-medium text-foreground font-sans">
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
