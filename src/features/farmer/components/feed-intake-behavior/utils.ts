import {
  type FeedIntakeRecord,
  type FeedIntakeSummary,
  type FeedBehavior,
  type BehaviorStatus,
  FEED_BEHAVIOR,
  BEHAVIOR_STATUS,
} from "./constants";

export const calculateBehaviorScore = (records: FeedIntakeRecord[]): number => {
  if (records.length === 0) return 100;

  const totalPercentage = records.reduce(
    (sum, record) => sum + record.percentage,
    0
  );
  const averagePercentage = totalPercentage / records.length;

  // Convert percentage to a 0-100 behavior score
  return Math.round(averagePercentage);
};

export const calculateFeedIntakeSummary = (
  records: FeedIntakeRecord[]
): FeedIntakeSummary => {
  const behaviorScore = calculateBehaviorScore(records);
  const averagePercentage =
    records.length > 0
      ? records.reduce((sum, record) => sum + record.percentage, 0) /
        records.length
      : 0;

  const eatingWellCount = records.filter(
    (r) => r.behavior === FEED_BEHAVIOR.EATING_WELL
  ).length;
  const pickingOnlyCount = records.filter(
    (r) => r.behavior === FEED_BEHAVIOR.PICKING_ONLY
  ).length;
  const notEatingCount = records.filter(
    (r) => r.behavior === FEED_BEHAVIOR.NOT_EATING
  ).length;

  // Determine current behavior based on most recent record
  const currentBehavior =
    records.length > 0 ? records[0].behavior : FEED_BEHAVIOR.EATING_WELL;

  // Determine status based on behavior score
  const status = getBehaviorStatus(behaviorScore);

  // Determine trend based on recent vs older records
  const recentRecords = records.slice(0, 3);
  const olderRecords = records.slice(3, 6);

  const recentScore = calculateBehaviorScore(recentRecords);
  const olderScore = calculateBehaviorScore(olderRecords);

  let trend: "improving" | "stable" | "declining" = "stable";
  if (recentScore > olderScore) {
    trend = "improving";
  } else if (recentScore < olderScore) {
    trend = "declining";
  }

  return {
    currentBehavior,
    averagePercentage: Math.round(averagePercentage),
    behaviorScore,
    status,
    trend,
    lastUpdated: new Date().toISOString().split("T")[0],
    totalRecords: records.length,
    eatingWellCount,
    pickingOnlyCount,
    notEatingCount,
  };
};

export const getBehaviorStatus = (score: number): BehaviorStatus => {
  if (score >= 90) return BEHAVIOR_STATUS.EXCELLENT;
  if (score >= 75) return BEHAVIOR_STATUS.GOOD;
  if (score >= 50) return BEHAVIOR_STATUS.WARNING;
  return BEHAVIOR_STATUS.CRITICAL;
};

export const getBehaviorStatusColor = (status: BehaviorStatus): string => {
  switch (status) {
    case BEHAVIOR_STATUS.EXCELLENT:
      return "border-green-200 bg-green-50/50";
    case BEHAVIOR_STATUS.GOOD:
      return "border-blue-200 bg-blue-50/50";
    case BEHAVIOR_STATUS.WARNING:
      return "border-yellow-200 bg-yellow-50/50";
    case BEHAVIOR_STATUS.CRITICAL:
      return "border-red-200 bg-red-50/50";
    default:
      return "border-gray-200 bg-gray-50/50";
  }
};

export const getBehaviorColor = (behavior: FeedBehavior): string => {
  switch (behavior) {
    case FEED_BEHAVIOR.EATING_WELL:
      return "text-green-600 bg-green-100";
    case FEED_BEHAVIOR.PICKING_ONLY:
      return "text-yellow-600 bg-yellow-100";
    case FEED_BEHAVIOR.NOT_EATING:
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getBehaviorIcon = (behavior: FeedBehavior): string => {
  switch (behavior) {
    case FEED_BEHAVIOR.EATING_WELL:
      return "🍽️";
    case FEED_BEHAVIOR.PICKING_ONLY:
      return "🥄";
    case FEED_BEHAVIOR.NOT_EATING:
      return "🚫";
    default:
      return "🍽️";
  }
};

export const getSmileyIcon = (score: number): string => {
  if (score >= 90) return "😊";
  if (score >= 75) return "🙂";
  if (score >= 50) return "😐";
  return "😟";
};

export const getBehaviorLabel = (behavior: FeedBehavior): string => {
  switch (behavior) {
    case FEED_BEHAVIOR.EATING_WELL:
      return "Eating Well";
    case FEED_BEHAVIOR.PICKING_ONLY:
      return "Picking Only";
    case FEED_BEHAVIOR.NOT_EATING:
      return "Not Eating";
    default:
      return "Unknown";
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const formatTimeOfDay = (timeOfDay: string): string => {
  return timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1);
};

export const filterRecordsByBehavior = (
  records: FeedIntakeRecord[],
  behavior: FeedBehavior
): FeedIntakeRecord[] => {
  return records.filter((record) => record.behavior === behavior);
};

export const groupRecordsByDate = (
  records: FeedIntakeRecord[]
): Record<string, FeedIntakeRecord[]> => {
  return records.reduce(
    (groups, record) => {
      const date = record.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
      return groups;
    },
    {} as Record<string, FeedIntakeRecord[]>
  );
};
