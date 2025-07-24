export const VIEW_MODES = {
  LIST: "list",
  CATEGORIES: "categories",
  STATS: "stats",
} as const;

export type ViewMode = (typeof VIEW_MODES)[keyof typeof VIEW_MODES];

// Updated FAQ categories to match API response
export const FAQ_CATEGORIES = [
  "farm_visit",
  "product_issue",
  "general_inquiry",
  "nutrition",
  "health",
  "management",
  "pricing",
  "support",
  "technical",
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export const FAQ_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DRAFT: "draft",
} as const;

export type FaqStatus = (typeof FAQ_STATUS)[keyof typeof FAQ_STATUS];

// Updated interface to match API response
export interface FaqItem {
  id: number; // Changed from string to number
  question: string;
  answer: string;
  category: string; // Keep as string since API can have various categories
  status: string; // Keep as string since API can have various statuses
  priority: number;
  views: number;
  lastUpdated: string;
  createdBy: string;
  tags: string[];
  is_featured?: boolean; // Added field from API
}

// Remove mock data - will be replaced with API data
export const MOCK_FAQ_DATA: FaqItem[] = [];

export const PRIORITY_LEVELS = [
  { value: 1, label: "High Priority" },
  { value: 2, label: "Medium Priority" },
  { value: 3, label: "Low Priority" },
  { value: 4, label: "Normal Priority" },
] as const;

export const STATUS_COLORS = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  draft: "bg-yellow-100 text-yellow-800",
} as const;

// Updated category colors to match API categories
export const CATEGORY_COLORS = {
  farm_visit: "bg-blue-100 text-blue-800",
  product_issue: "bg-red-100 text-red-800",
  general_inquiry: "bg-purple-100 text-purple-800",
  nutrition: "bg-green-100 text-green-800",
  health: "bg-red-100 text-red-800",
  management: "bg-orange-100 text-orange-800",
  pricing: "bg-yellow-100 text-yellow-800",
  support: "bg-indigo-100 text-indigo-800",
  technical: "bg-pink-100 text-pink-800",
} as const;
