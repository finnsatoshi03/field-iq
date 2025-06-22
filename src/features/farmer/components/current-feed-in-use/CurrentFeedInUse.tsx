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
import {
  MOCK_CURRENT_FEED,
  FEED_TYPE_COLORS,
  type FeedInfo,
} from "./constants";

export const CurrentFeedInUse = () => {
  const [feedInfo] = useState<FeedInfo>(MOCK_CURRENT_FEED);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const formatAgeRange = (start: number, end: number) => {
    if (start === 0) {
      return `Day 1 - ${end} days`;
    }
    return `${start} - ${end} days`;
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const feedTypeColorClass = FEED_TYPE_COLORS[feedInfo.type];

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
              {feedInfo.type}
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
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">
                  {formatLastUpdated(feedInfo.lastUpdated)}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Nutrition Info */}
          <div className="bg-background/50 rounded-md p-3 border">
            <p className="text-xs text-muted-foreground mb-2">
              Quick Nutrition
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
            Optimal for current growth stage
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
                    {feedInfo.type}
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
              </div>
            </div>

            <Separator />

            {/* Detailed Nutrition */}
            <div>
              <h4 className="font-semibold mb-3">Nutritional Analysis</h4>
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

            {/* Update Info */}
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <span className="text-sm text-muted-foreground">
                Last updated: {formatLastUpdated(feedInfo.lastUpdated)}
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
