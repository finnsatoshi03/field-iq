import {
  AlertTriangle,
  CircleDot,
  Cloud,
  Moon,
  Sun,
  Utensils,
  X,
} from "lucide-react";
import { type FeedIntakeRecord } from "../constants";
import {
  formatDate,
  formatTimeOfDay,
  getBehaviorColor,
  getBehaviorLabel,
} from "../utils";

interface BehaviorListProps {
  records: FeedIntakeRecord[];
  maxItems?: number;
}

const getBehaviorIcon = (behavior: string) => {
  switch (behavior) {
    case "eating_well":
      return <Utensils className="size-4 text-green-500" />;
    case "picking_only":
      return <CircleDot className="size-4 text-orange-500" />;
    case "not_eating":
      return <X className="size-4 text-red-500" />;
    default:
      return <Utensils className="size-4 text-gray-500" />;
  }
};

const getTimeOfDayIcon = (timeOfDay: string) => {
  switch (timeOfDay.toLowerCase()) {
    case "morning":
      return <Sun className="size-3 text-gray-500" />;
    case "afternoon":
      return <Cloud className="size-3 text-gray-500" />;
    case "evening":
      return <Moon className="size-3 text-gray-500" />;
    default:
      return <Sun className="size-3 text-gray-500" />;
  }
};

export const BehaviorList = ({ records, maxItems = 5 }: BehaviorListProps) => {
  const displayRecords = records.slice(0, maxItems);

  // Show empty state if no records
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Utensils className="h-12 w-12 text-gray-300 mb-3" />
        <h3 className="font-medium text-gray-900 mb-1">
          No recent feed intake records
        </h3>
        <p className="text-sm text-gray-500">
          Feed intake behavior data will appear here once available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayRecords.map((record) => (
        <div
          key={record.id}
          className="flex justify-between p-3 rounded-md border-black/20 border"
        >
          <div className="flex items-center gap-3">
            <div className="text-lg">{getBehaviorIcon(record.behavior)}</div>
            <div>
              <p className="font-medium font-display text-sm">
                {getBehaviorLabel(record.behavior)} - {record.percentage}%
              </p>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                {formatDate(record.date)} • {getTimeOfDayIcon(record.timeOfDay)}{" "}
                {formatTimeOfDay(record.timeOfDay)} • {record.feedConsumed}kg
                consumed
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
