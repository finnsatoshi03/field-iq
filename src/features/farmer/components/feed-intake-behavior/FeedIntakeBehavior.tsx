import { Button } from "@/components/ui/button";
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

  return (
    <div className="bg-card rounded-lg border border-border pt-4 space-y-4">
      {/* Header */}
      <div className="px-4 flex justify-between gap-4">
        <div>
          <h3 className="text-foreground font-display font-medium text-base tracking-tight">
            Feed Intake Behavior
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            Monitor feed acceptability and eating patterns
          </p>
        </div>
        <Button onClick={handleAddBehaviorClick} variant="native">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Behavior Meter */}
      <div className="px-4">
        <BehaviorMeter summary={summary} />
      </div>

      {/* Behavior Summary */}
      <div className="px-4 space-y-2">
        <p className="text-base font-medium font-display">Behavior Summary</p>
        <BehaviorSummary summary={summary} />
      </div>

      {/* Recent Records */}
      <div className="px-4 bg-muted/50 space-y-2 py-4 rounded-b-lg">
        <p className="font-medium font-display">Recent Records</p>
        <BehaviorList records={records} maxItems={5} />
      </div>
    </div>
  );
};
