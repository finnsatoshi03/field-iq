import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { SalesGoal } from "@/features/admin/types";
import { useUserStore } from "@/store";
import {
  AlertTriangle,
  Eye,
  Loader2,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AllGoalsDialog,
  SalesChart,
  SalesGoalDialog,
  ViewToggle,
} from "./components";
import type { ViewMode } from "./constants";
import { VIEW_MODES } from "./constants";
import {
  useAdminSales,
  useCreateSalesGoal,
  useCurrentSalesGoal,
  useSalesGoals,
  useUpdateSalesGoal,
} from "./hooks";
import {
  calculateSalesMetrics,
  getChartData,
  sortChartData,
  transformApiDataToSalesData,
} from "./utils";

interface SalesActivitySummaryProps {
  companyId: number;
}

const SalesActivitySummary: React.FC<SalesActivitySummaryProps> = ({
  companyId,
}) => {
  const { user } = useUserStore();
  const [viewMode, setViewMode] = useState<ViewMode>(VIEW_MODES.REGION);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [allGoalsDialogOpen, setAllGoalsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SalesGoal | null>(null);

  // Fetch data using our hooks
  const {
    data: salesData,
    isLoading,
    error,
    refetch,
  } = useAdminSales(companyId);

  const { data: currentGoalData, isLoading: goalLoading } =
    useCurrentSalesGoal(companyId);

  const { data: allGoalsData, isLoading: allGoalsLoading } =
    useSalesGoals(companyId);

  const createGoalMutation = useCreateSalesGoal();
  const updateGoalMutation = useUpdateSalesGoal();

  const currentGoal = currentGoalData?.data;
  const allGoals = allGoalsData?.data || [];

  const handleViewChange = (newView: ViewMode) => {
    setViewMode(newView);
  };

  const handleEditGoal = (goal: SalesGoal) => {
    setEditingGoal(goal);
    setAllGoalsDialogOpen(false);
    setGoalDialogOpen(true);
  };

  const handleCloseGoalDialog = () => {
    setGoalDialogOpen(false);
    setEditingGoal(null);
  };

  const handleCreateNewGoal = () => {
    setEditingGoal(null); // Clear any editing goal
    setGoalDialogOpen(true);
  };

  const handleSaveGoal = async (goalData: {
    target_amount: number;
    period_start: string;
    period_end: string;
  }) => {
    if (!user?.id) {
      toast.error("User information not available");
      return;
    }

    try {
      if (editingGoal) {
        // Update specific goal being edited
        const updatePromise = updateGoalMutation.mutateAsync({
          goalId: editingGoal.id,
          goalData: { target_amount: goalData.target_amount },
          companyId,
        });

        toast.promise(updatePromise, {
          loading: "Updating sales goal...",
          success: "Sales goal updated successfully!",
          error: "Failed to update sales goal",
        });

        await updatePromise;
      } else if (currentGoal) {
        // Update current goal if no specific goal is being edited
        const updatePromise = updateGoalMutation.mutateAsync({
          goalId: currentGoal.id,
          goalData: { target_amount: goalData.target_amount },
          companyId,
        });

        toast.promise(updatePromise, {
          loading: "Updating sales goal...",
          success: "Sales goal updated successfully!",
          error: "Failed to update sales goal",
        });

        await updatePromise;
      } else {
        // Create new goal
        const createPromise = createGoalMutation.mutateAsync({
          company_id: companyId,
          target_amount: goalData.target_amount,
          period_start: goalData.period_start,
          period_end: goalData.period_end,
          created_by: Number(user.id),
        });

        toast.promise(createPromise, {
          loading: "Creating sales goal...",
          success: "Sales goal created successfully!",
          error: "Failed to create sales goal",
        });

        await createPromise;
      }
    } catch (error) {
      console.error("Error saving sales goal:", error);
    }
  };

  // Loading state
  if (isLoading || allGoalsLoading) {
    return (
      <div className="bg-card space-y-4 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
              Sales Dashboard
            </h3>
            <p className="text-muted-foreground text-sm font-sans">
              Track your sales performance and goals
            </p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>

        <div className="h-96 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading sales data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-card space-y-4 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
              Sales Dashboard
            </h3>
            <p className="text-muted-foreground text-sm font-sans">
              Track your sales performance and goals
            </p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Error loading data</span>
          </div>
        </div>

        <div className="h-96 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-sm mb-2">
              Failed to load sales data: {error.message}
            </p>
            <button
              onClick={() => refetch()}
              className="text-xs text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Transform API data to component format
  const transformedData = salesData?.data
    ? transformApiDataToSalesData(salesData.data)
    : [];
  const salesMetrics = calculateSalesMetrics(transformedData);
  const chartData = sortChartData(getChartData(transformedData, viewMode));

  // Calculate goal progress for current goal
  const goalProgress = currentGoal
    ? Math.min(
        (salesMetrics.totalClosedSales / currentGoal.target_amount) * 100,
        100,
      )
    : 0;

  // Empty state
  if (transformedData.length === 0) {
    return (
      <div className="bg-card space-y-4 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
              Sales Dashboard
            </h3>
            <p className="text-muted-foreground text-sm font-sans">
              Track your sales performance and goals
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ViewToggle
              currentView={viewMode}
              onViewChange={handleViewChange}
            />
            {allGoals.length > 0 && (
              <Button
                onClick={() => setAllGoalsDialogOpen(true)}
                size="sm"
                variant="outline"
                className="gap-2"
                disabled={allGoalsLoading}
              >
                <Eye className="h-4 w-4" />
                View All Goals ({allGoals.length})
              </Button>
            )}
            <Button
              onClick={handleCreateNewGoal}
              size="sm"
              variant="outline"
              className="gap-2"
              disabled={goalLoading || allGoalsLoading}
            >
              <Plus className="h-4 w-4" />
              Create New Goal
            </Button>
            {currentGoal && (
              <Button
                onClick={() => {
                  setEditingGoal(currentGoal);
                  setGoalDialogOpen(true);
                }}
                size="sm"
                variant="outline"
                className="gap-2"
                disabled={goalLoading || allGoalsLoading}
              >
                <Target className="h-4 w-4" />
                Update Current Goal
              </Button>
            )}
          </div>
        </div>

        <div className="h-96 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-display font-medium text-foreground mb-2">
              No sales data yet
            </h3>
            <p className="text-sm">
              Sales data will appear here once you have sales activities.
            </p>
          </div>
        </div>

        {/* Sales Goal Dialog */}
        <SalesGoalDialog
          isOpen={goalDialogOpen}
          onClose={handleCloseGoalDialog}
          onSave={handleSaveGoal}
          currentGoal={editingGoal || currentGoal}
          existingGoals={allGoals}
          isLoading={
            createGoalMutation.isPending || updateGoalMutation.isPending
          }
          mode={editingGoal || currentGoal ? "update" : "create"}
        />

        {/* All Goals Dialog */}
        <AllGoalsDialog
          isOpen={allGoalsDialogOpen}
          onClose={() => setAllGoalsDialogOpen(false)}
          goals={allGoals}
          salesMetrics={salesMetrics}
          onEditGoal={handleEditGoal}
          onCreateNew={() => {
            setAllGoalsDialogOpen(false);
            handleCreateNewGoal();
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-card space-y-4 rounded-lg border border-border p-4">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-foreground font-display font-semibold text-base tracking-tight">
              Sales Dashboard
            </h3>
            <p className="text-muted-foreground text-sm font-sans">
              Track your sales performance and goals
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <ViewToggle
              currentView={viewMode}
              onViewChange={handleViewChange}
            />
            <div className="flex items-center flex-wrap gap-2">
              {allGoals.length > 0 && (
                <Button
                  onClick={() => setAllGoalsDialogOpen(true)}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  disabled={allGoalsLoading}
                >
                  <Eye className="h-4 w-4" />
                  View All Goals ({allGoals.length})
                </Button>
              )}
              <Button
                onClick={handleCreateNewGoal}
                size="sm"
                variant="outline"
                className="gap-2"
                disabled={goalLoading || allGoalsLoading}
              >
                <Plus className="h-4 w-4" />
                Create New Goal
              </Button>
              {currentGoal && (
                <Button
                  onClick={() => {
                    setEditingGoal(currentGoal);
                    setGoalDialogOpen(true);
                  }}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  disabled={goalLoading || allGoalsLoading}
                >
                  <Target className="h-4 w-4" />
                  Update Current Goal
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Current Goal Progress - show only current goal */}
        {currentGoal && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">
                  Current Goal Progress
                </h4>
              </div>
              <Badge
                variant={
                  goalProgress >= 100
                    ? "default"
                    : goalProgress >= 75
                      ? "secondary"
                      : "outline"
                }
                className={`font-medium ${
                  goalProgress >= 100
                    ? "bg-green-100 text-green-800"
                    : goalProgress >= 75
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {goalProgress.toFixed(1)}% Complete
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 font-display">
                  ₱{salesMetrics.totalClosedSales.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Sales Made</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 font-display">
                  ₱{currentGoal.target_amount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Goal Amount</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 font-display flex items-center justify-center gap-1">
                  <TrendingUp className="h-5 w-5" />₱
                  {(
                    currentGoal.target_amount - salesMetrics.totalClosedSales
                  ).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Still Needed</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  goalProgress >= 100
                    ? "bg-green-500"
                    : goalProgress >= 75
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(goalProgress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Summary moved to top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-1" />
                <span className="text-xs font-semibold text-muted-foreground font-sans">
                  Volume Influenced
                </span>
              </div>
              <span className="text-2xl font-bold text-foreground font-sans">
                ₱{salesMetrics.totalInfluencedVolume.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-2" />
                <span className="text-xs font-semibold text-muted-foreground font-sans">
                  Closed Sales
                </span>
              </div>
              <span className="text-2xl font-bold text-foreground font-sans">
                ₱{salesMetrics.totalClosedSales.toLocaleString()}
              </span>
            </div>
          </div>
          {/* Additional Metrics */}
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-1">
              <div className="w-2 h-2 rounded-full bg-chart-3" />
              <span className="text-xs font-semibold text-muted-foreground font-sans">
                Success Rate
              </span>
            </div>
            <span className="text-2xl font-bold text-foreground font-sans">
              {(
                (salesMetrics.totalClosedSales /
                  salesMetrics.totalInfluencedVolume) *
                100
              ).toFixed(1)}
              %
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-1">
              <div className="w-2 h-2 rounded-full bg-chart-4" />
              <span className="text-xs font-semibold text-muted-foreground font-sans">
                Growth Rate
              </span>
            </div>
            <span className="text-2xl font-bold text-foreground font-sans">
              {salesMetrics.averageGrowthRate.toFixed(1)}%
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-1">
              <div className="w-2 h-2 rounded-full bg-chart-5" />
              <span className="text-xs font-semibold text-muted-foreground font-sans">
                Active {viewMode === VIEW_MODES.REGION ? "Areas" : "Reps"}
              </span>
            </div>
            <span className="text-2xl font-bold text-foreground font-sans">
              {chartData.length}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-96">
        <SalesChart data={chartData} height={384} />
      </div>

      {/* Sales Goal Dialog */}
      <SalesGoalDialog
        isOpen={goalDialogOpen}
        onClose={handleCloseGoalDialog}
        onSave={handleSaveGoal}
        currentGoal={editingGoal || currentGoal}
        existingGoals={allGoals}
        isLoading={createGoalMutation.isPending || updateGoalMutation.isPending}
        mode={editingGoal || currentGoal ? "update" : "create"}
      />

      {/* All Goals Dialog */}
      <AllGoalsDialog
        isOpen={allGoalsDialogOpen}
        onClose={() => setAllGoalsDialogOpen(false)}
        goals={allGoals}
        salesMetrics={salesMetrics}
        onEditGoal={handleEditGoal}
        onCreateNew={() => {
          setAllGoalsDialogOpen(false);
          handleCreateNewGoal();
        }}
      />
    </div>
  );
};

export default SalesActivitySummary;
