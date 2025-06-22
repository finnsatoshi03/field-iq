export interface SalesData {
  id: string;
  region: string;
  rep: string;
  influencedVolume: number;
  closedSales: number;
  growthRate: number;
  period: string;
}

export interface SalesMetrics {
  totalInfluencedVolume: number;
  totalClosedSales: number;
  averageGrowthRate: number;
  topPerformingRegion: string;
  topPerformingRep: string;
}

export interface ChartDataPoint {
  name: string;
  influencedVolume: number;
  closedSales: number;
  type: "region" | "rep";
}

export const CHART_COLORS = {
  influenced: "#3b82f6", // blue-500
  closed: "#10b981", // emerald-500
} as const;

export const MOCK_SALES_DATA: SalesData[] = [
  {
    id: "1",
    region: "North Region",
    rep: "John Smith",
    influencedVolume: 1250000,
    closedSales: 875000,
    growthRate: 15.5,
    period: "2024-Q4",
  },
  {
    id: "2",
    region: "North Region",
    rep: "Sarah Johnson",
    influencedVolume: 980000,
    closedSales: 720000,
    growthRate: 12.3,
    period: "2024-Q4",
  },
  {
    id: "3",
    region: "South Region",
    rep: "Mike Davis",
    influencedVolume: 1100000,
    closedSales: 850000,
    growthRate: 18.2,
    period: "2024-Q4",
  },
  {
    id: "4",
    region: "South Region",
    rep: "Emily Wilson",
    influencedVolume: 1350000,
    closedSales: 950000,
    growthRate: 22.1,
    period: "2024-Q4",
  },
  {
    id: "5",
    region: "East Region",
    rep: "David Brown",
    influencedVolume: 900000,
    closedSales: 650000,
    growthRate: 8.7,
    period: "2024-Q4",
  },
  {
    id: "6",
    region: "East Region",
    rep: "Lisa Martinez",
    influencedVolume: 1200000,
    closedSales: 800000,
    growthRate: 16.4,
    period: "2024-Q4",
  },
  {
    id: "7",
    region: "West Region",
    rep: "James Taylor",
    influencedVolume: 1150000,
    closedSales: 780000,
    growthRate: 14.8,
    period: "2024-Q4",
  },
  {
    id: "8",
    region: "West Region",
    rep: "Amanda White",
    influencedVolume: 1050000,
    closedSales: 750000,
    growthRate: 11.9,
    period: "2024-Q4",
  },
];

export const VIEW_MODES = {
  REGION: "region",
  REP: "rep",
} as const;

export type ViewMode = (typeof VIEW_MODES)[keyof typeof VIEW_MODES];
