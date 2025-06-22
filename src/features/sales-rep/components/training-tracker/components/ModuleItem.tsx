import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TrainingModule } from "../constants";
import {
  getStatusBadgeColor,
  getDifficultyBadgeColor,
  formatCategoryName,
  formatStatusName,
  formatDuration,
  formatDateRelative,
  isModuleOverdue,
} from "../utils";

interface ModuleItemProps {
  module: TrainingModule;
}

const ModuleItem: React.FC<ModuleItemProps> = ({ module }) => {
  const isOverdue = isModuleOverdue(module);

  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5 text-lg">{module.badgeIcon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex gap-2 mb-1">
                <h4 className="font-display font-medium text-sm tracking-tight">
                  {module.title}
                </h4>
                {module.isRequired && (
                  <Badge className="bg-red-600 text-red-50 text-[10px] px-2 mt-0.5 h-fit py-0 rounded-sm">
                    Required
                  </Badge>
                )}
                {isOverdue && (
                  <Badge className="bg-orange-600 text-orange-50 text-[10px] px-2 mt-0.5 h-fit py-0 rounded-sm">
                    Overdue
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {module.description}
              </p>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0",
                    getDifficultyBadgeColor(module.difficulty)
                  )}
                >
                  {formatCategoryName(module.difficulty)}
                </Badge>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {formatDuration(module.duration)}
                </Badge>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {module.points} pts
                </Badge>
              </div>
              {module.status === "in_progress" && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-xs font-medium">
                      {module.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="h-1.5 bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <Badge
                className={cn(
                  "text-[10px] px-2 h-fit py-0 rounded-sm mb-1",
                  getStatusBadgeColor(module.status)
                )}
              >
                {formatStatusName(module.status)}
              </Badge>
              {module.completedDate && (
                <div className="text-xs text-muted-foreground">
                  {formatDateRelative(module.completedDate)}
                </div>
              )}
              {module.dueDate && module.status !== "completed" && (
                <div
                  className={cn(
                    "text-xs",
                    isOverdue
                      ? "text-red-600 dark:text-red-400"
                      : "text-muted-foreground"
                  )}
                >
                  Due: {formatDateRelative(module.dueDate)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleItem;
