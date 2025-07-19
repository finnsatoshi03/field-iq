import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { type HealthSummary } from "../constants";
import { getHealthStatus, getHealthStatusColor, getSmileyIcon } from "../utils";

interface SmileyMeterProps {
  summary: HealthSummary;
}

export const SmileyMeter = ({ summary }: SmileyMeterProps) => {
  const healthStatus = getHealthStatus(summary.healthScore);
  const statusColor = getHealthStatusColor(healthStatus);
  const smileyIcon = getSmileyIcon(summary.healthScore);

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

  const getTrendColor = () => {
    switch (summary.trend) {
      case "improving":
        return "text-green-600";
      case "declining":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className={`p-3 border-t border-b ${statusColor} -mx-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-2xl">{smileyIcon}</div>
          <div>
            <p className="font-medium text-sm font-display">
              <span className="text-muted-foreground">Health Score: </span>
              {summary.healthScore}/100
            </p>
            <p className="text-xs text-muted-foreground font-medium capitalize">
              {healthStatus} •{" "}
              <span className={getTrendColor()}>{getTrendText()}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className="text-sm font-display font-medium">
              {summary.totalIssues} issues
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium" tabIndex={0}>
            Updated at{" "}
            <span>
              {new Date(summary.lastUpdated).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
