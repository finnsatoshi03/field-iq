import { useState, useMemo } from "react";
import {
  MOCK_BROILER_RECORDS,
  MOCK_LAYER_RECORDS,
  ANIMAL_TYPES,
  type PerformanceRecord,
  type AnimalType,
} from "../constants";
import { calculateStats, generateChartData, getLatestRecord } from "../utils";

export const useGrowthPerformance = () => {
  const [animalType, setAnimalType] = useState<AnimalType>(
    ANIMAL_TYPES.BROILER
  );
  const [records, setRecords] = useState<PerformanceRecord[]>(
    animalType === ANIMAL_TYPES.BROILER
      ? MOCK_BROILER_RECORDS
      : MOCK_LAYER_RECORDS
  );
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<PerformanceRecord>>({
    date: new Date().toISOString().split("T")[0],
    ageInDays: 0,
    measurements: {},
    notes: "",
  });

  // Calculate performance stats
  const stats = useMemo(
    () => calculateStats(records, animalType),
    [records, animalType]
  );
  const latestRecord = useMemo(() => getLatestRecord(records), [records]);
  const chartData = useMemo(
    () =>
      generateChartData(
        records,
        animalType === ANIMAL_TYPES.BROILER ? "weight" : "eggProduction"
      ),
    [records, animalType]
  );

  const handleAnimalTypeChange = (type: AnimalType) => {
    setAnimalType(type);
    setRecords(
      type === ANIMAL_TYPES.BROILER ? MOCK_BROILER_RECORDS : MOCK_LAYER_RECORDS
    );
  };

  const handleAddRecord = () => {
    if (!newRecord.date || !newRecord.ageInDays) return;

    const record: PerformanceRecord = {
      id: Date.now().toString(),
      date: newRecord.date!,
      ageInDays: newRecord.ageInDays!,
      measurements: newRecord.measurements || {},
      notes: newRecord.notes,
    };

    setRecords((prev) =>
      [...prev, record].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );

    // Reset form
    setNewRecord({
      date: new Date().toISOString().split("T")[0],
      ageInDays: 0,
      measurements: {},
      notes: "",
    });
    setIsAddRecordOpen(false);
  };

  const getProgressValue = () => {
    if (
      animalType === ANIMAL_TYPES.BROILER &&
      latestRecord?.measurements.weight &&
      latestRecord?.expectedWeight
    ) {
      return Math.min(
        (latestRecord.measurements.weight / latestRecord.expectedWeight) * 100,
        100
      );
    }
    if (animalType === ANIMAL_TYPES.LAYER && stats.productionRate) {
      return Math.min(stats.productionRate, 100);
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
