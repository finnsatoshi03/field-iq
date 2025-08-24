import { Button } from "@/components/ui/button";
import ExpandableCard from "@/components/ui/expandable-card";
import { useFeedIntakeBehavior } from "@/hooks/use-farmer-v2";
import { useChatWidgetStore } from "@/store/chat-widget-store";
import { useUserStore } from "@/store/user-store";
import { Plus, TrendingUp } from "lucide-react";
import { BehaviorList, BehaviorMeter, BehaviorSummary } from "./components";
import { useFeedBehavior } from "./hooks";

interface FeedIntakeBehaviorProps {
  // Remove dashboardData dependency - we'll fetch data directly
}

export const FeedIntakeBehavior: React.FC<FeedIntakeBehaviorProps> = () => {
  const { user } = useUserStore();
  const farmerUserProfileId = user?.profileId || 0;

  // Fetch feed intake behavior data directly from API
  const {
    data: feedIntakeData,
    isLoading,
    error,
  } = useFeedIntakeBehavior(farmerUserProfileId);

  const { records, summary } = useFeedBehavior(feedIntakeData);

  const { openFeedConsumptionReport } = useChatWidgetStore();

  const handleAddBehaviorClick = () => {
    openFeedConsumptionReport();
  };

  // Show loading state
  if (isLoading) {
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
        title="Feed Intake Behavior"
        summary={
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Error loading behavior data</span>
          </div>
        }
        className="h-fit"
      >
        <div className="space-y-4">
          <div className="rounded-lg p-4 border">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">Failed to load behavior data</p>
              <p className="text-xs mt-1">{error.message}</p>
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
