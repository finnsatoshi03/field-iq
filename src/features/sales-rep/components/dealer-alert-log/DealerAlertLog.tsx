import React from "react";
import { Plus, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertItem, FarmItem, MoreButton } from "./components";
import { mockAlerts, mockFarms } from "./constants";
import { getAddedFarmsCount, getVisitedFarmsCount } from "./utils";

const DealerAlertLog: React.FC = () => {
  const visibleAlerts = mockAlerts.slice(0, 3);
  const remainingAlerts = mockAlerts.slice(3);
  const visibleFarms = mockFarms.slice(0, 3);
  const remainingFarms = mockFarms.slice(3);

  return (
    <div className="bg-card rounded-lg border border-border pt-4 space-y-6">
      <div className="px-4">
        <h3 className="text-foreground font-display font-medium text-base tracking-tight">
          Dealer Alert Log
        </h3>
      </div>

      <div className="space-y-3 px-4">
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
                {mockAlerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="px-4 bg-muted/20 py-4 space-y-4">
        <div className="flex items-end justify-between">
          <h4 className="text-foreground font-display font-medium text-sm tracking-tight">
            New Accounts - Farms Added + Visited
          </h4>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Plus className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <span className="text-muted-foreground font-sans">Added</span>
              <span className="font-medium text-foreground font-sans">
                {getAddedFarmsCount(mockFarms)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span className="text-muted-foreground font-sans">Visited</span>
              <span className="font-medium text-foreground font-sans">
                {getVisitedFarmsCount(mockFarms)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-0">
          {visibleFarms.map((farm, index) => (
            <FarmItem
              key={index}
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
                  {mockFarms.map((farm, index) => (
                    <FarmItem
                      key={index}
                      farm={farm}
                      index={index}
                      showConnector={index < mockFarms.length - 1}
                      isDialog={true}
                    />
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealerAlertLog;
