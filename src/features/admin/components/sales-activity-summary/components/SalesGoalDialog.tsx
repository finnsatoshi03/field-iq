import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SalesGoal } from "@/features/admin/types";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useState } from "react";

interface SalesGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalData: {
    target_amount: number;
    period_start: string;
    period_end: string;
  }) => Promise<void>;
  currentGoal?: SalesGoal | null;
  isLoading?: boolean;
  mode: "create" | "update";
}

const SalesGoalDialog = ({
  isOpen,
  onClose,
  onSave,
  currentGoal,
  isLoading = false,
  mode,
}: SalesGoalDialogProps) => {
  const [formData, setFormData] = useState({
    target_amount: currentGoal?.target_amount || 0,
    period_start: currentGoal?.period_start || "",
    period_end: currentGoal?.period_end || "",
  });

  const [errors, setErrors] = useState<{
    target_amount?: string;
    period_start?: string;
    period_end?: string;
  }>({});

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.target_amount || formData.target_amount <= 0) {
      newErrors.target_amount = "Target amount must be greater than 0";
    }

    if (!formData.period_start) {
      newErrors.period_start = "Start date is required";
    }

    if (!formData.period_end) {
      newErrors.period_end = "End date is required";
    }

    if (formData.period_start && formData.period_end) {
      const startDate = new Date(formData.period_start);
      const endDate = new Date(formData.period_end);

      if (startDate >= endDate) {
        newErrors.period_end = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving sales goal:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      target_amount: currentGoal?.target_amount || 0,
      period_start: currentGoal?.period_start || "",
      period_end: currentGoal?.period_end || "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {mode === "create" ? "Set Sales Goal" : "Update Sales Goal"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Set a new sales target for your team."
              : "Update the current sales target."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Target Amount */}
          <div className="space-y-2">
            <Label htmlFor="target_amount">Target Amount (₱)</Label>
            <Input
              id="target_amount"
              type="number"
              placeholder="Enter target amount"
              value={formData.target_amount || ""}
              onChange={(e) =>
                handleInputChange(
                  "target_amount",
                  parseFloat(e.target.value) || 0,
                )
              }
              className={errors.target_amount ? "border-red-500" : ""}
            />
            {errors.target_amount && (
              <p className="text-sm text-red-600">{errors.target_amount}</p>
            )}
          </div>

          {/* Period Start */}
          <div className="space-y-2">
            <Label htmlFor="period_start">Start Date</Label>
            <Input
              id="period_start"
              type="date"
              value={formData.period_start}
              onChange={(e) =>
                handleInputChange("period_start", e.target.value)
              }
              className={errors.period_start ? "border-red-500" : ""}
              disabled={mode === "update"} // Don't allow changing dates for existing goals
            />
            {errors.period_start && (
              <p className="text-sm text-red-600">{errors.period_start}</p>
            )}
          </div>

          {/* Period End */}
          <div className="space-y-2">
            <Label htmlFor="period_end">End Date</Label>
            <Input
              id="period_end"
              type="date"
              value={formData.period_end}
              onChange={(e) => handleInputChange("period_end", e.target.value)}
              className={errors.period_end ? "border-red-500" : ""}
              disabled={mode === "update"} // Don't allow changing dates for existing goals
            />
            {errors.period_end && (
              <p className="text-sm text-red-600">{errors.period_end}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {mode === "create" ? "Creating..." : "Updating..."}
              </>
            ) : mode === "create" ? (
              "Create Goal"
            ) : (
              "Update Goal"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SalesGoalDialog;
