import type {
  CompetitorBrand,
  CompetitorPromo,
  SwitchingRisk,
  BrandMention,
  CompetitorCategory,
  PromoType,
  RiskLevel,
  SentimentType,
} from "./constants";

export interface FilterOptions {
  category: CompetitorCategory | "all";
  sentiment: SentimentType | "all";
  riskLevel: RiskLevel | "all";
  pricePoint: "budget" | "mid-range" | "premium" | "all";
  region: string | "all";
  promoType: PromoType | "all";
  promoStatus: "active" | "expired" | "upcoming" | "all";
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export const getDefaultFilters = (): FilterOptions => ({
  category: "all",
  sentiment: "all",
  riskLevel: "all",
  pricePoint: "all",
  region: "all",
  promoType: "all",
  promoStatus: "all",
  dateRange: {
    start: null,
    end: null,
  },
});

export const filterCompetitorBrands = (
  brands: CompetitorBrand[],
  filters: FilterOptions
): CompetitorBrand[] => {
  return brands.filter((brand) => {
    if (filters.category !== "all" && brand.category !== filters.category) {
      return false;
    }
    if (filters.sentiment !== "all" && brand.sentiment !== filters.sentiment) {
      return false;
    }
    if (
      filters.riskLevel !== "all" &&
      brand.switchingRisk !== filters.riskLevel
    ) {
      return false;
    }
    if (
      filters.pricePoint !== "all" &&
      brand.pricePoint !== filters.pricePoint
    ) {
      return false;
    }
    if (filters.region !== "all" && !brand.regions.includes(filters.region)) {
      return false;
    }
    if (filters.dateRange.start && filters.dateRange.end) {
      const activityDate = new Date(brand.lastActivity);
      if (
        activityDate < filters.dateRange.start ||
        activityDate > filters.dateRange.end
      ) {
        return false;
      }
    }
    return true;
  });
};

export const filterCompetitorPromos = (
  promos: CompetitorPromo[],
  filters: FilterOptions
): CompetitorPromo[] => {
  return promos.filter((promo) => {
    if (filters.promoType !== "all" && promo.type !== filters.promoType) {
      return false;
    }
    if (filters.promoStatus !== "all" && promo.status !== filters.promoStatus) {
      return false;
    }
    if (filters.region !== "all" && !promo.regions.includes(filters.region)) {
      return false;
    }
    if (filters.dateRange.start && filters.dateRange.end) {
      const promoStart = new Date(promo.startDate);
      const promoEnd = new Date(promo.endDate);
      if (
        promoEnd < filters.dateRange.start ||
        promoStart > filters.dateRange.end
      ) {
        return false;
      }
    }
    return true;
  });
};

export const filterSwitchingRisks = (
  risks: SwitchingRisk[],
  filters: FilterOptions
): SwitchingRisk[] => {
  return risks.filter((risk) => {
    if (filters.riskLevel !== "all" && risk.riskLevel !== filters.riskLevel) {
      return false;
    }
    if (filters.region !== "all" && risk.region !== filters.region) {
      return false;
    }
    if (filters.dateRange.start && filters.dateRange.end) {
      const reportDate = new Date(risk.reportDate);
      if (
        reportDate < filters.dateRange.start ||
        reportDate > filters.dateRange.end
      ) {
        return false;
      }
    }
    return true;
  });
};

export const calculateMarketShareData = (brands: CompetitorBrand[]) => {
  const totalMarketShare = brands.reduce(
    (sum, brand) => sum + brand.marketShare,
    0
  );
  const ourShare = Math.max(0, 100 - totalMarketShare);

  return [
    { name: "Our Brand", value: ourShare, color: "#22c55e" },
    ...brands.map((brand, index) => ({
      name: brand.name,
      value: brand.marketShare,
      color: getChartColor(index),
    })),
  ];
};

export const calculateBrandMentionsData = (mentions: BrandMention[]) => {
  return mentions.map((mention) => ({
    ...mention,
    color: getSentimentColor(mention.sentiment),
    size: Math.max(12, Math.min(48, mention.mentions / 3)),
  }));
};

export const calculateCompetitorMetrics = (
  brands: CompetitorBrand[],
  promos: CompetitorPromo[],
  risks: SwitchingRisk[]
) => {
  const totalBrands = brands.length;
  const activePromos = promos.filter((p) => p.status === "active").length;
  const highRiskSwitchers = risks.filter((r) => r.riskLevel === "high").length;
  const marketShareLoss = brands.reduce(
    (sum, brand) => sum + brand.marketShare,
    0
  );
  const averageSentiment = calculateAverageSentiment(brands);
  const topThreat =
    brands.reduce((prev, current) =>
      prev.marketShare > current.marketShare ? prev : current
    )?.name || "N/A";
  const emergingCompetitors = brands.filter(
    (b) => b.marketShare < 5 && b.sentiment === "positive"
  ).length;
  const estimatedRevenueLoss = risks.reduce(
    (sum, risk) => sum + risk.estimatedRevenueLoss,
    0
  );

  return {
    totalBrands,
    activePromos,
    highRiskSwitchers,
    marketShareLoss,
    averageSentiment,
    topThreat,
    emergingCompetitors,
    estimatedRevenueLoss,
  };
};

export const calculateAverageSentiment = (
  brands: CompetitorBrand[]
): number => {
  if (brands.length === 0) return 0;

  const sentimentScores = brands.map((brand) => {
    switch (brand.sentiment) {
      case "positive":
        return 1;
      case "neutral":
        return 0;
      case "negative":
        return -1;
      default:
        return 0;
    }
  });

  const sum = sentimentScores.reduce((acc: number, score) => acc + score, 0);
  const average = sum / brands.length;
  return Math.round(average * 100) / 100;
};

export const getBrandRankings = (brands: CompetitorBrand[]) => {
  return [...brands]
    .sort((a, b) => b.marketShare - a.marketShare)
    .map((brand, index) => ({
      ...brand,
      rank: index + 1,
      threat: calculateThreatLevel(brand),
    }));
};

export const calculateThreatLevel = (
  brand: CompetitorBrand
): "low" | "medium" | "high" => {
  let score = 0;

  // Market share weight
  if (brand.marketShare > 20) score += 3;
  else if (brand.marketShare > 10) score += 2;
  else score += 1;

  // Switching risk weight
  if (brand.switchingRisk === "high") score += 3;
  else if (brand.switchingRisk === "medium") score += 2;
  else score += 1;

  // Sentiment weight
  if (brand.sentiment === "positive") score += 2;
  else if (brand.sentiment === "neutral") score += 1;

  // Mentions weight
  if (brand.mentions > 100) score += 2;
  else if (brand.mentions > 50) score += 1;

  if (score >= 8) return "high";
  if (score >= 5) return "medium";
  return "low";
};

export const getChartColor = (index: number): string => {
  const colors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#84cc16",
  ];
  return colors[index % colors.length];
};

