import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { DealerIssue } from "../constants";
import { SEVERITY_COLORS } from "../constants";
import {
  formatDate,
  getIssueTypeLabel,
  getSeverityBadgeClass,
  getValidCoordinates,
  hasDealerGpsCoordinates,
} from "../utils";

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

interface DealerMapProps {
  dealers: DealerIssue[];
  selectedDealer?: DealerIssue;
  onDealerSelect?: (dealer: DealerIssue) => void;
  className?: string;
}

const createCustomIcon = (
  severity: string,
  isHighlighted: boolean = false,
  hasValidGPS: boolean = true,
) => {
  const color = SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS];
  const size = severity === "critical" ? 30 : severity === "high" ? 25 : 20;
  const highlightedSize = isHighlighted ? size + 8 : size;

  // Different styling for dealers without valid GPS coordinates
  const borderStyle = hasValidGPS
    ? `border: ${isHighlighted ? "4px" : "2px"} solid ${isHighlighted ? "#ffffff" : "white"};`
    : `border: ${isHighlighted ? "4px" : "2px"} dashed ${isHighlighted ? "#ffffff" : "white"};`;

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: ${highlightedSize}px;
        height: ${highlightedSize}px;
        background-color: ${color};
        ${borderStyle}
        border-radius: 50%;
        box-shadow: ${isHighlighted ? "0 4px 12px rgba(0,0,0,0.4)" : "0 2px 4px rgba(0,0,0,0.3)"};
        display: flex;
        align-items: center;
        justify-content: center;
        ${isHighlighted ? "transform: scale(1.1);" : ""}
        transition: all 0.3s ease;
        ${!hasValidGPS ? "opacity: 0.8;" : ""}
      ">
        <div style="
          color: white;
          font-size: ${highlightedSize < 25 ? "8px" : "10px"};
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
        ">
          ${!hasValidGPS ? "📍" : "•"}
        </div>
      </div>
    `,
    iconSize: [highlightedSize, highlightedSize],
    iconAnchor: [highlightedSize / 2, highlightedSize / 2],
  });
};

// Component to fit map to bounds
const FitBounds: React.FC<{ bounds: L.LatLngBounds }> = ({ bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [bounds, map]);

  return null;
};

const DealerMap: React.FC<DealerMapProps> = ({
  dealers,
  selectedDealer,
  onDealerSelect,
}) => {
  const [currentDealerIndex, setCurrentDealerIndex] = useState(0);
  const mapRef = useRef<L.Map>(null);

  // Calculate map bounds based on all dealers with valid coordinates
  const dealersWithValidCoords = dealers.filter((dealer) =>
    hasDealerGpsCoordinates(dealer),
  );

  const bounds = useMemo(() => {
    if (dealersWithValidCoords.length === 0) {
      // Default to Manila area if no valid coordinates
      return L.latLngBounds([
        [14.4, 120.8],
        [14.8, 121.2],
      ]);
    }

    if (dealersWithValidCoords.length === 1) {
      const coords = getValidCoordinates(dealersWithValidCoords[0]);
      return L.latLngBounds([
        [coords.lat - 0.01, coords.lng - 0.01],
        [coords.lat + 0.01, coords.lng + 0.01],
      ]);
    }

    const latLngs = dealersWithValidCoords.map((dealer) => {
      const coords = getValidCoordinates(dealer);
      return L.latLng(coords.lat, coords.lng);
    });

    return L.latLngBounds(latLngs);
  }, [dealersWithValidCoords]);

  const handlePrevious = () => {
    setCurrentDealerIndex((prev) =>
      prev === 0 ? dealers.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentDealerIndex((prev) =>
      prev === dealers.length - 1 ? 0 : prev + 1,
    );
  };

  useEffect(() => {
    if (selectedDealer) {
      const index = dealers.findIndex((d) => d.id === selectedDealer.id);
      if (index !== -1) {
        setCurrentDealerIndex(index);
      }
    }
  }, [selectedDealer, dealers]);

  if (dealers.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/20">
        <div className="text-center text-muted-foreground">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No dealers to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        ref={mapRef}
        center={[14.5995, 120.9842]} // Manila center as default
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds bounds={bounds} />

        {dealers.map((dealer) => {
          const coords = getValidCoordinates(dealer);
          const hasValidGPS = hasDealerGpsCoordinates(dealer);
          const isSelected = selectedDealer?.id === dealer.id;

          return (
            <Marker
              key={dealer.id}
              position={[coords.lat, coords.lng]}
              icon={createCustomIcon(dealer.severity, isSelected, hasValidGPS)}
              eventHandlers={{
                click: () => {
                  onDealerSelect?.(dealer);
                  setCurrentDealerIndex(
                    dealers.findIndex((d) => d.id === dealer.id),
                  );
                },
              }}
            >
              <Popup>
                <div className="p-2 min-w-64">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-sm">
                      {dealer.dealerName}
                    </h3>
                    <Badge
                      className={`text-xs ${getSeverityBadgeClass(dealer.severity)}`}
                    >
                      {dealer.severity.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{dealer.location.address}</span>
                      {!hasValidGPS && (
                        <span className="text-orange-600 font-medium">
                          (Estimated location)
                        </span>
                      )}
                    </div>
                    <div>Code: {dealer.dealerCode}</div>
                    <div>Issues: {dealer.issues.length}</div>
                    <div>Last Updated: {formatDate(dealer.lastUpdated)}</div>
                  </div>

                  {dealer.issues.length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="text-xs font-medium mb-1">
                        Recent Issues:
                      </div>
                      <div className="space-y-1">
                        {dealer.issues.slice(0, 2).map((issue, index) => (
                          <div key={index} className="text-xs">
                            <span className="font-medium">
                              {getIssueTypeLabel(issue.type)}:
                            </span>
                            <span className="ml-1 text-muted-foreground">
                              {issue.description.length > 40
                                ? `${issue.description.substring(0, 40)}...`
                                : issue.description}
                            </span>
                          </div>
                        ))}
                        {dealer.issues.length > 2 && (
                          <div className="text-xs text-blue-600">
                            +{dealer.issues.length - 2} more issues
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Navigation Controls */}
      {dealers.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border p-2 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="px-3 py-1 bg-muted rounded text-xs font-medium">
            {currentDealerIndex + 1} of {dealers.length}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border p-3">
        <div className="text-xs font-medium mb-2">Legend</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full border border-white"></div>
            <span>Critical/High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full border border-white"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full border border-white"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-dashed border-white"></div>
            <span>Estimated location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerMap;
