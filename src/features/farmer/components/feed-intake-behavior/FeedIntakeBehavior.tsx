import { Button } from "@/components/ui/button";
import ExpandableCard from "@/components/ui/expandable-card";
import type { FarmerDashboardViewModel } from "@/services/field-iq-service";
import { useChatWidgetStore } from "@/store/chat-widget-store";
import { Plus, TrendingUp } from "lucide-react";
import { BehaviorList, BehaviorMeter, BehaviorSummary } from "./components";
import { useFeedBehavior } from "./hooks";

interface FeedIntakeBehaviorProps {
  dashboardData?: FarmerDashboardViewModel;
}

export const FeedIntakeBehavior: React.FC<FeedIntakeBehaviorProps> = ({
  dashboardData,
}) => {
  const { records, summary } = useFeedBehavior(
    dashboardData?.feed_intake_behavior,
  );

  const { openFeedConsumptionReport } = useChatWidgetStore();

  const handleAddBehaviorClick = () => {
    openFeedConsumptionReport();
  };

  // Show loading state if no data
  if (!dashboardData?.feed_intake_behavior) {
    return (
      <ExpandableCard
        title="Feed Intake Behavior"
        summary={
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Loading behavior data...</span>
          </div>
        }
        className="h-fit"
      >
        <div className="space-y-4">
          <div className="rounded-lg p-4 border">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">No behavior data available</p>
            </div>
          </div>
        </div>
      </ExpandableCard>
    );
  }

  // Summary content - show behavior statistics
  const summaryContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {summary.totalRecords} records
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Score: {summary.behaviorScore}/100
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs text-muted-foreground">{summary.status}</span>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="Feed Intake Behavior"
      summary={summaryContent}
      className="h-fit"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Monitor feed acceptability and eating patterns
            </p>
          </div>
          <Button onClick={handleAddBehaviorClick} variant="native">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Behavior Meter */}
        <BehaviorMeter summary={summary} />

        {/* Behavior Summary */}
        <div className="space-y-2">
          <p className="text-base font-medium font-display">Behavior Summary</p>
          <BehaviorSummary summary={summary} />
        </div>

        {/* Recent Records */}
        <div className="bg-muted/50 space-y-2 pt-4 rounded-b-lg -mx-4 px-4">
          <p className="font-medium font-display">Recent Records</p>
          <BehaviorList records={records} maxItems={5} />
        </div>
      </div>
    </ExpandableCard>
  );
};
