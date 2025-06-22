export const FEED_FREQUENCY_OPTIONS = [
  { value: 1, label: "Once per day" },
  { value: 2, label: "Twice per day" },
  { value: 3, label: "Three times per day" },
  { value: 4, label: "Four times per day" },
] as const;

export const BAG_SIZE_OPTIONS = [
  { value: 25, label: "25 kg" },
  { value: 50, label: "50 kg" },
] as const;

export const ANIMAL_TYPE_CONSUMPTION = {
  broiler: {
    starter: { dailyConsumption: 0.045, ageRange: "0-21 days" }, // kg per bird per day
    grower: { dailyConsumption: 0.095, ageRange: "22-35 days" },
    finisher: { dailyConsumption: 0.15, ageRange: "36-42 days" },
  },
  layer: {
    starter: { dailyConsumption: 0.04, ageRange: "0-18 weeks" },
    layer: { dailyConsumption: 0.12, ageRange: "19+ weeks" },
  },
} as const;

export const REORDER_THRESHOLDS = {
  LOW: 0.2, // 20% remaining
  MEDIUM: 0.4, // 40% remaining
  HIGH: 0.6, // 60% remaining
} as const;

export interface FeedUsageCalculation {
  dailyConsumption: number; // kg per day total
  weeklyConsumption: number; // kg per week total
  bagsNeededPerWeek: number;
  costPerWeek: number;
  reorderPoint: number; // days before running out
  alertLevel: "low" | "medium" | "high" | "good";
}

export interface CalculatorInputs {
  numberOfAnimals: number;
  feedFrequency: number;
  bagSize: number;
  currentStock: number; // number of bags currently in stock
  bagCost: number;
  animalType: "broiler" | "layer";
  feedStage: "starter" | "grower" | "finisher" | "layer";
}

// Mock data for calculator
export const MOCK_CALCULATOR_INPUTS: CalculatorInputs = {
  numberOfAnimals: 1000,
  feedFrequency: 2,
  bagSize: 50,
  currentStock: 8,
  bagCost: 2800, // PHP
  animalType: "broiler",
  feedStage: "starter",
};

export const ALERT_COLORS = {
  low: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-blue-100 text-blue-800 border-blue-200",
  good: "bg-green-100 text-green-800 border-green-200",
} as const;

export const ALERT_MESSAGES = {
  low: "Critical: Reorder immediately!",
  medium: "Warning: Reorder within 2-3 days",
  high: "Notice: Plan to reorder soon",
  good: "Stock level is adequate",
} as const;
