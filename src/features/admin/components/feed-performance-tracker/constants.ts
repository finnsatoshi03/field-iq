export interface FeedProduct {
  id: string;
  name: string;
  category: "starter" | "grower" | "finisher" | "layer" | "breeder";
  brand: string;
  formulationType: "standard" | "premium" | "organic" | "medicated";
  targetSpecies: "broiler" | "layer" | "swine" | "fish" | "cattle";
  launchDate: string;
  status: "active" | "trial" | "discontinued";
  regions: string[];
}

export interface PerformanceMetric {
  id: string;
  productId: string;
  productName: string;
  farmId: string;
  farmName: string;
  region: string;
  province: string;
  gpsCoordinates: {
    lat: number;
    lng: number;
  };
  recordDate: string;
  batchSize: number;
  daysOnFeed: number;
  fcr: number; // Feed Conversion Ratio
  weightGain: number; // kg
  mortality: number; // percentage
  avgWeight: number; // kg
  feedIntake: number; // kg per bird/animal
  weatherCondition: "hot" | "moderate" | "cold" | "rainy";
  managementScore: number; // 1-10
  reportedBy: string;
  verified: boolean;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  totalTrials: number;
  avgFcr: number;
  avgWeightGain: number;
  avgMortality: number;
  performanceScore: number;
  trend: "improving" | "stable" | "declining";
  benchmarkComparison: "above" | "at" | "below";
  regions: string[];
}

export interface RegionalPerformance {
  region: string;
  province: string;
  gpsCoordinates: {
    lat: number;
    lng: number;
  };
  totalFarms: number;
  avgFcr: number;
  avgWeightGain: number;
  avgMortality: number;
  topProduct: string;
  performanceRating: "excellent" | "good" | "average" | "poor";
  lastUpdate: string;
}

export interface PerformanceComparison {
  date: string;
  fcr: number;
  weightGain: number;
  mortality: number;
  feedIntake: number;
  managementScore: number;
}

export const FEED_CATEGORIES = {
  STARTER: "starter",
  GROWER: "grower",
  FINISHER: "finisher",
  LAYER: "layer",
  BREEDER: "breeder",
} as const;

export const FORMULATION_TYPES = {
  STANDARD: "standard",
  PREMIUM: "premium",
  ORGANIC: "organic",
  MEDICATED: "medicated",
} as const;

export const TARGET_SPECIES = {
  BROILER: "broiler",
  LAYER: "layer",
  SWINE: "swine",
  FISH: "fish",
  CATTLE: "cattle",
} as const;

export const PERFORMANCE_RATINGS = {
  EXCELLENT: "excellent",
  GOOD: "good",
  AVERAGE: "average",
  POOR: "poor",
} as const;

export const VIEW_MODES = {
  CHART: "chart",
  RADAR: "radar",
  MAP: "map",
} as const;

export const CHART_TYPES = {
  FCR: "fcr",
  WEIGHT_GAIN: "weightGain",
  MORTALITY: "mortality",
  COMBINED: "combined",
} as const;

// Mock Feed Products Data
export const MOCK_FEED_PRODUCTS: FeedProduct[] = [
  {
    id: "feed-001",
    name: "ProGrow Starter Plus",
    category: "starter",
    brand: "FieldIQ Feeds",
    formulationType: "premium",
    targetSpecies: "broiler",
    launchDate: "2023-06-15",
    status: "active",
    regions: ["Central Luzon", "CALABARZON", "Western Visayas"],
  },
  {
    id: "feed-002",
    name: "MaxGain Finisher Pro",
    category: "finisher",
    brand: "FieldIQ Feeds",
    formulationType: "standard",
    targetSpecies: "broiler",
    launchDate: "2023-08-20",
    status: "active",
    regions: ["NCR", "Central Visayas", "Northern Mindanao"],
  },
  {
    id: "feed-003",
    name: "LayerMax Premium",
    category: "layer",
    brand: "FieldIQ Feeds",
    formulationType: "premium",
    targetSpecies: "layer",
    launchDate: "2023-04-10",
    status: "active",
    regions: ["Bicol Region", "Eastern Visayas", "Davao Region"],
  },
  {
    id: "feed-004",
    name: "AquaGrow Supreme",
    category: "grower",
    brand: "FieldIQ Feeds",
    formulationType: "organic",
    targetSpecies: "fish",
    launchDate: "2023-09-05",
    status: "trial",
    regions: ["Ilocos Region", "Cagayan Valley"],
  },
  {
    id: "feed-005",
    name: "SwineMax Grower",
    category: "grower",
    brand: "FieldIQ Feeds",
    formulationType: "medicated",
    targetSpecies: "swine",
    launchDate: "2023-07-12",
    status: "active",
    regions: ["SOCCSKSARGEN", "Caraga", "Zamboanga Peninsula"],
  },
];

