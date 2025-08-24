import type { AdminDealerIssueApiItem } from "@/features/admin/types";
import type {
  DealerIssue,
  IssueMetrics,
  IssueTypeKey,
  MapPin,
  SeverityLevel,
} from "./constants";
import { ISSUE_STATUS, ISSUE_TYPES } from "./constants";

// Map API issue types to component issue types
export const mapApiIssueTypeToComponent = (
  apiIssueType: string,
): IssueTypeKey => {
  const lowerCaseType = apiIssueType.toLowerCase().trim();

  // Stock/Inventory Issues - be very specific about stock-related issues
  if (
    lowerCaseType === "out of stock" ||
    lowerCaseType === "dealer out of stock" ||
    lowerCaseType.startsWith("out of stock") ||
    lowerCaseType.includes("stockout") ||
    lowerCaseType.includes("stock") ||
    lowerCaseType.includes("inventory") ||
    lowerCaseType.includes("shortage")
  ) {
    return ISSUE_TYPES.STOCKOUT;
  }

  // Delivery Issues - specific delivery-related problems
  if (
    lowerCaseType === "late delivery" ||
    lowerCaseType === "missing items" ||
    lowerCaseType.includes("late delivery") ||
    lowerCaseType.includes("missing items") ||
    lowerCaseType.includes("delivery") ||
    lowerCaseType.includes("late") ||
    lowerCaseType.includes("missing") ||
    lowerCaseType.includes("transport") ||
    lowerCaseType.includes("shipping") ||
    lowerCaseType.includes("logistics")
  ) {
    return ISSUE_TYPES.DELIVERY;
  }

  // Pricing/Invoice Issues - billing and payment related
  if (
    lowerCaseType === "duplicate invoice" ||
    lowerCaseType.includes("invoice") ||
    lowerCaseType.includes("billing") ||
    lowerCaseType.includes("payment") ||
    lowerCaseType.includes("pricing") ||
    lowerCaseType.includes("price") ||
    lowerCaseType.includes("cost") ||
    lowerCaseType.includes("duplicate")
  ) {
    return ISSUE_TYPES.PRICING;
  }

  // Quality Issues - product condition and integrity
  if (
    lowerCaseType === "leak in packaging" ||
    lowerCaseType === "mold in product" ||
    lowerCaseType === "incorrect labeling" ||
    lowerCaseType === "damaged bags" ||
    lowerCaseType === "spoiled feed" ||
    lowerCaseType === "wrong product" ||
    lowerCaseType === "broken seal" ||
    lowerCaseType.includes("leak") ||
    lowerCaseType.includes("mold") ||
    lowerCaseType.includes("damaged") ||
    lowerCaseType.includes("spoiled") ||
    lowerCaseType.includes("broken") ||
    lowerCaseType.includes("wrong product") ||
    lowerCaseType.includes("incorrect labeling") ||
    lowerCaseType.includes("quality") ||
    lowerCaseType.includes("defective") ||
    lowerCaseType.includes("contaminated") ||
    lowerCaseType.includes("expired") ||
    lowerCaseType.includes("tampered")
  ) {
    return ISSUE_TYPES.QUALITY;
  }

  // Default everything else to others
  return ISSUE_TYPES.OTHERS;
};

// Transform API data to component format
export const transformApiDataToDealerIssues = (
  apiData: AdminDealerIssueApiItem[],
): DealerIssue[] => {
  return apiData.map((item) => ({
    id: item.id.toString(),
    dealerName: item.dealerName,
    dealerCode: item.dealerCode,
    location: {
      lat: item.location.lat,
      lng: item.location.lng,
      address: item.location.address || "Unknown Address",
      region: item.location.region || "Unknown Region",
    },
    issues: item.issues.map((issue) => ({
      type: mapApiIssueTypeToComponent(issue.type),
      description: issue.description || issue.type, // Use type as fallback if description is null
      reportedDate: issue.reportedDate,
      status: issue.status,
      priority: issue.priority,
    })),
    severity: item.severity,
    lastUpdated: item.lastUpdated,
    contactPerson: item.contactPerson || "N/A",
    phone: item.phone || "N/A",
    email: item.email || "N/A",
  }));
};

export const calculateIssueMetrics = (dealers: DealerIssue[]): IssueMetrics => {
  const totalDealers = dealers.length;
  const allIssues = dealers.flatMap((dealer) => dealer.issues);
  const totalIssues = allIssues.length;

  const stockoutIssues = allIssues.filter(
    (issue) => issue.type === ISSUE_TYPES.STOCKOUT,
  ).length;
  const deliveryIssues = allIssues.filter(
    (issue) => issue.type === ISSUE_TYPES.DELIVERY,
  ).length;
  const pricingIssues = allIssues.filter(
    (issue) => issue.type === ISSUE_TYPES.PRICING,
  ).length;
  const qualityIssues = allIssues.filter(
    (issue) => issue.type === ISSUE_TYPES.QUALITY,
  ).length;
  const otherIssues = allIssues.filter(
    (issue) => issue.type === ISSUE_TYPES.OTHERS,
  ).length;

  const criticalIssues = dealers.filter(
    (dealer) => dealer.severity === "critical",
  ).length;
  const resolvedIssues = allIssues.filter(
    (issue) => issue.status === ISSUE_STATUS.RESOLVED,
  ).length;

  return {
    totalDealers,
    totalIssues,
    stockoutIssues,
    deliveryIssues,
    pricingIssues,
    qualityIssues,
    otherIssues,
    criticalIssues,
    resolvedIssues,
  };
};

