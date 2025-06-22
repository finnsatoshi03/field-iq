import React, { useState } from "react";
import {
  GraduationCap,
  Trophy,
  ChevronRight,
  Book,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModuleItem, BadgeItem, QuickStats } from "./components";
import {
  mockTrainingModules,
  mockTrainingBadges,
  mockUserProgress,
} from "./constants";
import { getInProgressModules, getOverdueModules } from "./utils";

const TrainingTracker: React.FC = () => {
  const [modules] = useState(mockTrainingModules);
  const [badges] = useState(mockTrainingBadges);

  const inProgressModules = getInProgressModules(modules);
  const overdueModules = getOverdueModules(modules);
  const recentModules = [...inProgressModules, ...overdueModules].slice(0, 3);
  const earnedBadges = badges.filter((badge) => badge.earned);

  return (
    <div className="bg-card rounded-lg border border-border pt-4 space-y-6">
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-foreground font-display font-medium text-base tracking-tight">
            Training Progress
          </h3>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className="text-xs">
              {mockUserProgress.overallProgress}% Complete
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Track your learning journey and earn badges
        </p>
      </div>

      {/* Achievement Badges Section */}
      <div className="px-4 bg-muted/20 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-foreground font-display font-medium text-sm tracking-tight">
            Achievement Badges
          </h4>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <Badge variant="outline" className="text-xs">
              {earnedBadges.length}/{badges.length} earned
            </Badge>
          </div>
        </div>

        {earnedBadges.length > 0 ? (
          <div className="space-y-2">
            {earnedBadges.slice(0, 2).map((badge) => (
              <BadgeItem key={badge.id} badge={badge} simplified />
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <div className="text-muted-foreground text-sm">
              No badges earned yet
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Complete training modules to earn your first badge!
            </div>
          </div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 px-3 py-2 cursor-pointer hover:border-muted-foreground/50 transition-colors">
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground font-sans">
                  View badge collection
                </span>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Badge Collection
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {badges.map((badge) => (
                <BadgeItem key={badge.id} badge={badge} />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="px-4">
        <QuickStats progress={mockUserProgress} />
      </div>

      {/* Current Training Modules */}
      <div className="space-y-3 px-4">
        <div className="flex items-center justify-between">
          <h4 className="font-display font-medium text-sm tracking-tight">
            Current Training
          </h4>
          {recentModules.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {recentModules.length} active
            </Badge>
          )}
        </div>

        {recentModules.length > 0 ? (
          <div className="space-y-2">
            {recentModules.map((module) => (
              <ModuleItem key={module.id} module={module} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Book className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <div className="text-muted-foreground text-sm">
              No active training modules
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Great job staying current!
            </div>
          </div>
        )}

        {modules.length > recentModules.length && (
          <Dialog>
            <DialogTrigger asChild>
              <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 px-3 py-2 mb-4 cursor-pointer hover:border-muted-foreground/50 transition-colors">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-muted-foreground font-sans">
                    View all training modules
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  All Training Modules
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                {modules.map((module) => (
                  <ModuleItem key={module.id} module={module} />
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default TrainingTracker;