export const getSentimentColor = (sentiment: SentimentType): string => {
  switch (sentiment) {
    case "positive":
      return "#22c55e";
    case "neutral":
      return "#6b7280";
    case "negative":
      return "#ef4444";
    default:
      return "#6b7280";
  }
};

export const getRiskColor = (risk: RiskLevel): string => {
  switch (risk) {
    case "high":
      return "#ef4444";
    case "medium":
      return "#f59e0b";
    case "low":
      return "#22c55e";
    default:
      return "#6b7280";
  }
};

export const getCategoryIcon = (category: CompetitorCategory): string => {
  switch (category) {
    case "fertilizer":
      return "🌱";
    case "seeds":
      return "🌾";
    case "pesticide":
      return "🛡️";
    case "equipment":
      return "🚜";
    case "technology":
      return "📱";
    default:
      return "📦";
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getUniqueRegions = (
  brands: CompetitorBrand[],
  promos: CompetitorPromo[],
  risks: SwitchingRisk[]
): string[] => {
  const regions = new Set<string>();

  brands.forEach((brand) =>
    brand.regions.forEach((region) => regions.add(region))
  );
  promos.forEach((promo) =>
    promo.regions.forEach((region) => regions.add(region))
  );
  risks.forEach((risk) => regions.add(risk.region));

  return Array.from(regions).sort();
};
