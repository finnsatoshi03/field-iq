import { Calendar, ChevronRight, Settings, Wheat } from "lucide-react";
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
import { FEED_STAGE_COLORS, FEED_STAGE_DISPLAY } from "@/features/farmer/types";
import type { FarmerDashboardViewModel } from "@/services/field-iq-service";

interface CurrentFeedInUseProps {
  dashboardData?: FarmerDashboardViewModel;
}

export const CurrentFeedInUse: React.FC<CurrentFeedInUseProps> = ({
  dashboardData,
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Extract used_feed data from API response
  const feedInfo = dashboardData?.used_feed;

  const formatAgeRange = (start: number, end: number) => {
    if (start === 1) {
      return `Day 1 - ${end} days`;
    }
    return `${start} - ${end} days`;
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFeedStageDisplay = (stage?: string | null) => {
    if (!stage || typeof stage !== "string") return "Unknown";
    const mapped = FEED_STAGE_DISPLAY[stage];
    if (mapped) return mapped;
    return stage
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const feedStageColorClass = feedInfo?.feed_stage
    ? FEED_STAGE_COLORS[feedInfo.feed_stage] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    : "bg-gray-100 text-gray-800 border-gray-200";

  // Show loading state if no data
  if (!feedInfo) {
    return (
      <ExpandableCard
        title="My Current Feed in Use"
        summary={
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wheat className="h-4 w-4" />
            <span className="text-sm">Loading feed information...</span>
          </div>
        }
        className="h-fit"
      >
        <div className="space-y-4">
          <div className="rounded-lg p-4 border">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">No feed data available</p>
            </div>
          </div>
        </div>
      </ExpandableCard>
    );
  }

  // Summary content - show feed name and status
  const summaryContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Wheat className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-foreground">
            {feedInfo.feed_name}
          </span>
        </div>
        <Badge
          variant="outline"
          className={`${feedStageColorClass} font-medium capitalize text-xs`}
        >
          {getFeedStageDisplay(feedInfo.feed_stage)}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs text-muted-foreground">Active Program</span>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="My Current Feed in Use"
      summary={summaryContent}
      className="h-fit"
    >
      <div className="space-y-4">
        {/* Main Feed Tile */}
        <div className="rounded-lg p-4 border">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-display font-medium text-foreground">
                {feedInfo.feed_name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2 font-medium">
                {feedInfo.feed_goal}
              </p>
            </div>
            <Badge
              variant="outline"
              className={`${feedStageColorClass} font-medium capitalize`}
            >
              {getFeedStageDisplay(feedInfo.feed_stage)}
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
                  {formatAgeRange(
                    feedInfo.age_range_start,
                    feedInfo.age_range_end,
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-medium leading-none">
                  Start Date
                </p>
                <p className="text-sm font-medium font-display">
                  {formatDate(feedInfo.start_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Feed Program Info */}
          <div className="bg-background/50 rounded-md p-3 border">
            <p className="text-xs text-muted-foreground mb-2 font-medium">
              Feed Program Goal
            </p>
            <p className="text-sm font-medium text-foreground">
              {feedInfo.feed_goal}
            </p>
          </div>

          {/* Action Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 font-medium text-xs text-muted-foreground"
            onClick={() => setIsDetailsOpen(true)}
          >
            View Details & Information
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between p-3 -mx-4 bg-green-100 border-t border-b border-green-500">
          <p className="text-base font-display font-medium text-green-500">
            Active Feed Program
          </p>
          <span className="text-sm text-muted-foreground">
            {getFeedStageDisplay(feedInfo.feed_stage)} stage
          </span>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">
              {feedInfo.feed_name}
            </DialogTitle>
            <DialogDescription>
              Complete feed information and program details
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
                    <p className="text-xs text-muted-foreground">Feed Stage</p>
                    <Badge className={`${feedStageColorClass} capitalize`}>
                      {getFeedStageDisplay(feedInfo.feed_stage)}
                    </Badge>
                  </div>
                </div>
                <div className="items-start flex gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="">
                    <p className="text-xs text-muted-foreground">Age Range</p>
                    <p className="font-medium text-sm font-display">
                      {formatAgeRange(
                        feedInfo.age_range_start,
                        feedInfo.age_range_end,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed Program Goal */}
            <div className="space-y-1">
              <h4 className="font-medium font-display">Program Goal</h4>
              <div className="p-3 rounded-md border bg-blue-50">
                <p className="text-sm text-blue-700 font-medium">
                  {feedInfo.feed_goal}
                </p>
              </div>
            </div>

            {/* Program Info */}
            <div className="p-5 bg-green-100 -mx-6 border-t border-green-500 border-b">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-green-600 font-medium">Feed ID</p>
                  <p className="text-sm font-display font-medium text-green-700">
                    #{feedInfo.feed_product_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-green-600 font-medium">
                    Program Started
                  </p>
                  <p className="text-sm font-display font-medium text-green-700">
                    {formatDate(feedInfo.start_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex items-center justify-end p-5 -mx-6 bg-muted/50">
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
