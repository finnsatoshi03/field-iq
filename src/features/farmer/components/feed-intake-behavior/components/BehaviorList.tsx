import { AlertTriangle } from "lucide-react";
import { type FeedIntakeRecord } from "../constants";
import {
  getBehaviorIcon,
  getBehaviorColor,
  getBehaviorLabel,
  formatDate,
  formatTimeOfDay,
} from "../utils";

interface BehaviorListProps {
  records: FeedIntakeRecord[];
  maxItems?: number;
}

export const BehaviorList = ({ records, maxItems = 5 }: BehaviorListProps) => {
  const displayRecords = records.slice(0, maxItems);

  return (
    <div className="space-y-2">
      {displayRecords.map((record) => (
        <div
          key={record.id}
          className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border"
        >
          <div className="flex items-center gap-3">
            <div className="text-lg">{getBehaviorIcon(record.behavior)}</div>
            <div>
              <p className="font-medium text-sm">
                {getBehaviorLabel(record.behavior)} - {record.percentage}%
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(record.date)} • {formatTimeOfDay(record.timeOfDay)}{" "}
                • {record.feedConsumed}kg consumed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${getBehaviorColor(record.behavior)}`}
            >
              {record.percentage}%
            </span>
            {record.behavior === "not_eating" && (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
          </div>
        </div>
      ))}

      {records.length > maxItems && (
        <div className="text-center text-xs text-muted-foreground py-2">
          +{records.length - maxItems} more records
        </div>
      )}
    </div>
  );
};
