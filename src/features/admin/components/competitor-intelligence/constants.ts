export interface CompetitorBrand {
  id: string;
  name: string;
  category: "fertilizer" | "seeds" | "pesticide" | "equipment" | "technology";
  marketShare: number;
  mentions: number;
  sentiment: "positive" | "neutral" | "negative";
  switchingRisk: "low" | "medium" | "high";
  pricePoint: "budget" | "mid-range" | "premium";
  regions: string[];
  lastActivity: string;
  logoUrl?: string;
}

export interface CompetitorPromo {
  id: string;
  brandId: string;
  brandName: string;
  title: string;
  description: string;
  type: "discount" | "bundle" | "cashback" | "loyalty" | "seasonal";
  value: number;
  startDate: string;
  endDate: string;
  regions: string[];
  reportedBy: string;
  impact: "low" | "medium" | "high";
  status: "active" | "expired" | "upcoming";
}

export interface SwitchingRisk {
  farmerId: string;
  farmerName: string;
  currentBrand: string;
  competitorBrand: string;
  riskLevel: "low" | "medium" | "high";
  reasons: string[];
  reportDate: string;
  region: string;
  salesRep: string;
  estimatedRevenueLoss: number;
  actionRequired: boolean;
}

export interface CompetitorMetrics {
  totalBrands: number;
  activePromos: number;
  highRiskSwitchers: number;
  marketShareLoss: number;
  averageSentiment: number;
  topThreat: string;
  emergingCompetitors: number;
  priceAdvantage: number;
}

export interface BrandMention {
  brandName: string;
  mentions: number;
  sentiment: "positive" | "neutral" | "negative";
  category: string;
  trend: "up" | "down" | "stable";
}

export const COMPETITOR_CATEGORIES = {
  FERTILIZER: "fertilizer",
  SEEDS: "seeds",
  PESTICIDE: "pesticide",
  EQUIPMENT: "equipment",
  TECHNOLOGY: "technology",
} as const;

export const PROMO_TYPES = {
  DISCOUNT: "discount",
  BUNDLE: "bundle",
  CASHBACK: "cashback",
  LOYALTY: "loyalty",
  SEASONAL: "seasonal",
} as const;

export const RISK_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export const SENTIMENT_TYPES = {
  POSITIVE: "positive",
  NEUTRAL: "neutral",
  NEGATIVE: "negative",
} as const;

export const VIEW_MODES = {
  CHART: "chart",
  BRANDS: "brands",
  RISKS: "risks",
} as const;

// Mock Competitor Brands Data
export const MOCK_COMPETITOR_BRANDS: CompetitorBrand[] = [
  {
    id: "brand-001",
    name: "AgroMax",
    category: "fertilizer",
    marketShare: 23.5,
    mentions: 156,
    sentiment: "positive",
    switchingRisk: "medium",
    pricePoint: "mid-range",
    regions: ["Central Luzon", "CALABARZON"],
    lastActivity: "2024-01-20",
  },
  {
    id: "brand-002",
    name: "FarmTech Pro",
    category: "technology",
    marketShare: 18.2,
    mentions: 89,
    sentiment: "positive",
    switchingRisk: "high",
    pricePoint: "premium",
    regions: ["NCR", "Central Visayas"],
    lastActivity: "2024-01-18",
  },
  {
    id: "brand-003",
    name: "GreenGrow",
    category: "seeds",
    marketShare: 15.8,
    mentions: 134,
    sentiment: "neutral",
    switchingRisk: "low",
    pricePoint: "budget",
    regions: ["Western Visayas", "Northern Mindanao"],
    lastActivity: "2024-01-22",
  },
  {
    id: "brand-004",
    name: "CropShield",
    category: "pesticide",
    marketShare: 12.4,
    mentions: 78,
    sentiment: "negative",
    switchingRisk: "low",
    pricePoint: "mid-range",
    regions: ["Davao Region", "SOCCSKSARGEN"],
    lastActivity: "2024-01-15",
  },
  {
    id: "brand-005",
    name: "HarvestPlus",
    category: "fertilizer",
    marketShare: 11.2,
    mentions: 92,
    sentiment: "positive",
    switchingRisk: "medium",
    pricePoint: "premium",
    regions: ["Bicol Region", "Eastern Visayas"],
    lastActivity: "2024-01-19",
  },
  {
    id: "brand-006",
    name: "AgriBoost",
    category: "equipment",
    marketShare: 8.9,
    mentions: 45,
    sentiment: "neutral",
    switchingRisk: "low",
    pricePoint: "budget",
    regions: ["Ilocos Region", "Cagayan Valley"],
    lastActivity: "2024-01-21",
  },
];

