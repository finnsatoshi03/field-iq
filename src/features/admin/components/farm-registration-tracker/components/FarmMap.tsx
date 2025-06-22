import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Sprout, Calendar, Users } from "lucide-react";
import type { FarmRegistration } from "../constants";
import type { FilterOptions } from "../utils";
import {
  getFilteredRegistrations,
  getMapMarkerSize,
  getMapMarkerColor,
  formatCurrency,
  formatHectares,
  getRegistrationTypeBadgeVariant,
} from "../utils";
import { format, parseISO } from "date-fns";
import "leaflet/dist/leaflet.css";

interface FarmMapProps {
  filters?: FilterOptions;
  className?: string;
}

interface MapControlsProps {
  currentFarmIndex: number;
  farms: FarmRegistration[];
  onPrevious: () => void;
  onNext: () => void;
  onViewAll: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  currentFarmIndex,
  farms,
  onPrevious,
  onNext,
  onViewAll,
}) => {
  if (farms.length <= 1) return null;

  const currentFarm = farms[currentFarmIndex];

  return (
    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 p-2 sm:p-3 max-w-[200px] sm:max-w-none">
      <div className="flex items-center gap-1 sm:gap-2 mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-xs"
          aria-label="Previous farm"
        >
          ←
        </Button>
        <div className="text-center px-1 sm:px-2 min-w-0 flex-1">
          <div className="text-xs sm:text-sm font-medium truncate">
            {currentFarm?.farmName}
          </div>
          <div className="text-xs text-muted-foreground">
            {currentFarmIndex + 1} of {farms.length}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-xs"
          aria-label="Next farm"
        >
          →
        </Button>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={onViewAll}
        className="w-full text-xs h-6 sm:h-8"
      >
        View All
      </Button>
    </div>
  );
};

const MapUpdater: React.FC<{
  currentFarm: FarmRegistration | null;
  farms: FarmRegistration[];
  viewAll: boolean;
}> = ({ currentFarm, farms, viewAll }) => {
  const map = useMap();

  useEffect(() => {
    if (viewAll && farms.length > 0) {
      // Show all farms
      const group = farms.map((farm) => [farm.location.lat, farm.location.lng]);
      if (group.length > 0) {
        const bounds = (window as any).L.latLngBounds(
          group as [number, number][]
        );
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    } else if (currentFarm) {
      // Focus on current farm
      map.setView([currentFarm.location.lat, currentFarm.location.lng], 10, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [currentFarm, farms, viewAll, map]);

  return null;
};

const FarmMap: React.FC<FarmMapProps> = ({ filters = {}, className = "" }) => {
  const mapRef = useRef<any>(null);
  const [currentFarmIndex, setCurrentFarmIndex] = useState(0);
  const [viewAll, setViewAll] = useState(true);

  const farms = getFilteredRegistrations(undefined, filters);

  const handlePrevious = () => {
    setCurrentFarmIndex((prev) => (prev === 0 ? farms.length - 1 : prev - 1));
    setViewAll(false);
  };

  const handleNext = () => {
    setCurrentFarmIndex((prev) => (prev === farms.length - 1 ? 0 : prev + 1));
    setViewAll(false);
  };

  const handleViewAll = () => {
    setViewAll(true);
  };

  const currentFarm = farms[currentFarmIndex];

  const getMarkerStyle = (farm: FarmRegistration, index: number) => {
    const isCurrentFarm = index === currentFarmIndex && !viewAll;
    const baseRadius = getMapMarkerSize(1);

    return {
      radius: isCurrentFarm ? baseRadius * 1.5 : baseRadius,
      fillColor: getMapMarkerColor(farm.registrationType),
      color: isCurrentFarm
        ? "#ffffff"
        : getMapMarkerColor(farm.registrationType),
      weight: isCurrentFarm ? 3 : 2,
      opacity: 1,
      fillOpacity: isCurrentFarm ? 0.9 : 0.7,
    };
  };

  const getRegistrationTypeLabel = (type: string) => {
    const labels = {
      new: "New Account",
      expansion: "Expansion",
      conversion: "Conversion",
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gray-50 flex-shrink-0">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-semibold">
                Farm Locations
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {farms.length} registered farms across the Philippines
              </p>
            </div>
          </div>

          <div className="relative h-[200px] sm:h-[300px] lg:h-[400px] w-full rounded-lg overflow-hidden border border-gray-200">
            <MapContainer
              ref={mapRef}
              center={[12.8797, 121.774]} // Philippines center
              zoom={6}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {farms.map((farm, index) => (
                <CircleMarker
                  key={farm.id}
                  center={[farm.location.lat, farm.location.lng]}
                  {...getMarkerStyle(farm, index)}
                >
                  <Popup className="farm-popup" maxWidth={300}>
                    <div className="p-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Sprout className="h-4 w-4 text-green-600" />
                        <h3 className="font-semibold text-sm">
                          {farm.farmName}
                        </h3>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-gray-500" />
                          <span className="font-medium">{farm.farmerName}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span>{farm.location.address}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <span>
                            Registered:{" "}
                            {format(
                              parseISO(farm.registrationDate),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <Badge
                            variant={getRegistrationTypeBadgeVariant(
                              farm.registrationType
                            )}
                            className="text-xs"
                          >
                            {getRegistrationTypeLabel(farm.registrationType)}
                          </Badge>
                          <span className="text-gray-600">
                            {formatHectares(farm.farmSize)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-1 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Crops:</span>
                            <span className="font-medium">
                              {farm.cropTypes.join(", ")}
                            </span>
                          </div>
                          {farm.status === "active" && (
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500">Revenue:</span>
                              <span className="font-medium text-green-600">
                                {formatCurrency(farm.monthlyRevenue)}/mo
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-1 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-gray-500" />
                            <span className="text-gray-600">
                              {farm.contactInfo.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              <MapUpdater
                currentFarm={currentFarm}
                farms={farms}
                viewAll={viewAll}
              />
            </MapContainer>

            <MapControls
              currentFarmIndex={currentFarmIndex}
              farms={farms}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onViewAll={handleViewAll}
            />
          </div>

          <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600">New</span>
              </div>
              <div className="font-medium">
                {farms.filter((f) => f.registrationType === "new").length}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600">Expansion</span>
              </div>
              <div className="font-medium">
                {farms.filter((f) => f.registrationType === "expansion").length}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-500"></div>
                <span className="text-gray-600">Conversion</span>
              </div>
              <div className="font-medium">
                {
                  farms.filter((f) => f.registrationType === "conversion")
                    .length
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmMap;
