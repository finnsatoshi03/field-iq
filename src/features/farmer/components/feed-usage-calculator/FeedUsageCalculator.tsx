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
import { AlertTriangle, Package, Wheat } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ALERT_COLORS,
  ALERT_MESSAGES,
  FEED_FREQUENCY_OPTIONS,
  MOCK_CALCULATOR_INPUTS,
  type CalculatorInputs,
  type FeedUsageCalculation,
} from "./constants";
import {
  calculateFeedUsage,
  formatCurrency,
  formatDays,
  formatWeight,
  validateInputs,
} from "./utils";

export const FeedUsageCalculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(
    MOCK_CALCULATOR_INPUTS,
  );
  const [calculation, setCalculation] = useState<FeedUsageCalculation | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const validationErrors = validateInputs(inputs);
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      try {
        const result = calculateFeedUsage(inputs);
        setCalculation(result);
      } catch (error) {
        console.error("Calculation error:", error);
        setCalculation(null);
      }
    } else {
      setCalculation(null);
    }
  }, [inputs]);

  const handleInputChange = (
    field: keyof CalculatorInputs,
    value: number | string,
  ) => {
    setInputs((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? value : Number(value),
    }));
  };

  const getStockProgress = () => {
    if (!calculation) return 0;
    const maxDays = 14; // 2 weeks
    return Math.min((calculation.reorderPoint / maxDays) * 100, 100);
  };

  // Summary content - show key calculation results
  const summaryContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Wheat className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-foreground">
            {calculation
              ? `${calculation.bagsNeededPerWeek} bags/week`
              : "No data"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {inputs.currentStock} bags in stock
          </span>
        </div>
      </div>
      {/* Only show badge when collapsed */}
      {!isExpanded && calculation && (
        <Badge className={ALERT_COLORS[calculation.alertLevel]}>
          {ALERT_MESSAGES[calculation.alertLevel]}
        </Badge>
      )}
    </div>
  );

  return (
    <ExpandableCard
      title="Feed Usage Calculator"
      summary={summaryContent}
      onToggle={(expanded: boolean) => setIsExpanded(expanded)}
    >
      <div className="space-y-4">
        {/* Quick Stats Display */}
        {calculation && (
          <>
            {/* Main Calculation Result */}
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center col-span-2 rounded-md p-2 bg-muted/50">
                <div className="text-2xl font-medium font-display">
                  {calculation.bagsNeededPerWeek}
                </div>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 font-medium">
                  <Wheat className="size-4 text-blue-600" />
                  needed per week
                </p>
              </div>

              <div className="rounded-md p-2 bg-muted/50">
                <p className="font-medium text-xs text-muted-foreground">
                  Daily Usage
                </p>
                <p className="text-2xl font-medium font-display">
                  {formatWeight(calculation.dailyConsumption)}
                </p>
              </div>
              <div className="rounded-md p-2 bg-muted/50">
                <p className="font-medium text-xs text-muted-foreground">
                  Weekly Cost
                </p>
                <p className="text-2xl font-medium font-display">
                  {formatCurrency(calculation.costPerWeek)}
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
                  <Badge className={ALERT_COLORS[calculation.alertLevel]}>
                    {ALERT_MESSAGES[calculation.alertLevel]}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground text-xs font-medium">
                      {formatDays(calculation.reorderPoint)} remaining
                    </span>
                    <span className="font-display font-medium">
                      {inputs.currentStock} bags in stock
                    </span>
                  </div>
                  <Progress value={getStockProgress()} />
                </div>
              </div>

              {calculation.alertLevel !== "good" && (
                <div className="flex items-center gap-2 p-3 bg-yellow-100 -mx-4 border-t border-b border-yellow-600">
                  <AlertTriangle
                    className="size-4 text-yellow-600"
                    strokeWidth={3}
                  />
                  <div>
                    <p className="font-display text-yellow-600 font-medium">
                      Recommended
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Order {calculation.bagsNeededPerWeek} bags to maintain
                      optimal stock
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
              Adjust Parameters
            </Button>
          </>
        )}

        {errors.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium mb-2">
              Please fix the following:
            </p>
            <ul className="text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Settings Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              Feed Usage Calculator Settings
            </DialogTitle>
            <DialogDescription>
              Adjust your parameters to get accurate feed usage calculations
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Farm Details */}
            <div>
              <h4 className="font-display font-medium mb-3">Farm Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="animals">Number of Animals</Label>
                  <Input
                    id="animals"
                    type="number"
                    value={inputs.numberOfAnimals}
                    onChange={(e) =>
                      handleInputChange(
                        "numberOfAnimals",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    placeholder="e.g., 1000"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="frequency">Feed Frequency</Label>
                  <Select
                    value={inputs.feedFrequency.toString()}
                    onValueChange={(value) =>
                      handleInputChange("feedFrequency", parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FEED_FREQUENCY_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Feed Details */}
            <div>
              <h4 className="font-display font-medium mb-3">Feed Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="animalType">Animal Type</Label>
                  <Select
                    value={inputs.animalType}
                    onValueChange={(value) =>
                      handleInputChange(
                        "animalType",
                        value as "broiler" | "layer",
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="broiler">Broiler</SelectItem>
                      <SelectItem value="layer">Layer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="feedStage">Feed Stage</Label>
                  <Select
                    value={inputs.feedStage}
                    onValueChange={(value) =>
                      handleInputChange(
                        "feedStage",
                        value as "starter" | "grower" | "finisher" | "layer",
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {inputs.animalType === "broiler" ? (
                        <>
                          <SelectItem value="starter">Starter</SelectItem>
                          <SelectItem value="grower">Grower</SelectItem>
                          <SelectItem value="finisher">Finisher</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="starter">Starter</SelectItem>
                          <SelectItem value="layer">Layer</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Cost Details */}
            <div>
              <h4 className="font-display font-medium mb-3">Cost Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="cost">Cost per Bag (₱)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={inputs.bagCost}
                    onChange={(e) =>
                      handleInputChange(
                        "bagCost",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    placeholder="e.g., 1250.00"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="stock">Current Stock (bags)</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={inputs.currentStock}
                    onChange={(e) =>
                      handleInputChange(
                        "currentStock",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    placeholder="e.g., 50"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Results Preview */}
            {calculation && (
              <div>
                <h4 className="font-display font-medium mb-3">
                  Calculation Results
                </h4>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Weekly Need</p>
                    <p className="text-lg font-display font-medium">
                      {calculation.bagsNeededPerWeek} bags
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weekly Cost</p>
                    <p className="text-lg font-display font-medium">
                      {formatCurrency(calculation.costPerWeek)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Reorder Point
                    </p>
                    <p className="text-lg font-display font-medium">
                      {formatDays(calculation.reorderPoint)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Stock Status
                    </p>
                    <Badge className={ALERT_COLORS[calculation.alertLevel]}>
                      {ALERT_MESSAGES[calculation.alertLevel]}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </ExpandableCard>
  );
};
