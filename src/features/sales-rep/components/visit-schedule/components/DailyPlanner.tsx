import React, { useState } from "react";
import {
  CheckCircle,
  Circle,
  Clock,
  Target,
  Plus,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type DailyPlan, type Task, mockDailyPlans } from "../constants";
import {
  formatDateOnly,
  getDayOfWeekLabel,
  calculateTaskProgress,
  getTotalEstimatedDuration,
  formatDuration,
} from "../utils";
import { cn } from "@/lib/utils";

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
            task.completed && "line-through text-muted-foreground"
          )}
        >
          {task.title}
        </h4>
        <p
          className={cn(
            "text-xs text-muted-foreground",
            task.completed && "line-through"
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
              "text-sm font-medium font-sans",
              isToday && "text-blue-600 dark:text-blue-400"
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
                "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
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
            progress === 100 ? "bg-green-600" : "bg-blue-600"
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

const AddDayPlanDialog: React.FC<{
  onAddPlan: (plan: Omit<DailyPlan, "id">) => void;
}> = ({ onAddPlan }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    tasks: [] as Omit<Task, "id">[],
    newTask: {
      title: "",
      description: "",
      type: "visit" as Task["type"],
      estimatedDuration: 60,
    },
  });

  const handleAddTask = () => {
    if (!formData.newTask.title.trim()) return;

    setFormData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, { ...prev.newTask, completed: false }],
      newTask: {
        title: "",
        description: "",
        type: "visit" as Task["type"],
        estimatedDuration: 60,
      },
    }));
  };

  const handleRemoveTask = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (!formData.date || formData.tasks.length === 0) return;

    const newPlan: Omit<DailyPlan, "id"> = {
      date: new Date(formData.date),
      tasks: formData.tasks.map((task, index) => ({
        ...task,
        id: `new-task-${Date.now()}-${index}`,
      })),
      totalVisits: formData.tasks.filter((t) => t.type === "visit").length,
      completedVisits: 0,
    };

    onAddPlan(newPlan);
    setFormData({
      date: "",
      tasks: [],
      newTask: {
        title: "",
        description: "",
        type: "visit",
        estimatedDuration: 60,
      },
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
          <Plus className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
          <span className="text-sm text-muted-foreground">
            Add new day plan
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Create New Day Plan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="plan-date">Select Date</Label>
            <Input
              id="plan-date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full"
            />
          </div>

          {/* Tasks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Tasks ({formData.tasks.length})</Label>
              <Badge variant="outline" className="text-xs">
                Total:{" "}
                {formatDuration(
                  formData.tasks.reduce(
                    (sum, task) => sum + task.estimatedDuration,
                    0
                  )
                )}
              </Badge>
            </div>

            {/* Existing Tasks */}
            {formData.tasks.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                {formData.tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{task.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {task.description}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px]">
                          {task.type.replace("_", " ")}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {formatDuration(task.estimatedDuration)}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTask(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Task Form */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-sm">Add New Task</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input
                    id="task-title"
                    placeholder="Enter task title"
                    value={formData.newTask.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        newTask: { ...prev.newTask, title: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-type">Task Type</Label>
                  <Select
                    value={formData.newTask.type}
                    onValueChange={(value: Task["type"]) =>
                      setFormData((prev) => ({
                        ...prev,
                        newTask: { ...prev.newTask, type: value },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visit">Visit</SelectItem>
                      <SelectItem value="follow_up">Follow Up</SelectItem>
                      <SelectItem value="administrative">
                        Administrative
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Input
                  id="task-description"
                  placeholder="Enter task description"
                  value={formData.newTask.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      newTask: { ...prev.newTask, description: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-duration">
                  Estimated Duration (minutes)
                </Label>
                <Input
                  id="task-duration"
                  type="number"
                  min="15"
                  max="480"
                  step="15"
                  value={formData.newTask.estimatedDuration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      newTask: {
                        ...prev.newTask,
                        estimatedDuration: parseInt(e.target.value) || 60,
                      },
                    }))
                  }
                />
              </div>
              <Button
                onClick={handleAddTask}
                disabled={!formData.newTask.title.trim()}
                className="w-full"
                size="sm"
              >
                Add Task
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.date || formData.tasks.length === 0}
          >
            Create Day Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
                  : task
              ),
            }
          : plan
      )
    );
  };

  const handleAddPlan = (newPlanData: Omit<DailyPlan, "id">) => {
    const newPlan: DailyPlan = {
      ...newPlanData,
      id: `plan-${Date.now()}`,
    };
    setDailyPlans((prevPlans) =>
      [...prevPlans, newPlan].sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      )
    );
  };

  const totalTasks = dailyPlans.reduce(
    (sum, plan) => sum + plan.tasks.length,
    0
  );
  const completedTasks = dailyPlans.reduce(
    (sum, plan) => sum + plan.tasks.filter((task) => task.completed).length,
    0
  );
  const overallProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div
      className={cn("bg-card rounded-lg border border-border p-4", className)}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
            Daily Planner
          </h3>
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              overallProgress === 100 &&
                "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
            )}
          >
            {overallProgress}% complete
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Track your daily tasks and visit schedules
        </p>
      </div>

      <div className="space-y-4">
        {dailyPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onTaskToggle={handleTaskToggle} />
        ))}

        <AddDayPlanDialog onAddPlan={handleAddPlan} />
      </div>
    </div>
  );
};

export default DailyPlanner;
