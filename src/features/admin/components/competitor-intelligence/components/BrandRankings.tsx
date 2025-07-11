import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Shield,
  MapPin,
  Calendar,
  AtSign,
  Frown,
  Meh,
  Laugh,
} from "lucide-react";
import type { CompetitorBrand } from "../constants";
import {
  getBrandRankings,
  getSentimentColor,
  getRiskColor,
  getCategoryIcon,
  formatPercentage,
  formatDate,
} from "../utils";
import { capitalizeFirstLetter } from "@/lib/helpers/string";

interface BrandRankingsProps {
  brands: CompetitorBrand[];
}

const BrandRankings = ({ brands }: BrandRankingsProps) => {
  const rankedBrands = getBrandRankings(brands);

  const getThreatIcon = (threat: string) => {
    switch (threat) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Shield className="h-4 w-4 text-yellow-500" />;
      default:
        return <Shield className="h-4 w-4 text-green-500" />;
    }
  };

  const getPricePointColor = (pricePoint: string) => {
    switch (pricePoint) {
      case "premium":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "mid-range":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "budget":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Laugh className="size-5 text-green-500" />;
      case "negative":
        return <Frown className="size-5 text-red-500" />;
      default:
        return <Meh className="size-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-display font-medium">
          Brand Rankings & Intelligence
        </h3>
        <Badge
          variant="outline"
          className="font-display font-medium rounded-full border-black text-xs"
        >
          {rankedBrands.length} Competitors
        </Badge>
      </div>

      <div className="space-y-2">
        {rankedBrands.map((brand) => (
          <div
            key={brand.id}
            className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    #{brand.rank}
                  </div>
                  <span className="text-lg">
                    {getCategoryIcon(brand.category)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-sm font-display">
                    {brand.name}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium capitalize">
                    {brand.category}
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-xs ${getPricePointColor(brand.pricePoint)}`}
              >
                {brand.pricePoint}
              </Badge>
            </div>

            {/* Market Share Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">
                  Market Share
                </span>
                <span className="font-medium text-sm font-display">
                  {formatPercentage(brand.marketShare)}
                </span>
              </div>
              <Progress value={brand.marketShare} className="h-2" />
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center p-2 rounded bg-card border">
                <div className="flex items-center justify-center gap-1">
                  <AtSign className="size-5" />
                  <span className="text-2xl font-display font-semibold">
                    {brand.mentions}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Mentions
                </div>
              </div>
              <div className="text-center p-2 rounded bg-card border">
                <div className="flex items-center justify-center gap-1">
                  {getSentimentIcon(brand.sentiment)}
                  <Badge
                    variant="outline"
                    className="text-lg font-display text-white font-semibold"
                    style={{
                      backgroundColor: getSentimentColor(brand.sentiment),
                    }}
                  >
                    {capitalizeFirstLetter(brand.sentiment)}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Sentiment
                </div>
              </div>
              <div className="text-center p-2 rounded bg-card border">
                <Badge
                  variant="outline"
                  className="text-lg font-display text-white font-semibold rounded-full"
                  style={{
                    borderColor: getRiskColor(brand.switchingRisk),
                    color: getRiskColor(brand.switchingRisk),
                  }}
                >
                  {capitalizeFirstLetter(brand.switchingRisk)}
                </Badge>
                <div className="text-xs text-muted-foreground font-medium">
                  Risk
                </div>
              </div>
              <div className="text-center p-2 rounded bg-card border">
                <div className="flex items-center justify-center gap-1">
                  <Calendar className="size-5" />
                  <span className="text-2xl font-semibold font-display">
                    {formatDate(brand.lastActivity)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Last Activity
                </div>
              </div>
            </div>

            {/* Regions */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground font-medium">
                <MapPin className="size-3" />
                <span>Active Regions</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {brand.regions.map((region) => (
                  <Badge
                    key={region}
                    variant="secondary"
                    className="text-xs font-medium"
                  >
                    {region}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Threat Level Summary */}
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2">
                {getThreatIcon(brand.threat)}
                <span className="capitalize text-muted-foreground text-sm font-medium">
                  {brand.threat} Threat Level
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rankedBrands.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No competitor brands found</p>
          <p className="text-xs">Adjust your filters to see more results</p>
        </div>
      )}
    </div>
  );
};

export default BrandRankings;
