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
import { type HealthIssue, type IssueType, ISSUE_TYPES } from "../constants";

interface AddIssueDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newIssue: Partial<HealthIssue>;
  onNewIssueChange: (issue: Partial<HealthIssue>) => void;
  onAddIssue: () => void;
}

export const AddIssueDialog = ({
  isOpen,
  onOpenChange,
  newIssue,
  onNewIssueChange,
  onAddIssue,
}: AddIssueDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Add Health Issue</DialogTitle>
          <DialogDescription>
            Record new health issue or observation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newIssue.date}
                onChange={(e) =>
                  onNewIssueChange({ ...newIssue, date: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="count">Count</Label>
              <Input
                id="count"
                type="number"
                value={newIssue.count}
                onChange={(e) =>
                  onNewIssueChange({
                    ...newIssue,
                    count: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="e.g., 3"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="type">Issue Type</Label>
            <Select
              value={newIssue.type}
              onValueChange={(value: IssueType) =>
                onNewIssueChange({ ...newIssue, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ISSUE_TYPES.SICK}>Sick</SelectItem>
                <SelectItem value={ISSUE_TYPES.MORTALITY}>Mortality</SelectItem>
                <SelectItem value={ISSUE_TYPES.NOTES}>Notes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="severity">Severity</Label>
            <Select
              value={newIssue.severity}
              onValueChange={(value: "low" | "medium" | "high") =>
                onNewIssueChange({ ...newIssue, severity: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newIssue.description}
              onChange={(e) =>
                onNewIssueChange({ ...newIssue, description: e.target.value })
              }
              placeholder="Brief description of the issue..."
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              value={newIssue.notes}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onNewIssueChange({ ...newIssue, notes: e.target.value })
              }
              placeholder="Additional observations or notes..."
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
            <Button onClick={onAddIssue} className="flex-1">
              Add Issue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
