import React from "react";
import { Navigation, MoreHorizontal, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { type Visit } from "../constants";
import {
  openGoogleMapsDirections,
  getDirectionsOptions,
  hasGpsCoordinates,
} from "../utils";
import { cn } from "@/lib/utils";
import DirectionsModal from "./DirectionsModal";

interface DirectionsButtonProps {
  visit: Visit;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  showLabel?: boolean;
  showModal?: boolean;
  className?: string;
}

const DirectionsButton: React.FC<DirectionsButtonProps> = ({
  visit,
  variant = "outline",
  size = "sm",
  showLabel = false,
  showModal = false,
  className,
}) => {
  const directionsOptions = getDirectionsOptions();
  const hasCoordinates = hasGpsCoordinates(visit);

  const handleQuickDirections = () => {
    // Default to Google Maps for quick access
    openGoogleMapsDirections(visit);
  };

  const handleDirectionOption = (option: any) => {
    option.action(visit);
  };

  if (!hasCoordinates && !visit.location) {
    return null; // Don't show button if no location data
  }

  if (showModal) {
    return (
      <DirectionsModal visit={visit}>
        <Button
          variant={variant}
          size={size}
          className={cn("flex items-center gap-1", className)}
          title={`Get directions to ${visit.farmName}`}
        >
          <Map className="h-3 w-3" />
          {showLabel && <span className="text-xs">Detailed Directions</span>}
        </Button>
      </DirectionsModal>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Quick Direction Button */}
      <Button
        variant={variant}
        size={size}
        onClick={handleQuickDirections}
        className={cn("flex items-center gap-1", !showLabel && "px-2")}
        title={`Get directions to ${visit.farmName}`}
      >
        <Navigation className="h-3 w-3" />
        {showLabel && <span className="text-xs">Directions</span>}
      </Button>

      {/* More Options Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className="px-2"
            title="More direction options"
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Open directions in:
          </div>
          <DropdownMenuSeparator />

          {directionsOptions.map((option) => (
            <DropdownMenuItem
              key={option.id}
              onClick={() => handleDirectionOption(option)}
              className="flex items-center gap-2 cursor-pointer"
              disabled={
                !hasCoordinates &&
                (option.id === "waze" || option.id === "mapbox")
              }
            >
              <span className="text-sm">{option.icon}</span>
              <span className="text-xs">{option.name}</span>
              {!hasCoordinates &&
                (option.id === "waze" || option.id === "mapbox") && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    GPS req.
                  </span>
                )}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DirectionsModal visit={visit}>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onSelect={(e) => e.preventDefault()}
            >
              <Map className="h-4 w-4" />
              <span className="text-xs">Detailed View</span>
            </DropdownMenuItem>
          </DirectionsModal>

          <DropdownMenuSeparator />
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            📍 {visit.farmName}
            <br />
            📌 {visit.location}
            {hasCoordinates && (
              <>
                <br />
                🌐 {visit.gpsCoordinates!.lat.toFixed(4)},{" "}
                {visit.gpsCoordinates!.lng.toFixed(4)}
              </>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DirectionsButton;
