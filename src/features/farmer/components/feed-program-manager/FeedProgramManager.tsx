import {
  AlertCircle,
  CheckCircle,
  Plus,
  Settings,
  XCircle,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useActiveFeedProduct,
  useActiveFeedProgram,
  useCompleteFeedProgram,
  useCreateFeedProgram,
  useIncompleteFeedProgram,
} from "@/hooks/use-farmer-v2";
import { toast } from "sonner";

interface FeedProgramManagerProps {
  farmerUserProfileId: number;
}

export const FeedProgramManager: React.FC<FeedProgramManagerProps> = ({
  farmerUserProfileId,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [feedProductId, setFeedProductId] = useState<number>(1);

  // Queries
  const {
    data: activeFeedProgram,
    isLoading: loadingFeedProgram,
    error: feedProgramError,
  } = useActiveFeedProgram(farmerUserProfileId);

  const { data: activeFeedProduct } = useActiveFeedProduct(farmerUserProfileId);

  // Mutations
  const createFeedProgramMutation = useCreateFeedProgram({
    onSuccess: () => {
      toast.success("Feed program created successfully!");
      setIsCreateDialogOpen(false);
      setFeedProductId(1);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create feed program");
    },
  });

  const completeFeedProgramMutation = useCompleteFeedProgram({
    onSuccess: () => {
      toast.success("Feed program completed successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to complete feed program");
    },
  });

  const incompleteFeedProgramMutation = useIncompleteFeedProgram({
    onSuccess: () => {
      toast.success("Feed program marked as incomplete");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update feed program");
    },
  });

  const handleCreateFeedProgram = () => {
    if (feedProductId <= 0) {
      toast.error("Please enter a valid feed product ID");
      return;
    }

    createFeedProgramMutation.mutate({
      farmer_user_profile_id: farmerUserProfileId,
      feed_product_id: feedProductId,
    });
  };

  const handleCompleteFeedProgram = () => {
    completeFeedProgramMutation.mutate(farmerUserProfileId);
  };

  const handleIncompleteFeedProgram = () => {
    incompleteFeedProgramMutation.mutate(farmerUserProfileId);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "incomplete":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Incomplete
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <XCircle className="h-3 w-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading state
  if (loadingFeedProgram) {
    return (
      <ExpandableCard
        title="Feed Program Manager"
        summary={
          <div className="flex items-center gap-2 text-muted-foreground">
            <Settings className="h-4 w-4" />
            <span className="text-sm">Loading feed program...</span>
          </div>
        }
        className="h-fit"
      >
        <div className="space-y-4">
          <div className="rounded-lg p-4 border">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">Loading feed program information...</p>
            </div>
          </div>
        </div>
      </ExpandableCard>
    );
  }

  // Error state
  if (feedProgramError) {
    return (
      <ExpandableCard
        title="Feed Program Manager"
        summary={
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="h-4 w-4" />
            <span className="text-sm">Error loading feed program</span>
          </div>
        }
        className="h-fit"
      >
        <div className="space-y-4">
          <div className="rounded-lg p-4 border border-red-200 bg-red-50">
            <div className="text-center text-red-700">
              <p className="text-sm">{feedProgramError.message}</p>
            </div>
          </div>
        </div>
      </ExpandableCard>
    );
  }

  const feedProgram = activeFeedProgram?.feed_program;
  const feedProduct = activeFeedProduct?.feed_product;

  // Summary content
  const summaryContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-foreground">
            {feedProgram ? "Active Program" : "No Active Program"}
          </span>
        </div>
        {feedProgram && getStatusBadge(feedProgram.status)}
      </div>
      <div className="flex items-center gap-2">
        {feedProgram ? (
          <>
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">
              ID: {feedProgram.id}
            </span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-xs text-muted-foreground">
              Ready to create
            </span>
          </>
        )}
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="Feed Program Manager"
      summary={summaryContent}
      className="h-fit"
    >
      <div className="space-y-4">
        {feedProgram ? (
          // Active Feed Program Display
          <div className="rounded-lg p-4 border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-display font-medium text-foreground">
                  Feed Program #{feedProgram.id}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {feedProduct
                    ? feedProduct.name
                    : `Product ID: ${feedProgram.feed_product_id}`}
                </p>
              </div>
              {getStatusBadge(feedProgram.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Created
                </p>
                <p className="text-sm font-medium font-display">
                  {formatDate(feedProgram.created_at)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Last Updated
                </p>
                <p className="text-sm font-medium font-display">
                  {formatDate(feedProgram.updated_at)}
                </p>
              </div>
            </div>

            {feedProduct && (
              <div className="bg-background/50 rounded-md p-3 border mb-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium">
                  Feed Product Details
                </p>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {feedProduct.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Category: {feedProduct.category} • Price: $
                    {feedProduct.price}
                  </p>
                  {feedProduct.description && (
                    <p className="text-xs text-muted-foreground">
                      {feedProduct.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {feedProgram.status === "active" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCompleteFeedProgram}
                    disabled={completeFeedProgramMutation.isPending}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {completeFeedProgramMutation.isPending
                      ? "Completing..."
                      : "Complete"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleIncompleteFeedProgram}
                    disabled={incompleteFeedProgramMutation.isPending}
                    className="flex-1"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {incompleteFeedProgramMutation.isPending
                      ? "Updating..."
                      : "Mark Incomplete"}
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          // No Active Program - Create New
          <div className="rounded-lg p-4 border border-dashed">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-display font-medium text-foreground">
                  No Active Feed Program
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create a new feed program to get started
                </p>
              </div>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                size="sm"
                className="mt-3"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Feed Program
              </Button>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        {feedProgram && (
          <div
            className={`flex items-center justify-between p-3 -mx-4 border-t border-b ${
              feedProgram.status === "active"
                ? "bg-green-100 border-green-500"
                : feedProgram.status === "completed"
                  ? "bg-blue-100 border-blue-500"
                  : "bg-yellow-100 border-yellow-500"
            }`}
          >
            <p
              className={`text-base font-display font-medium ${
                feedProgram.status === "active"
                  ? "text-green-500"
                  : feedProgram.status === "completed"
                    ? "text-blue-500"
                    : "text-yellow-500"
              }`}
            >
              {feedProgram.status === "active" && "Active Feed Program"}
              {feedProgram.status === "completed" && "Completed Program"}
              {feedProgram.status === "incomplete" && "Incomplete Program"}
            </p>
            <span className="text-sm text-muted-foreground">
              Program #{feedProgram.id}
            </span>
          </div>
        )}
      </div>

      {/* Create Feed Program Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Feed Program</DialogTitle>
            <DialogDescription>
              Create a new feed program for farmer profile #
              {farmerUserProfileId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="feedProductId">Feed Product ID</Label>
              <Input
                id="feedProductId"
                type="number"
                value={feedProductId}
                onChange={(e) => setFeedProductId(Number(e.target.value))}
                placeholder="Enter feed product ID"
                min="1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the ID of the feed product to use for this program
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={createFeedProgramMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFeedProgram}
                disabled={
                  createFeedProgramMutation.isPending || feedProductId <= 0
                }
              >
                {createFeedProgramMutation.isPending
                  ? "Creating..."
                  : "Create Program"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ExpandableCard>
  );
};
