import type {
  FeedProduct,
  PerformanceMetric,
  RegionalPerformance,
  ProductPerformance,
  FeedCategory,
  FormulationType,
  TargetSpecies,
  PerformanceRating,
} from "./constants";

export interface FilterOptions {
  product: string | "all";
  category: FeedCategory | "all";
  species: TargetSpecies | "all";
  formulation: FormulationType | "all";
  region: string | "all";
  province: string | "all";
  performanceRating: PerformanceRating | "all";
  verified: boolean | "all";
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export const getDefaultFilters = (): FilterOptions => ({
  product: "all",
  category: "all",
  species: "all",
  formulation: "all",
  region: "all",
  province: "all",
  performanceRating: "all",
  verified: "all",
  dateRange: {
    start: null,
    end: null,
  },
});

export const filterPerformanceMetrics = (
  metrics: PerformanceMetric[],
  filters: FilterOptions
): PerformanceMetric[] => {
  return metrics.filter((metric) => {
    if (filters.product !== "all" && metric.productId !== filters.product) {
      return false;
    }
    if (filters.region !== "all" && metric.region !== filters.region) {
      return false;
    }
    if (filters.province !== "all" && metric.province !== filters.province) {
      return false;
    }
    if (filters.verified !== "all" && metric.verified !== filters.verified) {
      return false;
    }
    if (filters.dateRange.start && filters.dateRange.end) {
      const recordDate = new Date(metric.recordDate);
      if (
        recordDate < filters.dateRange.start ||
        recordDate > filters.dateRange.end
      ) {
        return false;
      }
    }
    return true;
  });
};

export const filterFeedProducts = (
  products: FeedProduct[],
  filters: FilterOptions
): FeedProduct[] => {
  return products.filter((product) => {
    if (filters.category !== "all" && product.category !== filters.category) {
      return false;
    }
    if (
      filters.species !== "all" &&
      product.targetSpecies !== filters.species
    ) {
      return false;
    }
    if (
      filters.formulation !== "all" &&
      product.formulationType !== filters.formulation
    ) {
      return false;
    }
    if (filters.region !== "all" && !product.regions.includes(filters.region)) {
      return false;
    }
    return true;
  });
};

export const filterRegionalPerformance = (
  regional: RegionalPerformance[],
  filters: FilterOptions
): RegionalPerformance[] => {
  return regional.filter((region) => {
    if (filters.region !== "all" && region.region !== filters.region) {
      return false;
    }
    if (filters.province !== "all" && region.province !== filters.province) {
      return false;
    }
    if (
      filters.performanceRating !== "all" &&
      region.performanceRating !== filters.performanceRating
    ) {
      return false;
    }
    return true;
  });
};

export const calculatePerformanceMetrics = (metrics: PerformanceMetric[]) => {
  if (metrics.length === 0) {
    return {
      totalTrials: 0,
      avgFcr: 0,
      avgWeightGain: 0,
      avgMortality: 0,
      totalFarms: 0,
      verifiedTrials: 0,
      performanceScore: 0,
    };
  }

  const totalTrials = metrics.length;
  const avgFcr = metrics.reduce((sum, m) => sum + m.fcr, 0) / totalTrials;
  const avgWeightGain =
    metrics.reduce((sum, m) => sum + m.weightGain, 0) / totalTrials;
  const avgMortality =
    metrics.reduce((sum, m) => sum + m.mortality, 0) / totalTrials;
  const totalFarms = new Set(metrics.map((m) => m.farmId)).size;
  const verifiedTrials = metrics.filter((m) => m.verified).length;

  // Calculate performance score (lower FCR and mortality = better, higher weight gain = better)
  const fcrScore = Math.max(0, 100 - (avgFcr - 1) * 50); // Ideal FCR around 1.0-1.5
  const weightGainScore = Math.min(100, avgWeightGain * 25); // Scale weight gain
  const mortalityScore = Math.max(0, 100 - avgMortality * 10); // Lower mortality is better
  const performanceScore = (fcrScore + weightGainScore + mortalityScore) / 3;

  return {
    totalTrials,
    avgFcr: Number(avgFcr.toFixed(2)),
    avgWeightGain: Number(avgWeightGain.toFixed(2)),
    avgMortality: Number(avgMortality.toFixed(1)),
    totalFarms,
    verifiedTrials,
    performanceScore: Number(performanceScore.toFixed(1)),
  };
};

export const calculateProductPerformance = (
  products: FeedProduct[],
  metrics: PerformanceMetric[]
): ProductPerformance[] => {
  return products.map((product) => {
    const productMetrics = metrics.filter((m) => m.productId === product.id);
    const performance = calculatePerformanceMetrics(productMetrics);

    // Determine trend based on recent vs older data
    const sortedMetrics = productMetrics.sort(
      (a, b) =>
        new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
    );
    const recentMetrics = sortedMetrics.slice(
      0,
      Math.ceil(sortedMetrics.length / 2)
    );
    const olderMetrics = sortedMetrics.slice(
      Math.ceil(sortedMetrics.length / 2)
    );

    let trend: "improving" | "stable" | "declining" = "stable";
    if (recentMetrics.length > 0 && olderMetrics.length > 0) {
      const recentAvgFcr =
        recentMetrics.reduce((sum, m) => sum + m.fcr, 0) / recentMetrics.length;
      const olderAvgFcr =
        olderMetrics.reduce((sum, m) => sum + m.fcr, 0) / olderMetrics.length;

      if (recentAvgFcr < olderAvgFcr - 0.05) trend = "improving";
      else if (recentAvgFcr > olderAvgFcr + 0.05) trend = "declining";
    }

    // Benchmark comparison (assuming industry standard FCR of 1.7)
    const benchmarkFcr = 1.7;
    let benchmarkComparison: "above" | "at" | "below" = "at";
    if (performance.avgFcr < benchmarkFcr - 0.05) benchmarkComparison = "above";
    else if (performance.avgFcr > benchmarkFcr + 0.05)
      benchmarkComparison = "below";

    return {
      productId: product.id,
      productName: product.name,
      totalTrials: performance.totalTrials,
      avgFcr: performance.avgFcr,
      avgWeightGain: performance.avgWeightGain,
      avgMortality: performance.avgMortality,
      performanceScore: performance.performanceScore,
      trend,
      benchmarkComparison,
      regions: product.regions,
    };
  });
};

export const getPerformanceRating = (score: number): PerformanceRating => {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "average";
  return "poor";
};

export const getPerformanceColor = (rating: PerformanceRating): string => {
  switch (rating) {
    case "excellent":
      return "#22c55e";
    case "good":
      return "#3b82f6";
    case "average":
      return "#f59e0b";
    case "poor":
      return "#ef4444";
    default:
      return "#6b7280";
  }
};

export const getTrendColor = (trend: string): string => {
  switch (trend) {
    case "improving":
      return "#22c55e";
    case "stable":
      return "#6b7280";
    case "declining":
      return "#ef4444";
    default:
      return "#6b7280";
  }
};

export const getBenchmarkColor = (comparison: string): string => {
  switch (comparison) {
    case "above":
      return "#22c55e";
    case "at":
      return "#6b7280";
    case "below":
      return "#ef4444";
    default:
      return "#6b7280";
  }
};

export const getCategoryIcon = (category: FeedCategory): string => {
  switch (category) {
    case "starter":
      return "🐣";
    case "grower":
      return "🌱";
    case "finisher":
      return "🎯";
    case "layer":
      return "🥚";
    case "breeder":
      return "👨‍👩‍👧‍👦";
    default:
      return "🌾";
  }
};

export const getSpeciesIcon = (species: TargetSpecies): string => {
  switch (species) {
    case "broiler":
      return "🐔";
    case "layer":
      return "🐓";
    case "swine":
      return "🐷";
    case "fish":
      return "🐟";
    case "cattle":
      return "🐄";
    default:
      return "🐾";
  }
};

export const formatFcr = (fcr: number): string => {
  return fcr.toFixed(2);
};

export const formatWeight = (weight: number): string => {
  return `${weight.toFixed(1)} kg`;
};

export const formatMortality = (mortality: number): string => {
  return `${mortality.toFixed(1)}%`;
};

export const formatPerformanceScore = (score: number): string => {
  return `${score.toFixed(1)}`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getUniqueRegions = (metrics: PerformanceMetric[]): string[] => {
  const regions = new Set<string>();
  metrics.forEach((metric) => regions.add(metric.region));
  return Array.from(regions).sort();
};

export const getUniqueProvinces = (metrics: PerformanceMetric[]): string[] => {
  const provinces = new Set<string>();
  metrics.forEach((metric) => provinces.add(metric.province));
  return Array.from(provinces).sort();
};

export const prepareChartData = (metrics: PerformanceMetric[]) => {
  // Group by date and calculate averages
  const groupedData = metrics.reduce(
    (acc, metric) => {
      const date = metric.recordDate;
      if (!acc[date]) {
        acc[date] = {
          date,
          fcr: [],
          weightGain: [],
          mortality: [],
          feedIntake: [],
          managementScore: [],
        };
      }
      acc[date].fcr.push(metric.fcr);
      acc[date].weightGain.push(metric.weightGain);
      acc[date].mortality.push(metric.mortality);
      acc[date].feedIntake.push(metric.feedIntake);
      acc[date].managementScore.push(metric.managementScore);
      return acc;
    },
    {} as Record<string, any>
  );

  return Object.values(groupedData)
    .map((item: any) => ({
      date: item.date,
      fcr:
        item.fcr.reduce((sum: number, val: number) => sum + val, 0) /
        item.fcr.length,
      weightGain:
        item.weightGain.reduce((sum: number, val: number) => sum + val, 0) /
        item.weightGain.length,
      mortality:
        item.mortality.reduce((sum: number, val: number) => sum + val, 0) /
        item.mortality.length,
      feedIntake:
        item.feedIntake.reduce((sum: number, val: number) => sum + val, 0) /
        item.feedIntake.length,
      managementScore:
        item.managementScore.reduce(
          (sum: number, val: number) => sum + val,
          0
        ) / item.managementScore.length,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const prepareRadarData = (metrics: PerformanceMetric[]) => {
  if (metrics.length === 0) return [];

  const avgMetrics = calculatePerformanceMetrics(metrics);

  return [
    {
      metric: "FCR",
      value: Math.max(0, 100 - (avgMetrics.avgFcr - 1) * 50), // Convert to 0-100 scale
      fullMark: 100,
    },
    {
      metric: "Weight Gain",
      value: Math.min(100, avgMetrics.avgWeightGain * 25), // Scale weight gain
      fullMark: 100,
    },
    {
      metric: "Mortality",
      value: Math.max(0, 100 - avgMetrics.avgMortality * 10), // Invert mortality (lower is better)
      fullMark: 100,
    },
    {
      metric: "Management",
      value:
        (metrics.reduce((sum, m) => sum + m.managementScore, 0) /
          metrics.length) *
        10, // Scale to 100
      fullMark: 100,
    },
    {
      metric: "Verification",
      value: (avgMetrics.verifiedTrials / avgMetrics.totalTrials) * 100,
      fullMark: 100,
    },
  ];
};
