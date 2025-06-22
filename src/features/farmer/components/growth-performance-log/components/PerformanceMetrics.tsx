import { type AnimalType } from "../constants";
import {
  formatGrowthRate,
  formatEggProduction,
  formatFCR,
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
    <div className="grid grid-cols-2 gap-3">
      <div className="text-center p-3 rounded-lg bg-muted/20 border">
        <div className="text-lg font-bold text-blue-600">
          {animalType === "broiler"
            ? formatGrowthRate(stats.growthRate)
            : latestRecord?.measurements.eggProduction
              ? formatEggProduction(latestRecord.measurements.eggProduction)
              : "N/A"}
        </div>
        <div className="text-xs text-muted-foreground">
          {animalType === "broiler" ? "Growth Rate" : "Daily Production"}
        </div>
      </div>
      <div className="text-center p-3 rounded-lg bg-muted/20 border">
        <div className="text-lg font-bold text-orange-600">
          {animalType === "broiler"
            ? formatFCR(stats.currentFcr)
            : formatProductionRate(stats.productionRate)}
        </div>
        <div className="text-xs text-muted-foreground">
          {animalType === "broiler" ? "Current FCR" : "Production Rate"}
        </div>
      </div>
    </div>
  );
};
