import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TrainingBadge } from "../constants";
import { getRarityBadgeColor, formatDateRelative } from "../utils";

interface BadgeItemProps {
  badge: TrainingBadge & { canEarn?: boolean };
}

const BadgeItem: React.FC<BadgeItemProps> = ({ badge }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-colors",
        badge.earned
          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-900/10 dark:to-emerald-900/10 dark:border-green-800"
          : badge.canEarn
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-900/10 dark:to-indigo-900/10 dark:border-blue-800"
            : "bg-muted/30 border-muted-foreground/20"
      )}
    >
      <div
        className={cn(
          "text-2xl",
          badge.earned ? "grayscale-0" : "grayscale opacity-50"
        )}
      >
        {badge.icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4
            className={cn(
              "font-display font-medium text-sm tracking-tight",
              badge.earned ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {badge.name}
          </h4>
          <Badge
            className={cn(
              "text-[10px] px-2 h-fit py-0 rounded-sm",
              getRarityBadgeColor(badge.rarity)
            )}
          >
            {badge.rarity}
          </Badge>
        </div>
        <p
          className={cn(
            "text-xs",
            badge.earned ? "text-muted-foreground" : "text-muted-foreground/70"
          )}
        >
          {badge.description}
        </p>
        {badge.earnedDate && (
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            Earned {formatDateRelative(badge.earnedDate)}
          </div>
        )}
        {badge.canEarn && (
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Ready to earn!
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeItem;
