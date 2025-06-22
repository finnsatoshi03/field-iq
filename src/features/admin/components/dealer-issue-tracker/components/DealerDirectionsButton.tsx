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
import { type DealerIssue } from "../constants";
import {
  openGoogleMapsDirections,
  getDealerDirectionsOptions,
  hasDealerGpsCoordinates,
} from "../utils";
import { cn } from "@/lib/utils";
import DealerDirectionsModal from "./DealerDirectionsModal";

interface DealerDirectionsButtonProps {
  dealer: DealerIssue;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  showLabel?: boolean;
  showModal?: boolean;
  className?: string;
}

const DealerDirectionsButton: React.FC<DealerDirectionsButtonProps> = ({
  dealer,
  variant = "outline",
  size = "sm",
  showLabel = false,
  showModal = false,
  className,
}) => {
  const directionsOptions = getDealerDirectionsOptions();
  const hasCoordinates = hasDealerGpsCoordinates(dealer);

  const handleQuickDirections = () => {
    // Default to Google Maps for quick access
    openGoogleMapsDirections(dealer);
  };

  const handleDirectionOption = (option: any) => {
    option.action(dealer);
  };

  if (!hasCoordinates) {
    return null; // Don't show button if no GPS coordinates
  }

  if (showModal) {
    return (
      <DealerDirectionsModal dealer={dealer}>
        <Button
          variant={variant}
          size={size}
          className={cn("flex items-center gap-1", className)}
          title={`Get directions to ${dealer.dealerName}`}
        >
          <Map className="h-3 w-3" />
          {showLabel && <span className="text-xs">Detailed Directions</span>}
        </Button>
      </DealerDirectionsModal>
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
        title={`Get directions to ${dealer.dealerName}`}
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
            >
              <span className="text-sm">{option.icon}</span>
              <span className="text-xs">{option.name}</span>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DealerDirectionsModal dealer={dealer}>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onSelect={(e) => e.preventDefault()}
            >
              <Map className="h-4 w-4" />
              <span className="text-xs">Detailed View</span>
            </DropdownMenuItem>
          </DealerDirectionsModal>

          <DropdownMenuSeparator />
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            📍 {dealer.dealerName}
            <br />
            📌 {dealer.location.address}
            <br />
            🌐 {dealer.location.lat.toFixed(4)},{" "}
            {dealer.location.lng.toFixed(4)}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DealerDirectionsButton;
