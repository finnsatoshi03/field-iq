import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useChatWidgetStore } from "@/store/chat-widget-store";
import { Plus } from "lucide-react";
import {
  AddIssueDialog,
  IssueList,
  IssueSummary,
  SmileyMeter,
} from "./components";
import { TIME_PERIODS } from "./constants";
import { useHealthWatch } from "./hooks";

export const HealthWatchSummary = () => {
  const {
    timePeriod,
    setTimePeriod,
    issues,
    summary,
    isAddDialogOpen,
    setIsAddDialogOpen,
    newIssue,
    handleNewIssueChange,
    handleAddIssue,
  } = useHealthWatch();

  const { openFlockMortalityReport } = useChatWidgetStore();

  const handleAddIssueClick = () => {
    openFlockMortalityReport();
  };

  return (
    <div className="bg-card rounded-lg border border-border pt-4 space-y-4">
      {/* Header */}
      <div className="px-4 flex justify-between gap-4">
        <div>
          <h3 className="text-foreground font-display font-medium text-base tracking-tight">
            Health Watch Summary
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitor health issues and mortality patterns
          </p>
        </div>
        <Button onClick={handleAddIssueClick} variant="native">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Time Period Toggle */}
      <div className="px-4 flex items-center justify-between">
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
      <div className="px-4">
        <SmileyMeter summary={summary} />
      </div>

      {/* Issue Summary */}
      <div className="px-4 space-y-2">
        <p className="text-base font-medium text-foreground font-display">
          Issue Summary
        </p>
        <IssueSummary summary={summary} />
      </div>

      {/* Recent Issues */}
      <div className="px-4 bg-muted/20 py-4 rounded-b-lg">
        <div className="pb-2">
          <span className="text-base font-medium text-foreground">
            Recent Issues
          </span>
        </div>
        <IssueList issues={issues} maxItems={5} />
      </div>

      {/* Add Issue Dialog */}
      <AddIssueDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newIssue={newIssue}
        onNewIssueChange={handleNewIssueChange}
        onAddIssue={handleAddIssue}
      />
    </div>
  );
};
