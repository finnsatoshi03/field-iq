import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserProgress } from "../constants";
import { getMotivationalMessage } from "../utils";

interface QuickStatsProps {
  progress: UserProgress;
}

const QuickStats: React.FC<QuickStatsProps> = ({ progress }) => {
  const motivationalMessage = getMotivationalMessage(progress);

  return (
    <div className="bg-muted/20 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-display font-medium text-sm tracking-tight">
          Your Progress
        </h4>
        <Badge variant="outline" className="text-xs">
          {progress.overallProgress}% Complete
        </Badge>
      </div>

      {/* Overall Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              progress.overallProgress >= 75 ? "bg-green-600" : "bg-blue-600"
            )}
            style={{ width: `${progress.overallProgress}%` }}
          />
        </div>
        <div className="text-xs text-center text-muted-foreground">
          {motivationalMessage}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className="font-display font-semibold text-lg text-foreground">
            {progress.completedModules}
          </div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
        <div className="text-center">
          <div className="font-display font-semibold text-lg text-foreground">
            {progress.totalPoints}
          </div>
          <div className="text-xs text-muted-foreground">Points</div>
        </div>
        <div className="text-center">
          <div className="font-display font-semibold text-lg text-foreground">
            {progress.earnedBadges}
          </div>
          <div className="text-xs text-muted-foreground">Badges</div>
        </div>
        <div className="text-center">
          <div className="font-display font-semibold text-lg text-foreground">
            {progress.streak}
          </div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
