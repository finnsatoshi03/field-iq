import { Button } from "@/components/ui/button";
import ExpandableCard from "@/components/ui/expandable-card";
import { useChatWidgetStore } from "@/store/chat-widget-store";
import { Plus } from "lucide-react";
import { BehaviorList, BehaviorMeter, BehaviorSummary } from "./components";
import { useFeedBehavior } from "./hooks";

export const FeedIntakeBehavior = () => {
  const { records, summary } = useFeedBehavior();

  const { openFeedConsumptionReport } = useChatWidgetStore();

  const handleAddBehaviorClick = () => {
    openFeedConsumptionReport();
  };

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
        <div className="bg-muted/50 space-y-2 py-4 rounded-b-lg">
          <p className="font-medium font-display">Recent Records</p>
          <BehaviorList records={records} maxItems={5} />
        </div>
      </div>
    </ExpandableCard>
  );
};
