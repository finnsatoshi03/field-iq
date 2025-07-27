import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ExpandableCard from "@/components/ui/expandable-card";
import type { FarmerDashboardViewModel } from "@/services/field-iq-service";
import { useChatWidgetStore } from "@/store/chat-widget-store";
import { Plus, TrendingUp } from "lucide-react";
import { IssueList, IssueSummary, SmileyMeter } from "./components";
import { TIME_PERIODS } from "./constants";
import { useHealthWatch } from "./hooks";

interface HealthWatchSummaryProps {
  dashboardData?: FarmerDashboardViewModel;
}

export const HealthWatchSummary: React.FC<HealthWatchSummaryProps> = ({
  dashboardData,
}) => {
  const { timePeriod, setTimePeriod, issues, summary } = useHealthWatch(
    dashboardData?.health_watch,
  );

  const { openFlockMortalityReport } = useChatWidgetStore();

  const handleAddIssueClick = () => {
    openFlockMortalityReport();
  };

  // Show loading state if no data
  if (!dashboardData?.health_watch) {
    return (
      <ExpandableCard
        title="Health Watch Summary"
        summary={
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Loading health data...</span>
          </div>
        }
        className="h-fit"
      >
        <div className="space-y-4">
          <div className="rounded-lg p-4 border">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">No health data available</p>
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
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs text-muted-foreground">{summary.trend}</span>
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
          </div>
          <IssueList issues={issues} maxItems={5} />
        </div>
      </div>
    </ExpandableCard>
  );
};
