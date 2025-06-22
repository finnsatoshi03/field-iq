import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { DealerIssue } from "../constants";
import { getHeatmapData } from "../utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

interface HeatmapViewProps {
  dealers: DealerIssue[];
  className?: string;
}

const HeatmapLayer = ({
  dealers,
  currentDealerIndex,
}: {
  dealers: DealerIssue[];
  currentDealerIndex: number;
}) => {
  const map = useMap();

  useEffect(() => {
    // Simple circle-based heatmap since we don't have a full heatmap library
    const heatmapData = getHeatmapData(dealers);

    // Clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    // Add circle markers for heatmap effect
    heatmapData.forEach((point, index) => {
      const isCurrentDealer = index === currentDealerIndex;
      const circle = L.circleMarker([point.lat, point.lng], {
        radius: point.intensity * 20 + 10,
        fillColor:
          point.intensity > 0.7
            ? "#dc2626"
            : point.intensity > 0.5
              ? "#f59e0b"
              : point.intensity > 0.3
                ? "#eab308"
                : "#10b981",
        color: isCurrentDealer ? "#ffffff" : "transparent",
        fillOpacity: isCurrentDealer ? 0.9 : 0.6,
        weight: isCurrentDealer ? 3 : 0,
      });
      circle.addTo(map);
    });

    // Pan to current dealer if valid index
    if (
      currentDealerIndex >= 0 &&
      currentDealerIndex < dealers.length &&
      dealers.length > 0
    ) {
      const currentDealer = dealers[currentDealerIndex];
      map.setView(
        [currentDealer.location.lat, currentDealer.location.lng],
        10,
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

const HeatmapView = ({ dealers, className }: HeatmapViewProps) => {
  const mapRef = useRef<L.Map>(null);
  const [currentDealerIndex, setCurrentDealerIndex] = useState<number>(-1);

  // Default center (Philippines)
  const defaultCenter: [number, number] = [12.8797, 121.774];

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

  // Reset current dealer index when dealers change
  useEffect(() => {
    setCurrentDealerIndex(-1);
  }, [dealers]);

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

        <HeatmapLayer
          dealers={dealers}
          currentDealerIndex={currentDealerIndex}
        />
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

      {/* Heatmap Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 z-[1000]">
        <h4 className="text-xs font-medium text-foreground font-sans mb-2">
          Issue Intensity
        </h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="text-xs text-muted-foreground font-sans">
              Critical
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs text-muted-foreground font-sans">
              High
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-muted-foreground font-sans">
              Medium
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-muted-foreground font-sans">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapView;
