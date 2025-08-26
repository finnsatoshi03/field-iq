import {
  type AnimalType,
  type PerformanceRecord,
  type PerformanceStats,
} from "./constants";

export const calculateGrowthRate = (records: PerformanceRecord[]): number => {
  if (records.length < 2) return 0;

  const sorted = records.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  if (!first.measurements.weight || !last.measurements.weight) return 0;

  const weightGain = last.measurements.weight - first.measurements.weight;
  const daysElapsed = last.ageInDays - first.ageInDays;

  return parseFloat((weightGain / daysElapsed).toFixed(3));
};

export const calculateProductionRate = (
  records: PerformanceRecord[],
  flockSize: number = 100,
): number => {
  if (records.length === 0) return 0;

  const totalEggs = records.reduce((sum, record) => {
    return sum + (record.measurements.eggProduction || 0);
  }, 0);

  const avgDailyProduction = totalEggs / records.length;
  return parseFloat(((avgDailyProduction / flockSize) * 100).toFixed(1)); // percentage
};

export const calculateMortalityRate = (
  records: PerformanceRecord[],
  initialFlockSize: number = 1000,
): number => {
  const totalMortality = records.reduce((sum, record) => {
    return sum + (record.measurements.mortality || 0);
  }, 0);

  return parseFloat(((totalMortality / initialFlockSize) * 100).toFixed(2));
};

export const formatWeight = (weight: number): string => {
  if (weight < 1) {
    return `${Math.round(weight * 1000)}g`;
  }
  return `${weight.toFixed(2)}kg`;
};

export const formatEggProduction = (eggs: number): string => {
  return `${eggs} eggs/day`;
};

export const formatGrowthRate = (rate: number): string => {
  return `${(rate * 1000).toFixed(1)}g/day`;
};

export const formatProductionRate = (rate: number): string => {
  return `${rate.toFixed(1)}%`;
};

export const formatMortalityRate = (rate: number): string => {
  return `${rate.toFixed(2)}%`;
};

export const generateChartData = (
  records: PerformanceRecord[],
  measurementType: "weight" | "eggProduction",
) => {
  return records
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((record) => ({
      date: record.date,
      age: record.ageInDays,
      actual: record.measurements[measurementType] || 0,
      expected:
        measurementType === "weight"
          ? record.expectedWeight || 0
          : record.expectedEggProduction || 0,
      formattedDate: new Date(record.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
};

export const getLatestRecord = (
  records: PerformanceRecord[],
): PerformanceRecord | null => {
  if (records.length === 0) return null;

  return records.reduce((latest, current) => {
    return new Date(current.date) > new Date(latest.date) ? current : latest;
  });
};

export const calculateStats = (
  records: PerformanceRecord[],
  _animalType: AnimalType,
): PerformanceStats => {
  if (records.length === 0) {
    return {
      totalRecords: 0,
      averageWeight: 0,
      averageEggProduction: 0,
      currentFcr: 0,
      growthRate: 0,
      productionRate: 0,
      mortalityRate: 0,
      performanceIndex: 0,
    };
  }

  // const latest = getLatestRecord(records);
  const avgWeight =
    records.reduce((sum, r) => sum + (r.measurements.weight || 0), 0) /
    records.length;
  const avgEggProduction =
    records.reduce((sum, r) => sum + (r.measurements.eggProduction || 0), 0) /
    records.length;
  const growthRate = calculateGrowthRate(records);
  const productionRate = calculateProductionRate(records);
  const mortalityRate = calculateMortalityRate(records);

  return {
    totalRecords: records.length,
    averageWeight: avgWeight,
    averageEggProduction: avgEggProduction,
    currentFcr: 0, // Removed from UI, set to 0
    growthRate,
    productionRate,
    mortalityRate,
    performanceIndex: 0, // Removed from UI, set to 0
  };
};
