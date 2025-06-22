export const FEED_BEHAVIOR = {
  EATING_WELL: "eating_well",
  PICKING_ONLY: "picking_only",
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
  percentage: number; // 0-100 scale
  notes?: string;
  timeOfDay: "morning" | "afternoon" | "evening";
  flockSize: number;
  feedConsumed: number; // in kg
}

export interface FeedIntakeSummary {
  currentBehavior: FeedBehavior;
  averagePercentage: number;
  behaviorScore: number; // 0-100
  status: BehaviorStatus;
  trend: "improving" | "stable" | "declining";
  lastUpdated: string;
  totalRecords: number;
  eatingWellCount: number;
  pickingOnlyCount: number;
  notEatingCount: number;
}

// Mock data
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
