import { Button } from "@/components/ui/button";
import ExpandableCard from "@/components/ui/expandable-card";
import {
  useActiveFeedProgram,
  useFeedIntakeBehavior,
} from "@/hooks/use-farmer-v2";
import { useChatWidgetStore } from "@/store/chat-widget-store";
import { useUserStore } from "@/store/user-store";
import { Activity, AlertTriangle, Plus } from "lucide-react";
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
    isLoading: isFeedIntakeLoading,
    error: feedIntakeError,
  } = useFeedIntakeBehavior(farmerUserProfileId);

  // Fetch active feed program to get animal quantity
  const {
    data: activeFeedProgram,
    isLoading: isFeedProgramLoading,
    error: feedProgramError,
  } = useActiveFeedProgram(farmerUserProfileId);

  const { records, summary } = useFeedBehavior(
    feedIntakeData,
    activeFeedProgram?.data?.animal_quantity,
  );

  const { openFeedConsumptionReport } = useChatWidgetStore();

  const handleAddBehaviorClick = () => {
    openFeedConsumptionReport();
  };

  // Show loading state
  if (isFeedIntakeLoading || isFeedProgramLoading) {
    return (
      <ExpandableCard
        title="Feed Intake Behavior"
        summary={
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-4 w-4 animate-pulse" />
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
  if (feedIntakeError || feedProgramError) {
    return (
      <ExpandableCard
        title="Feed Intake Behavior"
        summary={
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm">Error loading behavior data</span>
          </div>
        }
        className="h-fit"
      >
        <div className="space-y-4">
          <div className="rounded-lg p-4 border border-red-200 bg-red-50">
            <div className="text-center text-red-600">
              <p className="text-sm font-medium">
                Failed to load behavior data
              </p>
              <p className="text-xs mt-1">
                {feedIntakeError?.message || feedProgramError?.message}
              </p>
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
        <div
          className={`w-2 h-2 rounded-full ${
            summary.status === "excellent"
              ? "bg-green-500"
              : summary.status === "good"
                ? "bg-blue-500"
                : summary.status === "warning"
                  ? "bg-yellow-500"
                  : "bg-red-500"
          }`}
        />
        <span className="text-xs text-muted-foreground capitalize">
          {summary.status}
        </span>
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
            {feedIntakeData?.behavior_status && (
              <p className="text-xs text-muted-foreground">
                Current Status:{" "}
                {feedIntakeData.behavior_status.replace("_", " ")}
              </p>
            )}
            {activeFeedProgram?.data?.animal_quantity && (
              <p className="text-xs text-muted-foreground">
                Flock Size: {activeFeedProgram.data.animal_quantity} animals
              </p>
            )}
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
        <div className="bg-muted/20 py-4 rounded-lg -mx-4 px-4">
          <div className="pb-2">
            <span className="text-base font-medium text-foreground">
              Recent Records
            </span>
            {records.length === 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                No recent feed intake records
              </p>
            )}
          </div>
          {records.length > 0 && (
            <BehaviorList records={records} maxItems={5} />
          )}
        </div>
      </div>
    </ExpandableCard>
  );
};