// Mock Performance Metrics Data
export const MOCK_PERFORMANCE_METRICS: PerformanceMetric[] = [
  {
    id: "metric-001",
    productId: "feed-001",
    productName: "ProGrow Starter Plus",
    farmId: "farm-001",
    farmName: "Santos Poultry Farm",
    region: "Central Luzon",
    province: "Nueva Ecija",
    gpsCoordinates: { lat: 15.5784, lng: 120.9726 },
    recordDate: "2024-01-20",
    batchSize: 5000,
    daysOnFeed: 35,
    fcr: 1.65,
    weightGain: 1.8,
    mortality: 3.2,
    avgWeight: 1.9,
    feedIntake: 3.2,
    weatherCondition: "moderate",
    managementScore: 8,
    reportedBy: "Dr. Maria Santos",
    verified: true,
  },
  {
    id: "metric-002",
    productId: "feed-002",
    productName: "MaxGain Finisher Pro",
    farmId: "farm-002",
    farmName: "Reyes Broiler Farm",
    region: "CALABARZON",
    province: "Laguna",
    gpsCoordinates: { lat: 14.2691, lng: 121.1611 },
    recordDate: "2024-01-18",
    batchSize: 3000,
    daysOnFeed: 42,
    fcr: 1.72,
    weightGain: 2.1,
    mortality: 2.8,
    avgWeight: 2.3,
    feedIntake: 4.1,
    weatherCondition: "hot",
    managementScore: 9,
    reportedBy: "Dr. Pedro Reyes",
    verified: true,
  },
  {
    id: "metric-003",
    productId: "feed-003",
    productName: "LayerMax Premium",
    farmId: "farm-003",
    farmName: "Villanueva Layer Farm",
    region: "Western Visayas",
    province: "Iloilo",
    gpsCoordinates: { lat: 10.7202, lng: 122.5621 },
    recordDate: "2024-01-22",
    batchSize: 8000,
    daysOnFeed: 150,
    fcr: 2.1,
    weightGain: 0.8,
    mortality: 1.5,
    avgWeight: 1.6,
    feedIntake: 110,
    weatherCondition: "moderate",
    managementScore: 7,
    reportedBy: "Dr. Ana Villanueva",
    verified: true,
  },
  {
    id: "metric-004",
    productId: "feed-004",
    productName: "AquaGrow Supreme",
    farmId: "farm-004",
    farmName: "Garcia Fish Farm",
    region: "Northern Mindanao",
    province: "Misamis Oriental",
    gpsCoordinates: { lat: 8.4542, lng: 124.6319 },
    recordDate: "2024-01-19",
    batchSize: 10000,
    daysOnFeed: 90,
    fcr: 1.45,
    weightGain: 0.35,
    mortality: 4.1,
    avgWeight: 0.4,
    feedIntake: 0.52,
    weatherCondition: "rainy",
    managementScore: 6,
    reportedBy: "Dr. Roberto Garcia",
    verified: false,
  },
  {
    id: "metric-005",
    productId: "feed-005",
    productName: "SwineMax Grower",
    farmId: "farm-005",
    farmName: "Fernandez Swine Farm",
    region: "Davao Region",
    province: "Davao del Sur",
    gpsCoordinates: { lat: 7.0731, lng: 125.6128 },
    recordDate: "2024-01-21",
    batchSize: 1200,
    daysOnFeed: 60,
    fcr: 2.8,
    weightGain: 25,
    mortality: 2.1,
    avgWeight: 45,
    feedIntake: 2.1,
    weatherCondition: "hot",
    managementScore: 8,
    reportedBy: "Dr. Miguel Fernandez",
    verified: true,
  },
];

