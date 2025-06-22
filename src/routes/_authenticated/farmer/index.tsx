import { createFileRoute } from "@tanstack/react-router";

import {
  CurrentFeedInUse,
  FeedUsageCalculator,
  GrowthPerformanceLog,
} from "@/features/farmer/components";
import { HealthWatchSummary } from "@/features/farmer/components/health-watch-summary";

export const Route = createFileRoute("/_authenticated/farmer/")({
  component: FarmerDashboard,
});

function FarmerDashboard() {
  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-display font-semibold text-foreground mb-1 tracking-tight">
          Farmer Dashboard
        </h1>
        <p className="text-muted-foreground font-sans text-sm">
          Monitor your farm operations and feed management
        </p>
      </div>

      <div className="space-y-6 flex-1 min-h-0 h-full overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="lg:col-span-2 xl:col-span-2 h-fit gap-6 grid grid-cols-1 lg:grid-cols-2">
            <div className="lg:col-span-2 xl:col-span-2">
              <CurrentFeedInUse />
            </div>
            <div className="lg:col-span-2 xl:col-span-2">
              <GrowthPerformanceLog />
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <FeedUsageCalculator />
            <HealthWatchSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
