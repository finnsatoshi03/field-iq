import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, Sparkles, Star } from "lucide-react";
import React from "react";

interface DailyPlannerProps {
  className?: string;
}

const DailyPlanner: React.FC<DailyPlannerProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg p-4 relative overflow-hidden",
        "opacity-60 cursor-not-allowed",
        className,
      )}
    >
      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/80 to-muted/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="flex items-center justify-center mb-2">
            <Sparkles className="h-6 w-6 text-primary mr-2 animate-pulse" />
            <Star className="h-5 w-5 text-yellow-500 animate-bounce" />
          </div>
          <h3 className="font-display font-semibold text-foreground mb-1">
            Coming Soon
          </h3>
          <p className="text-xs text-muted-foreground">
            Daily planning features are being developed
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-display font-medium text-sm text-foreground">
            Daily Planner
          </h3>
        </div>
        <Badge variant="secondary" className="text-xs bg-muted">
          Beta Feature
        </Badge>
      </div>

      {/* Mock Content (Blurred) */}
      <div className="space-y-3 filter blur-sm pointer-events-none">
        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground">
              Today's Tasks
            </span>
            <span className="text-xs text-muted-foreground">
              3 of 5 completed
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-green-600"></div>
              <span className="text-xs text-muted-foreground line-through">
                Visit Makiling Farm
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-green-600"></div>
              <span className="text-xs text-muted-foreground line-through">
                Follow up with client
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm border-2 border-muted"></div>
              <span className="text-xs text-foreground">
                Update CRM records
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm border-2 border-muted"></div>
              <span className="text-xs text-foreground">
                Prepare tomorrow's schedule
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted/30">
          <span className="text-xs font-medium text-foreground mb-2 block">
            Estimated Time Remaining
          </span>
          <div className="flex items-center gap-2">
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-3/5"></div>
            </div>
            <span className="text-xs text-muted-foreground">2.5h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyPlanner;
