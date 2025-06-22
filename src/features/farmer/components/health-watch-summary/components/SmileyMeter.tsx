import { TrendingUp, TrendingDown, Minus } from "lucide-react";
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

  return (
    <div className={`rounded-lg p-3 border ${statusColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{smileyIcon}</div>
          <div>
            <p className="font-medium text-sm text-foreground">
              Health Score: {summary.healthScore}/100
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {healthStatus} • {getTrendText()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className="text-xs text-muted-foreground">
              {summary.totalIssues} issues
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Updated {summary.lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
};
