import { type FeedInfo, FEED_TYPES } from "./constants";

export const formatAgeRange = (start: number, end: number): string => {
  if (start === 0 || start === 1) {
    return `Day 1 - ${end} days`;
  }
  return `Day ${start} - ${end} days`;
};

export const formatLastUpdated = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatNutritionValue = (value: number, unit: string): string => {
  return `${value}${unit}`;
};

export const calculateFeedDuration = (
  ageStart: number,
  ageEnd: number
): number => {
  return ageEnd - ageStart + 1; // +1 to include both start and end days
};

export const getFeedTypeDisplayName = (feedType: string): string => {
  const displayNames: Record<string, string> = {
    pre_starter: "Pre-Starter Feed",
    starter: "Starter Feed",
    grower: "Grower Feed",
    finisher: "Finisher Feed",
    layer: "Layer Feed",
  };

  return (
    displayNames[feedType] ||
    feedType.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

export const validateFeedInfo = (feedInfo: FeedInfo): boolean => {
  if (!feedInfo.id || !feedInfo.name || !feedInfo.type) {
    return false;
  }

  if (
    feedInfo.ageRangeStart < 0 ||
    feedInfo.ageRangeEnd <= feedInfo.ageRangeStart
  ) {
    return false;
  }

  if (
    !feedInfo.nutritionInfo ||
    feedInfo.nutritionInfo.protein <= 0 ||
    feedInfo.nutritionInfo.energy <= 0 ||
    feedInfo.nutritionInfo.fiber < 0
  ) {
    return false;
  }

  return true;
};

export const isCurrentlyActive = (
  feedInfo: FeedInfo,
  currentAge?: number
): boolean => {
  if (!currentAge) return true; // Assume active if no current age provided

  return (
    currentAge >= feedInfo.ageRangeStart && currentAge <= feedInfo.ageRangeEnd
  );
};

export const getRecommendedNextFeed = (
  currentFeedType: string
): string | null => {
  const feedProgression: Record<string, string | null> = {
    pre_starter: FEED_TYPES.STARTER,
    starter: FEED_TYPES.GROWER,
    grower: FEED_TYPES.FINISHER,
    finisher: FEED_TYPES.LAYER,
    layer: null, // No next feed for layer
  };

  return feedProgression[currentFeedType] || null;
};

// New utility functions for the real data
export const calculateDaysIntoFeed = (startDate: string): number => {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getFeedStageRecommendation = (
  currentStage: string,
  daysIntoFeed: number,
  ageRangeEnd: number
): string => {
  const daysRemaining = ageRangeEnd - daysIntoFeed;

  if (daysRemaining <= 0) {
    const nextStage = getRecommendedNextFeed(currentStage);
    return nextStage
      ? `Time to transition to ${getFeedTypeDisplayName(nextStage)}`
      : "Current stage complete";
  }

  if (daysRemaining <= 2) {
    return "Feed transition approaching";
  }

  return "Continue with current feed";
};

export const formatFeedIntakeStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    eating_well: "Eating Well",
    picky: "Picky Eater",
    not_eating: "Not Eating",
  };

  return (
    statusMap[status] ||
    status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};
