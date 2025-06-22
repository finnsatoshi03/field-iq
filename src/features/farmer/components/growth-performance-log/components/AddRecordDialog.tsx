import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type AnimalType, type PerformanceRecord } from "../constants";

interface AddRecordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  animalType: AnimalType;
  newRecord: Partial<PerformanceRecord>;
  onNewRecordChange: (record: Partial<PerformanceRecord>) => void;
  onAddRecord: () => void;
}

export const AddRecordDialog = ({
  isOpen,
  onOpenChange,
  animalType,
  newRecord,
  onNewRecordChange,
  onAddRecord,
}: AddRecordDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            Add Performance Record
          </DialogTitle>
          <DialogDescription>
            Record new {animalType === "broiler" ? "weight" : "egg production"}{" "}
            data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newRecord.date}
                onChange={(e) =>
                  onNewRecordChange({ ...newRecord, date: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="age">Age (days)</Label>
              <Input
                id="age"
                type="number"
                value={newRecord.ageInDays}
                onChange={(e) =>
                  onNewRecordChange({
                    ...newRecord,
                    ageInDays: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="e.g., 21"
              />
            </div>
          </div>

          {animalType === "broiler" ? (
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={newRecord.measurements?.weight || ""}
                onChange={(e) =>
                  onNewRecordChange({
                    ...newRecord,
                    measurements: {
                      ...newRecord.measurements,
                      weight: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                placeholder="e.g., 1.25"
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="eggs">Egg Production (eggs/day)</Label>
              <Input
                id="eggs"
                type="number"
                value={newRecord.measurements?.eggProduction || ""}
                onChange={(e) =>
                  onNewRecordChange({
                    ...newRecord,
                    measurements: {
                      ...newRecord.measurements,
                      eggProduction: parseInt(e.target.value) || 0,
                    },
                  })
                }
                placeholder="e.g., 85"
              />
            </div>
          )}

          <div>
            <Label htmlFor="feedIntake">Feed Intake (kg/day)</Label>
            <Input
              id="feedIntake"
              type="number"
              step="0.01"
              value={newRecord.measurements?.feedIntake || ""}
              onChange={(e) =>
                onNewRecordChange({
                  ...newRecord,
                  measurements: {
                    ...newRecord.measurements,
                    feedIntake: parseFloat(e.target.value) || 0,
                  },
                })
              }
              placeholder="e.g., 0.12"
            />
          </div>

          <div>
            <Label htmlFor="mortality">Mortality Count</Label>
            <Input
              id="mortality"
              type="number"
              value={newRecord.measurements?.mortality || ""}
              onChange={(e) =>
                onNewRecordChange({
                  ...newRecord,
                  measurements: {
                    ...newRecord.measurements,
                    mortality: parseInt(e.target.value) || 0,
                  },
                })
              }
              placeholder="e.g., 2"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              value={newRecord.notes || ""}
              onChange={(e) =>
                onNewRecordChange({ ...newRecord, notes: e.target.value })
              }
              placeholder="Any observations or notes..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={onAddRecord} className="flex-1">
              Add Record
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
