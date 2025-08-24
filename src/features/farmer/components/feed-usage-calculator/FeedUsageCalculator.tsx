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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  farmerV2Keys,
  useActiveFeedProduct,
  useCreateFeedCalculationLog,
  useFeedCalculationLog,
  useUpdateFeedCalculationLog,
} from "@/hooks/use-farmer-v2";
import { useUserStore } from "@/store/user-store";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Package, Plus, Wheat } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ALERT_COLORS, ALERT_MESSAGES } from "./constants";
import { formatCurrency, formatDays, formatWeight } from "./utils";

interface FeedUsageCalculatorProps {
  farmerUserProfileId: number;
}

export const FeedUsageCalculator: React.FC<FeedUsageCalculatorProps> = ({
  farmerUserProfileId,
}) => {
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

  // Form state for creating new calculation log
  const [formData, setFormData] = useState({
    number_of_animals: "",
    feed_frequency: "",
    bag_size_kg: "",
    current_stock_bags: "",
    bag_cost_php: "",
    animal_type: "",
    feed_stage: "",
  });

  // Fetch feed calculation data from V2 API
  const { data: feedCalcResponse, isLoading } =
    useFeedCalculationLog(farmerUserProfileId);
  const feedCalcData = feedCalcResponse?.data;

  // Fetch current feed product data for auto-filling
  const { data: activeFeedProduct } = useActiveFeedProduct(farmerUserProfileId);

  // Get user data for livestock type
  const { user } = useUserStore();

  // Auto-fill form when dialog opens
  useEffect(() => {
    if (isCreateFormOpen) {
      const feedStage = activeFeedProduct?.data?.feed_stage || "";
      const livestockType = user?.livestock_type || "";

      // Map livestock_type to animal_type format (accepted: layers, broilers, native)
      let animalType = "";
      if (livestockType) {
        const lowerType = livestockType.toLowerCase();
        if (lowerType.includes("broiler")) {
          animalType = "broilers";
        } else if (lowerType.includes("layer")) {
          animalType = "layers";
        } else if (lowerType.includes("native")) {
          animalType = "native";
        } else if (lowerType.includes("chicken")) {
          // Default to broilers for generic chicken
          animalType = "broilers";
        } else {
          // Check if it's already one of the accepted values
          if (["layers", "broilers", "native"].includes(lowerType)) {
            animalType = lowerType;
          } else {
            // Default fallback to broilers if no match
            animalType = "broilers";
          }
        }
      }

      setFormData((prev) => ({
        ...prev,
        animal_type: animalType,
        feed_stage: feedStage,
      }));
    }
  }, [
    isCreateFormOpen,
    activeFeedProduct?.data?.feed_stage,
    user?.livestock_type,
  ]);

  // Auto-fill form with existing data when update dialog opens
  useEffect(() => {
    if (isUpdateFormOpen && feedCalcData) {
      setFormData({
        number_of_animals: feedCalcData.number_of_animals.toString(),
        feed_frequency: feedCalcData.feed_frequency.toString(),
        bag_size_kg: feedCalcData.bag_size_kg.toString(),
        current_stock_bags: feedCalcData.current_stock_bags.toString(),
        bag_cost_php: feedCalcData.bag_cost_php.toString(),
        animal_type: feedCalcData.animal_type,
        feed_stage: feedCalcData.feed_stage,
      });
    }
  }, [isUpdateFormOpen, feedCalcData]);

  // Create mutation
  const createMutation = useCreateFeedCalculationLog({
    onSuccess: () => {
      setIsCreateFormOpen(false);
      setFormData({
        number_of_animals: "",
        feed_frequency: "",
        bag_size_kg: "",
        current_stock_bags: "",
        bag_cost_php: "",
        animal_type: "",
        feed_stage: "",
      });
      toast.success("Feed calculation log created successfully!");
      // Invalidate and refetch feed calculation log for this farmer
      queryClient.invalidateQueries({
        queryKey: farmerV2Keys.feedCalculationLog(farmerUserProfileId),
      });
    },
    onError: (error) => {
      toast.error(`Failed to create calculation log: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useUpdateFeedCalculationLog({
    onSuccess: () => {
      setIsUpdateFormOpen(false);
      toast.success("Feed calculation log updated successfully!");
      // Invalidate and refetch feed calculation log for this farmer
      queryClient.invalidateQueries({
        queryKey: farmerV2Keys.feedCalculationLog(farmerUserProfileId),
      });
    },
    onError: (error) => {
      console.error("Error updating feed calculation log:", error);
      toast.error("Failed to update feed calculation log. Please try again.");
    },
  });

  // Handle form submission
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate derived values
    const numberOfAnimals = Number(formData.number_of_animals);
    const feedFrequency = Number(formData.feed_frequency);
    const bagSizeKg = Number(formData.bag_size_kg);
    const currentStockBags = Number(formData.current_stock_bags);
    const bagCostPhp = Number(formData.bag_cost_php);

    // Simple calculation logic (you can enhance this)
    const dailyConsumptionKg = numberOfAnimals * 0.1 * feedFrequency; // Rough estimate
    const weeklyConsumptionKg = dailyConsumptionKg * 7;
    const bagsNeededPerWeek = weeklyConsumptionKg / bagSizeKg;
    const costPerWeekPhp = bagsNeededPerWeek * bagCostPhp;
    const reorderPointDays =
      (currentStockBags * bagSizeKg) / dailyConsumptionKg;

    // Determine alert level
    let alertLevel = "good";
    if (reorderPointDays < 3) alertLevel = "high";
    else if (reorderPointDays < 7) alertLevel = "medium";
    else if (reorderPointDays < 14) alertLevel = "low";

    const createData = {
      user_profile_id: farmerUserProfileId,
      number_of_animals: numberOfAnimals,
      feed_frequency: feedFrequency,
      bag_size_kg: bagSizeKg,
      current_stock_bags: currentStockBags,
      bag_cost_php: bagCostPhp,
      animal_type: formData.animal_type,
      feed_stage: formData.feed_stage,
      daily_consumption_kg: dailyConsumptionKg,
      bags_needed_per_week: bagsNeededPerWeek,
      cost_per_week_php: costPerWeekPhp,
      reorder_point_days: reorderPointDays,
      alert_level: alertLevel,
      weekly_consumption_kg: weeklyConsumptionKg,
    };

    createMutation.mutate(createData);
  };

  // Handle update form submission
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedCalcData) return;

    // Calculate derived values
    const numberOfAnimals = Number(formData.number_of_animals);
    const feedFrequency = Number(formData.feed_frequency);
    const bagSizeKg = Number(formData.bag_size_kg);
    const currentStockBags = Number(formData.current_stock_bags);
    const bagCostPhp = Number(formData.bag_cost_php);

    // Basic calculations (same as create)
    const dailyConsumptionKg = numberOfAnimals * feedFrequency * 0.1; // 0.1kg per animal per feeding
    const weeklyConsumptionKg = dailyConsumptionKg * 7;
    const bagsNeededPerWeek = weeklyConsumptionKg / bagSizeKg;
    const costPerWeekPhp = bagsNeededPerWeek * bagCostPhp;
    const reorderPointDays = Math.floor(
      (currentStockBags * bagSizeKg) / dailyConsumptionKg,
    );

    // Determine alert level
    let alertLevel = "good";
    if (reorderPointDays < 3) alertLevel = "high";
    else if (reorderPointDays < 7) alertLevel = "medium";
    else if (reorderPointDays < 14) alertLevel = "low";

    const updateData = {
      id: feedCalcData.id,
      user_profile_id: farmerUserProfileId,
      number_of_animals: numberOfAnimals,
      feed_frequency: feedFrequency,
      bag_size_kg: bagSizeKg,
      current_stock_bags: currentStockBags,
      bag_cost_php: bagCostPhp,
      animal_type: formData.animal_type,
      feed_stage: formData.feed_stage,
      daily_consumption_kg: dailyConsumptionKg,
      bags_needed_per_week: bagsNeededPerWeek,
      cost_per_week_php: costPerWeekPhp,
      reorder_point_days: reorderPointDays,
      alert_level: alertLevel,
      weekly_consumption_kg: weeklyConsumptionKg,
      created_at: feedCalcData.created_at,
      updated_at: new Date().toISOString(),
    };

    updateMutation.mutate({
      farmerUserProfileId,
      logData: updateData,
    });
  };

  const formatInteger = (value?: number | string | null): string => {
    const numericValue =
      typeof value === "number" ? value : value != null ? Number(value) : NaN;
    if (!Number.isFinite(numericValue)) return "—";
    return Math.round(numericValue).toLocaleString();
  };

  const safeFormatDateTime = (dateString?: string | null): string => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Safely compute bags needed per week with fallbacks
  const getBagsNeededPerWeek = (): number => {
    if (!feedCalcData) return 0;
    if (Number.isFinite(feedCalcData.bags_needed_per_week)) {
      return feedCalcData.bags_needed_per_week;
    }
    // Fallback calculation
    if (
      Number.isFinite(feedCalcData.weekly_consumption_kg) &&
      Number.isFinite(feedCalcData.bag_size_kg) &&
      feedCalcData.bag_size_kg > 0
    ) {
      return feedCalcData.weekly_consumption_kg / feedCalcData.bag_size_kg;
    }
    return 0;
  };

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
    const days = feedCalcData.reorder_point_days;
    if (!Number.isFinite(days) || days <= 0) return 0;
    const percent = (days / maxDays) * 100;
    return Math.max(0, Math.min(percent, 100));
  };

  // Show loading state
  if (isLoading) {
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
              <p className="text-sm">Loading calculation data...</p>
            </div>
          </div>
        </div>
      </ExpandableCard>
    );
  }

  // Show empty state if no calculation log exists
  if (!feedCalcResponse || !feedCalcData) {
    return (
      <>
        <ExpandableCard
          title="Feed Usage Calculator"
          summary={
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wheat className="h-4 w-4" />
              <span className="text-sm">No calculation data available</span>
            </div>
          }
          className="h-fit"
        >
          <div className="space-y-4">
            <div className="rounded-lg p-4 border">
              <div className="text-center text-muted-foreground space-y-3">
                <Wheat className="h-8 w-8 mx-auto opacity-50" />
                <div>
                  <p className="text-sm font-medium">
                    No feed calculation log found
                  </p>
                  <p className="text-xs mt-1">
                    Create a calculation log to track feed usage and costs
                  </p>
                </div>
                <Button
                  onClick={() => setIsCreateFormOpen(true)}
                  className="mt-3"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Calculation Log
                </Button>
              </div>
            </div>
          </div>
        </ExpandableCard>

        {/* Create Form Dialog */}
        <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">
                Create Feed Calculation Log
              </DialogTitle>
              <DialogDescription>
                Enter your farm details to calculate feed usage and costs
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateSubmit} className="space-y-6">
              {/* Farm Details */}
              <div>
                <h4 className="font-display font-medium mb-3">Farm Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="number_of_animals">Number of Animals</Label>
                    <Input
                      id="number_of_animals"
                      type="number"
                      value={formData.number_of_animals}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          number_of_animals: e.target.value,
                        }))
                      }
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="feed_frequency">
                      Feed Frequency (per day)
                    </Label>
                    <Input
                      id="feed_frequency"
                      type="number"
                      value={formData.feed_frequency}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          feed_frequency: e.target.value,
                        }))
                      }
                      required
                      min="1"
                      max="10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="animal_type">
                      Animal Type
                      {user?.livestock_type && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (from profile)
                        </span>
                      )}
                    </Label>
                    <Select
                      value={formData.animal_type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, animal_type: value }))
                      }
                      disabled={!!user?.livestock_type}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select animal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="broilers">Broilers</SelectItem>
                        <SelectItem value="layers">Layers</SelectItem>
                        <SelectItem value="native">Native</SelectItem>
                      </SelectContent>
                    </Select>
                    {user?.livestock_type && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Auto-filled from your livestock type:{" "}
                        {user.livestock_type}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="feed_stage">
                      Feed Stage
                      {activeFeedProduct?.data?.feed_stage && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (from current feed)
                        </span>
                      )}
                    </Label>
                    <Select
                      value={formData.feed_stage}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, feed_stage: value }))
                      }
                      disabled={!!activeFeedProduct?.data?.feed_stage}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select feed stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="grower">Grower</SelectItem>
                        <SelectItem value="finisher">Finisher</SelectItem>
                        <SelectItem value="layer">Layer</SelectItem>
                        <SelectItem value="booster">Booster</SelectItem>
                      </SelectContent>
                    </Select>
                    {activeFeedProduct?.data?.feed_stage && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Auto-filled from current feed:{" "}
                        {activeFeedProduct.data.feed_stage}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Feed & Cost Details */}
              <div>
                <h4 className="font-display font-medium mb-3">
                  Feed & Cost Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bag_size_kg">Bag Size (kg)</Label>
                    <Input
                      id="bag_size_kg"
                      type="number"
                      value={formData.bag_size_kg}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bag_size_kg: e.target.value,
                        }))
                      }
                      required
                      min="1"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bag_cost_php">Cost per Bag (₱)</Label>
                    <Input
                      id="bag_cost_php"
                      type="number"
                      value={formData.bag_cost_php}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bag_cost_php: e.target.value,
                        }))
                      }
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="current_stock_bags">
                      Current Stock (bags)
                    </Label>
                    <Input
                      id="current_stock_bags"
                      type="number"
                      value={formData.current_stock_bags}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          current_stock_bags: e.target.value,
                        }))
                      }
                      required
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateFormOpen(false)}
                  disabled={createMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending
                    ? "Creating..."
                    : "Create Calculation Log"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Summary content - show key calculation results
  const summaryContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Wheat className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-foreground">
            {getBagsNeededPerWeek().toFixed(1)} bags/week
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {formatInteger(feedCalcData?.current_stock_bags)} bags in stock
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
        {/* Edit Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsUpdateFormOpen(true)}
            className="text-xs"
          >
            <Package className="h-3 w-3 mr-1" />
            Edit Calculation
          </Button>
        </div>

        {/* Quick Stats Display */}
        <>
          {/* Main Calculation Result */}
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center col-span-2 rounded-md p-2 bg-muted/50">
              <div className="text-2xl font-medium font-display">
                {getBagsNeededPerWeek().toFixed(1)}
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
                {formatInteger(feedCalcData?.number_of_animals)}
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
                    {formatDays(feedCalcData?.reorder_point_days ?? 0)}{" "}
                    remaining
                  </span>
                  <span className="font-display font-medium">
                    {formatInteger(feedCalcData?.current_stock_bags)} bags in
                    stock
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
                    Order {Math.ceil(getBagsNeededPerWeek())} bags to maintain
                    optimal stock levels
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
                    {formatInteger(feedCalcData?.number_of_animals)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Feed Frequency
                  </p>
                  <p className="text-lg font-display font-medium">
                    {formatInteger(feedCalcData?.feed_frequency)}x per day
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Animal Type</p>
                  <p className="text-lg font-display font-medium capitalize">
                    {normalizeAnimalType(feedCalcData?.animal_type || "layer")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Feed Stage</p>
                  <p className="text-lg font-display font-medium capitalize">
                    {feedCalcData?.feed_stage || "—"}
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
                    {getBagsNeededPerWeek().toFixed(1)}
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
              Last updated: {safeFormatDateTime(feedCalcData?.updated_at)}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Form Dialog */}
      <Dialog open={isUpdateFormOpen} onOpenChange={setIsUpdateFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Feed Calculation</DialogTitle>
            <DialogDescription>
              Update your feed usage calculation with current data.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="update_number_of_animals">
                  Number of Animals *
                </Label>
                <Input
                  id="update_number_of_animals"
                  type="number"
                  value={formData.number_of_animals}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      number_of_animals: e.target.value,
                    }))
                  }
                  required
                  min="1"
                  placeholder="e.g., 100"
                />
              </div>

              <div>
                <Label htmlFor="update_feed_frequency">
                  Feed Frequency per Day *
                </Label>
                <Input
                  id="update_feed_frequency"
                  type="number"
                  value={formData.feed_frequency}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      feed_frequency: e.target.value,
                    }))
                  }
                  required
                  min="1"
                  max="10"
                  placeholder="e.g., 3"
                />
              </div>

              <div>
                <Label htmlFor="update_bag_size_kg">Bag Size (kg) *</Label>
                <Input
                  id="update_bag_size_kg"
                  type="number"
                  value={formData.bag_size_kg}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bag_size_kg: e.target.value,
                    }))
                  }
                  required
                  min="1"
                  placeholder="e.g., 25"
                />
              </div>

              <div>
                <Label htmlFor="update_current_stock_bags">
                  Current Stock (bags) *
                </Label>
                <Input
                  id="update_current_stock_bags"
                  type="number"
                  value={formData.current_stock_bags}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      current_stock_bags: e.target.value,
                    }))
                  }
                  required
                  min="0"
                  placeholder="e.g., 10"
                />
              </div>

              <div>
                <Label htmlFor="update_bag_cost_php">Bag Cost (PHP) *</Label>
                <Input
                  id="update_bag_cost_php"
                  type="number"
                  value={formData.bag_cost_php}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bag_cost_php: e.target.value,
                    }))
                  }
                  required
                  min="1"
                  placeholder="e.g., 1200"
                />
              </div>

              <div>
                <Label htmlFor="update_animal_type">Animal Type *</Label>
                <Select
                  value={formData.animal_type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, animal_type: value }))
                  }
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select animal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="broilers">Broilers</SelectItem>
                    <SelectItem value="layers">Layers</SelectItem>
                    <SelectItem value="native">Native</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="update_feed_stage">Feed Stage *</Label>
                <Select
                  value={formData.feed_stage}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, feed_stage: value }))
                  }
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select feed stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="grower">Grower</SelectItem>
                    <SelectItem value="finisher">Finisher</SelectItem>
                    <SelectItem value="layer">Layer</SelectItem>
                    <SelectItem value="booster">Booster</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUpdateFormOpen(false)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending
                  ? "Updating..."
                  : "Update Calculation"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </ExpandableCard>
  );
};
