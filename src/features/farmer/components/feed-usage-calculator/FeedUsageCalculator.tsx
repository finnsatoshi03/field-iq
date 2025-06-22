import { useState, useEffect } from "react";
import { AlertTriangle, Settings, TrendingUp, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  MOCK_CALCULATOR_INPUTS,
  FEED_FREQUENCY_OPTIONS,
  BAG_SIZE_OPTIONS,
  ALERT_COLORS,
  ALERT_MESSAGES,
  type CalculatorInputs,
  type FeedUsageCalculation,
} from "./constants";
import {
  calculateFeedUsage,
  formatWeight,
  formatCurrency,
  formatBags,
  formatDays,
  getOptimalReorderPoint,
  validateInputs,
} from "./utils";

export const FeedUsageCalculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(
    MOCK_CALCULATOR_INPUTS
  );
  const [calculation, setCalculation] = useState<FeedUsageCalculation | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

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
    value: number | string
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

  return (
    <div className="bg-card rounded-lg border border-border py-4 space-y-6">
      <div className="flex items-center justify-between px-4">
        <h3 className="text-foreground font-display font-medium text-base tracking-tight">
          Feed Usage Calculator
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsDialogOpen(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4 px-4">
        {/* Quick Stats Display */}
        {calculation && (
          <>
            {/* Main Calculation Result */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="text-center mb-3">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {calculation.bagsNeededPerWeek}
                </div>
                <p className="text-sm text-blue-800 font-medium">
                  {formatBags(calculation.bagsNeededPerWeek)} needed per week
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-blue-600 font-medium">Daily Usage</p>
                  <p className="text-blue-800">
                    {formatWeight(calculation.dailyConsumption)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-blue-600 font-medium">Weekly Cost</p>
                  <p className="text-blue-800">
                    {formatCurrency(calculation.costPerWeek)}
                  </p>
                </div>
              </div>
            </div>

            {/* Reorder Alert Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Current Stock Status
                </span>
                <Badge className={ALERT_COLORS[calculation.alertLevel]}>
                  {ALERT_MESSAGES[calculation.alertLevel]}
                </Badge>
              </div>

              <div className="space-y-2">
                <Progress
                  value={getStockProgress()}
                  className="h-3"
                  style={{
                    background: "rgb(243 244 246)",
                  }}
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {formatDays(calculation.reorderPoint)} remaining
                  </span>
                  <span className="text-muted-foreground">
                    {inputs.currentStock} bags in stock
                  </span>
                </div>
              </div>

              {calculation.alertLevel !== "good" && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Recommended: Order{" "}
                    {getOptimalReorderPoint(
                      calculation.weeklyConsumption,
                      inputs.bagSize
                    )}{" "}
                    bags to maintain optimal stock
                  </span>
                </div>
              )}
            </div>

            {/* Quick Action */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setIsDialogOpen(true)}
            >
              <Package className="h-4 w-4 mr-2" />
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
              <h4 className="font-semibold mb-3">Farm Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="animals">Number of Animals</Label>
                  <Input
                    id="animals"
                    type="number"
                    value={inputs.numberOfAnimals}
                    onChange={(e) =>
                      handleInputChange(
                        "numberOfAnimals",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="e.g., 1000"
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Feed Frequency</Label>
                  <Select
                    value={inputs.feedFrequency.toString()}
                    onValueChange={(value) =>
                      handleInputChange("feedFrequency", parseInt(value))
                    }
                  >
                    <SelectTrigger>
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

            {/* Feed & Stock Details */}
            <div>
              <h4 className="font-semibold mb-3">Feed & Stock Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bagSize">Bag Size</Label>
                  <Select
                    value={inputs.bagSize.toString()}
                    onValueChange={(value) =>
                      handleInputChange("bagSize", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BAG_SIZE_OPTIONS.map((option) => (
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
                <div>
                  <Label htmlFor="currentStock">Current Stock (bags)</Label>
                  <Input
                    id="currentStock"
                    type="number"
                    value={inputs.currentStock}
                    onChange={(e) =>
                      handleInputChange(
                        "currentStock",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="e.g., 8"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="bagCost">Cost per Bag (PHP)</Label>
                <Input
                  id="bagCost"
                  type="number"
                  value={inputs.bagCost}
                  onChange={(e) =>
                    handleInputChange("bagCost", parseInt(e.target.value) || 0)
                  }
                  placeholder="e.g., 2800"
                />
              </div>
            </div>

            <Separator />

            {/* Animal Type & Stage */}
            <div>
              <h4 className="font-semibold mb-3">Animal Type & Feed Stage</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="animalType">Animal Type</Label>
                  <Select
                    value={inputs.animalType}
                    onValueChange={(value) =>
                      handleInputChange("animalType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="broiler">Broiler</SelectItem>
                      <SelectItem value="layer">Layer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="feedStage">Feed Stage</Label>
                  <Select
                    value={inputs.feedStage}
                    onValueChange={(value) =>
                      handleInputChange("feedStage", value)
                    }
                  >
                    <SelectTrigger>
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

            {/* Calculation Summary */}
            {calculation && (
              <>
                <Separator />
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Calculation Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">
                        Daily consumption:
                      </p>
                      <p className="font-medium">
                        {formatWeight(calculation.dailyConsumption)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        Weekly consumption:
                      </p>
                      <p className="font-medium">
                        {formatWeight(calculation.weeklyConsumption)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bags per week:</p>
                      <p className="font-medium">
                        {formatBags(calculation.bagsNeededPerWeek)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Weekly cost:</p>
                      <p className="font-medium">
                        {formatCurrency(calculation.costPerWeek)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
