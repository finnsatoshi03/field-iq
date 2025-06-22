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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type FeedIntakeRecord,
  type FeedBehavior,
  FEED_BEHAVIOR,
} from "../constants";

interface AddBehaviorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newRecord: Partial<FeedIntakeRecord>;
  onNewRecordChange: (record: Partial<FeedIntakeRecord>) => void;
  onAddRecord: () => void;
}

export const AddBehaviorDialog = ({
  isOpen,
  onOpenChange,
  newRecord,
  onNewRecordChange,
  onAddRecord,
}: AddBehaviorDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            Add Feed Behavior Record
          </DialogTitle>
          <DialogDescription>
            Record new feed intake behavior observation
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
              <Label htmlFor="timeOfDay">Time of Day</Label>
              <Select
                value={newRecord.timeOfDay}
                onValueChange={(value: "morning" | "afternoon" | "evening") =>
                  onNewRecordChange({ ...newRecord, timeOfDay: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="behavior">Behavior</Label>
            <Select
              value={newRecord.behavior}
              onValueChange={(value: FeedBehavior) =>
                onNewRecordChange({ ...newRecord, behavior: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select behavior" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={FEED_BEHAVIOR.EATING_WELL}>
                  Eating Well
                </SelectItem>
                <SelectItem value={FEED_BEHAVIOR.PICKING_ONLY}>
                  Picking Only
                </SelectItem>
                <SelectItem value={FEED_BEHAVIOR.NOT_EATING}>
                  Not Eating
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="percentage">Percentage (%)</Label>
              <Input
                id="percentage"
                type="number"
                min="0"
                max="100"
                value={newRecord.percentage}
                onChange={(e) =>
                  onNewRecordChange({
                    ...newRecord,
                    percentage: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0-100"
              />
            </div>
            <div>
              <Label htmlFor="flockSize">Flock Size</Label>
              <Input
                id="flockSize"
                type="number"
                value={newRecord.flockSize}
                onChange={(e) =>
                  onNewRecordChange({
                    ...newRecord,
                    flockSize: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="e.g., 1000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="feedConsumed">Feed Consumed (kg)</Label>
            <Input
              id="feedConsumed"
              type="number"
              step="0.1"
              value={newRecord.feedConsumed}
              onChange={(e) =>
                onNewRecordChange({
                  ...newRecord,
                  feedConsumed: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="e.g., 45.5"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              value={newRecord.notes}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onNewRecordChange({ ...newRecord, notes: e.target.value })
              }
              placeholder="Additional observations..."
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
