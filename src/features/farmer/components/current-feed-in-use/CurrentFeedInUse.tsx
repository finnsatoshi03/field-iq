import {
  AlertTriangle,
  Calendar,
  ChevronRight,
  RotateCcw,
  Settings,
  Wheat,
} from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import {
  farmerV2Keys,
  useActiveFeedProduct,
  useActiveFeedProgram,
  useCreateFeedProgram,
} from "@/hooks/use-farmer-v2";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FeedProductSelector } from "../feed-product-selector";

interface CurrentFeedInUseProps {
  farmerUserProfileId: number;
}

export const CurrentFeedInUse: React.FC<CurrentFeedInUseProps> = ({
  farmerUserProfileId,
}) => {
  const queryClient = useQueryClient();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isChangeFeedOpen, setIsChangeFeedOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedFeedProductId, setSelectedFeedProductId] =
    useState<string>("");

  // Fetch farmer_v2 data (only source)
  const { data: activeFeedProduct } = useActiveFeedProduct(farmerUserProfileId);
  const { data: activeFeedProgram } = useActiveFeedProgram(farmerUserProfileId);

  // Feed change mutation
  const createFeedProgramMutation = useCreateFeedProgram({
    onSuccess: () => {
      toast.success("Feed changed successfully!");
      setIsChangeFeedOpen(false);
      setIsConfirmationOpen(false);
      setSelectedFeedProductId("");

      // Invalidate and refetch active feed program for this farmer
      queryClient.invalidateQueries({
        queryKey: farmerV2Keys.activeFeedProgram(farmerUserProfileId),
      });
      queryClient.invalidateQueries({
        queryKey: farmerV2Keys.activeFeedProduct(farmerUserProfileId),
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to change feed");
    },
  });

  // Use only farmer_v2 data
  const feedInfo = activeFeedProduct?.data;
  const currentFeedProductId = activeFeedProgram?.data?.feed_product_id;

  const formatAgeRange = (start: number, end: number) => {
    if (start === 1) {
      return `Day 1 - ${end} days`;
    }
    return `${start} - ${end} days`;
  };

  const getFeedStageDisplay = (stage?: string | null) => {
    if (!stage || typeof stage !== "string") return "Unknown";
    const mapped = FEED_STAGE_DISPLAY[stage];
    if (mapped) return mapped;
    return stage
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // Check if user needs age range warning
  const getAgeRangeWarning = () => {
    if (!feedInfo?.days_on_feed || !feedInfo?.age_range_end) return null;

    if (feedInfo.days_on_feed > feedInfo.age_range_end) {
      return `Warning: You have been using this feed for ${feedInfo.days_on_feed} days, which exceeds the recommended age range of ${feedInfo.age_range_end} days.`;
    }

    return null;
  };

  const handleChangeFeed = () => {
    setIsChangeFeedOpen(true);
  };

  const handleInitialConfirm = () => {
    const feedProductId = parseInt(selectedFeedProductId);
    if (!selectedFeedProductId || feedProductId <= 0) {
      toast.error("Please select a feed product");
      return;
    }

    // Check if user selected the same feed
    if (
      typeof currentFeedProductId === "number" &&
      feedProductId === currentFeedProductId
    ) {
      toast.error("Please select a different feed product");
      return;
    }

    // Close first dialog and open confirmation dialog
    setIsChangeFeedOpen(false);
    setIsConfirmationOpen(true);
  };

  const handleFinalConfirmation = () => {
    const feedProductId = parseInt(selectedFeedProductId);
    const currentAnimalQuantity = activeFeedProgram?.data?.animal_quantity || 1;

    createFeedProgramMutation.mutate({
      farmer_user_profile_id: farmerUserProfileId,
      feed_product_id: feedProductId,
      animal_quantity: currentAnimalQuantity,
    });
  };

  const handleCancelChange = () => {
    setIsChangeFeedOpen(false);
    setIsConfirmationOpen(false);
    setSelectedFeedProductId("");
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
                  Days on Feed
                </p>
                <p className="text-sm font-medium font-display">
                  {feedInfo?.days_on_feed
                    ? `${feedInfo.days_on_feed} days`
                    : "—"}
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

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 font-medium text-xs text-muted-foreground"
              onClick={() => setIsDetailsOpen(true)}
            >
              View Details
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 font-medium text-xs"
              onClick={handleChangeFeed}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Change Feed
            </Button>
          </div>
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
                  <p className="text-xs text-green-600 font-medium">
                    Program ID
                  </p>
                  <p className="text-sm font-display font-medium text-green-700">
                    #{feedInfo?.feed_program_id || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-green-600 font-medium">
                    Program Status
                  </p>
                  <p className="text-sm font-display font-medium text-green-700 capitalize">
                    {feedInfo?.status || "—"}
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

      {/* Change Feed Dialog */}
      <AlertDialog open={isChangeFeedOpen} onOpenChange={setIsChangeFeedOpen}>
        <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Change Your Current Feed
            </AlertDialogTitle>
            <AlertDialogDescription>
              Select a new feed product for your animals. This will create a new
              feed program and replace your current one.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            {/* Age Range Warning */}
            {getAgeRangeWarning() && (
              <div className="flex items-start gap-3 p-3 border border-amber-200 bg-amber-50 rounded-md">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 mb-1">
                    Feed Usage Alert
                  </p>
                  <p className="text-sm text-amber-700">
                    {getAgeRangeWarning()}
                  </p>
                </div>
              </div>
            )}

            {/* Current Feed Info */}
            <div className="p-4 border rounded-md bg-muted/50">
              <h4 className="font-medium text-sm mb-2">Current Feed</h4>
              <div className="flex items-center gap-3">
                <Wheat className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {feedInfo?.feed_name}
                </span>
                <Badge
                  variant="outline"
                  className={`${feedStageColorClass} font-medium capitalize text-xs`}
                >
                  {getFeedStageDisplay(feedInfo?.feed_stage)}
                </Badge>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  Days on feed: {feedInfo?.days_on_feed || 0} days
                </p>
                <p className="text-xs text-muted-foreground">
                  {activeFeedProgram?.data?.animal_quantity || 0} animals
                </p>
              </div>
            </div>

            {/* Feed Product Selector */}
            <div>
              <FeedProductSelector
                value={selectedFeedProductId}
                onValueChange={setSelectedFeedProductId}
                // Custom prop to disable current feed
                disabledProductId={currentFeedProductId}
              />
            </div>

            {/* Warning about changing feed */}
            <div className="p-3 border border-blue-200 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Changing your feed will create a new feed
                program. Make sure to transition your animals properly when
                switching feeds.
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelChange}
              disabled={createFeedProgramMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInitialConfirm}
              disabled={
                !selectedFeedProductId ||
                (typeof currentFeedProductId === "number" &&
                  parseInt(selectedFeedProductId) === currentFeedProductId)
              }
            >
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Final Confirmation Dialog */}
      <AlertDialog
        open={isConfirmationOpen}
        onOpenChange={setIsConfirmationOpen}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Confirm Feed Change
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change your feed? This action will:
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground flex-shrink-0 mt-2"></span>
                Complete your current feed program
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground flex-shrink-0 mt-2"></span>
                Create a new feed program with the selected feed
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground flex-shrink-0 mt-2"></span>
                Reset your days on feed counter
              </li>
            </ul>

            {/* Selected Feed Preview */}
            {selectedFeedProductId && (
              <div className="p-3 border rounded-md bg-blue-50 border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  New Feed Selected
                </p>
                <p className="text-sm text-blue-700">
                  Feed Product ID: {selectedFeedProductId}
                </p>
                <p className="text-sm text-blue-700">
                  Animal Count: {activeFeedProgram?.data?.animal_quantity || 1}{" "}
                  animals
                </p>
              </div>
            )}

            {/* Age Range Warning in confirmation */}
            {getAgeRangeWarning() && (
              <div className="p-3 border border-amber-200 bg-amber-50 rounded-md">
                <p className="text-xs font-medium text-amber-800 mb-1">
                  Current Feed Usage Alert
                </p>
                <p className="text-xs text-amber-700">{getAgeRangeWarning()}</p>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirmationOpen(false);
                setIsChangeFeedOpen(true); // Go back to feed selection
              }}
              disabled={createFeedProgramMutation.isPending}
            >
              Go Back
            </Button>
            <Button
              onClick={handleFinalConfirmation}
              disabled={createFeedProgramMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {createFeedProgramMutation.isPending
                ? "Changing Feed..."
                : "Yes, Change Feed"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ExpandableCard>
  );
};
