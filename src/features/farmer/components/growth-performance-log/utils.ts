import {
  type PerformanceRecord,
  type PerformanceStats,
  type AnimalType,
  ANIMAL_TYPES,
  PERFORMANCE_THRESHOLDS,
} from "./constants";

export const calculateFCR = (
  feedIntake: number,
  weightGain: number
): number => {
  if (weightGain <= 0) return 0;
  return parseFloat((feedIntake / weightGain).toFixed(2));
};

export const calculateGrowthRate = (records: PerformanceRecord[]): number => {
  if (records.length < 2) return 0;

  const sorted = records.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
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
  flockSize: number = 100
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
  initialFlockSize: number = 1000
): number => {
  const totalMortality = records.reduce((sum, record) => {
    return sum + (record.measurements.mortality || 0);
  }, 0);

  return parseFloat(((totalMortality / initialFlockSize) * 100).toFixed(2));
};

export const calculatePerformanceIndex = (
  animalType: AnimalType,
  currentWeight?: number,
  expectedWeight?: number,
  productionRate?: number,
  fcr?: number,
  mortalityRate?: number
): number => {
  let score = 0;
  let factors = 0;

  if (animalType === ANIMAL_TYPES.BROILER && currentWeight && expectedWeight) {
    // Weight performance (40% of score)
    const weightRatio = currentWeight / expectedWeight;
    score += Math.min(weightRatio * 40, 40);
    factors += 40;

    // FCR performance (35% of score)
    if (fcr) {
      const fcrScore = Math.max(0, (2.0 - fcr) * 17.5); // Optimal FCR around 1.6-1.8
      score += Math.min(fcrScore, 35);
      factors += 35;
    }
  }

  if (animalType === ANIMAL_TYPES.LAYER && productionRate) {
    // Production rate performance (60% of score)
    score += Math.min(productionRate * 0.67, 60); // 90% production = 60 points
    factors += 60;
  }

  // Mortality performance (25% of score for both)
  if (mortalityRate !== undefined) {
    const mortalityScore = Math.max(0, (5 - mortalityRate) * 5); // Under 5% mortality is good
    score += Math.min(mortalityScore, 25);
    factors += 25;
  }

  return factors > 0 ? Math.round(score * (100 / factors)) : 0;
};

export const getPerformanceLabel = (index: number): string => {
  if (index >= PERFORMANCE_THRESHOLDS.EXCELLENT) return "Excellent";
  if (index >= PERFORMANCE_THRESHOLDS.GOOD) return "Good";
  if (index >= PERFORMANCE_THRESHOLDS.AVERAGE) return "Average";
  return "Needs Improvement";
};

export const getPerformanceColor = (index: number): string => {
  if (index >= PERFORMANCE_THRESHOLDS.EXCELLENT)
    return "text-green-600 bg-green-100 border-green-200";
  if (index >= PERFORMANCE_THRESHOLDS.GOOD)
    return "text-blue-600 bg-blue-100 border-blue-200";
  if (index >= PERFORMANCE_THRESHOLDS.AVERAGE)
    return "text-yellow-600 bg-yellow-100 border-yellow-200";
  return "text-red-600 bg-red-100 border-red-200";
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

export const formatFCR = (fcr: number): string => {
  return fcr.toFixed(2);
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
  measurementType: "weight" | "eggProduction"
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
  records: PerformanceRecord[]
): PerformanceRecord | null => {
  if (records.length === 0) return null;

  return records.reduce((latest, current) => {
    return new Date(current.date) > new Date(latest.date) ? current : latest;
  });
};

export const calculateStats = (
  records: PerformanceRecord[],
  animalType: AnimalType
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

  const latest = getLatestRecord(records);
  const avgWeight =
    records.reduce((sum, r) => sum + (r.measurements.weight || 0), 0) /
    records.length;
  const avgEggProduction =
    records.reduce((sum, r) => sum + (r.measurements.eggProduction || 0), 0) /
    records.length;
  const growthRate = calculateGrowthRate(records);
  const productionRate = calculateProductionRate(records);
  const mortalityRate = calculateMortalityRate(records);
  const currentFcr = latest?.fcr || 0;

  const performanceIndex = calculatePerformanceIndex(
    animalType,
    latest?.measurements.weight,
    latest?.expectedWeight,
    productionRate,
    currentFcr,
    mortalityRate
  );

  return {
    totalRecords: records.length,
    averageWeight: avgWeight,
    averageEggProduction: avgEggProduction,
    currentFcr,
    growthRate,
    productionRate,
    mortalityRate,
    performanceIndex,
  };
};
