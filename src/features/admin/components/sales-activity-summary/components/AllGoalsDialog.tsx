import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SalesGoal } from "@/features/admin/types";
import { Calendar, Clock, Edit, Plus, Target } from "lucide-react";

interface AllGoalsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  goals: SalesGoal[];
  salesMetrics: { totalClosedSales: number };
  onEditGoal: (goal: SalesGoal) => void;
  onCreateNew: () => void;
}

// Helper function to format date ranges
const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startFormatted = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const endFormatted = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startFormatted} - ${endFormatted}`;
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "future":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "locked":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const AllGoalsDialog: React.FC<AllGoalsDialogProps> = ({
  isOpen,
  onClose,
  goals,
  salesMetrics,
  onEditGoal,
  onCreateNew,
}) => {
  if (goals.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              All Sales Goals
            </DialogTitle>
          </DialogHeader>
          <div className="text-center text-muted-foreground py-8">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No sales goals set yet</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Sort goals: active first, then future, then locked
  const sortedGoals = [...goals].sort((a, b) => {
    const statusOrder = { active: 0, future: 1, locked: 2 };
    const aOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
    const bOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 3;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    // If same status, sort by period start date
    return (
      new Date(a.period_start).getTime() - new Date(b.period_start).getTime()
    );
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              All Sales Goals ({goals.length})
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="grid gap-4 mt-4">
          <Button onClick={onCreateNew} size="sm" className="gap-1">
            <Plus className="h-3 w-3" />
            Create New
          </Button>
          {sortedGoals.map((goal) => {
            const isActive = goal.status === "active";
            const progress = isActive
              ? Math.min(
                  (salesMetrics.totalClosedSales / goal.target_amount) * 100,
                  100,
                )
              : 0;

            return (
              <Card
                key={goal.id}
                className={`${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-green-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3">
                    {/* Top row: Status and Edit button */}
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`${getStatusColor(goal.status || "future")} font-medium`}
                      >
                        {goal.status === "active" && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {goal.status === "future" && (
                          <Calendar className="h-3 w-3 mr-1" />
                        )}
                        {goal.status
                          ? goal.status.charAt(0).toUpperCase() +
                            goal.status.slice(1)
                          : "Unknown"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditGoal(goal)}
                        className="gap-1 shrink-0"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </div>

                    {/* Bottom row: Date range and target amount */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {formatDateRange(goal.period_start, goal.period_end)}
                      </span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">
                          ₱{goal.target_amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Target
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {isActive && (
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          ₱{salesMetrics.totalClosedSales.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">Achieved</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {progress.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-600">Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">
                          ₱
                          {(
                            goal.target_amount - salesMetrics.totalClosedSales
                          ).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">Remaining</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress >= 100
                            ? "bg-green-500"
                            : progress >= 75
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AllGoalsDialog;
