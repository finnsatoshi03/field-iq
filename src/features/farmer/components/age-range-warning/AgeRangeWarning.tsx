import { AlertTriangle, RotateCcw, Wheat } from "lucide-react";
import { useEffect, useState } from "react";

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

interface AgeRangeWarningProps {
  farmerUserProfileId: number;
}

export const AgeRangeWarning: React.FC<AgeRangeWarningProps> = ({
  farmerUserProfileId,
}) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isChangeFeedOpen, setIsChangeFeedOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedFeedProductId, setSelectedFeedProductId] =
    useState<string>("");
  const [switchReason, setSwitchReason] = useState<string>("");

  // Fetch farmer_v2 data
  const { data: activeFeedProduct } = useActiveFeedProduct(farmerUserProfileId);
  const { data: activeFeedProgram } = useActiveFeedProgram(farmerUserProfileId);

  // Feed change mutation
  const createFeedProgramMutation = useCreateFeedProgram({
    onSuccess: () => {
      toast.success("Feed changed successfully!");
      setIsChangeFeedOpen(false);
      setIsConfirmationOpen(false);
      setSelectedFeedProductId("");
      setSwitchReason("");

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

    if (feedInfo.days_on_feed >= feedInfo.age_range_end) {
      return `You have been using this feed for ${feedInfo.days_on_feed} days, which exceeds the recommended age range of ${feedInfo.age_range_end} days.`;
    }

    return null;
  };

  // Check if user needs onboarding (has age range warning)
  const needsWarning = getAgeRangeWarning();

  // Auto-open dialog when user needs warning
  useEffect(() => {
    if (needsWarning) {
      setIsOpen(true);
    }
  }, [needsWarning]);

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

    if (!switchReason.trim()) {
      toast.error("Please provide a reason for switching feeds");
      return;
    }

    createFeedProgramMutation.mutate({
      farmer_user_profile_id: farmerUserProfileId,
      feed_product_id: feedProductId,
      animal_quantity: currentAnimalQuantity,
      switch_reason: switchReason.trim(),
    });
  };

  const handleCancelChange = () => {
    setIsChangeFeedOpen(false);
    setIsConfirmationOpen(false);
    setSelectedFeedProductId("");
    setSwitchReason("");
  };

  const feedStageColorClass = feedInfo?.feed_stage
    ? FEED_STAGE_COLORS[feedInfo.feed_stage] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    : "bg-gray-100 text-gray-800 border-gray-200";

  // Don't render anything if user doesn't need warning
  if (!needsWarning) {
    return null;
  }

  return (
    <>
      {/* Main Age Range Warning Dialog */}
      <AlertDialog
        open={isOpen}
        onOpenChange={(open) => {
          // Prevent closing if user still has age range warning (persistent warning)
          if (!open && needsWarning) {
            return;
          }
          setIsOpen(open);
          if (open) {
            setSelectedFeedProductId("");
            setSwitchReason("");
          }
        }}
      >
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Feed Usage Alert
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {getAgeRangeWarning()}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            {/* Current Feed Info */}
            <div className="p-4 border rounded-md bg-red-50 border-red-200">
              <h4 className="font-medium text-sm mb-2 text-red-800">
                Current Feed
              </h4>
              <div className="flex items-center gap-3">
                <Wheat className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  {feedInfo?.feed_name}
                </span>
                <Badge
                  variant="outline"
                  className={`${feedStageColorClass} font-medium capitalize text-xs`}
                >
                  {getFeedStageDisplay(feedInfo?.feed_stage)}
                </Badge>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-red-600">
                  Days on feed:{" "}
                  <strong>{feedInfo?.days_on_feed || 0} days</strong>
                </p>
                <p className="text-xs text-red-600">
                  Recommended:{" "}
                  <strong>{feedInfo?.age_range_end || 0} days</strong>
                </p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="p-3 border border-red-200 bg-red-50 rounded-md">
              <p className="text-sm text-red-700">
                <strong>Important:</strong> Using this feed beyond the
                recommended age range may affect your animals' growth, health,
                and feed efficiency. Consider upgrading to the next stage feed
                or switching to a more appropriate feed product.
              </p>
            </div>
          </div>

          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setIsOpen(false)}
            >
              Acknowledge & Continue
            </Button>
            <Button
              onClick={handleChangeFeed}
              className="bg-red-600 hover:bg-red-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Change Feed
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

            {/* Switch Reason Input */}
            <div className="space-y-2">
              <label
                htmlFor="switchReason"
                className="block text-sm font-medium text-foreground"
              >
                Reason for Feed Change <span className="text-red-500">*</span>
              </label>
              <textarea
                id="switchReason"
                value={switchReason}
                onChange={(e) => setSwitchReason(e.target.value)}
                placeholder="Please explain why you're changing to this feed (e.g., better FCR, recommendation from nutritionist, cost optimization, etc.)"
                className="w-full min-h-20 p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                This information helps us track feed performance and provide
                better recommendations.
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirmationOpen(false);
                setIsChangeFeedOpen(true); // Go back to feed selection
                setSwitchReason(""); // Reset switch reason
              }}
              disabled={createFeedProgramMutation.isPending}
            >
              Go Back
            </Button>
            <Button
              onClick={handleFinalConfirmation}
              disabled={
                createFeedProgramMutation.isPending || !switchReason.trim()
              }
              className="bg-red-600 hover:bg-red-700"
            >
              {createFeedProgramMutation.isPending
                ? "Changing Feed..."
                : "Yes, Change Feed"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