export const convertToMapPins = (dealers: DealerIssue[]): MapPin[] => {
  return dealers.map((dealer) => ({
    id: dealer.id,
    position: { lat: dealer.location.lat, lng: dealer.location.lng },
    severity: dealer.severity,
    dealerName: dealer.dealerName,
    issueCount: dealer.issues.length,
  }));
};

export const filterDealersBySeverity = (
  dealers: DealerIssue[],
  severity?: SeverityLevel,
): DealerIssue[] => {
  if (!severity) return dealers;
  return dealers.filter((dealer) => dealer.severity === severity);
};

export const filterDealersByIssueType = (
  dealers: DealerIssue[],
  issueType?: IssueTypeKey,
): DealerIssue[] => {
  if (!issueType) return dealers;
  return dealers.filter((dealer) =>
    dealer.issues.some((issue) => issue.type === issueType),
  );
};

export const sortDealersBySeverity = (
  dealers: DealerIssue[],
): DealerIssue[] => {
  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  return [...dealers].sort(
    (a, b) => severityOrder[b.severity] - severityOrder[a.severity],
  );
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
};

export const getSeverityBadgeClass = (severity: SeverityLevel): string => {
  const classes = {
    low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    high: "bg-red-50 text-red-700 border-red-200",
    critical: "bg-red-100 text-red-800 border-red-300",
  };
  return classes[severity];
};

export const getIssueTypeBadgeClass = (type: IssueTypeKey): string => {
  const classes = {
    stockout: "bg-red-50 text-red-700 border-red-200",
    delivery: "bg-amber-50 text-amber-700 border-amber-200",
    pricing: "bg-violet-50 text-violet-700 border-violet-200",
    quality: "bg-cyan-50 text-cyan-700 border-cyan-200",
    others: "bg-gray-50 text-gray-700 border-gray-200",
  };
  return classes[type] || classes.others;
};

