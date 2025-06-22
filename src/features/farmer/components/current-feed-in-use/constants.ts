export const FEED_TYPES = {
  STARTER: "starter",
  GROWER: "grower",
  FINISHER: "finisher",
  LAYER: "layer",
} as const;

export type FeedType = (typeof FEED_TYPES)[keyof typeof FEED_TYPES];

export interface FeedInfo {
  id: string;
  name: string;
  type: FeedType;
  ageRangeStart: number;
  ageRangeEnd: number;
  description: string;
  nutritionInfo: {
    protein: number;
    energy: number;
    fiber: number;
  };
  feedingGuidelines: string;
  lastUpdated: string;
}

// Mock data for current feed in use
export const MOCK_CURRENT_FEED: FeedInfo = {
  id: "vr-starter-001",
  name: "Vitarich Starter Premium",
  type: FEED_TYPES.STARTER,
  ageRangeStart: 0,
  ageRangeEnd: 21,
  description:
    "High-quality starter feed for optimal chick growth and development",
  nutritionInfo: {
    protein: 22,
    energy: 2900,
    fiber: 4,
  },
  feedingGuidelines:
    "Feed ad libitum from day 1 to day 21. Ensure fresh water is always available.",
  lastUpdated: "2024-01-15",
};

export const FEED_TYPE_COLORS = {
  [FEED_TYPES.STARTER]: "bg-green-100 text-green-800 border-green-200",
  [FEED_TYPES.GROWER]: "bg-blue-100 text-blue-800 border-blue-200",
  [FEED_TYPES.FINISHER]: "bg-orange-100 text-orange-800 border-orange-200",
  [FEED_TYPES.LAYER]: "bg-purple-100 text-purple-800 border-purple-200",
} as const;

export const FEED_TYPE_ICONS = {
  [FEED_TYPES.STARTER]: "🐣",
  [FEED_TYPES.GROWER]: "🐤",
  [FEED_TYPES.FINISHER]: "🐔",
  [FEED_TYPES.LAYER]: "🥚",
} as const;
