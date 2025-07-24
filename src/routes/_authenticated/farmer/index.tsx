import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFarmerDashboard } from "@/hooks";
import { useUserStore } from "@/store/user-store";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";

import {
  CurrentFeedInUse,
  FeedIntakeBehavior,
  FeedUsageCalculator,
  GrowthPerformanceLog,
} from "@/features/farmer/components";
import { HealthWatchSummary } from "@/features/farmer/components/health-watch-summary";

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
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading data...
            </div>
          )}

          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* API Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data: {error.message}
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="ml-4"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* API Data Display */}
      {dashboardData && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Field IQ API Data</CardTitle>
            <CardDescription>
              Live data from Python backend (Profile ID:{" "}
              {dashboardData.farmer_user_profile_id})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-32 border">
              {JSON.stringify(dashboardData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

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
