import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { type FeedIntakeSummary } from "../constants";
import { getBehaviorStatusColor, getSmileyIcon } from "../utils";

interface BehaviorMeterProps {
  summary: FeedIntakeSummary;
}

// Quick date formatter function
const formatLastUpdated = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays === 1) {
      return "yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      // For older dates, show the actual date
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Fallback to original string
  }
};

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

  return (
    <div className={`rounded-lg p-3 border ${statusColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{smileyIcon}</div>
          <div>
            <p className="font-medium text-sm text-foreground">
              Behavior Score: {summary.behaviorScore}/100
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {summary.status} • {getTrendText()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className="text-xs text-muted-foreground">
              {summary.totalRecords} records
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Updated {formatLastUpdated(summary.lastUpdated)}
          </p>
        </div>
      </div>
    </div>
  );
};
