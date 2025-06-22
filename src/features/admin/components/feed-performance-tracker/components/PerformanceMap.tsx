import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PerformanceMetric, RegionalPerformance } from "../constants";
import {
  getPerformanceRating,
  getPerformanceColor,
  formatFcr,
  formatWeight,
  formatMortality,
  formatDate,
} from "../utils";

interface PerformanceMapProps {
  metrics: PerformanceMetric[];
  regionalData: RegionalPerformance[];
}

const PerformanceMap = ({ metrics, regionalData }: PerformanceMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [12.8797, 121.774],
        6
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Add performance markers for individual farms
    metrics.forEach((metric) => {
      const { lat, lng } = metric.gpsCoordinates;

      // Calculate performance score
      const fcrScore = Math.max(0, 100 - (metric.fcr - 1) * 50);
      const weightGainScore = Math.min(100, metric.weightGain * 25);
      const mortalityScore = Math.max(0, 100 - metric.mortality * 10);
      const performanceScore =
        (fcrScore + weightGainScore + mortalityScore) / 3;

      const rating = getPerformanceRating(performanceScore);
      const color = getPerformanceColor(rating);

      // Create custom icon based on performance
      const iconHtml = `
        <div style="
          background-color: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: white;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
          ${metric.verified ? "✓" : "?"}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-marker",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px;">
          <div style="font-weight: bold; margin-bottom: 8px; color: ${color};">
            ${metric.farmName}
          </div>
          <div style="margin-bottom: 6px;">
            <strong>Product:</strong> ${metric.productName}
          </div>
          <div style="margin-bottom: 6px;">
            <strong>Performance Score:</strong> 
            <span style="color: ${color}; font-weight: bold;">
              ${performanceScore.toFixed(1)}/100
            </span>
            <span style="background: ${color}; color: white; padding: 2px 6px; border-radius: 12px; font-size: 10px; margin-left: 4px;">
              ${rating.toUpperCase()}
            </span>
          </div>
          <hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
            <div><strong>FCR:</strong> ${formatFcr(metric.fcr)}</div>
            <div><strong>Weight Gain:</strong> ${formatWeight(metric.weightGain)}</div>
            <div><strong>Mortality:</strong> ${formatMortality(metric.mortality)}</div>
            <div><strong>Batch Size:</strong> ${metric.batchSize.toLocaleString()}</div>
          </div>
          <hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;">
          <div style="font-size: 11px; color: #666;">
            <div><strong>Region:</strong> ${metric.region}</div>
            <div><strong>Province:</strong> ${metric.province}</div>
            <div><strong>Recorded:</strong> ${formatDate(metric.recordDate)}</div>
            <div><strong>Reported by:</strong> ${metric.reportedBy}</div>
            <div style="margin-top: 4px;">
              <span style="background: ${metric.verified ? "#22c55e" : "#f59e0b"}; color: white; padding: 1px 4px; border-radius: 8px; font-size: 10px;">
                ${metric.verified ? "VERIFIED" : "PENDING"}
              </span>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    // Add regional performance circles
    regionalData.forEach((region) => {
      const { lat, lng } = region.gpsCoordinates;
      const color = getPerformanceColor(region.performanceRating);

      // Circle size based on number of farms
      const radius = Math.max(10000, region.totalFarms * 2000);

      const circle = L.circle([lat, lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.2,
        radius: radius,
        weight: 2,
      }).addTo(map);

      const circlePopupContent = `
        <div style="min-width: 180px;">
          <div style="font-weight: bold; margin-bottom: 8px; color: ${color};">
            ${region.region}
          </div>
          <div style="margin-bottom: 6px;">
            <strong>Province:</strong> ${region.province}
          </div>
          <div style="margin-bottom: 6px;">
            <strong>Performance:</strong> 
            <span style="background: ${color}; color: white; padding: 2px 6px; border-radius: 12px; font-size: 10px;">
              ${region.performanceRating.toUpperCase()}
            </span>
          </div>
          <hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 12px;">
            <div><strong>Farms:</strong> ${region.totalFarms}</div>
            <div><strong>Avg FCR:</strong> ${formatFcr(region.avgFcr)}</div>
            <div><strong>Avg Weight:</strong> ${formatWeight(region.avgWeightGain)}</div>
            <div><strong>Avg Mortality:</strong> ${formatMortality(region.avgMortality)}</div>
          </div>
          <hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;">
          <div style="font-size: 11px; color: #666;">
            <div><strong>Top Product:</strong> ${region.topProduct}</div>
            <div><strong>Last Update:</strong> ${formatDate(region.lastUpdate)}</div>
          </div>
        </div>
      `;

      circle.bindPopup(circlePopupContent);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [metrics, regionalData]);

  const getPerformanceStats = () => {
    const excellentCount = regionalData.filter(
      (r) => r.performanceRating === "excellent"
    ).length;
    const goodCount = regionalData.filter(
      (r) => r.performanceRating === "good"
    ).length;
    const averageCount = regionalData.filter(
      (r) => r.performanceRating === "average"
    ).length;
    const poorCount = regionalData.filter(
      (r) => r.performanceRating === "poor"
    ).length;

    return { excellentCount, goodCount, averageCount, poorCount };
  };

  const stats = getPerformanceStats();

  return (
    <div className="space-y-4">
      {/* Map */}
      <div className="relative">
        <div
          ref={mapRef}
          className="h-[200px] sm:h-[250px] lg:h-[300px] rounded-lg border"
        />

        {/* Map Legend */}
        <div className="absolute z-[10000] top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <div className="text-xs font-medium mb-2">Performance Rating</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs">Excellent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs">Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs">Average</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs">Poor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Performance Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="text-center p-3 rounded-lg bg-card border">
          <div className="text-lg font-bold text-green-600">
            {stats.excellentCount}
          </div>
          <div className="text-xs text-muted-foreground">Excellent</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-card border">
          <div className="text-lg font-bold text-blue-600">
            {stats.goodCount}
          </div>
          <div className="text-xs text-muted-foreground">Good</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-card border">
          <div className="text-lg font-bold text-yellow-600">
            {stats.averageCount}
          </div>
          <div className="text-xs text-muted-foreground">Average</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-card border">
          <div className="text-lg font-bold text-red-600">
            {stats.poorCount}
          </div>
          <div className="text-xs text-muted-foreground">Poor</div>
        </div>
      </div>

      {/* Top Performing Regions */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Top Performing Regions</h4>
        <div className="space-y-2">
          {regionalData
            .sort((a, b) => {
              const scoreA =
                a.performanceRating === "excellent"
                  ? 4
                  : a.performanceRating === "good"
                    ? 3
                    : a.performanceRating === "average"
                      ? 2
                      : 1;
              const scoreB =
                b.performanceRating === "excellent"
                  ? 4
                  : b.performanceRating === "good"
                    ? 3
                    : b.performanceRating === "average"
                      ? 2
                      : 1;
              return scoreB - scoreA;
            })
            .slice(0, 3)
            .map((region, index) => (
              <div
                key={region.region}
                className="flex items-center justify-between p-2 rounded bg-muted/10"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{region.region}</div>
                    <div className="text-xs text-muted-foreground">
                      {region.province}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      borderColor: getPerformanceColor(
                        region.performanceRating
                      ),
                      color: getPerformanceColor(region.performanceRating),
                    }}
                  >
                    {region.performanceRating}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {region.totalFarms} farms
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMap;
