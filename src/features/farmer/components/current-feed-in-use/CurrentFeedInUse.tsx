import {
  Calendar,
  ChevronRight,
  CircleFadingArrowUp,
  Settings,
  Wheat,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ExpandableCard from "@/components/ui/expandable-card";
import {
  FEED_TYPE_COLORS,
  MOCK_CURRENT_FEED,
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

  // Summary content - show feed name and status
  const summaryContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Wheat className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-foreground">
            {feedInfo.name}
          </span>
        </div>
        <Badge
          variant="outline"
          className={`${feedTypeColorClass} font-medium capitalize text-xs`}
        >
          {feedInfo.type}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs text-muted-foreground">Active Program</span>
      </div>
    </div>
  );

  return (
    <ExpandableCard title="My Current Feed in Use" summary={summaryContent}>
      <div className="space-y-4">
        {/* Main Feed Tile */}
        <div className="rounded-lg p-4 border">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-display font-medium text-foreground">
                {feedInfo.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2 font-medium">
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
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-medium leading-none">
                  Age Range
                </p>
                <p className="text-sm font-medium font-display">
                  {formatAgeRange(feedInfo.ageRangeStart, feedInfo.ageRangeEnd)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-medium leading-none">
                  Last Updated
                </p>
                <p className="text-sm font-medium font-display">
                  {formatLastUpdated(feedInfo.lastUpdated)}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Nutrition Info */}
          <div className="bg-background/50 rounded-md p-3 border">
            <p className="text-xs text-muted-foreground mb-2 font-medium">
              Quick Nutrition
            </p>
            <div className="flex justify-between text-xs">
              <span className="font-medium text-muted-foreground">
                Protein:{" "}
                <span className="font-display text-sm text-black">
                  {feedInfo.nutritionInfo.protein}%
                </span>
              </span>
              <span className="font-medium text-muted-foreground">
                Energy:{" "}
                <span className="font-display text-sm text-black">
                  {feedInfo.nutritionInfo.energy} kcal/kg
                </span>
              </span>
              <span className="font-medium text-muted-foreground">
                Fiber:{" "}
                <span className="font-display text-sm text-black">
                  {feedInfo.nutritionInfo.fiber}%
                </span>
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 font-medium text-xs text-muted-foreground"
            onClick={() => setIsDetailsOpen(true)}
          >
            View Details & Guidelines
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between p-3 -mx-4 bg-green-100 border-t border-b border-green-500">
          <p className="text-base font-display font-medium text-green-500">
            Active Feed Program
          </p>
          <span className="text-sm text-muted-foreground">
            optimal for current growth stage
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
            <div className="space-y-1">
              <h4 className="font-semibold">Feed Information</h4>
              <div className="flex justify-between items-center gap-4">
                <div className="items-start flex gap-1">
                  <Wheat className="h-4 w-4 text-muted-foreground" />
                  <div className="">
                    <p className="text-xs text-muted-foreground">Feed Type</p>
                    <Badge className={`${feedTypeColorClass} capitalize`}>
                      {feedInfo.type}
                    </Badge>
                  </div>
                </div>
                <div className="items-start flex gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="">
                    <p className="text-xs text-muted-foreground">Age Range</p>
                    <p className="font-medium text-sm font-display">
                      {formatAgeRange(
                        feedInfo.ageRangeStart,
                        feedInfo.ageRangeEnd,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Nutrition */}
            <div className="space-y-1">
              <h4 className="font-medium font-display">Nutritional Analysis</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-md border">
                  <p className="text-xl font-medium font-display">
                    {feedInfo.nutritionInfo.protein}%
                  </p>
                  <p className="text-sm text-muted-foreground">Crude Protein</p>
                </div>
                <div className="text-center p-2 rounded-md border">
                  <p className="text-xl font-medium font-display">
                    {feedInfo.nutritionInfo.energy}
                  </p>
                  <p className="text-sm text-muted-foreground">ME (kcal/kg)</p>
                </div>
                <div className="text-center p-2 rounded-md border">
                  <p className="text-xl font-medium font-display">
                    {feedInfo.nutritionInfo.fiber}%
                  </p>
                  <p className="text-sm text-muted-foreground">Crude Fiber</p>
                </div>
              </div>
            </div>

            {/* Feeding Guidelines */}
            <div className="p-5 bg-blue-100 -mx-6 border-t border-blue-500 border-b">
              <p className="text-sm text-blue-500 font-medium font-display">
                {feedInfo.feedingGuidelines}
              </p>
            </div>

            {/* Update Info */}
            <div className="flex items-center justify-between p-5 -mx-6 bg-muted/50">
              <div className="flex gap-2">
                <CircleFadingArrowUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Last updated
                  </p>
                  <p className="text-sm font-display font-medium">
                    {formatLastUpdated(feedInfo.lastUpdated)}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ExpandableCard>
  );
};
