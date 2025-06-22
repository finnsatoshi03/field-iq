import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, TrendingUp } from "lucide-react";
import { TIME_PERIODS } from "./constants";
import { useHealthWatch } from "./hooks";
import {
  SmileyMeter,
  IssueSummary,
  IssueList,
  AddIssueDialog,
} from "./components";

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

  return (
    <div className="bg-card rounded-lg border border-border pt-4 space-y-6">
      {/* Header */}
      <div className="px-4">
        <h3 className="text-foreground font-display font-medium text-base tracking-tight">
          Health Watch Summary
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          Monitor health issues and mortality patterns
        </p>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Issue
        </Button>
      </div>

      {/* Time Period Toggle */}
      <div className="px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Time Period</span>
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
      <div className="px-4">
        <div className="pb-2 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-base font-medium text-foreground">
            Issue Summary
          </span>
        </div>
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
