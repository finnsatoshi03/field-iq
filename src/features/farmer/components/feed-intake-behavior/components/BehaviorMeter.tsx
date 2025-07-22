import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { type FeedIntakeSummary } from "../constants";
import { getBehaviorStatusColor, getSmileyIcon } from "../utils";

interface BehaviorMeterProps {
  summary: FeedIntakeSummary;
}

export const BehaviorMeter = ({ summary }: BehaviorMeterProps) => {
  const statusColor = getBehaviorStatusColor(summary.status);
  const smileyIcon = getSmileyIcon(summary.behaviorScore);

  const getTrendIcon = () => {
    switch (summary.trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendText = () => {
    switch (summary.trend) {
      case "improving":
        return "Improving";
      case "declining":
        return "Declining";
      default:
        return "Stable";
    }
  };

  const getTrendTextColor = () => {
    switch (summary.trend) {
      case "improving":
        return "text-green-600";
      case "declining":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className={`p-3 border-t border-b ${statusColor} -mx-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{smileyIcon}</div>
          <div>
            <p className="font-medium font-display text-foreground">
              <span className="text-muted-foreground">Behavior Score:</span>{" "}
              {summary.behaviorScore}/100
            </p>
            <p className="text-sm font-medium text-muted-foreground capitalize">
              {summary.status} •{" "}
              <span className={getTrendTextColor()}>{getTrendText()}</span>
            </p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className="text-sm font-display font-medium">
              {summary.totalRecords} records
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Updated at{" "}
            {new Date(summary.lastUpdated).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
