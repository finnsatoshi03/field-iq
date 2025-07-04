// Feed types from your data
export const FEED_TYPES = {
  PRE_STARTER: "pre_starter",
  STARTER: "starter",
  GROWER: "grower",
  FINISHER: "finisher",
  LAYER: "layer",
} as const;

export type FeedType = (typeof FEED_TYPES)[keyof typeof FEED_TYPES];

// Updated to include your feed stages
export const FEED_TYPE_COLORS = {
  pre_starter: "bg-purple-100 text-purple-800 border-purple-300",
  starter: "bg-blue-100 text-blue-800 border-blue-300",
  grower: "bg-green-100 text-green-800 border-green-300",
  finisher: "bg-orange-100 text-orange-800 border-orange-300",
  layer: "bg-yellow-100 text-yellow-800 border-yellow-300",
} as const;

export interface NutritionInfo {
  protein: number;
  energy: number;
  fiber: number;
  fat: number;
  ash: number;
  calcium: number;
  phosphorus: number;
}

export interface FeedInfo {
  id: string;
  name: string;
  type: string; // Changed from FeedType to string to handle dynamic values
  description: string;
  ageRangeStart: number;
  ageRangeEnd: number;
  lastUpdated: string;
  nutritionInfo: NutritionInfo;
  feedingGuidelines: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  storageInstructions: string;
  isActive: boolean;
  isRecommended: boolean;
}

// Mock data for fallback (you can remove this once fully integrated)
export const MOCK_CURRENT_FEED: FeedInfo = {
  id: "1",
  name: "Broiler Pre-Starter Crumble",
  type: FEED_TYPES.PRE_STARTER,
  description: "Jumpstart early growth (Day 1–7)",
  ageRangeStart: 1,
  ageRangeEnd: 7,
  lastUpdated: "2025-06-30T12:00:00",
  nutritionInfo: {
    protein: 22,
    energy: 3000,
    fiber: 3.5,
    fat: 6.5,
    ash: 7.0,
    calcium: 1.0,
    phosphorus: 0.45,
  },
  feedingGuidelines:
    "Feed ad libitum (free choice) during pre-starter stage. Ensure fresh water is always available. Monitor feed consumption and adjust as needed. Transition to starter at 7 days.",
  manufacturer: "Premium Feeds Co.",
  batchNumber: "PF-2025-001",
  expiryDate: "2025-12-31",
  storageInstructions:
    "Store in cool, dry place. Keep away from direct sunlight.",
  isActive: true,
  isRecommended: true,
};
