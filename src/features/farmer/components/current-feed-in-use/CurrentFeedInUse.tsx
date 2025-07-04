import { useState } from "react";
import { Calendar, Settings, Info, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useFarmerData } from "../../hooks/useFarmerData";
import { formatAgeRange, formatLastUpdated } from "./utils";
import { FEED_TYPE_COLORS, type FeedInfo } from "./constants";

export const CurrentFeedInUse = () => {
  const { data: farmerData, loading, error } = useFarmerData();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Transform farmer data to match component's expected structure
  const transformToFeedInfo = (): FeedInfo | null => {
    if (!farmerData?.used_feed) return null;

    const { used_feed } = farmerData;

    return {
      id: used_feed.feed_product_id.toString(),
      name: used_feed.feed_name,
      type: used_feed.feed_stage, // Map feed_stage to type
      description: used_feed.feed_goal,
      ageRangeStart: used_feed.age_range_start,
      ageRangeEnd: used_feed.age_range_end,
      lastUpdated: used_feed.start_date,

      // Placeholder nutrition info (not available in current data)
      nutritionInfo: {
        protein: 22, // Placeholder - typical for pre-starter
        energy: 3000, // Placeholder - typical ME value
        fiber: 3.5, // Placeholder - typical fiber content
        fat: 6.5, // Placeholder
        ash: 7.0, // Placeholder
        calcium: 1.0, // Placeholder
        phosphorus: 0.45, // Placeholder
      },

      // Placeholder feeding guidelines
      feedingGuidelines: `Feed ad libitum (free choice) during ${used_feed.feed_stage} stage. Ensure fresh water is always available. Monitor feed consumption and adjust as needed. Transition to next stage at ${used_feed.age_range_end} days.`,

      // Placeholder additional info
      manufacturer: "Premium Feeds Co.", // Placeholder
      batchNumber: "PF-2025-001", // Placeholder
      expiryDate: "2025-12-31", // Placeholder
      storageInstructions:
        "Store in cool, dry place. Keep away from direct sunlight.", // Placeholder

      // Placeholder status
      isActive: true,
      isRecommended: true,
    };
  };

  const feedInfo = transformToFeedInfo();

  // Loading state
  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border py-4 space-y-6">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-foreground font-display font-medium text-base tracking-tight">
            My Current Feed in Use
          </h3>
        </div>
        <div className="px-4">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-primary/20 rounded w-3/4"></div>
              <div className="h-4 bg-primary/20 rounded w-1/2"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-primary/20 rounded"></div>
                <div className="h-16 bg-primary/20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-card rounded-lg border border-border py-4 space-y-6">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-foreground font-display font-medium text-base tracking-tight">
            My Current Feed in Use
          </h3>
        </div>
        <div className="px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!feedInfo) {
    return (
      <div className="bg-card rounded-lg border border-border py-4 space-y-6">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-foreground font-display font-medium text-base tracking-tight">
            My Current Feed in Use
          </h3>
        </div>
        <div className="px-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              No feed information available
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get feed type color, fallback to default if not found
  const feedTypeColorClass =
    FEED_TYPE_COLORS[feedInfo.type as keyof typeof FEED_TYPE_COLORS] ||
    "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <div className="bg-card rounded-lg border border-border py-4 space-y-6">
      <div className="flex items-center justify-between px-4">
        <h3 className="text-foreground font-display font-medium text-base tracking-tight">
          My Current Feed in Use
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsDetailsOpen(true)}
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4 px-4">
        {/* Main Feed Tile */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-1">
                {feedInfo.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {feedInfo.description}
              </p>
            </div>
            <Badge
              variant="outline"
              className={`${feedTypeColorClass} font-medium capitalize`}
            >
              {feedInfo.type.replace("_", " ")}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Age Range</p>
                <p className="text-sm font-medium">
                  {formatAgeRange(feedInfo.ageRangeStart, feedInfo.ageRangeEnd)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Started On</p>
                <p className="text-sm font-medium">
                  {formatLastUpdated(feedInfo.lastUpdated)}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Nutrition Info */}
          <div className="bg-background/50 rounded-md p-3 border">
            <p className="text-xs text-muted-foreground mb-2">
              Quick Nutrition (Typical Values)
            </p>
            <div className="flex justify-between text-sm">
              <span>
                Protein: <strong>{feedInfo.nutritionInfo.protein}%</strong>
              </span>
              <span>
                Energy: <strong>{feedInfo.nutritionInfo.energy} kcal/kg</strong>
              </span>
              <span>
                Fiber: <strong>{feedInfo.nutritionInfo.fiber}%</strong>
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3"
            onClick={() => setIsDetailsOpen(true)}
          >
            View Details & Guidelines
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">
              Active Feed Program
            </span>
          </div>
          <span className="text-xs text-green-600">
            Day {farmerData?.used_feed.age_range_start} -{" "}
            {farmerData?.used_feed.age_range_end}
          </span>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">{feedInfo.name}</DialogTitle>
            <DialogDescription>
              Complete feed information and feeding guidelines
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h4 className="font-semibold mb-3">Feed Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Feed Type</p>
                  <Badge className={`${feedTypeColorClass} mt-1 capitalize`}>
                    {feedInfo.type.replace("_", " ")}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age Range</p>
                  <p className="font-medium">
                    {formatAgeRange(
                      feedInfo.ageRangeStart,
                      feedInfo.ageRangeEnd
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Product ID</p>
                  <p className="font-medium">{feedInfo.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Manufacturer</p>
                  <p className="font-medium">{feedInfo.manufacturer}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Detailed Nutrition */}
            <div>
              <h4 className="font-semibold mb-3">Nutritional Analysis</h4>
              <p className="text-sm text-muted-foreground mb-3">
                *Typical values for {feedInfo.type.replace("_", " ")} feeds
              </p>
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {feedInfo.nutritionInfo.protein}%
                  </p>
                  <p className="text-sm text-muted-foreground">Crude Protein</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {feedInfo.nutritionInfo.energy}
                  </p>
                  <p className="text-sm text-muted-foreground">ME (kcal/kg)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {feedInfo.nutritionInfo.fiber}%
                  </p>
                  <p className="text-sm text-muted-foreground">Crude Fiber</p>
                </div>
              </div>

              {/* Additional nutrition info */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-2 bg-slate-50 rounded">
                  <p className="font-semibold text-slate-700">
                    {feedInfo.nutritionInfo.fat}%
                  </p>
                  <p className="text-xs text-slate-500">Fat</p>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded">
                  <p className="font-semibold text-slate-700">
                    {feedInfo.nutritionInfo.calcium}%
                  </p>
                  <p className="text-xs text-slate-500">Calcium</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Feeding Guidelines */}
            <div>
              <h4 className="font-semibold mb-3">Feeding Guidelines</h4>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  {feedInfo.feedingGuidelines}
                </p>
              </div>
            </div>

            {/* Current Feed Stats from Real Data */}
            {farmerData && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-3">Current Performance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Feed Behavior</p>
                      <p className="font-semibold text-green-800 capitalize">
                        {farmerData.feed_intake_behavior.behavior_status.replace(
                          "_",
                          " "
                        )}
                      </p>
                      <p className="text-xs text-green-600">
                        Score: {farmerData.feed_intake_behavior.behavior_score}
                        /100
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Daily Growth</p>
                      <p className="font-semibold text-blue-800">
                        {farmerData.growth_performance.daily_average_growth_rate.toFixed(
                          3
                        )}{" "}
                        kg
                      </p>
                      <p className="text-xs text-blue-600">
                        FCR: {farmerData.growth_performance.current_fcr}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Update Info */}
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <span className="text-sm text-muted-foreground">
                Started: {formatLastUpdated(feedInfo.lastUpdated)}
              </span>
              <Button variant="outline" size="sm">
                Update Feed Selection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
