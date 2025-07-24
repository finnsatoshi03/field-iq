import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  Building2,
  Eye,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  BrandRankings,
  CompetitorChart,
  FilterControls,
  SwitchingRisks,
  ViewToggle,
} from "./components";
import {
  MOCK_BRAND_MENTIONS,
  MOCK_COMPETITOR_BRANDS,
  MOCK_COMPETITOR_PROMOS,
  MOCK_SWITCHING_RISKS,
  VIEW_MODES,
  type ViewMode,
} from "./constants";
import {
  calculateCompetitorMetrics,
  calculateMarketShareData,
  filterCompetitorBrands,
  filterCompetitorPromos,
  filterSwitchingRisks,
  formatCurrency,
  getDefaultFilters,
  getUniqueRegions,
  type FilterOptions,
} from "./utils";

const CompetitorIntelligence = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(VIEW_MODES.CHART);
  const [filters, setFilters] = useState<FilterOptions>(getDefaultFilters());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get unique regions for filters
  const regions = useMemo(
    () =>
      getUniqueRegions(
        MOCK_COMPETITOR_BRANDS,
        MOCK_COMPETITOR_PROMOS,
        MOCK_SWITCHING_RISKS,
      ),
    [],
  );

  // Apply filters
  const filteredBrands = useMemo(
    () => filterCompetitorBrands(MOCK_COMPETITOR_BRANDS, filters),
    [filters],
  );

  const filteredPromos = useMemo(
    () => filterCompetitorPromos(MOCK_COMPETITOR_PROMOS, filters),
    [filters],
  );

  const filteredRisks = useMemo(
    () => filterSwitchingRisks(MOCK_SWITCHING_RISKS, filters),
    [filters],
  );

  const filteredMentions = useMemo(() => {
    let mentions = MOCK_BRAND_MENTIONS;

    if (filters.sentiment !== "all") {
      mentions = mentions.filter((m) => m.sentiment === filters.sentiment);
    }

    return mentions;
  }, [filters]);

  // Calculate metrics
  const metrics = useMemo(
    () =>
      calculateCompetitorMetrics(filteredBrands, filteredPromos, filteredRisks),
    [filteredBrands, filteredPromos, filteredRisks],
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case VIEW_MODES.CHART:
        return (
          <CompetitorChart
            brands={filteredBrands}
            mentions={filteredMentions}
          />
        );
      case VIEW_MODES.BRANDS:
        return <BrandRankings brands={filteredBrands} />;
      case VIEW_MODES.RISKS:
        return <SwitchingRisks risks={filteredRisks} />;
      default:
        return (
          <CompetitorChart
            brands={filteredBrands}
            mentions={filteredMentions}
          />
        );
    }
  };

  const renderCompactView = () => {
    switch (currentView) {
      case VIEW_MODES.CHART:
        const marketShareData = calculateMarketShareData(filteredBrands);

        const CustomTooltip = ({ active, payload }: any) => {
          if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
              <div className="bg-background border rounded-lg p-2 shadow-lg">
                <p className="font-medium text-xs">{data.name}</p>
                <p className="text-xs text-muted-foreground">
                  {data.value.toFixed(1)}%
                </p>
              </div>
            );
          }
          return null;
        };

        return (
          <div className="grid grid-cols-2 gap-4">
            {/* Chart on the left */}
            <div className="h-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marketShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={"30%"}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {marketShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend on the right */}
            <div className="space-y-1">
              {marketShareData.slice(0, 5).map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-1.5 bg-muted/10 rounded"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs font-medium truncate">
                      {item.name}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ color: item.color }}
                  >
                    {item.value.toFixed(1)}%
                  </span>
                </div>
              ))}
              {marketShareData.length > 5 && (
                <div className="text-center text-xs text-muted-foreground">
                  +{marketShareData.length - 5} more
                </div>
              )}
            </div>
          </div>
        );
      case VIEW_MODES.BRANDS:
        return (
          <div className="space-y-2">
            {filteredBrands.slice(0, 3).map((brand, index) => (
              <div
                key={brand.id}
                className="flex items-center justify-between p-2 rounded bg-muted/10"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    #{index + 1}
                  </div>
                  <span className="text-sm font-medium">{brand.name}</span>
                </div>
                <div className="text-xs font-medium font-display text-muted-foreground">
                  {brand.marketShare.toFixed(1)}%
                </div>
              </div>
            ))}
            {filteredBrands.length > 3 && (
              <div className="text-center text-xs text-muted-foreground">
                +{filteredBrands.length - 3} more brands
              </div>
            )}
          </div>
        );
      case VIEW_MODES.RISKS:
        return (
          <div className="space-y-2">
            {filteredRisks.slice(0, 3).map((risk) => (
              <div
                key={risk.farmerId}
                className="flex items-center justify-between p-2 rounded bg-muted/10"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className={`h-3 w-3 ${
                      risk.riskLevel === "high"
                        ? "text-red-500"
                        : risk.riskLevel === "medium"
                          ? "text-yellow-500"
                          : "text-green-500"
                    }`}
                  />
                  <span className="text-sm font-medium">{risk.farmerName}</span>
                </div>
                <div className="text-xs font-medium font-display text-muted-foreground">
                  {formatCurrency(risk.estimatedRevenueLoss)}
                </div>
              </div>
            ))}
            {filteredRisks.length > 3 && (
              <div className="text-center text-xs text-muted-foreground">
                +{filteredRisks.length - 3} more risks
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-muted/10 rounded">
                <div className="text-sm font-bold text-blue-600">
                  {metrics.totalBrands}
                </div>
                <div className="text-xs text-muted-foreground">Competitors</div>
              </div>
              <div className="text-center p-2 bg-muted/10 rounded">
                <div className="text-sm font-bold text-green-600">
                  {metrics.activePromos}
                </div>
                <div className="text-xs text-muted-foreground">
                  Active Promos
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-muted/10 rounded">
                <div className="text-sm font-bold text-red-600">
                  {metrics.highRiskSwitchers}
                </div>
                <div className="text-xs text-muted-foreground">High Risk</div>
              </div>
              <div className="text-center p-2 bg-muted/10 rounded">
                <div className="text-sm font-bold text-yellow-600">
                  {filteredMentions.reduce((sum, m) => sum + m.mentions, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Mentions</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border pt-4 relative overflow-hidden opacity-60 cursor-not-allowed">
      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/80 to-muted/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="flex items-center justify-center mb-2">
            <Sparkles className="h-6 w-6 text-primary mr-2 animate-pulse" />
            <Star className="h-5 w-5 text-yellow-500 animate-bounce" />
          </div>
          <h3 className="font-display font-semibold text-foreground mb-1">
            Coming Soon
          </h3>
          <p className="text-xs text-muted-foreground">
            Competitor intelligence features are being developed
          </p>
        </div>
      </div>

      {/* Original Content (Blurred) */}
      <div className="filter blur-sm pointer-events-none">
        <div className="px-4">
          <div className="flex flex-wrap gap-2 justify-between">
            <div>
              <h3 className="text-foreground font-display font-medium text-base tracking-tight">
                Competitor Intelligence
              </h3>
              <p className="text-muted-foreground text-xs font-sans">
                Track competitor activity and market share
              </p>
            </div>
            <ViewToggle
              currentView={currentView}
              onViewChange={setCurrentView}
            />
          </div>
        </div>

        <div className="px-4 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm sm:text-base font-medium font-display truncate">
              {currentView === VIEW_MODES.CHART
                ? "Market Distribution"
                : currentView === VIEW_MODES.BRANDS
                  ? "Brand Rankings"
                  : currentView === VIEW_MODES.RISKS
                    ? "Revenue at Risk"
                    : "Sentiment Analysis"}
            </h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="link"
                  className="text-xs underline p-0 w-fit h-fit"
                >
                  More Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-4xl xl:max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="gap-0 space-y-0">
                  <DialogTitle className="font-semibold font-display text-lg">
                    Competitor Intelligence Analytics
                  </DialogTitle>
                  <DialogDescription>
                    Track competitor activity and market share
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Filters */}
                  <div className="-mx-6 px-2 bg-accent">
                    <div className="p-4">
                      <FilterControls
                        filters={filters}
                        onFiltersChange={setFilters}
                        regions={regions}
                      />
                    </div>
                  </div>

                  {/* View Toggle */}
                  <ViewToggle
                    currentView={currentView}
                    onViewChange={setCurrentView}
                  />

                  {/* Content */}
                  {renderCurrentView()}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {renderCompactView()}
        </div>

        <div className="px-4 bg-muted/20 py-4 space-y-4">
          <div className="flex gap-4 justify-between">
            <h4 className="text-foreground font-display font-medium text-sm tracking-tight">
              Threat Intelligence Summary
            </h4>
            <div className="flex flex-col items-end gap-1 text-xs">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3 text-red-600 dark:text-red-400" />
                <span className="text-muted-foreground font-sans">
                  Top Threat
                </span>
                <span className="font-medium text-foreground font-display">
                  {metrics.topThreat}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                <span className="text-muted-foreground font-sans">
                  Market Loss
                </span>
                <span className="font-medium text-foreground font-display">
                  {metrics.marketShareLoss.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-3 w-3 text-blue-500" />
                <span className="text-sm font-medium">
                  Market Share Analysis
                </span>
              </div>
              <Badge
                variant="outline"
                className="text-xs font-display border-black"
              >
                {metrics.emergingCompetitors} Emerging
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-3 w-3 text-yellow-500" />
                <span className="text-sm font-medium">Revenue at Risk</span>
              </div>
              <div className="text-xs font-medium font-display">
                {formatCurrency(metrics.estimatedRevenueLoss || 0)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-sm font-medium">Sentiment Analysis</span>
              </div>
              <Badge
                variant={
                  metrics.averageSentiment > 0
                    ? "default"
                    : metrics.averageSentiment < 0
                      ? "destructive"
                      : "secondary"
                }
                className="text-xs"
              >
                {metrics.averageSentiment > 0
                  ? "Positive"
                  : metrics.averageSentiment < 0
                    ? "Negative"
                    : "Neutral"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorIntelligence;
