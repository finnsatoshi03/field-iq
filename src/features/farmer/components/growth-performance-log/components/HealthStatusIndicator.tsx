import { CheckCircle, Clock, AlertTriangle, Activity } from "lucide-react";
import { type AnimalType } from "../constants";
import { formatWeight, formatProductionRate } from "../utils";

type HealthStatus = "normal" | "warning" | "alert" | "watch";

interface HealthIndicator {
  status: HealthStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface HealthStatusIndicatorProps {
  stats: any;
  animalType: AnimalType;
  latestRecord: any;
}

const getHealthStatus = (stats: any): HealthIndicator => {
  const performanceIndex = stats.performanceIndex;
  const mortalityRate = stats.mortalityRate;

  if (performanceIndex >= 85 && mortalityRate < 2) {
    return {
      status: "normal",
      label: "Healthy",
      description: "All parameters within normal range",
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    };
  } else if (performanceIndex >= 70 || mortalityRate < 5) {
    return {
      status: "watch",
      label: "Monitor",
      description: "Some parameters need attention",
      icon: <Clock className="h-4 w-4 text-yellow-600" />,
    };
  } else if (performanceIndex >= 50 || mortalityRate < 8) {
    return {
      status: "warning",
      label: "Warning",
      description: "Performance below target levels",
      icon: <AlertTriangle className="h-4 w-4 text-orange-600" />,
    };
  } else {
    return {
      status: "alert",
      label: "Alert",
      description: "Immediate attention required",
      icon: <Activity className="h-4 w-4 text-red-600" />,
    };
  }
};

const getHealthStatusColor = (status: HealthStatus): string => {
  switch (status) {
    case "normal":
      return "border-green-200 bg-green-50/50";
    case "watch":
      return "border-yellow-200 bg-yellow-50/50";
    case "warning":
      return "border-orange-200 bg-orange-50/50";
    case "alert":
      return "border-red-200 bg-red-50/50";
    default:
      return "border-gray-200 bg-gray-50/50";
  }
};

export const HealthStatusIndicator = ({
  stats,
  animalType,
  latestRecord,
}: HealthStatusIndicatorProps) => {
  const healthStatus = getHealthStatus(stats);
  const statusColor = getHealthStatusColor(healthStatus.status);

  return (
    <div className={`rounded-lg p-3 border ${statusColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {healthStatus.icon}
          <div>
            <p className="font-medium text-sm text-foreground">
              {healthStatus.label}
            </p>
            <p className="text-xs text-muted-foreground">
              {healthStatus.description}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {animalType === "broiler"
              ? latestRecord?.measurements.weight
                ? formatWeight(latestRecord.measurements.weight)
                : "N/A"
              : formatProductionRate(stats.productionRate)}
          </p>
          <p className="text-xs text-muted-foreground">
            {animalType === "broiler" ? "Current Weight" : "Production Rate"}
          </p>
        </div>
      </div>
    </div>
  );
};
