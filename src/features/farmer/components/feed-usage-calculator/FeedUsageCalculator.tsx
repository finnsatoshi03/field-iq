import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ExpandableCard from "@/components/ui/expandable-card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { FarmerDashboardViewModel } from "@/services/field-iq-service";
import { AlertTriangle, Package, Wheat } from "lucide-react";
import { useState } from "react";
import { ALERT_COLORS, ALERT_MESSAGES } from "./constants";
import { formatCurrency, formatDays, formatWeight } from "./utils";

interface FeedUsageCalculatorProps {
  dashboardData?: FarmerDashboardViewModel;
}

export const FeedUsageCalculator: React.FC<FeedUsageCalculatorProps> = ({
  dashboardData,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract feed calculation data from API response
  const feedCalcData = dashboardData?.feed_calculation_log;

  // Normalize animal type from API format to component format
  const normalizeAnimalType = (apiType: string): "broiler" | "layer" => {
    return apiType === "broilers" ? "broiler" : "layer";
  };

  // Normalize alert level to ensure type safety
  const normalizeAlertLevel = (
    level: string,
  ): "low" | "medium" | "high" | "good" => {
    if (
      level === "low" ||
      level === "medium" ||
      level === "high" ||
      level === "good"
    ) {
      return level;
    }
    return "medium"; // fallback
  };

  const getStockProgress = () => {
    if (!feedCalcData) return 0;
    const maxDays = 14; // 2 weeks
    return Math.min((feedCalcData.reorder_point_days / maxDays) * 100, 100);
  };

  // Show loading state if no data
  if (!feedCalcData) {
    return (
      <ExpandableCard
        title="Feed Usage Calculator"
        summary={
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wheat className="h-4 w-4" />
            <span className="text-sm">Loading calculator data...</span>
          </div>
        }
        className="h-fit"
      >
        <div className="space-y-4">
          <div className="rounded-lg p-4 border">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">No calculation data available</p>
            </div>
          </div>
        </div>
      </ExpandableCard>
    );
  }

  // Summary content - show key calculation results
  const summaryContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Wheat className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-foreground">
            {feedCalcData.bags_needed_per_week.toFixed(1)} bags/week
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {feedCalcData.current_stock_bags} bags in stock
          </span>
        </div>
      </div>
      {/* Only show badge when collapsed */}
      {!isExpanded && (
        <Badge
          className={
            ALERT_COLORS[normalizeAlertLevel(feedCalcData.alert_level)]
          }
        >
          {ALERT_MESSAGES[normalizeAlertLevel(feedCalcData.alert_level)]}
        </Badge>
      )}
    </div>
  );

  return (
    <ExpandableCard
      title="Feed Usage Calculator"
      summary={summaryContent}
      onToggle={(expanded: boolean) => setIsExpanded(expanded)}
      className="h-fit"
    >
      <div className="space-y-4">
        {/* Quick Stats Display */}
        <>
          {/* Main Calculation Result */}
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center col-span-2 rounded-md p-2 bg-muted/50">
              <div className="text-2xl font-medium font-display">
                {feedCalcData.bags_needed_per_week.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 font-medium">
                <Wheat className="size-4 text-blue-600" />
                bags needed per week
              </p>
            </div>

            <div className="rounded-md p-2 bg-muted/50">
              <p className="font-medium text-xs text-muted-foreground">
                Daily Usage
              </p>
              <p className="text-lg font-medium font-display">
                {formatWeight(feedCalcData.daily_consumption_kg)}
              </p>
            </div>
            <div className="rounded-md p-2 bg-muted/50">
              <p className="font-medium text-xs text-muted-foreground">
                Weekly Cost
              </p>
              <p className="text-lg font-medium font-display">
                {formatCurrency(feedCalcData.cost_per_week_php)}
              </p>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md p-2 bg-blue-50 border border-blue-200">
              <p className="font-medium text-xs text-blue-600">
                Weekly Consumption
              </p>
              <p className="text-lg font-medium font-display text-blue-700">
                {formatWeight(feedCalcData.weekly_consumption_kg)}
              </p>
            </div>
            <div className="rounded-md p-2 bg-gray-50 border border-gray-200">
              <p className="font-medium text-xs text-gray-600">Animals</p>
              <p className="text-lg font-medium font-display text-gray-700">
                {feedCalcData.number_of_animals.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Reorder Alert Bar */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-display font-medium">
                  Current Stock Status
                </span>
                <Badge
                  className={
                    ALERT_COLORS[normalizeAlertLevel(feedCalcData.alert_level)]
                  }
                >
                  {
                    ALERT_MESSAGES[
                      normalizeAlertLevel(feedCalcData.alert_level)
                    ]
                  }
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground text-xs font-medium">
                    {formatDays(feedCalcData.reorder_point_days)} remaining
                  </span>
                  <span className="font-display font-medium">
                    {feedCalcData.current_stock_bags} bags in stock
                  </span>
                </div>
                <Progress value={getStockProgress()} />
              </div>
            </div>

            {normalizeAlertLevel(feedCalcData.alert_level) !== "good" && (
              <div className="flex items-center gap-2 p-3 bg-yellow-100 -mx-4 border-t border-b border-yellow-600">
                <AlertTriangle
                  className="size-4 text-yellow-600"
                  strokeWidth={3}
                />
                <div>
                  <p className="font-display text-yellow-600 font-medium">
                    Recommended Action
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Order {Math.ceil(feedCalcData.bags_needed_per_week)} bags to
                    maintain optimal stock levels
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action */}
          <Button
            variant="outline"
            size="sm"
            className="w-full text-muted-foreground text-xs"
            onClick={() => setIsDialogOpen(true)}
          >
            <Package className="size-4" />
            View Calculation Details
          </Button>
        </>
      </div>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              Feed Calculation Details
            </DialogTitle>
            <DialogDescription>
              Current feed usage calculation based on your farm parameters
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Farm Details */}
            <div>
              <h4 className="font-display font-medium mb-3">Farm Details</h4>
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Number of Animals
                  </p>
                  <p className="text-lg font-display font-medium">
                    {feedCalcData.number_of_animals.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Feed Frequency
                  </p>
                  <p className="text-lg font-display font-medium">
                    {feedCalcData.feed_frequency}x per day
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Animal Type</p>
                  <p className="text-lg font-display font-medium capitalize">
                    {normalizeAnimalType(feedCalcData.animal_type)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Feed Stage</p>
                  <p className="text-lg font-display font-medium capitalize">
                    {feedCalcData.feed_stage}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Feed & Cost Details */}
            <div>
              <h4 className="font-display font-medium mb-3">
                Feed & Cost Details
              </h4>
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Bag Size</p>
                  <p className="text-lg font-display font-medium">
                    {feedCalcData.bag_size_kg} kg
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cost per Bag</p>
                  <p className="text-lg font-display font-medium">
                    {formatCurrency(feedCalcData.bag_cost_php)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Stock</p>
                  <p className="text-lg font-display font-medium">
                    {feedCalcData.current_stock_bags} bags
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stock Value</p>
                  <p className="text-lg font-display font-medium">
                    {formatCurrency(
                      feedCalcData.current_stock_bags *
                        feedCalcData.bag_cost_php,
                    )}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Consumption Metrics */}
            <div>
              <h4 className="font-display font-medium mb-3">
                Consumption Metrics
              </h4>
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="text-sm text-blue-600">Daily Consumption</p>
                  <p className="text-xl font-display font-medium text-blue-700">
                    {formatWeight(feedCalcData.daily_consumption_kg)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Weekly Consumption</p>
                  <p className="text-xl font-display font-medium text-blue-700">
                    {formatWeight(feedCalcData.weekly_consumption_kg)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Bags per Week</p>
                  <p className="text-xl font-display font-medium text-blue-700">
                    {feedCalcData.bags_needed_per_week.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Weekly Cost</p>
                  <p className="text-xl font-display font-medium text-blue-700">
                    {formatCurrency(feedCalcData.cost_per_week_php)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Stock Alert */}
            <div>
              <h4 className="font-display font-medium mb-3">Stock Status</h4>
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor:
                    normalizeAlertLevel(feedCalcData.alert_level) === "low"
                      ? "#fef2f2"
                      : normalizeAlertLevel(feedCalcData.alert_level) ===
                          "medium"
                        ? "#fffbeb"
                        : "#f0f9ff",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    className={
                      ALERT_COLORS[
                        normalizeAlertLevel(feedCalcData.alert_level)
                      ]
                    }
                  >
                    {
                      ALERT_MESSAGES[
                        normalizeAlertLevel(feedCalcData.alert_level)
                      ]
                    }
                  </Badge>
                  <span className="text-sm font-medium">
                    {formatDays(feedCalcData.reorder_point_days)} remaining
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on current consumption rates, you have approximately{" "}
                  <strong>{formatDays(feedCalcData.reorder_point_days)}</strong>{" "}
                  of feed remaining.
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center text-xs text-muted-foreground border-t pt-4">
              Last updated:{" "}
              {new Date(feedCalcData.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ExpandableCard>
  );
};
