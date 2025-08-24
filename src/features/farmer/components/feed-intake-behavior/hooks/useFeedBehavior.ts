import type { FeedIntakeBehavior as ApiFeedIntakeBehavior } from "@/features/farmer/types";
import { useMemo, useState } from "react";
import {
  type BehaviorStatus,
  type FeedBehavior,
  type FeedIntakeRecord,
  type FeedIntakeSummary,
  BEHAVIOR_STATUS,
  FEED_BEHAVIOR,
} from "../constants";

// Transform API behavior status to component format
const transformApiBehaviorStatus = (apiStatus: string): FeedBehavior => {
  switch (apiStatus) {
    case "eating_well":
      return FEED_BEHAVIOR.EATING_WELL;
    case "picky":
      return FEED_BEHAVIOR.PICKING_ONLY;
    case "not_eating":
      return FEED_BEHAVIOR.NOT_EATING;
    default:
      return FEED_BEHAVIOR.EATING_WELL;
  }
};

// Transform API data to component format
const transformApiDataToRecords = (
  apiBehaviorData?: ApiFeedIntakeBehavior,
): FeedIntakeRecord[] => {
  if (
    !apiBehaviorData?.performance_analytics?.recent_records ||
    apiBehaviorData.performance_analytics.recent_records.length === 0
  ) {
    return [];
  }

  // Since recent_records structure is unknown, we'll create mock records based on available data
  return apiBehaviorData.performance_analytics.recent_records.map(
    (record, index) => ({
      id: index.toString(),
      date: new Date().toISOString().split("T")[0], // Use current date as fallback
      behavior: FEED_BEHAVIOR.EATING_WELL, // Default to eating well
      percentage: 85, // Default percentage
      timeOfDay: "morning" as const,
      flockSize: 1000, // Default flock size
      feedConsumed: 0, // Default feed consumed
      notes: `Record ${index + 1} - Performance data available`,
    }),
  );
};

// Create summary from API data
const createSummaryFromApiData = (
  apiBehaviorData?: ApiFeedIntakeBehavior,
): FeedIntakeSummary => {
  if (!apiBehaviorData) {
    return {
      currentBehavior: FEED_BEHAVIOR.EATING_WELL,
      averagePercentage: 0,
      behaviorScore: 0,
      status: BEHAVIOR_STATUS.CRITICAL,
      trend: "stable" as const,
      lastUpdated: new Date().toISOString().split("T")[0],
      totalRecords: 0,
      eatingWellCount: 0,
      pickingOnlyCount: 0,
      notEatingCount: 0,
    };
  }

  // Determine status based on performance index and total records
  const getStatus = (performanceIndex: number, totalRecords: number): BehaviorStatus => {
    // If no records, show neutral status
    if (totalRecords === 0) return BEHAVIOR_STATUS.WARNING;
    
    if (performanceIndex >= 90) return BEHAVIOR_STATUS.EXCELLENT;
    if (performanceIndex >= 75) return BEHAVIOR_STATUS.GOOD;
    if (performanceIndex >= 50) return BEHAVIOR_STATUS.WARNING;
    return BEHAVIOR_STATUS.CRITICAL;
  };

  // Calculate behavior score based on available metrics
  const behaviorScore =
    apiBehaviorData.performance_analytics?.performance_index || 0;

  // Calculate average percentage based on FCR and growth rate
  const averagePercentage = Math.min(
    100,
    Math.max(
      0,
      (apiBehaviorData.daily_average_growth_rate || 0) * 10 +
        (apiBehaviorData.current_fcr > 0
          ? (2.0 / apiBehaviorData.current_fcr) * 50
          : 50),
    ),
  );

  const totalRecords = apiBehaviorData.performance_analytics?.total_logs || 0;

  return {
    currentBehavior: FEED_BEHAVIOR.EATING_WELL, // Default to eating well
    averagePercentage,
    behaviorScore,
    status: getStatus(behaviorScore, totalRecords),
    trend: "stable" as const, // API doesn't provide trend
    lastUpdated: new Date().toISOString().split("T")[0],
    totalRecords,
    eatingWellCount: Math.max(
      0,
      totalRecords - (apiBehaviorData.performance_analytics?.mortality_count || 0),
    ),
    pickingOnlyCount: 0, // Not available in new API
    notEatingCount: apiBehaviorData.performance_analytics?.mortality_count || 0,
  };
};

export const useFeedBehavior = (apiBehaviorData?: ApiFeedIntakeBehavior) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentBehavior, setCurrentBehavior] =
    useState<FeedBehavior>("eating_well");
  const [newRecord, setNewRecord] = useState<Partial<FeedIntakeRecord>>({
    date: new Date().toISOString().split("T")[0],
    behavior: "eating_well",
    percentage: 100,
    timeOfDay: "morning",
    flockSize: 1000,
    feedConsumed: 0,
    notes: "",
  });

  // Transform API data to records
  const records = useMemo(() => {
    return transformApiDataToRecords(apiBehaviorData);
  }, [apiBehaviorData]);

  // Create summary from API data
  const summary = useMemo(() => {
    return createSummaryFromApiData(apiBehaviorData);
  }, [apiBehaviorData]);

  const handleAddRecord = () => {
    if (!newRecord.behavior || !newRecord.date) return;

    const record: FeedIntakeRecord = {
      id: Date.now().toString(),
      date: newRecord.date,
      behavior: newRecord.behavior,
      percentage: newRecord.percentage || 0,
      timeOfDay: newRecord.timeOfDay || "morning",
      flockSize: newRecord.flockSize || 1000,
      feedConsumed: newRecord.feedConsumed || 0,
      notes: newRecord.notes,
    };

    // This would typically send data to the API
    console.log("Adding new record:", record);

    // Reset form
    setNewRecord({
      date: new Date().toISOString().split("T")[0],
      behavior: "eating_well",
      percentage: 100,
      timeOfDay: "morning",
      flockSize: 1000,
      feedConsumed: 0,
      notes: "",
    });

    setIsAddDialogOpen(false);
  };

  const handleNewRecordChange = (updatedRecord: Partial<FeedIntakeRecord>) => {
    setNewRecord(updatedRecord);
  };

  const handleBehaviorChange = (behavior: FeedBehavior) => {
    setCurrentBehavior(behavior);
  };

  return {
    records,
    summary,
    currentBehavior,
    isAddDialogOpen,
    setIsAddDialogOpen,
    newRecord,
    handleNewRecordChange,
    handleAddRecord,
    handleBehaviorChange,
  };
};
