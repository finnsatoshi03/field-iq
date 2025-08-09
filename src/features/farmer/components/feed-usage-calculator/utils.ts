import {
  type CalculatorInputs,
  type FeedUsageCalculation,
  ANIMAL_TYPE_CONSUMPTION,
} from "./constants";

export const calculateFeedUsage = (
  inputs: CalculatorInputs,
): FeedUsageCalculation => {
  const {
    numberOfAnimals,
    bagSize,
    currentStock,
    bagCost,
    animalType,
    feedStage,
  } = inputs;

  // Get daily consumption per animal based on type and stage
  const consumptionData =
    ANIMAL_TYPE_CONSUMPTION[animalType][
      feedStage as keyof (typeof ANIMAL_TYPE_CONSUMPTION)[typeof animalType]
    ];

  if (!consumptionData) {
    throw new Error(`Invalid combination: ${animalType} - ${feedStage}`);
  }

  // Calculate daily consumption for all animals
  const dailyConsumption = numberOfAnimals * consumptionData.dailyConsumption;

  // Calculate weekly consumption
  const weeklyConsumption = dailyConsumption * 7;

  // Calculate bags needed per week
  const bagsNeededPerWeek = Math.ceil(weeklyConsumption / bagSize);

  // Calculate cost per week
  const costPerWeek = bagsNeededPerWeek * bagCost;

  // Calculate how many days current stock will last
  const currentStockKg = currentStock * bagSize;
  const reorderPoint = Math.floor(currentStockKg / dailyConsumption);

  // Determine alert level
  let alertLevel: FeedUsageCalculation["alertLevel"] = "good";

  if (reorderPoint <= 2) {
    alertLevel = "low";
  } else if (reorderPoint <= 5) {
    alertLevel = "medium";
  } else if (reorderPoint <= 10) {
    alertLevel = "high";
  }

  return {
    dailyConsumption,
    weeklyConsumption,
    bagsNeededPerWeek,
    costPerWeek,
    reorderPoint,
    alertLevel,
  };
};

export const formatWeight = (kg?: number | null): string => {
  const value = typeof kg === "number" ? kg : Number(kg);
  if (!Number.isFinite(value)) return "—";
  if (value < 1) {
    return `${Math.round(value * 1000)}g`;
  }
  return `${value.toFixed(1)}kg`;
};

export const formatCurrency = (amount?: number | null): string => {
  const value = typeof amount === "number" ? amount : Number(amount);
  const safe = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safe);
};

export const formatBags = (bags: number): string => {
  return bags === 1 ? `${bags} bag` : `${bags} bags`;
};

export const formatDays = (days: number): string => {
  if (days === 0) return "Less than 1 day";
  return days === 1 ? `${days} day` : `${days} days`;
};

export const getOptimalReorderPoint = (
  weeklyConsumption: number,
  bagSize: number,
): number => {
  // Suggest reordering when you have 1.5 weeks of feed left
  const optimalDays = 10;
  const dailyConsumption = weeklyConsumption / 7;
  return Math.ceil((dailyConsumption * optimalDays) / bagSize);
};

export const calculateSavings = (
  currentUsage: number,
  optimizedUsage: number,
  bagCost: number,
): number => {
  const difference = currentUsage - optimizedUsage;
  return difference * bagCost;
};

export const validateInputs = (inputs: CalculatorInputs): string[] => {
  const errors: string[] = [];

  if (inputs.numberOfAnimals <= 0) {
    errors.push("Number of animals must be greater than 0");
  }

  if (inputs.bagSize <= 0) {
    errors.push("Bag size must be greater than 0");
  }

  if (inputs.currentStock < 0) {
    errors.push("Current stock cannot be negative");
  }

  if (inputs.bagCost <= 0) {
    errors.push("Bag cost must be greater than 0");
  }

  return errors;
};

export const getConsumptionInfo = (
  animalType: "broiler" | "layer",
  feedStage: string,
) => {
  const consumptionData = ANIMAL_TYPE_CONSUMPTION[animalType];
  return consumptionData[feedStage as keyof typeof consumptionData];
};
