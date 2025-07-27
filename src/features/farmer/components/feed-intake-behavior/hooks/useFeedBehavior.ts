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
  if (!apiBehaviorData?.recent_feed_records) {
    return [];
  }

  return apiBehaviorData.recent_feed_records.map((record, index) => ({
    id: index.toString(),
    date: record.date.split("T")[0], // Extract date part only
    behavior: transformApiBehaviorStatus(record.feed_intake_status),
    percentage:
      record.feed_intake_status === "eating_well"
        ? 95
        : record.feed_intake_status === "picky"
          ? 65
          : 30,
    timeOfDay: "morning" as const, // API doesn't provide time of day
    flockSize: 1000, // API doesn't provide flock size
    feedConsumed: record.feed_intake_kg,
    notes: `${record.feed_intake_status.replace("_", " ")} - ${record.feed_intake_kg}kg consumed`,
  }));
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

  // Determine status based on behavior score
  const getStatus = (score: number): BehaviorStatus => {
    if (score >= 90) return BEHAVIOR_STATUS.EXCELLENT;
    if (score >= 75) return BEHAVIOR_STATUS.GOOD;
    if (score >= 50) return BEHAVIOR_STATUS.WARNING;
    return BEHAVIOR_STATUS.CRITICAL;
  };

  return {
    currentBehavior: transformApiBehaviorStatus(
      apiBehaviorData.behavior_status,
    ),
    averagePercentage: apiBehaviorData.behavior_score,
    behaviorScore: apiBehaviorData.behavior_score,
    status: getStatus(apiBehaviorData.behavior_score),
    trend: "stable" as const, // API doesn't provide trend
    lastUpdated:
      apiBehaviorData.recent_feed_records[0]?.date?.split("T")[0] ||
      new Date().toISOString().split("T")[0],
    totalRecords: apiBehaviorData.recent_feed_records.length,
    eatingWellCount: apiBehaviorData.summary.eating_well,
    pickingOnlyCount: apiBehaviorData.summary.picky,
    notEatingCount: apiBehaviorData.summary.not_eating,
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
