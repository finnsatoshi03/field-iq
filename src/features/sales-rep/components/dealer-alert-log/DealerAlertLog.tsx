import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ExpandableCard from "@/components/ui/expandable-card";
import { cn } from "@/lib/utils";
import { AlertTriangle, Loader2, MapPin, Plus } from "lucide-react";
import React from "react";
import { AlertItem, FarmItem, MoreButton } from "./components";
import { useFarms, useSalesRepLogs } from "./hooks";
import {
  getAddedFarmsCount,
  getVisitedFarmsCount,
  processFarmsData,
  processLogsData,
} from "./utils";

interface DealerAlertLogProps {
  className?: string;
  userId: number;
}

const DealerAlertLog: React.FC<DealerAlertLogProps> = ({
  className,
  userId,
}) => {
  // Fetch data using our hooks
  const {
    data: logsData,
    isLoading: logsLoading,
    error: logsError,
    refetch: refetchLogs,
  } = useSalesRepLogs(userId);

  const {
    data: farmsData,
    isLoading: farmsLoading,
    error: farmsError,
    refetch: refetchFarms,
  } = useFarms(userId);

  // Process the data
  const alerts = logsData ? processLogsData(logsData.data.data) : [];
  const farms = farmsData ? processFarmsData(farmsData.data.farms) : [];

  // Loading state
  if (logsLoading || farmsLoading) {
    const summaryContent = (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading data...</span>
      </div>
    );

    return (
      <ExpandableCard
        title="Sales Rep Alert Log"
        summary={summaryContent}
        className={cn("sm:h-fit", className)}
      >
        <div className="h-32 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading sales rep data...</p>
          </div>
        </div>
      </ExpandableCard>
    );
  }

  // Error state
  if (logsError || farmsError) {
    const summaryContent = (
      <div className="flex items-center gap-2 text-muted-foreground">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm">Error loading data</span>
      </div>
    );

    return (
      <ExpandableCard
        title="Sales Rep Alert Log"
        summary={summaryContent}
        className={cn("sm:h-fit", className)}
      >
        <div className="h-32 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-sm mb-2">
              Failed to load data: {logsError?.message || farmsError?.message}
            </p>
            <button
              onClick={() => {
                refetchLogs();
                refetchFarms();
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </ExpandableCard>
    );
  }

  const visibleAlerts = alerts.slice(0, 3);
  const remainingAlerts = alerts.slice(3);
  const visibleFarms = farms.slice(0, 3);
  const remainingFarms = farms.slice(3);

  // Summary content - show alert count and farm stats
  const summaryContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {alerts.length} alert{alerts.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Plus className="h-3 w-3 text-blue-600 dark:text-blue-400" />
          <span className="text-xs text-muted-foreground">
            {getAddedFarmsCount(farms)} added
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs text-muted-foreground">
            {getVisitedFarmsCount(farms)} visited
          </span>
        </div>
      </div>
      {alerts.length > 0 && (
        <Badge variant="outline" className="text-xs">
          {visibleAlerts.length} shown
        </Badge>
      )}
    </div>
  );

  // Full content
  const fullContent = (
    <div className="space-y-6">
      <div className="space-y-3">
        {visibleAlerts.length > 0 ? (
          <>
            {visibleAlerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}

            {remainingAlerts.length > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <div>
                    <MoreButton count={remainingAlerts.length} />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>All Alerts</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 mt-4">
                    {alerts.map((alert) => (
                      <AlertItem key={alert.id} alert={alert} />
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">No alerts found</p>
          </div>
        )}
      </div>

      <div className="bg-muted/20 pt-4 space-y-4 -mx-4 px-4">
        <div className="flex flex-col gap-1">
          <h4 className="text-foreground font-display font-medium text-sm tracking-tight">
            New Accounts - Farms Added + Visited
          </h4>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Plus className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <span className="text-muted-foreground font-sans">Added</span>
              <span className="font-medium text-foreground font-sans">
                {getAddedFarmsCount(farms)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span className="text-muted-foreground font-sans">Visited</span>
              <span className="font-medium text-foreground font-sans">
                {getVisitedFarmsCount(farms)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-0">
          {visibleFarms.length > 0 ? (
            <>
              {visibleFarms.map((farm, index) => (
                <FarmItem
                  key={`${farm.name}-${index}`}
                  farm={farm}
                  index={index}
                  showConnector={index < visibleFarms.length - 1}
                />
              ))}

              {remainingFarms.length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex items-center mt-2">
                      <div className="flex flex-col items-center mr-3 relative">
                        <div className="size-8 rounded-full flex-shrink-0 z-10 flex items-center justify-center border-2 border-dashed border-muted-foreground/30 bg-background">
                          <Plus className="size-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="flex-1 py-2">
                        <span className="text-sm text-muted-foreground font-sans">
                          +{remainingFarms.length} more farms
                        </span>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>All Farms - Added + Visited</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-0 mt-4">
                      {farms.map((farm, index) => (
                        <FarmItem
                          key={`${farm.name}-${index}`}
                          farm={farm}
                          index={index}
                          showConnector={index < farms.length - 1}
                          isDialog={true}
                        />
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No farms found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="Dealer Alert Log"
      summary={summaryContent}
      className={cn("sm:h-fit", className)}
    >
      {fullContent}
    </ExpandableCard>
  );
};

export default DealerAlertLog;
