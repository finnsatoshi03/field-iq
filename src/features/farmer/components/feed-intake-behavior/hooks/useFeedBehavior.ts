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

// Type guard to check if a record has the expected structure
const isValidFeedRecord = (record: any): record is any => {
  return (
    record &&
    typeof record === "object" &&
    typeof record.date === "string" &&
    typeof record.feed_intake_status === "string" &&
    typeof record.feed_intake_kg === "number"
  );
};

// Transform API behavior status to component format
const transformApiBehaviorStatus = (apiStatus: string): FeedBehavior => {
  switch (apiStatus.toLowerCase()) {
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
  animalQuantity?: number,
): FeedIntakeRecord[] => {
  if (
    !apiBehaviorData?.recent_feed_records ||
    apiBehaviorData.recent_feed_records.length === 0
  ) {
    return [];
  }

  // Filter and transform valid feed records
  return apiBehaviorData.recent_feed_records
    .filter(isValidFeedRecord)
    .map((record, index) => ({
      id: index.toString(),
      date: record.date || new Date().toISOString().split("T")[0],
      behavior: transformApiBehaviorStatus(record.feed_intake_status),
      percentage: record.feed_intake_kg > 0 ? 85 : 25, // Estimate percentage based on feed intake
      timeOfDay: "morning" as const, // Default since API doesn't provide this
      flockSize: animalQuantity || 1000, // Use actual animal quantity or fallback
      feedConsumed: record.feed_intake_kg,
      notes: `Feed intake: ${record.feed_intake_kg}kg - Status: ${record.feed_intake_status}`,
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
  const getStatus = (behaviorScore: number): BehaviorStatus => {
    if (behaviorScore >= 90) return BEHAVIOR_STATUS.EXCELLENT;
    if (behaviorScore >= 75) return BEHAVIOR_STATUS.GOOD;
    if (behaviorScore >= 50) return BEHAVIOR_STATUS.WARNING;
    return BEHAVIOR_STATUS.CRITICAL;
  };

  // Calculate average percentage based on behavior score
  const averagePercentage = Math.min(
    100,
    Math.max(0, apiBehaviorData.behavior_score),
  );

  // Get counts from summary
  const summary = apiBehaviorData.summary || {
    eating_well: 0,
    picky: 0,
    not_eating: 0,
  };

  const totalRecords = summary.eating_well + summary.picky + summary.not_eating;

  // Get the most recent date from recent_feed_records or use current date
  const lastUpdated =
    (apiBehaviorData.recent_feed_records &&
      apiBehaviorData.recent_feed_records.length > 0 &&
      apiBehaviorData.recent_feed_records[0]?.date) ||
    new Date().toISOString().split("T")[0];

  return {
    currentBehavior: transformApiBehaviorStatus(
      apiBehaviorData.behavior_status,
    ),
    averagePercentage,
    behaviorScore: apiBehaviorData.behavior_score,
    status: getStatus(apiBehaviorData.behavior_score),
    trend: "stable" as const, // API doesn't provide trend
    lastUpdated,
    totalRecords,
    eatingWellCount: summary.eating_well,
    pickingOnlyCount: summary.picky,
    notEatingCount: summary.not_eating,
  };
};

export const useFeedBehavior = (
  apiBehaviorData?: ApiFeedIntakeBehavior,
  animalQuantity?: number,
) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentBehavior, setCurrentBehavior] =
    useState<FeedBehavior>("eating_well");
  const [newRecord, setNewRecord] = useState<Partial<FeedIntakeRecord>>({
    date: new Date().toISOString().split("T")[0],
    behavior: "eating_well",
    percentage: 100,
    timeOfDay: "morning",
    flockSize: animalQuantity || 1000,
    feedConsumed: 0,
    notes: "",
  });

  // Transform API data to records
  const records = useMemo(() => {
    return transformApiDataToRecords(apiBehaviorData, animalQuantity);
  }, [apiBehaviorData, animalQuantity]);

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
      flockSize: newRecord.flockSize || animalQuantity || 1000,
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
      flockSize: animalQuantity || 1000,
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