// Mock Competitor Promos Data
export const MOCK_COMPETITOR_PROMOS: CompetitorPromo[] = [
  {
    id: "promo-001",
    brandId: "brand-001",
    brandName: "AgroMax",
    title: "Early Bird Fertilizer Sale",
    description: "20% off all organic fertilizers for early season planting",
    type: "discount",
    value: 20,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    regions: ["Central Luzon", "CALABARZON"],
    reportedBy: "Maria Santos",
    impact: "high",
    status: "active",
  },
  {
    id: "promo-002",
    brandId: "brand-002",
    brandName: "FarmTech Pro",
    title: "Smart Farming Bundle",
    description: "IoT sensors + mobile app + 6 months support",
    type: "bundle",
    value: 15000,
    startDate: "2024-01-10",
    endDate: "2024-03-31",
    regions: ["NCR", "Central Visayas"],
    reportedBy: "Pedro Reyes",
    impact: "high",
    status: "active",
  },
  {
    id: "promo-003",
    brandId: "brand-003",
    brandName: "GreenGrow",
    title: "Loyalty Rewards Program",
    description: "Earn points for every purchase, redeem for free seeds",
    type: "loyalty",
    value: 0,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    regions: ["Western Visayas", "Northern Mindanao"],
    reportedBy: "Ana Rodriguez",
    impact: "medium",
    status: "active",
  },
  {
    id: "promo-004",
    brandId: "brand-005",
    brandName: "HarvestPlus",
    title: "Cashback Campaign",
    description: "Get 10% cashback on purchases above ₱5,000",
    type: "cashback",
    value: 10,
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    regions: ["Bicol Region", "Eastern Visayas"],
    reportedBy: "Juan Dela Cruz",
    impact: "medium",
    status: "upcoming",
  },
];

// Mock Switching Risks Data
export const MOCK_SWITCHING_RISKS: SwitchingRisk[] = [
  {
    farmerId: "farmer-001",
    farmerName: "Roberto Garcia",
    currentBrand: "Our Brand",
    competitorBrand: "FarmTech Pro",
    riskLevel: "high",
    reasons: ["Better technology", "Lower pricing", "Superior support"],
    reportDate: "2024-01-20",
    region: "Central Luzon",
    salesRep: "Maria Santos",
    estimatedRevenueLoss: 45000,
    actionRequired: true,
  },
  {
    farmerId: "farmer-002",
    farmerName: "Elena Villanueva",
    currentBrand: "Our Brand",
    competitorBrand: "AgroMax",
    riskLevel: "medium",
    reasons: ["Promotional pricing", "Product availability"],
    reportDate: "2024-01-18",
    region: "CALABARZON",
    salesRep: "Juan Dela Cruz",
    estimatedRevenueLoss: 28000,
    actionRequired: true,
  },
  {
    farmerId: "farmer-003",
    farmerName: "Miguel Fernandez",
    currentBrand: "Our Brand",
    competitorBrand: "GreenGrow",
    riskLevel: "low",
    reasons: ["Curious about alternatives"],
    reportDate: "2024-01-22",
    region: "Davao Region",
    salesRep: "Ana Rodriguez",
    estimatedRevenueLoss: 15000,
    actionRequired: false,
  },
];

// Mock Brand Mentions for Tag Cloud
export const MOCK_BRAND_MENTIONS: BrandMention[] = [
  {
    brandName: "AgroMax",
    mentions: 156,
    sentiment: "positive",
    category: "fertilizer",
    trend: "up",
  },
  {
    brandName: "FarmTech Pro",
    mentions: 89,
    sentiment: "positive",
    category: "technology",
    trend: "up",
  },
  {
    brandName: "GreenGrow",
    mentions: 134,
    sentiment: "neutral",
    category: "seeds",
    trend: "stable",
  },
  {
    brandName: "CropShield",
    mentions: 78,
    sentiment: "negative",
    category: "pesticide",
    trend: "down",
  },
  {
    brandName: "HarvestPlus",
    mentions: 92,
    sentiment: "positive",
    category: "fertilizer",
    trend: "up",
  },
  {
    brandName: "AgriBoost",
    mentions: 45,
    sentiment: "neutral",
    category: "equipment",
    trend: "stable",
  },
  {
    brandName: "SeedMaster",
    mentions: 67,
    sentiment: "positive",
    category: "seeds",
    trend: "up",
  },
  {
    brandName: "PlantGuard",
    mentions: 34,
    sentiment: "negative",
    category: "pesticide",
    trend: "down",
  },
  {
    brandName: "FarmEasy",
    mentions: 56,
    sentiment: "neutral",
    category: "technology",
    trend: "stable",
  },
  {
    brandName: "NutriGrow",
    mentions: 23,
    sentiment: "positive",
    category: "fertilizer",
    trend: "up",
  },
];

export type CompetitorCategory =
  (typeof COMPETITOR_CATEGORIES)[keyof typeof COMPETITOR_CATEGORIES];
export type PromoType = (typeof PROMO_TYPES)[keyof typeof PROMO_TYPES];
export type RiskLevel = (typeof RISK_LEVELS)[keyof typeof RISK_LEVELS];
export type SentimentType =
  (typeof SENTIMENT_TYPES)[keyof typeof SENTIMENT_TYPES];
export type ViewMode = (typeof VIEW_MODES)[keyof typeof VIEW_MODES];
