import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import {
  Navigation,
  ExternalLink,
  MapPin,
  Phone,
  Loader2,
  MapPinIcon,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type DealerIssue } from "../constants";
import {
  getDealerDirectionsOptions,
  hasDealerGpsCoordinates,
  getSeverityBadgeClass,
  formatDate,
} from "../utils";
import { cn } from "@/lib/utils";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface DealerDirectionsModalProps {
  dealer: DealerIssue;
  children: React.ReactNode;
}

interface UserLocation {
  lat: number;
  lng: number;
}

const DealerDirectionsModal: React.FC<DealerDirectionsModalProps> = ({
  dealer,
  children,
}) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const directionsOptions = getDealerDirectionsOptions();
  const hasCoordinates = hasDealerGpsCoordinates(dealer);

  // Get user's current location when modal opens
  useEffect(() => {
    if (isOpen && !userLocation && !locationLoading) {
      getCurrentLocation();
    }
  }, [isOpen]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationLoading(false);
      },
      (error) => {
        let errorMessage = "Unable to get your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        setLocationError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const handleDirectionOption = (option: any) => {
    // Enhanced direction function that uses current location if available
    if (userLocation && hasCoordinates) {
      const { lat: destLat, lng: destLng } = dealer.location;
      const { lat: startLat, lng: startLng } = userLocation;

      // Create enhanced URLs with starting location
      if (option.id === "google") {
        const url = `https://www.google.com/maps/dir/${startLat},${startLng}/${destLat},${destLng}`;
        window.open(url, "_blank");
        return;
      }
      if (option.id === "waze") {
        const url = `https://waze.com/ul?ll=${destLat},${destLng}&navigate=yes&from=${startLat},${startLng}`;
        window.open(url, "_blank");
        return;
      }
      if (option.id === "apple") {
        const url = `http://maps.apple.com/?saddr=${startLat},${startLng}&daddr=${destLat},${destLng}&dirflg=d`;
        window.open(url, "_blank");
        return;
      }
    }

    // Fallback to original method
    option.action(dealer);
  };

  const openIssues = dealer.issues.filter(
    (issue) => issue.status !== "resolved"
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[95vw] w-full max-h-[90vh] lg:max-w-6xl overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base lg:text-lg">
            <Navigation className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="truncate">
              Get Directions to {dealer.dealerName}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 p-1">
            {/* Left Column - Dealer Details and Direction Options */}
            <div className="space-y-4 lg:space-y-6">
              {/* Dealer Information */}
              <div className="bg-muted/50 rounded-lg p-3 lg:p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-semibold text-base lg:text-lg tracking-tight truncate">
                      {dealer.dealerName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge
                        className={cn(
                          "text-xs",
                          getSeverityBadgeClass(dealer.severity)
                        )}
                      >
                        {dealer.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs lg:text-sm text-muted-foreground">
                        {dealer.dealerCode}
                      </span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-sm font-medium">
                      {dealer.issues.length} Issues
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last updated: {formatDate(dealer.lastUpdated)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">
                      {dealer.location.address}, {dealer.location.region}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{dealer.contactPerson}</span>
                    <span className="text-muted-foreground hidden sm:inline">
                      ({dealer.phone})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{dealer.email}</span>
                  </div>
                  {hasCoordinates && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm shrink-0">🌐</span>
                      <span className="text-xs lg:text-sm text-muted-foreground font-mono truncate">
                        {dealer.location.lat.toFixed(6)},{" "}
                        {dealer.location.lng.toFixed(6)}
                      </span>
                    </div>
                  )}
                </div>

                {openIssues.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="text-sm font-medium mb-2">
                      Current Issues ({openIssues.length}):
                    </div>
                    <div className="space-y-1">
                      {openIssues.slice(0, 3).map((issue, index) => (
                        <div
                          key={index}
                          className="text-xs text-muted-foreground"
                        >
                          • {issue.description}
                        </div>
                      ))}
                      {openIssues.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{openIssues.length - 3} more issues
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Current Location Status */}
              <div className="bg-muted/30 rounded-lg p-3 lg:p-4">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Your Current Location
                </h4>

                {locationLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Getting your location...
                  </div>
                )}

                {locationError && (
                  <div className="space-y-2">
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {locationError}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      className="text-xs"
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                {userLocation && (
                  <div className="text-sm text-green-600 dark:text-green-400">
                    ✓ Location found: {userLocation.lat.toFixed(4)},{" "}
                    {userLocation.lng.toFixed(4)}
                  </div>
                )}
              </div>

              {/* Direction Options */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">
                  Choose your navigation app:
                </h4>
                <div className="grid grid-cols-1 gap-2 lg:gap-3">
                  {directionsOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      className="justify-start h-auto p-3 lg:p-4"
                      onClick={() => handleDirectionOption(option)}
                    >
                      <div className="flex items-center gap-3 w-full min-w-0">
                        <span className="text-xl lg:text-2xl shrink-0">
                          {option.icon}
                        </span>
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-medium text-sm lg:text-base">
                            {option.name}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-1 lg:line-clamp-none">
                            {option.id === "google" &&
                              "Most compatible - works on all devices"}
                            {option.id === "waze" &&
                              "Real-time traffic and road alerts"}
                            {option.id === "apple" && "Native iOS integration"}
                            {option.id === "mapbox" &&
                              "Detailed mapping and navigation"}
                          </div>
                          {userLocation && hasCoordinates && (
                            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                              ✓ Will use your current location as starting point
                            </div>
                          )}
                        </div>
                        <ExternalLink className="h-4 w-4 shrink-0" />
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Map Preview */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Dealer Location Preview:</h4>

              {hasCoordinates || userLocation ? (
                <div className="h-64 lg:h-80 w-full bg-muted/10 rounded-lg overflow-hidden border">
                  <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                    crossOrigin=""
                  />
                  <MapContainer
                    center={
                      hasCoordinates
                        ? [dealer.location.lat, dealer.location.lng]
                        : userLocation
                          ? [userLocation.lat, userLocation.lng]
                          : [14.5995, 120.9842] // Default to Manila
                    }
                    zoom={hasCoordinates ? 13 : userLocation ? 15 : 10}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {hasCoordinates && (
                      <Marker
                        position={[dealer.location.lat, dealer.location.lng]}
                      >
                        <Popup>
                          <div className="text-center">
                            <div className="font-medium">
                              {dealer.dealerName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {dealer.location.address}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                    {userLocation && (
                      <Marker
                        position={[userLocation.lat, userLocation.lng]}
                        icon={L.divIcon({
                          className: "current-location-marker",
                          html: `
                            <div style="
                              width: 20px;
                              height: 20px;
                              background-color: #3b82f6;
                              border: 3px solid white;
                              border-radius: 50%;
                              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                            "></div>
                          `,
                          iconSize: [20, 20],
                          iconAnchor: [10, 10],
                        })}
                      >
                        <Popup>
                          <div className="text-center">
                            <div className="font-medium">Your Location</div>
                            <div className="text-sm text-muted-foreground">
                              Current position
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>
              ) : (
                <div className="h-64 lg:h-80 w-full bg-muted/20 rounded-lg border border-dashed border-muted-foreground/30 flex items-center justify-center">
                  <div className="text-center p-4">
                    <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground">
                      {locationLoading
                        ? "Getting your location..."
                        : locationError
                          ? "Unable to show map preview"
                          : "Loading dealer location..."}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {locationLoading
                        ? "Please wait while we access your location"
                        : locationError
                          ? "Grant location permission to see map preview"
                          : "Map will appear when location is ready"}
                    </div>
                    {locationError && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={getCurrentLocation}
                        className="text-xs mt-2"
                      >
                        Enable Location
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground space-y-1 bg-muted/20 rounded-lg p-3">
                <div>
                  💡 <strong>Tips:</strong>
                </div>
                <div>• Allow location access for turn-by-turn directions</div>
                <div>• Google Maps works best for all devices</div>
                <div>• Visit dealers efficiently with GPS navigation</div>
                {hasCoordinates ? (
                  <div>
                    • Precise GPS coordinates ensure accurate navigation
                  </div>
                ) : (
                  <div>• Dealer coordinates available for navigation</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DealerDirectionsModal;
