import type {
  DealerIssue,
  IssueMetrics,
  MapPin,
  SeverityLevel,
  IssueTypeKey,
} from "./constants";
import { ISSUE_TYPES, ISSUE_STATUS } from "./constants";

export const calculateIssueMetrics = (dealers: DealerIssue[]): IssueMetrics => {
  const totalDealers = dealers.length;
  const allIssues = dealers.flatMap((dealer) => dealer.issues);
  const totalIssues = allIssues.length;

  const stockoutIssues = allIssues.filter(
    (issue) => issue.type === ISSUE_TYPES.STOCKOUT
  ).length;
  const deliveryIssues = allIssues.filter(
    (issue) => issue.type === ISSUE_TYPES.DELIVERY
  ).length;
  const pricingIssues = allIssues.filter(
    (issue) => issue.type === ISSUE_TYPES.PRICING
  ).length;

  const criticalIssues = dealers.filter(
    (dealer) => dealer.severity === "critical"
  ).length;
  const resolvedIssues = allIssues.filter(
    (issue) => issue.status === ISSUE_STATUS.RESOLVED
  ).length;

  return {
    totalDealers,
    totalIssues,
    stockoutIssues,
    deliveryIssues,
    pricingIssues,
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
  severity?: SeverityLevel
): DealerIssue[] => {
  if (!severity) return dealers;
  return dealers.filter((dealer) => dealer.severity === severity);
};

export const filterDealersByIssueType = (
  dealers: DealerIssue[],
  issueType?: IssueTypeKey
): DealerIssue[] => {
  if (!issueType) return dealers;
  return dealers.filter((dealer) =>
    dealer.issues.some((issue) => issue.type === issueType)
  );
};

export const sortDealersBySeverity = (
  dealers: DealerIssue[]
): DealerIssue[] => {
  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  return [...dealers].sort(
    (a, b) => severityOrder[b.severity] - severityOrder[a.severity]
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
  };
  return classes[type];
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
    stockout: "Stock Out",
    delivery: "Delivery",
    pricing: "Pricing",
  };
  return labels[type];
};

export const calculateResolutionRate = (dealers: DealerIssue[]): number => {
  const allIssues = dealers.flatMap((dealer) => dealer.issues);
  const resolvedIssues = allIssues.filter(
    (issue) => issue.status === ISSUE_STATUS.RESOLVED
  );
  return allIssues.length > 0
    ? (resolvedIssues.length / allIssues.length) * 100
    : 0;
};

export const getHeatmapData = (
  dealers: DealerIssue[]
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
  userLocation?: { lat: number; lng: number }
) => {
  if (!dealer.location?.lat || !dealer.location?.lng) {
    console.warn("No GPS coordinates available for this dealer");
    return;
  }

  // Check if user is on mobile device
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
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
  userLocation?: { lat: number; lng: number }
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
  userLocation?: { lat: number; lng: number }
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
  userLocation?: { lat: number; lng: number }
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
  return !!(dealer.location?.lat && dealer.location?.lng);
};