// Mock Regional Performance Data
export const MOCK_REGIONAL_PERFORMANCE: RegionalPerformance[] = [
  {
    region: "Central Luzon",
    province: "Nueva Ecija",
    gpsCoordinates: { lat: 15.5784, lng: 120.9726 },
    totalFarms: 45,
    avgFcr: 1.68,
    avgWeightGain: 1.9,
    avgMortality: 3.1,
    topProduct: "ProGrow Starter Plus",
    performanceRating: "excellent",
    lastUpdate: "2024-01-22",
  },
  {
    region: "CALABARZON",
    province: "Laguna",
    gpsCoordinates: { lat: 14.2691, lng: 121.1611 },
    totalFarms: 38,
    avgFcr: 1.75,
    avgWeightGain: 2.0,
    avgMortality: 3.5,
    topProduct: "MaxGain Finisher Pro",
    performanceRating: "good",
    lastUpdate: "2024-01-21",
  },
  {
    region: "Western Visayas",
    province: "Iloilo",
    gpsCoordinates: { lat: 10.7202, lng: 122.5621 },
    totalFarms: 32,
    avgFcr: 2.05,
    avgWeightGain: 0.85,
    avgMortality: 2.1,
    topProduct: "LayerMax Premium",
    performanceRating: "good",
    lastUpdate: "2024-01-20",
  },
  {
    region: "Northern Mindanao",
    province: "Misamis Oriental",
    gpsCoordinates: { lat: 8.4542, lng: 124.6319 },
    totalFarms: 28,
    avgFcr: 1.52,
    avgWeightGain: 0.38,
    avgMortality: 4.8,
    topProduct: "AquaGrow Supreme",
    performanceRating: "average",
    lastUpdate: "2024-01-19",
  },
  {
    region: "Davao Region",
    province: "Davao del Sur",
    gpsCoordinates: { lat: 7.0731, lng: 125.6128 },
    totalFarms: 22,
    avgFcr: 2.9,
    avgWeightGain: 24,
    avgMortality: 2.8,
    topProduct: "SwineMax Grower",
    performanceRating: "good",
    lastUpdate: "2024-01-18",
  },
];

// Mock Time Series Data for Charts
export const MOCK_PERFORMANCE_TIMELINE: PerformanceComparison[] = [
  {
    date: "2024-01-01",
    fcr: 1.72,
    weightGain: 1.85,
    mortality: 3.8,
    feedIntake: 3.4,
    managementScore: 7.2,
  },
  {
    date: "2024-01-08",
    fcr: 1.68,
    weightGain: 1.92,
    mortality: 3.5,
    feedIntake: 3.3,
    managementScore: 7.5,
  },
  {
    date: "2024-01-15",
    fcr: 1.65,
    weightGain: 1.98,
    mortality: 3.2,
    feedIntake: 3.2,
    managementScore: 7.8,
  },
  {
    date: "2024-01-22",
    fcr: 1.63,
    weightGain: 2.05,
    mortality: 2.9,
    feedIntake: 3.1,
    managementScore: 8.1,
  },
];

export type FeedCategory =
  (typeof FEED_CATEGORIES)[keyof typeof FEED_CATEGORIES];
export type FormulationType =
  (typeof FORMULATION_TYPES)[keyof typeof FORMULATION_TYPES];
export type TargetSpecies =
  (typeof TARGET_SPECIES)[keyof typeof TARGET_SPECIES];
export type PerformanceRating =
  (typeof PERFORMANCE_RATINGS)[keyof typeof PERFORMANCE_RATINGS];
export type ViewMode = (typeof VIEW_MODES)[keyof typeof VIEW_MODES];
export type ChartType = (typeof CHART_TYPES)[keyof typeof CHART_TYPES];
