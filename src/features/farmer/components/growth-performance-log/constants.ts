export const ANIMAL_TYPES = {
  BROILER: "broiler",
  LAYER: "layer",
} as const;

export type AnimalType = (typeof ANIMAL_TYPES)[keyof typeof ANIMAL_TYPES];

export const MEASUREMENT_TYPES = {
  WEIGHT: "weight",
  EGG_PRODUCTION: "egg_production",
  MORTALITY: "mortality",
  FEED_INTAKE: "feed_intake",
} as const;

export type MeasurementType =
  (typeof MEASUREMENT_TYPES)[keyof typeof MEASUREMENT_TYPES];

export interface PerformanceRecord {
  id: string;
  date: string;
  ageInDays: number;
  measurements: {
    weight?: number; // kg for broilers
    eggProduction?: number; // eggs per day for layers
    mortality?: number; // number of birds
    feedIntake?: number; // kg per day
  };
  notes?: string;
  fcr?: number; // Feed Conversion Ratio
  expectedWeight?: number; // Target weight for comparison
  expectedEggProduction?: number; // Target egg production for comparison
}

export interface PerformanceStats {
  totalRecords: number;
  averageWeight: number;
  averageEggProduction: number;
  currentFcr: number;
  growthRate: number; // kg per day or percentage
  productionRate: number; // eggs per bird per day
  mortalityRate: number; // percentage
  performanceIndex: number; // overall score 0-100
}

// Mock data for broiler performance
export const MOCK_BROILER_RECORDS: PerformanceRecord[] = [
  {
    id: "1",
    date: "2024-01-01",
    ageInDays: 7,
    measurements: { weight: 0.15, feedIntake: 0.025, mortality: 2 },
    expectedWeight: 0.14,
    fcr: 1.1,
    notes: "Good start, healthy chicks",
  },
  {
    id: "2",
    date: "2024-01-08",
    ageInDays: 14,
    measurements: { weight: 0.35, feedIntake: 0.045, mortality: 1 },
    expectedWeight: 0.32,
    fcr: 1.2,
    notes: "Above target weight",
  },
  {
    id: "3",
    date: "2024-01-15",
    ageInDays: 21,
    measurements: { weight: 0.65, feedIntake: 0.075, mortality: 0 },
    expectedWeight: 0.6,
    fcr: 1.25,
    notes: "Excellent growth rate",
  },
  {
    id: "4",
    date: "2024-01-22",
    ageInDays: 28,
    measurements: { weight: 1.1, feedIntake: 0.12, mortality: 1 },
    expectedWeight: 1.0,
    fcr: 1.3,
    notes: "Maintaining good performance",
  },
  {
    id: "5",
    date: "2024-01-29",
    ageInDays: 35,
    measurements: { weight: 1.6, feedIntake: 0.16, mortality: 0 },
    expectedWeight: 1.5,
    fcr: 1.4,
    notes: "Ready for finisher feed transition",
  },
];

// Mock data for layer performance
export const MOCK_LAYER_RECORDS: PerformanceRecord[] = [
  {
    id: "1",
    date: "2024-01-01",
    ageInDays: 140,
    measurements: { eggProduction: 45, feedIntake: 12, mortality: 1 },
    expectedEggProduction: 40,
    notes: "Peak production period starting",
  },
  {
    id: "2",
    date: "2024-01-08",
    ageInDays: 147,
    measurements: { eggProduction: 52, feedIntake: 12.5, mortality: 0 },
    expectedEggProduction: 45,
    notes: "Excellent production rate",
  },
  {
    id: "3",
    date: "2024-01-15",
    ageInDays: 154,
    measurements: { eggProduction: 48, feedIntake: 12.2, mortality: 2 },
    expectedEggProduction: 48,
    notes: "Maintaining good production",
  },
  {
    id: "4",
    date: "2024-01-22",
    ageInDays: 161,
    measurements: { eggProduction: 50, feedIntake: 12.8, mortality: 1 },
    expectedEggProduction: 50,
    notes: "Peak performance maintained",
  },
];

export const PERFORMANCE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  AVERAGE: 60,
  POOR: 40,
} as const;

export const PERFORMANCE_COLORS = {
  EXCELLENT: "text-green-600 bg-green-100 border-green-200",
  GOOD: "text-blue-600 bg-blue-100 border-blue-200",
  AVERAGE: "text-yellow-600 bg-yellow-100 border-yellow-200",
  POOR: "text-red-600 bg-red-100 border-red-200",
} as const;

export const CHART_COLORS = {
  ACTUAL: "#3b82f6", // blue
  EXPECTED: "#e5e7eb", // gray
  TREND: "#10b981", // green
} as const;

export const WEIGHT_RANGES = {
  BROILER_STARTER: { min: 0.04, max: 0.6 }, // 40g to 600g
  BROILER_GROWER: { min: 0.6, max: 1.5 }, // 600g to 1.5kg
  BROILER_FINISHER: { min: 1.5, max: 3.0 }, // 1.5kg to 3kg
} as const;

export const EGG_PRODUCTION_RANGES = {
  PEAK: { min: 85, max: 95 }, // 85-95% production rate
  GOOD: { min: 75, max: 85 }, // 75-85% production rate
  AVERAGE: { min: 65, max: 75 }, // 65-75% production rate
} as const;
