import { Button } from "@/components/ui/button";
import { useFarmerDashboard } from "@/hooks";
import { useUserStore } from "@/store/user-store";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";

import { Error } from "@/features/error";
import {
  CurrentFeedInUse,
  FeedIntakeBehavior,
  FeedUsageCalculator,
  GrowthPerformanceLog,
} from "@/features/farmer/components";
import { HealthWatchSummary } from "@/features/farmer/components/health-watch-summary";
import { LoadingSpinner } from "@/features/loader/components/LoadingSpinner";

export const Route = createFileRoute("/_authenticated/farmer/")({
  component: FarmerDashboard,
});

function FarmerDashboard() {
  const { user } = useUserStore();

  const farmerUserProfileId = 3;

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useFarmerDashboard(farmerUserProfileId);

  const handleRefresh = () => {
    refetch();
  };

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show error state
  if (error) {
    return (
      <Error
        title="Failed to load dashboard"
        message={
          error.message ||
          "We couldn't load your farmer dashboard. Please try again."
        }
        action={{
          label: "Try Again",
          onClick: handleRefresh,
          icon: <RefreshCw className="h-4 w-4" />,
        }}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-foreground mb-1 tracking-tight">
            Farmer Dashboard
          </h1>
          <p className="text-muted-foreground font-sans text-sm">
            Monitor your farm operations and feed management
            {user && (
              <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                ID: {farmerUserProfileId}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-6 flex-1 min-h-0 h-full overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="lg:col-span-2 xl:col-span-2 h-fit gap-6 grid grid-cols-1 lg:grid-cols-2">
            <div className="grid lg:grid-cols-2 gap-6 lg:col-span-2 xl:col-span-2">
              <CurrentFeedInUse dashboardData={dashboardData} />
              <GrowthPerformanceLog dashboardData={dashboardData} />
            </div>
            <div className="lg:col-span-2 xl:col-span-2">
              <FeedIntakeBehavior dashboardData={dashboardData} />
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <FeedUsageCalculator dashboardData={dashboardData} />
            <HealthWatchSummary dashboardData={dashboardData} />
          </div>
        </div>
      </div>
    </div>
  );
}
