import { ArrowRightIcon, CheckCircle, Package, Wheat } from "lucide-react";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  farmerV2Keys,
  useActiveFeedProduct,
  useActiveFeedProgram,
  useCreateFeedProgram,
} from "@/hooks/use-farmer-v2";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FeedProductSelector } from "../feed-product-selector";

interface FeedProgramOnboardingProps {
  farmerUserProfileId: number;
}

export const FeedProgramManager: React.FC<FeedProgramOnboardingProps> = ({
  farmerUserProfileId,
}) => {
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const [selectedFeedProductId, setSelectedFeedProductId] =
    useState<string>("");
  const [animalQuantity, setAnimalQuantity] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  // Queries
  const { data: activeFeedProgram, isLoading: loadingFeedProgram } =
    useActiveFeedProgram(farmerUserProfileId);
  const { data: activeFeedProduct, isLoading: loadingFeedProduct } =
    useActiveFeedProduct(farmerUserProfileId);

  // Mutations
  const createFeedProgramMutation = useCreateFeedProgram({
    onSuccess: () => {
      toast.success(
        "Feed program created successfully! Welcome to your farm management journey!",
      );
      setIsOpen(false);
      setStep(1);
      setSelectedFeedProductId("");
      setAnimalQuantity("");

      // Invalidate and refetch active feed program for this farmer
      queryClient.invalidateQueries({
        queryKey: farmerV2Keys.activeFeedProgram(farmerUserProfileId),
      });
      queryClient.invalidateQueries({
        queryKey: farmerV2Keys.activeFeedProduct(farmerUserProfileId),
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create feed program");
    },
  });

  // Check if user needs onboarding
  // User needs onboarding if:
  // 1. Not currently loading feed program or feed product data
  // 2. No active feed program exists (from farmer_v2 API)
  // 3. No active feed product exists (from farmer_v2 API)
  const needsOnboarding =
    !loadingFeedProgram &&
    !loadingFeedProduct &&
    !activeFeedProgram?.data &&
    !activeFeedProduct?.data;

  // Auto-open dialog when user needs onboarding
  useEffect(() => {
    if (needsOnboarding) {
      setIsOpen(true);
    }
  }, [needsOnboarding]);

  const stepContent = [
    {
      title: "Welcome to Your Farm Dashboard",
      description:
        "Let's get you started with your first feed program to optimize your farm operations.",
      icon: <Wheat className="h-12 w-12 text-green-600" />,
    },
    {
      title: "Choose Your Feed Product",
      description:
        "Select the right feed product for your animals to ensure optimal growth and health.",
      icon: <Package className="h-12 w-12 text-blue-600" />,
    },
    {
      title: "How Many Animals?",
      description:
        "Tell us how many animals you'll be feeding to help us calculate the right amount of feed.",
      icon: <CheckCircle className="h-12 w-12 text-orange-600" />,
    },
    {
      title: "Complete Your Setup",
      description:
        "Finalize your feed program setup and start tracking your farm's performance.",
      icon: <CheckCircle className="h-12 w-12 text-purple-600" />,
    },
  ];

  const totalSteps = stepContent.length;

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleCreateFeedProgram = () => {
    const feedProductId = parseInt(selectedFeedProductId);
    const animalCount = parseInt(animalQuantity);

    if (!selectedFeedProductId || feedProductId <= 0) {
      toast.error("Please select a feed product");
      return;
    }

    if (!animalQuantity || animalCount <= 0) {
      toast.error("Please enter a valid number of animals");
      return;
    }

    createFeedProgramMutation.mutate({
      farmer_user_profile_id: farmerUserProfileId,
      feed_product_id: feedProductId,
      animal_quantity: animalCount,
    });
  };

  // Don't render anything if user already has an active feed program
  if (!needsOnboarding) {
    return null;
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        // Prevent closing if user doesn't have feed program (persistent onboarding)
        if (!open && needsOnboarding) {
          return;
        }
        setIsOpen(open);
        if (open) {
          setStep(1);
          setSelectedFeedProductId("");
          setAnimalQuantity("");
        }
      }}
    >
      <AlertDialogContent className="gap-0 p-0 max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 text-center">
          <div className="mb-6 flex justify-center">
            {stepContent[step - 1].icon}
          </div>

          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">
              {stepContent[step - 1].title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-2">
              {stepContent[step - 1].description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Feed Product Selection on Step 2 */}
          {step === 2 && (
            <div className="mt-6 text-left">
              <FeedProductSelector
                value={selectedFeedProductId}
                onValueChange={setSelectedFeedProductId}
              />
            </div>
          )}

          {/* Animal Quantity Input on Step 3 */}
          {step === 3 && (
            <div className="mt-6 space-y-4">
              <div className="text-left">
                <label
                  htmlFor="animalQuantity"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Number of Animals
                </label>
                <input
                  id="animalQuantity"
                  type="number"
                  min="1"
                  max="10000"
                  value={animalQuantity}
                  onChange={(e) => setAnimalQuantity(e.target.value)}
                  placeholder="Enter number of animals (e.g., 100)"
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This helps us calculate the right amount of feed for your
                  animals
                </p>
              </div>
            </div>
          )}

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2 mt-8 mb-6">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  index + 1 === step
                    ? "bg-primary"
                    : index + 1 < step
                      ? "bg-primary/60"
                      : "bg-primary/20",
                )}
              />
            ))}
          </div>

          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            {step < totalSteps ? (
              <Button
                className="group w-full sm:w-auto"
                type="button"
                onClick={handleContinue}
                disabled={
                  (step === 2 && !selectedFeedProductId) ||
                  (step === 3 &&
                    (!animalQuantity || parseInt(animalQuantity) <= 0))
                }
              >
                {step === 2
                  ? "Continue with Selected Feed"
                  : step === 3
                    ? "Continue with Animal Count"
                    : "Next"}
                <ArrowRightIcon
                  className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                  size={16}
                  aria-hidden="true"
                />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleCreateFeedProgram}
                disabled={
                  createFeedProgramMutation.isPending ||
                  !selectedFeedProductId ||
                  !animalQuantity ||
                  parseInt(animalQuantity) <= 0
                }
                className="w-full sm:w-auto"
              >
                {createFeedProgramMutation.isPending
                  ? "Creating Program..."
                  : "Start My Farm Journey"}
              </Button>
            )}
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
