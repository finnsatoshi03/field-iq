import { type FarmerData, getFarmerData } from "@/services/farmer-service";

export const FEED_BEHAVIOR = {
  EATING_WELL: "eating_well",
  PICKING_ONLY: "picky", // Maps to API's "picky"
  NOT_EATING: "not_eating",
} as const;

export const BEHAVIOR_STATUS = {
  EXCELLENT: "excellent",
  GOOD: "good",
  WARNING: "warning",
  CRITICAL: "critical",
} as const;

export type FeedBehavior = (typeof FEED_BEHAVIOR)[keyof typeof FEED_BEHAVIOR];
export type BehaviorStatus =
  (typeof BEHAVIOR_STATUS)[keyof typeof BEHAVIOR_STATUS];

export interface FeedIntakeRecord {
  id: string;
  date: string;
  behavior: FeedBehavior;
  percentage: number; // 0-100 scale - PLACEHOLDER (not in API)
  notes?: string; // PLACEHOLDER (not in API)
  timeOfDay: "morning" | "afternoon" | "evening"; // PLACEHOLDER (not in API)
  flockSize: number; // Can be derived from feed_calculation_log.number_of_animals
  feedConsumed: number; // Maps to API's feed_intake_kg
}

export interface FeedIntakeSummary {
  currentBehavior: FeedBehavior; // Maps to API's behavior_status
  averagePercentage: number; // PLACEHOLDER (not in API)
  behaviorScore: number; // Maps to API's behavior_score
  status: BehaviorStatus; // Can be derived from behavior_score
  trend: "improving" | "stable" | "declining"; // PLACEHOLDER (not in API)
  lastUpdated: string; // Can use most recent date from recent_feed_records
  totalRecords: number; // Can count recent_feed_records length
  eatingWellCount: number; // Maps to API's summary.eating_well
  pickingOnlyCount: number; // Maps to API's summary.picky
  notEatingCount: number; // Maps to API's summary.not_eating
}

// Helper function to convert API behavior_score to status
export const getBehaviorStatus = (score: number): BehaviorStatus => {
  if (score >= 90) return BEHAVIOR_STATUS.EXCELLENT;
  if (score >= 75) return BEHAVIOR_STATUS.GOOD;
  if (score >= 50) return BEHAVIOR_STATUS.WARNING;
  return BEHAVIOR_STATUS.CRITICAL;
};

// Helper function to convert API data to FeedIntakeRecord
export const mapApiFeedRecord = (
  apiRecord: FarmerData["feed_intake_behavior"]["recent_feed_records"][0],
  index: number,
  flockSize: number
): FeedIntakeRecord => ({
  id: `${apiRecord.date}-${index}`,
  date: apiRecord.date,
  behavior: apiRecord.feed_intake_status,
  percentage: 75, // PLACEHOLDER - could be derived from feed_intake_kg relative to expected
  notes: `Feed intake: ${apiRecord.feed_intake_kg}kg`, // PLACEHOLDER
  timeOfDay: "morning", // PLACEHOLDER
  flockSize,
  feedConsumed: apiRecord.feed_intake_kg,
});

// Helper function to convert API data to FeedIntakeSummary
export const mapApiFeedSummary = (
  apiData: FarmerData["feed_intake_behavior"],
  recentRecords: FeedIntakeRecord[]
): FeedIntakeSummary => ({
  currentBehavior: apiData.behavior_status,
  averagePercentage: 78, // PLACEHOLDER - could be calculated from feed intake vs expected
  behaviorScore: apiData.behavior_score,
  status: getBehaviorStatus(apiData.behavior_score),
  trend: "stable", // PLACEHOLDER - would need historical data to determine
  lastUpdated: recentRecords[0]?.date || new Date().toISOString().split("T")[0],
  totalRecords: recentRecords.length,
  eatingWellCount: apiData.summary.eating_well,
  pickingOnlyCount: apiData.summary.picky,
  notEatingCount: apiData.summary.not_eating,
});

// Mock data for development/testing
export const MOCK_FEED_RECORDS: FeedIntakeRecord[] = [
  {
    id: "1",
    date: "2024-01-15",
    behavior: FEED_BEHAVIOR.EATING_WELL,
    percentage: 95,
    notes: "Excellent feed consumption, all birds active",
    timeOfDay: "morning",
    flockSize: 1000,
    feedConsumed: 45,
  },
  {
    id: "2",
    date: "2024-01-15",
    behavior: FEED_BEHAVIOR.EATING_WELL,
    percentage: 92,
    notes: "Good afternoon feeding, normal behavior",
    timeOfDay: "afternoon",
    flockSize: 1000,
    feedConsumed: 42,
  },
  {
    id: "3",
    date: "2024-01-14",
    behavior: FEED_BEHAVIOR.PICKING_ONLY,
    percentage: 65,
    notes: "Some birds picking at feed, monitoring closely",
    timeOfDay: "morning",
    flockSize: 1000,
    feedConsumed: 30,
  },
  {
    id: "4",
    date: "2024-01-14",
    behavior: FEED_BEHAVIOR.EATING_WELL,
    percentage: 88,
    notes: "Recovered well in afternoon",
    timeOfDay: "afternoon",
    flockSize: 1000,
    feedConsumed: 40,
  },
  {
    id: "5",
    date: "2024-01-13",
    behavior: FEED_BEHAVIOR.NOT_EATING,
    percentage: 25,
    notes: "Concerning behavior, investigating cause",
    timeOfDay: "morning",
    flockSize: 1000,
    feedConsumed: 12,
  },
  {
    id: "6",
    date: "2024-01-13",
    behavior: FEED_BEHAVIOR.PICKING_ONLY,
    percentage: 55,
    notes: "Partial recovery, still monitoring",
    timeOfDay: "afternoon",
    flockSize: 1000,
    feedConsumed: 25,
  },
];

export const MOCK_FEED_SUMMARY: FeedIntakeSummary = {
  currentBehavior: FEED_BEHAVIOR.EATING_WELL,
  averagePercentage: 85,
  behaviorScore: 85,
  status: BEHAVIOR_STATUS.GOOD,
  trend: "improving",
  lastUpdated: "2024-01-15",
  totalRecords: 6,
  eatingWellCount: 3,
  pickingOnlyCount: 2,
  notEatingCount: 1,
};

// Example usage with real API data
export const useFeedIntakeData = async () => {
  try {
    const farmerData = await getFarmerData();
    const flockSize = farmerData.feed_calculation_log.number_of_animals;

    // Convert API records to your format
    const feedRecords: FeedIntakeRecord[] =
      farmerData.feed_intake_behavior.recent_feed_records.map((record, index) =>
        mapApiFeedRecord(record, index, flockSize)
      );

    // Convert API summary to your format
    const feedSummary: FeedIntakeSummary = mapApiFeedSummary(
      farmerData.feed_intake_behavior,
      feedRecords
    );

    return { feedRecords, feedSummary };
  } catch (error) {
    console.error("Failed to fetch feed intake data:", error);
    // Fallback to mock data
    return {
      feedRecords: MOCK_FEED_RECORDS,
      feedSummary: MOCK_FEED_SUMMARY,
    };
  }
};
