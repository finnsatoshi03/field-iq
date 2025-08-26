import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ExpandableCard from "@/components/ui/expandable-card";
import { useHealthWatch } from "@/hooks/use-farmer-v2";
import { useChatWidgetStore } from "@/store/chat-widget-store";
import { useUserStore } from "@/store/user-store";
import { Activity, AlertTriangle, Plus } from "lucide-react";
import { IssueList, IssueSummary, SmileyMeter } from "./components";
import { TIME_PERIODS } from "./constants";
import { useHealthWatch as useHealthWatchLocal } from "./hooks";

interface HealthWatchSummaryProps {
  // Remove dashboardData dependency - we'll fetch data directly
}

export const HealthWatchSummary: React.FC<HealthWatchSummaryProps> = () => {
  const { user } = useUserStore();
  const farmerUserProfileId = user?.profileId || 0;

  // Fetch health watch data directly from API
  const {
    data: healthWatchData,
    isLoading,
    error,
  } = useHealthWatch(farmerUserProfileId);

  const { timePeriod, setTimePeriod, issues, summary } =
    useHealthWatchLocal(healthWatchData);

  const { openFlockMortalityReport } = useChatWidgetStore();

  const handleAddIssueClick = () => {
    openFlockMortalityReport();
  };

  // Show loading state
  if (isLoading) {
    return (
      <ExpandableCard
        title="Health Watch Summary"
        summary={
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-4 w-4 animate-pulse" />
            <span className="text-sm">Loading health data...</span>
          </div>
        }
        className="h-fit"
      >
        <div className="space-y-4">
          <div className="rounded-lg p-4 border">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">Loading...</p>
            </div>
          </div>
        </div>
      </ExpandableCard>
    );
  }

  // Show error state
  if (error) {
    return (
      <ExpandableCard
        title="Health Watch Summary"
        summary={
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm">Error loading health data</span>
          </div>
        }
        className="h-fit"
      >
        <div className="space-y-4">
          <div className="rounded-lg p-4 border border-red-200 bg-red-50">
            <div className="text-center text-red-600">
              <p className="text-sm font-medium">Failed to load health data</p>
              <p className="text-xs mt-1">{error.message}</p>
            </div>
          </div>
        </div>
      </ExpandableCard>
    );
  }

  // Summary content - show health statistics
  const summaryContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {summary.totalIssues} issues tracked
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Score: {summary.healthScore}/100
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            summary.trend === "improving"
              ? "bg-green-500"
              : summary.trend === "stable"
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
        />
        <span className="text-xs text-muted-foreground capitalize">
          {summary.trend}
        </span>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="Health Watch Summary"
      summary={summaryContent}
      className="h-fit"
    >
      <div className="space-y-4">
        {/* Header with add button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Monitor health issues and mortality patterns
            </p>
            {healthWatchData?.filter_applied && (
              <p className="text-xs text-muted-foreground mt-1">
                Filter: {healthWatchData.filter_applied}
              </p>
            )}
          </div>
          <Button onClick={handleAddIssueClick} variant="native">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Time Period Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm font-display font-medium">Time Period</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                timePeriod === TIME_PERIODS.DAILY ? "default" : "secondary"
              }
              className="cursor-pointer"
              onClick={() => setTimePeriod(TIME_PERIODS.DAILY)}
            >
              Daily
            </Badge>
            <Badge
              variant={
                timePeriod === TIME_PERIODS.WEEKLY ? "default" : "secondary"
              }
              className="cursor-pointer"
              onClick={() => setTimePeriod(TIME_PERIODS.WEEKLY)}
            >
              Weekly
            </Badge>
          </div>
        </div>

        {/* Smiley Meter */}
        <div>
          <SmileyMeter summary={summary} />
        </div>

        {/* Issue Summary */}
        <div className="space-y-2">
          <p className="text-base font-medium text-foreground font-display">
            Issue Summary
          </p>
          <IssueSummary summary={summary} />
        </div>

        {/* Recent Issues */}
        <div className="bg-muted/20 py-4 rounded-lg -mx-4 px-4">
          <div className="pb-2">
            <span className="text-base font-medium text-foreground">
              Recent Issues
            </span>
            {issues.length === 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                No recent health issues reported
              </p>
            )}
          </div>
          {issues.length > 0 && <IssueList issues={issues} maxItems={5} />}
        </div>
      </div>
    </ExpandableCard>
  );
};
