import type { GrowthPerformance } from "@/features/farmer/types";
import { useMemo, useState } from "react";
import {
  ANIMAL_TYPES,
  type AnimalType,
  type PerformanceRecord,
  type PerformanceStats,
} from "../constants";
import { getLatestRecord } from "../utils";

// Transform API data to component format
const transformApiDataToRecords = (
  growthData?: GrowthPerformance,
): PerformanceRecord[] => {
  if (!growthData?.performance_analytics?.recent_records) {
    return [];
  }

  return growthData.performance_analytics.recent_records.map(
    (record, index) => ({
      id: index.toString(),
      date: record.date,
      ageInDays: parseInt(record.day.replace("Day ", "")),
      measurements: {
        weight: record.actual_weight,
        feedIntake: undefined, // Not available in API
        mortality: undefined, // Available separately in performance_analytics
      },
      notes: record.note,
      fcr: growthData.current_fcr,
      expectedWeight: growthData.target_weight,
    }),
  );
};

// Create stats from API data
const createStatsFromApiData = (
  growthData?: GrowthPerformance,
  animalType?: AnimalType,
): PerformanceStats => {
  console.log(animalType);
  if (!growthData) {
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

  return {
    totalRecords: growthData.performance_analytics.total_logs,
    averageWeight: growthData.actual_weight,
    averageEggProduction: 0, // Not available for broilers
    currentFcr: growthData.current_fcr,
    growthRate: growthData.daily_average_growth_rate,
    productionRate: 0, // Not applicable for broilers
    mortalityRate: growthData.performance_analytics.mortality_percentage,
    performanceIndex: growthData.performance_analytics.performance_index,
  };
};

export const useGrowthPerformance = (growthData?: GrowthPerformance) => {
  const [animalType, setAnimalType] = useState<AnimalType>(
    ANIMAL_TYPES.BROILER,
  );
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<PerformanceRecord>>({
    date: new Date().toISOString().split("T")[0],
    ageInDays: 0,
    measurements: {},
    notes: "",
  });

  // Transform API data to records
  const records = useMemo(
    () => transformApiDataToRecords(growthData),
    [growthData],
  );

  // Create stats from API data
  const stats = useMemo(
    () => createStatsFromApiData(growthData, animalType),
    [growthData, animalType],
  );

  const latestRecord = useMemo(() => getLatestRecord(records), [records]);

  // Generate chart data from API growth_chart_data
  const chartData = useMemo(() => {
    if (!growthData?.growth_chart_data) {
      return [];
    }

    return growthData.growth_chart_data.map((dataPoint) => ({
      date: dataPoint.date,
      actual: dataPoint.actual_weight,
      expected: dataPoint.target_weight,
    }));
  }, [growthData]);

  const handleAnimalTypeChange = (type: AnimalType) => {
    setAnimalType(type);
    // Note: API data doesn't distinguish between animal types for now
    // In the future, you might want to pass animal type to the API
  };

  const handleAddRecord = () => {
    if (!newRecord.date || !newRecord.ageInDays) return;

    // This would typically send data to the API
    // For now, we'll just close the form since we're using read-only API data
    setNewRecord({
      date: new Date().toISOString().split("T")[0],
      ageInDays: 0,
      measurements: {},
      notes: "",
    });
    setIsAddRecordOpen(false);
  };

  const getProgressValue = () => {
    if (!growthData) return 0;

    // Calculate progress based on actual vs target weight
    if (growthData.actual_weight && growthData.target_weight) {
      return Math.min(
        (growthData.actual_weight / growthData.target_weight) * 100,
        100,
      );
    }

    return 0;
  };

  return {
    // State
    animalType,
    records,
    isAddRecordOpen,
    isDetailViewOpen,
    newRecord,

    // Computed values
    stats,
    latestRecord,
    chartData,
    progressValue: getProgressValue(),

    // Actions
    setAnimalType: handleAnimalTypeChange,
    setNewRecord,
    setIsAddRecordOpen,
    setIsDetailViewOpen,
    handleAddRecord,
  };
};
