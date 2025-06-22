import { type FeedType, type FeedInfo, FEED_TYPES } from "./constants";

export const formatAgeRange = (start: number, end: number): string => {
  if (start === 0) {
    return `Day 1 - ${end} days`;
  }
  return `${start} - ${end} days`;
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
  return ageEnd - ageStart;
};

export const getFeedTypeDisplayName = (feedType: FeedType): string => {
  const displayNames = {
    [FEED_TYPES.STARTER]: "Starter Feed",
    [FEED_TYPES.GROWER]: "Grower Feed",
    [FEED_TYPES.FINISHER]: "Finisher Feed",
    [FEED_TYPES.LAYER]: "Layer Feed",
  };

  return displayNames[feedType] || feedType;
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
  currentFeedType: FeedType
): FeedType | null => {
  const feedProgression = {
    [FEED_TYPES.STARTER]: FEED_TYPES.GROWER,
    [FEED_TYPES.GROWER]: FEED_TYPES.FINISHER,
    [FEED_TYPES.FINISHER]: FEED_TYPES.LAYER,
    [FEED_TYPES.LAYER]: null, // No next feed for layer
  };

  return feedProgression[currentFeedType] || null;
};
