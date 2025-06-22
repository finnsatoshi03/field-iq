import React from "react";
import { Plus, MapPin } from "lucide-react";
import type { Farm } from "../constants";
import { formatDateTime } from "../utils";

interface FarmItemProps {
  farm: Farm;
  index: number;
  showConnector: boolean;
  isDialog?: boolean;
}

const FarmItem: React.FC<FarmItemProps> = ({ farm, showConnector }) => {
  const { dateString, timeString } = formatDateTime(farm.datetime);

  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center mr-3 relative">
        <div className="size-8 rounded-full flex-shrink-0 z-10 flex items-center justify-center bg-white">
          {farm.status === "added" ? (
            <Plus className="size-4 text-blue-600 dark:text-blue-400" />
          ) : (
            <MapPin className="size-4 text-emerald-600 dark:text-emerald-400" />
          )}
        </div>
        {showConnector && (
          <div className="w-px h-8 bg-border absolute top-6 left-1/2 transform -translate-x-1/2" />
        )}
      </div>
      <div className="flex items-center justify-between min-w-0 flex-1 py-2">
        <div className="flex flex-col flex-shrink-0">
          <span className="text-xs font-medium text-foreground font-sans">
            {dateString}
          </span>
          <span className="text-xs text-muted-foreground font-sans">
            {timeString}
          </span>
        </div>
        <div className="flex flex-col min-w-0 ml-4 text-right items-end">
          <span className="font-medium text-foreground font-sans leading-none text-sm truncate">
            {farm.name}
          </span>
          <span className="text-muted-foreground font-sans text-xs">
            {farm.location}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FarmItem;
