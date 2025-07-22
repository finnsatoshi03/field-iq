import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useChatWidgetStore } from "@/store";
import { CheckCircle, Circle, Clock, Plus, Target } from "lucide-react";
import React, { useState } from "react";
import { type DailyPlan, type Task, mockDailyPlans } from "../constants";
import {
  calculateTaskProgress,
  formatDateOnly,
  formatDuration,
  getDayOfWeekLabel,
  getTotalEstimatedDuration,
} from "../utils";

interface DailyPlannerProps {
  className?: string;
}

const TaskItem: React.FC<{
  task: Task;
  onToggle: (taskId: string) => void;
}> = ({ task, onToggle }) => {
  const handleToggle = () => {
    onToggle(task.id);
  };

  const getTaskIcon = (type: Task["type"]) => {
    switch (type) {
      case "visit":
        return <Target className="h-3 w-3" />;
      case "follow_up":
        return <CheckCircle className="h-3 w-3" />;
      case "administrative":
        return <Clock className="h-3 w-3" />;
      default:
        return <Circle className="h-3 w-3" />;
    }
  };

  const getTaskColor = (type: Task["type"]) => {
    switch (type) {
      case "visit":
        return "text-blue-600 dark:text-blue-400";
      case "follow_up":
        return "text-green-600 dark:text-green-400";
      case "administrative":
        return "text-orange-600 dark:text-orange-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleToggle}
        className="mt-0.5 border-black dark:border-white"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div
            className={cn("flex items-center gap-1", getTaskColor(task.type))}
          >
            {getTaskIcon(task.type)}
            <span className="text-xs font-medium capitalize">
              {task.type.replace("_", " ")}
            </span>
          </div>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {formatDuration(task.estimatedDuration)}
          </Badge>
        </div>
        <h4
          className={cn(
            "font-display font-medium text-sm tracking-tight mb-1",
            task.completed && "line-through text-muted-foreground",
          )}
        >
          {task.title}
        </h4>
        <p
          className={cn(
            "text-xs text-muted-foreground",
            task.completed && "line-through",
          )}
        >
          {task.description}
        </p>
      </div>
    </div>
  );
};

const PlanCard: React.FC<{
  plan: DailyPlan;
  onTaskToggle: (planId: string, taskId: string) => void;
}> = ({ plan, onTaskToggle }) => {
  const dayLabel = getDayOfWeekLabel(plan.date);
  const dateString = formatDateOnly(plan.date);
  const isToday = dayLabel === "Today";
  const progress = calculateTaskProgress(plan);
  const totalDuration = getTotalEstimatedDuration(plan.tasks);
  const completedTasks = plan.tasks.filter((task) => task.completed).length;

  const handleTaskToggle = (taskId: string) => {
    onTaskToggle(plan.id, taskId);
  };

  return (
    <div className="bg-muted/20 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span
            className={cn(
              "text-sm font-semibold font-sans",
              isToday && "text-blue-600 dark:text-blue-400",
            )}
          >
            {dayLabel}
          </span>
          {!isToday && (
            <span className="text-xs text-muted-foreground font-sans">
              {dateString}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              progress === 100 &&
                "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
            )}
          >
            {completedTasks}/{plan.tasks.length} tasks
          </Badge>
          <Badge variant="outline" className="text-xs">
            {formatDuration(totalDuration)}
          </Badge>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            progress === 100 ? "bg-green-600" : "bg-blue-600",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2">
        {plan.tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={handleTaskToggle} />
        ))}
      </div>
    </div>
  );
};

// New component to replace the dialog trigger
const AddDayPlanButton: React.FC = () => {
  const { openDailySalesReport } = useChatWidgetStore();

  const handleClick = () => {
    openDailySalesReport();
  };

  return (
    <button
      onClick={handleClick}
      className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer w-full"
    >
      <Plus className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
      <span className="text-sm text-muted-foreground">Add new day plan</span>
    </button>
  );
};

const DailyPlanner: React.FC<DailyPlannerProps> = ({ className }) => {
  const [dailyPlans, setDailyPlans] = useState(mockDailyPlans);

  const handleTaskToggle = (planId: string, taskId: string) => {
    setDailyPlans((prevPlans) =>
      prevPlans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              tasks: plan.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task,
              ),
            }
          : plan,
      ),
    );
  };

  const totalTasks = dailyPlans.reduce(
    (sum, plan) => sum + plan.tasks.length,
    0,
  );
  const completedTasks = dailyPlans.reduce(
    (sum, plan) => sum + plan.tasks.filter((task) => task.completed).length,
    0,
  );
  const overallProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div
      className={cn("bg-card rounded-lg border border-border p-4", className)}
    >
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 justify-between">
          <div className="leading-none">
            <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
              Daily Planner
            </h3>
            <p className="text-xs text-muted-foreground">
              Track your daily tasks and visit schedules
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-xs h-fit",
              overallProgress === 100 &&
                "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
            )}
          >
            {overallProgress}% complete
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {dailyPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onTaskToggle={handleTaskToggle} />
        ))}

        <AddDayPlanButton />
      </div>
    </div>
  );
};

export default DailyPlanner;
