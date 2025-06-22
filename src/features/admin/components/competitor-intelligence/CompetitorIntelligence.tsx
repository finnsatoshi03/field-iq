import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Eye,
  TrendingUp,
  AlertTriangle,
  Building2,
  BarChart3,
} from "lucide-react";
import {
  FilterControls,
  ViewToggle,
  CompetitorChart,
  BrandRankings,
  SwitchingRisks,
} from "./components";
import {
  MOCK_COMPETITOR_BRANDS,
  MOCK_COMPETITOR_PROMOS,
  MOCK_SWITCHING_RISKS,
  MOCK_BRAND_MENTIONS,
  VIEW_MODES,
  type ViewMode,
} from "./constants";
import {
  getDefaultFilters,
  filterCompetitorBrands,
  filterCompetitorPromos,
  filterSwitchingRisks,
  calculateCompetitorMetrics,
  getUniqueRegions,
  formatCurrency,
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
        MOCK_SWITCHING_RISKS
      ),
    []
  );

  // Apply filters
  const filteredBrands = useMemo(
    () => filterCompetitorBrands(MOCK_COMPETITOR_BRANDS, filters),
    [filters]
  );

  const filteredPromos = useMemo(
    () => filterCompetitorPromos(MOCK_COMPETITOR_PROMOS, filters),
    [filters]
  );

  const filteredRisks = useMemo(
    () => filterSwitchingRisks(MOCK_SWITCHING_RISKS, filters),
    [filters]
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
    [filteredBrands, filteredPromos, filteredRisks]
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
                <div className="text-xs text-muted-foreground">
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
                <div className="text-xs text-muted-foreground">
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
    <div className="bg-card rounded-lg border border-border pt-4 space-y-6">
      <div className="px-4">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground font-display font-medium text-base tracking-tight">
            Competitor Intelligence
          </h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-4xl xl:max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Competitor Intelligence Analytics</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Filters */}
                <FilterControls
                  filters={filters}
                  onFiltersChange={setFilters}
                  regions={regions}
                />

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
      </div>

      <div className="px-4">
        <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
      </div>

      <div className="px-4">{renderCompactView()}</div>

      <div className="px-4 bg-muted/20 py-4 space-y-4">
        <div className="flex items-end justify-between">
          <h4 className="text-foreground font-display font-medium text-sm tracking-tight">
            Threat Intelligence Summary
          </h4>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3 text-red-600 dark:text-red-400" />
              <span className="text-muted-foreground font-sans">
                Top Threat
              </span>
              <span className="font-medium text-foreground font-sans">
                {metrics.topThreat}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
              <span className="text-muted-foreground font-sans">
                Market Loss
              </span>
              <span className="font-medium text-foreground font-sans">
                {metrics.marketShareLoss.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded bg-muted/10">
            <div className="flex items-center gap-2">
              <Building2 className="h-3 w-3 text-blue-500" />
              <span className="text-sm font-medium">Market Share Analysis</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {metrics.emergingCompetitors} Emerging
            </Badge>
          </div>

          <div className="flex items-center justify-between p-2 rounded bg-muted/10">
            <div className="flex items-center gap-2">
              <Eye className="h-3 w-3 text-yellow-500" />
              <span className="text-sm font-medium">Revenue at Risk</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(metrics.estimatedRevenueLoss || 0)}
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded bg-muted/10">
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
  );
};

export default CompetitorIntelligence;
