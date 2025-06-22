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
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
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
