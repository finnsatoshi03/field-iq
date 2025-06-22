import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { DealerIssue } from "../constants";
import { SEVERITY_COLORS } from "../constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSeverityBadgeClass, getIssueTypeLabel, formatDate } from "../utils";

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
  onDealerSelect?: (dealer: DealerIssue) => void;
  className?: string;
}

const createCustomIcon = (severity: string, isHighlighted: boolean = false) => {
  const color = SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS];
  const size = severity === "critical" ? 30 : severity === "high" ? 25 : 20;
  const highlightedSize = isHighlighted ? size + 8 : size;

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: ${highlightedSize}px;
        height: ${highlightedSize}px;
        background-color: ${color};
        border: ${isHighlighted ? "4px" : "2px"} solid ${isHighlighted ? "#ffffff" : "white"};
        border-radius: 50%;
        box-shadow: ${isHighlighted ? "0 4px 12px rgba(0,0,0,0.4)" : "0 2px 4px rgba(0,0,0,0.3)"};
        display: flex;
        align-items: center;
        justify-content: center;
        ${isHighlighted ? "transform: scale(1.1);" : ""}
        transition: all 0.3s ease;
      ">
        <div style="
          width: ${highlightedSize - 12}px;
          height: ${highlightedSize - 12}px;
          background-color: white;
          border-radius: 50%;
          opacity: ${isHighlighted ? "1" : "0.8"};
        "></div>
      </div>
    `,
    iconSize: [highlightedSize, highlightedSize],
    iconAnchor: [highlightedSize / 2, highlightedSize / 2],
  });
};

const MapUpdater = ({
  dealers,
  currentDealerIndex,
}: {
  dealers: DealerIssue[];
  currentDealerIndex: number;
}) => {
  const map = useMap();

  useEffect(() => {
    // Pan to current dealer if valid index
    if (
      currentDealerIndex >= 0 &&
      currentDealerIndex < dealers.length &&
      dealers.length > 0
    ) {
      const currentDealer = dealers[currentDealerIndex];
      map.setView(
        [currentDealer.location.lat, currentDealer.location.lng],
        12,
        {
          animate: true,
          duration: 0.5,
        }
      );
    } else if (dealers.length > 0) {
      // Fit bounds if there are dealers but no specific focus
      const group = new L.FeatureGroup(
        dealers.map((dealer) =>
          L.marker([dealer.location.lat, dealer.location.lng])
        )
      );
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [dealers, map, currentDealerIndex]);

  return null;
};

const DealerMap = ({ dealers, onDealerSelect, className }: DealerMapProps) => {
  const mapRef = useRef<L.Map>(null);
  const [currentDealerIndex, setCurrentDealerIndex] = useState<number>(-1);

  const handleMarkerClick = (dealer: DealerIssue) => {
    onDealerSelect?.(dealer);
    // Find and set the index of the clicked dealer
    const index = dealers.findIndex((d) => d.id === dealer.id);
    if (index !== -1) {
      setCurrentDealerIndex(index);
    }
  };

  const handlePreviousDealer = () => {
    if (dealers.length === 0) return;

    if (currentDealerIndex <= 0) {
      setCurrentDealerIndex(dealers.length - 1);
    } else {
      setCurrentDealerIndex(currentDealerIndex - 1);
    }
  };

  const handleNextDealer = () => {
    if (dealers.length === 0) return;

    if (currentDealerIndex >= dealers.length - 1) {
      setCurrentDealerIndex(0);
    } else {
      setCurrentDealerIndex(currentDealerIndex + 1);
    }
  };

  const handleViewAll = () => {
    setCurrentDealerIndex(-1);
  };

  const handleDealerFocus = (index: number) => {
    setCurrentDealerIndex(index);
    const dealer = dealers[index];
    if (dealer && onDealerSelect) {
      onDealerSelect(dealer);
    }
  };

  // Reset current dealer index when dealers change
  useEffect(() => {
    setCurrentDealerIndex(-1);
  }, [dealers]);

  // Default center (Philippines)
  const defaultCenter: [number, number] = [12.8797, 121.774];

  const showNavigation = dealers.length > 1;
  const currentDealer =
    currentDealerIndex >= 0 && currentDealerIndex < dealers.length
      ? dealers[currentDealerIndex]
      : null;

  return (
    <div className={`w-full h-full relative z-0 ${className}`}>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <MapContainer
        center={defaultCenter}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater dealers={dealers} currentDealerIndex={currentDealerIndex} />

        {dealers.map((dealer, index) => (
          <Marker
            key={dealer.id}
            position={[dealer.location.lat, dealer.location.lng]}
            icon={createCustomIcon(
              dealer.severity,
              index === currentDealerIndex
            )}
            eventHandlers={{
              click: () => handleMarkerClick(dealer),
            }}
          >
            <Popup>
              <div className="p-2 min-w-64">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground font-display">
                      {dealer.dealerName}
                    </h3>
                    <p className="text-xs text-muted-foreground font-sans">
                      {dealer.dealerCode}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getSeverityBadgeClass(dealer.severity)}`}
                  >
                    {dealer.severity.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  <p className="text-xs text-muted-foreground font-sans">
                    📍 {dealer.location.address}
                  </p>
                  <p className="text-xs text-muted-foreground font-sans">
                    👤 {dealer.contactPerson}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-foreground font-sans">
                    Issues ({dealer.issues.length}):
                  </p>
                  {dealer.issues.slice(0, 2).map((issue, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getSeverityBadgeClass(issue.priority as any)}`}
                      >
                        {getIssueTypeLabel(issue.type)}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-sans truncate">
                        {issue.description}
                      </span>
                    </div>
                  ))}
                  {dealer.issues.length > 2 && (
                    <p className="text-xs text-muted-foreground font-sans">
                      +{dealer.issues.length - 2} more issues
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground font-sans">
                    Last updated: {formatDate(dealer.lastUpdated)}
                  </p>
                </div>

                <div className="mt-3 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDealerFocus(index)}
                    className="text-xs"
                  >
                    Focus on this dealer
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Navigation Controls */}
      {showNavigation && (
        <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2">
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousDealer}
              className="h-8 w-8 p-0"
              aria-label="Previous dealer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="px-2 text-xs text-foreground font-sans">
              {currentDealer ? (
                <div className="text-center min-w-24">
                  <div className="font-medium">{currentDealer.dealerName}</div>
                  <div className="text-muted-foreground">
                    {currentDealerIndex + 1} of {dealers.length}
                  </div>
                </div>
              ) : (
                <div className="text-center min-w-24">
                  <div className="font-medium">All Dealers</div>
                  <div className="text-muted-foreground">
                    {dealers.length} total
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextDealer}
              className="h-8 w-8 p-0"
              aria-label="Next dealer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {currentDealer && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewAll}
              className="bg-card/90 backdrop-blur-sm text-xs"
            >
              View All
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DealerMap;
