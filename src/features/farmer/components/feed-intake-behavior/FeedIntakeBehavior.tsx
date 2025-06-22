import { Button } from "@/components/ui/button";
import { Plus, Utensils } from "lucide-react";
import { useFeedBehavior } from "./hooks";
import {
  BehaviorMeter,
  BehaviorSummary,
  BehaviorSlider,
  BehaviorList,
  AddBehaviorDialog,
} from "./components";

export const FeedIntakeBehavior = () => {
  const {
    records,
    summary,
    currentBehavior,
    isAddDialogOpen,
    setIsAddDialogOpen,
    newRecord,
    handleNewRecordChange,
    handleAddRecord,
    handleBehaviorChange,
  } = useFeedBehavior();

  return (
    <div className="bg-card rounded-lg border border-border pt-4 space-y-6">
      {/* Header */}
      <div className="px-4">
        <h3 className="text-foreground font-display font-medium text-base tracking-tight">
          Feed Intake Behavior
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          Monitor feed acceptability and eating patterns
        </p>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Record
        </Button>
      </div>

      {/* Behavior Slider */}
      <div className="px-4">
        <BehaviorSlider
          currentBehavior={currentBehavior}
          onBehaviorChange={handleBehaviorChange}
        />
      </div>

      {/* Behavior Meter */}
      <div className="px-4">
        <BehaviorMeter summary={summary} />
      </div>

      {/* Behavior Summary */}
      <div className="px-4">
        <div className="pb-2 flex items-center gap-2">
          <Utensils className="h-4 w-4 text-muted-foreground" />
          <span className="text-base font-medium text-foreground">
            Behavior Summary
          </span>
        </div>
        <BehaviorSummary summary={summary} />
      </div>

      {/* Recent Records */}
      <div className="px-4 bg-muted/20 py-4 rounded-b-lg">
        <div className="pb-2">
          <span className="text-base font-medium text-foreground">
            Recent Records
          </span>
        </div>
        <BehaviorList records={records} maxItems={5} />
      </div>

      {/* Add Behavior Dialog */}
      <AddBehaviorDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newRecord={newRecord}
        onNewRecordChange={handleNewRecordChange}
        onAddRecord={handleAddRecord}
      />
    </div>
  );
};
