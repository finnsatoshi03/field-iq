import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { type AnimalType } from "../constants";
import { formatProductionRate, formatWeight } from "../utils";

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
  const mortalityRate = stats.mortalityRate;

  if (mortalityRate < 2) {
    return {
      status: "normal",
      label: "Healthy",
      description: "All parameters within normal range",
      icon: (
        <ShieldCheck className="h-4 w-4 text-green-600" strokeWidth={2.5} />
      ),
    };
  } else if (mortalityRate < 5) {
    return {
      status: "watch",
      label: "Monitor",
      description: "Some parameters need attention",
      icon: (
        <ShieldAlert className="h-4 w-4 text-yellow-600" strokeWidth={2.5} />
      ),
    };
  } else if (mortalityRate < 8) {
    return {
      status: "warning",
      label: "Warning",
      description: "Performance below target levels",
      icon: (
        <AlertTriangle className="h-4 w-4 text-orange-600" strokeWidth={2.5} />
      ),
    };
  } else {
    return {
      status: "alert",
      label: "Alert",
      description: "Immediate attention required",
      icon: <Activity className="h-4 w-4 text-red-600" strokeWidth={2.5} />,
    };
  }
};

const getHealthStatusColor = (status: HealthStatus): string => {
  switch (status) {
    case "normal":
      return "border-green-600 bg-green-100";
    case "watch":
      return "border-yellow-600 bg-yellow-100";
    case "warning":
      return "border-orange-600 bg-orange-100";
    case "alert":
      return "border-red-600 bg-red-100";
    default:
      return "border-gray-600 bg-gray-100";
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
    <div className={`p-3 border-t border-b ${statusColor} -mx-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {healthStatus.icon}
          <div>
            <p
              className={cn(
                "font-medium font-display text-foreground",
                healthStatus.status === "normal" && "text-green-600",
                healthStatus.status === "watch" && "text-yellow-600",
                healthStatus.status === "warning" && "text-orange-600",
                healthStatus.status === "alert" && "text-red-600",
              )}
            >
              {healthStatus.label}
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              {healthStatus.description}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium font-display text-foreground">
            {animalType === "broiler"
              ? latestRecord?.measurements.weight
                ? formatWeight(latestRecord.measurements.weight)
                : "N/A"
              : formatProductionRate(stats.productionRate)}
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            {animalType === "broiler" ? "Current Weight" : "Production Rate"}
          </p>
        </div>
      </div>
    </div>
  );
};
