import { Egg, Factory, Ratio, TrendingUpDown } from "lucide-react";
import { type AnimalType } from "../constants";
import {
  formatEggProduction,
  formatFCR,
  formatGrowthRate,
  formatProductionRate,
} from "../utils";

interface PerformanceMetricsProps {
  stats: any;
  animalType: AnimalType;
  latestRecord: any;
}

export const PerformanceMetrics = ({
  stats,
  animalType,
  latestRecord,
}: PerformanceMetricsProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="text-center p-3 rounded-lg space-y-1 bg-muted/50">
        <div className="text-xl font-medium font-display">
          {animalType === "broiler"
            ? formatGrowthRate(stats.growthRate)
            : latestRecord?.measurements.eggProduction
              ? formatEggProduction(latestRecord.measurements.eggProduction)
              : "N/A"}
        </div>
        <div className="flex items-center justify-center gap-1">
          {animalType === "broiler" ? (
            <TrendingUpDown className="size-4 text-orange-600" />
          ) : (
            <Egg className="size-4 text-blue-600" />
          )}
          <div className="text-xs text-muted-foreground font-medium">
            {animalType === "broiler" ? "Growth Rate" : "Daily Production"}
          </div>
        </div>
      </div>
      <div className="text-center p-3 rounded-lg space-y-1 bg-muted/50">
        <div className="text-xl font-medium font-display">
          {animalType === "broiler"
            ? formatFCR(stats.currentFcr)
            : formatProductionRate(stats.productionRate)}
        </div>
        <div className="flex items-center justify-center gap-1">
          {animalType === "broiler" ? (
            <Ratio className="size-4 text-orange-600" />
          ) : (
            <Factory className="size-4 text-red-600" />
          )}
          <div className="text-xs text-muted-foreground font-medium">
            {animalType === "broiler" ? "Current FCR" : "Production Rate"}
          </div>
        </div>
      </div>
    </div>
  );
};
