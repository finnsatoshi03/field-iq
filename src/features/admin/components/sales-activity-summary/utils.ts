import type {
  SalesData,
  SalesMetrics,
  ChartDataPoint,
  ViewMode,
} from "./constants";
import { VIEW_MODES } from "./constants";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};

export const calculateSalesMetrics = (salesData: SalesData[]): SalesMetrics => {
  const totalInfluencedVolume = salesData.reduce(
    (sum, data) => sum + data.influencedVolume,
    0
  );
  const totalClosedSales = salesData.reduce(
    (sum, data) => sum + data.closedSales,
    0
  );
  const averageGrowthRate =
    salesData.reduce((sum, data) => sum + data.growthRate, 0) /
    salesData.length;

  // Group by region to find top performing region
  const regionTotals = salesData.reduce(
    (acc, data) => {
      if (!acc[data.region]) {
        acc[data.region] = { influenced: 0, closed: 0 };
      }
      acc[data.region].influenced += data.influencedVolume;
      acc[data.region].closed += data.closedSales;
      return acc;
    },
    {} as Record<string, { influenced: number; closed: number }>
  );

  const topPerformingRegion =
    Object.entries(regionTotals).sort(
      ([, a], [, b]) => b.closed - a.closed
    )[0]?.[0] || "";

  // Find top performing rep
  const topPerformingRep =
    salesData.sort((a, b) => b.closedSales - a.closedSales)[0]?.rep || "";

  return {
    totalInfluencedVolume,
    totalClosedSales,
    averageGrowthRate,
    topPerformingRegion,
    topPerformingRep,
  };
};

export const groupDataByRegion = (salesData: SalesData[]): ChartDataPoint[] => {
  const grouped = salesData.reduce(
    (acc, data) => {
      if (!acc[data.region]) {
        acc[data.region] = { influenced: 0, closed: 0 };
      }
      acc[data.region].influenced += data.influencedVolume;
      acc[data.region].closed += data.closedSales;
      return acc;
    },
    {} as Record<string, { influenced: number; closed: number }>
  );

  return Object.entries(grouped).map(([region, totals]) => ({
    name: region,
    influencedVolume: totals.influenced,
    closedSales: totals.closed,
    type: "region" as const,
  }));
};

export const groupDataByRep = (salesData: SalesData[]): ChartDataPoint[] => {
  return salesData.map((data) => ({
    name: data.rep,
    influencedVolume: data.influencedVolume,
    closedSales: data.closedSales,
    type: "rep" as const,
  }));
};

export const getChartData = (
  salesData: SalesData[],
  viewMode: ViewMode
): ChartDataPoint[] => {
  return viewMode === VIEW_MODES.REGION
    ? groupDataByRegion(salesData)
    : groupDataByRep(salesData);
};

export const getConversionRate = (
  influencedVolume: number,
  closedSales: number
): number => {
  return influencedVolume > 0 ? (closedSales / influencedVolume) * 100 : 0;
};

export const sortChartData = (
  data: ChartDataPoint[],
  sortBy: "influenced" | "closed" = "closed"
): ChartDataPoint[] => {
  return [...data].sort((a, b) => {
    return sortBy === "influenced"
      ? b.influencedVolume - a.influencedVolume
      : b.closedSales - a.closedSales;
  });
};