export const getStatusBadgeClass = (status: string): string => {
  const classes = {
    open: "bg-gray-50 text-gray-700 border-gray-200",
    "in-progress": "bg-blue-50 text-blue-700 border-blue-200",
    resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return classes[status as keyof typeof classes] || classes.open;
};

export const getIssueTypeLabel = (type: IssueTypeKey): string => {
  const labels = {
    stockout: "Stock",
    delivery: "Delivery",
    pricing: "Pricing",
    quality: "Quality",
    others: "Others",
  };
  return labels[type];
};

export const calculateResolutionRate = (dealers: DealerIssue[]): number => {
  const allIssues = dealers.flatMap((dealer) => dealer.issues);
  const resolvedIssues = allIssues.filter(
    (issue) => issue.status === ISSUE_STATUS.RESOLVED,
  );
  return allIssues.length > 0
    ? (resolvedIssues.length / allIssues.length) * 100
    : 0;
};

export const getHeatmapData = (
  dealers: DealerIssue[],
): Array<{ lat: number; lng: number; intensity: number }> => {
  return dealers.map((dealer) => ({
    lat: dealer.location.lat,
    lng: dealer.location.lng,
    intensity:
      dealer.severity === "critical"
        ? 1
        : dealer.severity === "high"
          ? 0.8
          : dealer.severity === "medium"
            ? 0.5
            : 0.3,
  }));
};

// GPS Direction utilities for dealers
export const openGoogleMapsDirections = (
  dealer: DealerIssue,
  userLocation?: { lat: number; lng: number },
) => {
  if (!dealer.location?.lat || !dealer.location?.lng) {
    console.warn("No GPS coordinates available for this dealer");
    return;
  }

  // Check if user is on mobile device
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  let url: string;
  const { lat, lng } = dealer.location;
  const destination = `${lat},${lng}`;

  if (userLocation) {
    // With starting location
    const origin = `${userLocation.lat},${userLocation.lng}`;
    if (isMobile) {
      // Try app first, fallback to web
      url = `google.maps://?saddr=${origin}&daddr=${destination}&directionsmode=driving`;
      window.location.href = url;

      // Fallback after delay
      setTimeout(() => {
        const webUrl = `https://www.google.com/maps/dir/${origin}/${destination}`;
        window.open(webUrl, "_blank");
      }, 1500);
      return;
    } else {
      // Desktop web version
      url = `https://www.google.com/maps/dir/${origin}/${destination}`;
    }
  } else {
    // Without starting location
    if (isMobile) {
      url = `google.maps://?daddr=${destination}&directionsmode=driving`;
      window.location.href = url;

      setTimeout(() => {
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
        window.open(webUrl, "_blank");
      }, 1500);
      return;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    }
  }

  window.open(url, "_blank");
};

export const openWazeDirections = (
  dealer: DealerIssue,
  userLocation?: { lat: number; lng: number },
) => {
  if (!dealer.location?.lat || !dealer.location?.lng) {
    console.warn("GPS coordinates not available for this dealer");
    return;
  }

  const { lat, lng } = dealer.location;
  let url: string;

  if (userLocation) {
    url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes&from=${userLocation.lat},${userLocation.lng}`;
  } else {
    url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  }

  window.open(url, "_blank");
};

export const openAppleMapsDirections = (
  dealer: DealerIssue,
  userLocation?: { lat: number; lng: number },
) => {
  if (!dealer.location?.lat || !dealer.location?.lng) {
    console.warn("GPS coordinates not available for this dealer");
    return;
  }

  const { lat, lng } = dealer.location;
  let url: string;

  if (userLocation) {
    const origin = `${userLocation.lat},${userLocation.lng}`;
    url = `http://maps.apple.com/?saddr=${origin}&daddr=${lat},${lng}&dirflg=d`;
  } else {
    url = `http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
  }

  window.open(url, "_blank");
};

export const openMapboxDirections = (
  dealer: DealerIssue,
  userLocation?: { lat: number; lng: number },
) => {
  if (!dealer.location?.lat || !dealer.location?.lng) {
    console.warn("GPS coordinates not available for this dealer");
    return;
  }

  const { lat, lng } = dealer.location;
  let url: string;

  if (userLocation) {
    url = `https://www.mapbox.com/directions/#/${userLocation.lng},${userLocation.lat};${lng},${lat}`;
  } else {
    url = `https://www.mapbox.com/directions/#//${lng},${lat}`;
  }

  window.open(url, "_blank");
};

export const getDealerDirectionsOptions = () => [
  {
    id: "google",
    name: "Google Maps",
    icon: "🗺️",
    action: openGoogleMapsDirections,
  },
  {
    id: "waze",
    name: "Waze",
    icon: "🚗",
    action: openWazeDirections,
  },
  {
    id: "apple",
    name: "Apple Maps",
    icon: "🍎",
    action: openAppleMapsDirections,
  },
  {
    id: "mapbox",
    name: "Mapbox",
    icon: "📍",
    action: openMapboxDirections,
  },
];

export const hasDealerGpsCoordinates = (dealer: DealerIssue): boolean => {
  return !!(
    dealer.location?.lat &&
    dealer.location?.lng &&
    dealer.location.lat !== 0 &&
    dealer.location.lng !== 0
  );
};

// Geocoding service using Nominatim (OpenStreetMap)
export const geocodeAddress = async (
  address: string,
): Promise<{ lat: number; lng: number } | null> => {
  if (!address || address.trim() === "") {
    return null;
  }

  try {
    const encodedAddress = encodeURIComponent(address.trim());
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`,
    );

    if (!response.ok) {
      console.warn("Geocoding service unavailable");
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      };
    }

    return null;
  } catch (error) {
    console.warn("Error geocoding address:", error);
    return null;
  }
};

// Enhanced transform function with geocoding
export const transformApiDataToDealerIssuesWithGeocoding = async (
  apiData: AdminDealerIssueApiItem[],
): Promise<DealerIssue[]> => {
  const dealers = transformApiDataToDealerIssues(apiData);

  // Process dealers that need geocoding
  const geocodingPromises = dealers.map(async (dealer) => {
    if (!hasDealerGpsCoordinates(dealer) && dealer.location.address) {
      console.log(
        `Geocoding address for ${dealer.dealerName}: ${dealer.location.address}`,
      );

      // Add a small delay to be respectful to the geocoding service
      await new Promise((resolve) => setTimeout(resolve, 100));

      const coords = await geocodeAddress(dealer.location.address);
      if (coords) {
        return {
          ...dealer,
          location: {
            ...dealer.location,
            lat: coords.lat,
            lng: coords.lng,
          },
        };
      }
    }
    return dealer;
  });

  return Promise.all(geocodingPromises);
};

// Default coordinates for dealers without GPS or address (Manila center as fallback)
export const getDefaultCoordinates = () => ({
  lat: 14.5995,
  lng: 120.9842,
});

// Enhanced coordinate validation that handles geocoded addresses
export const getValidCoordinates = (dealer: DealerIssue) => {
  if (hasDealerGpsCoordinates(dealer)) {
    return { lat: dealer.location.lat, lng: dealer.location.lng };
  }

  // Return default coordinates if no valid GPS
  return getDefaultCoordinates();
};
