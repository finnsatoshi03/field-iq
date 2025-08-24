import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user-store";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";

import {
  CurrentFeedInUse,
  FeedIntakeBehavior,
  FeedProgramManager,
  FeedUsageCalculator,
  GrowthPerformanceLog,
} from "@/features/farmer/components";
import { HealthWatchSummary } from "@/features/farmer/components/health-watch-summary";

export const Route = createFileRoute("/_authenticated/farmer/")({
  component: FarmerDashboard,
});

function FarmerDashboard() {
  const { user } = useUserStore();

  const farmerUserProfileId = user?.profileId || 0;

  const handleRefresh = () => {
    // Refresh will be handled by individual components via React Query
    window.location.reload();
  };

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
              <CurrentFeedInUse farmerUserProfileId={farmerUserProfileId} />
              <GrowthPerformanceLog farmerUserProfileId={farmerUserProfileId} />
            </div>
            <div className="lg:col-span-2 xl:col-span-2">
              <FeedIntakeBehavior />
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <FeedUsageCalculator farmerUserProfileId={farmerUserProfileId} />
            <HealthWatchSummary />
          </div>
        </div>
      </div>

      {/* Persistent Onboarding Overlay */}
      <FeedProgramManager farmerUserProfileId={farmerUserProfileId} />
    </div>
  );
}
