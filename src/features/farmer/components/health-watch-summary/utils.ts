import {
  type HealthIssue,
  type HealthSummary,
  type IssueType,
} from "./constants";

export const calculateHealthScore = (issues: HealthIssue[]): number => {
  if (issues.length === 0) return 100;

  const totalIssues = issues.length;
  const severityWeights = {
    low: 1,
    medium: 2,
    high: 3,
  };

  const weightedScore = issues.reduce((score, issue) => {
    return score + severityWeights[issue.severity] * issue.count;
  }, 0);

  // Convert to a 0-100 scale (lower is better)
  const maxPossibleScore = totalIssues * 3 * 10; // Assuming max count of 10 per issue
  const healthScore = Math.max(
    0,
    100 - (weightedScore / maxPossibleScore) * 100,
  );

  return Math.round(healthScore);
};

export const calculateHealthSummary = (
  issues: HealthIssue[],
): HealthSummary => {
  const sickCount = issues
    .filter((issue) => issue.type === "sick")
    .reduce((sum, issue) => sum + issue.count, 0);

  const mortalityCount = issues
    .filter((issue) => issue.type === "mortality")
    .reduce((sum, issue) => sum + issue.count, 0);

  const notesCount = issues
    .filter((issue) => issue.type === "notes")
    .reduce((sum, issue) => sum + issue.count, 0);

  const healthScore = calculateHealthScore(issues);

  // Determine trend based on recent issues
  const recentIssues = issues.slice(0, 3);
  const olderIssues = issues.slice(3, 6);

  const recentSeverity = recentIssues.reduce((sum, issue) => {
    const weights = { low: 1, medium: 2, high: 3 };
    return sum + weights[issue.severity] * issue.count;
  }, 0);

  const olderSeverity = olderIssues.reduce((sum, issue) => {
    const weights = { low: 1, medium: 2, high: 3 };
    return sum + weights[issue.severity] * issue.count;
  }, 0);

  let trend: "improving" | "stable" | "declining" = "stable";
  if (recentSeverity < olderSeverity) {
    trend = "improving";
  } else if (recentSeverity > olderSeverity) {
    trend = "declining";
  }

  return {
    totalIssues: issues.length,
    sickCount,
    mortalityCount,
    notesCount,
    healthScore,
    trend,
    lastUpdated: new Date().toISOString().split("T")[0],
  };
};

export const getHealthStatus = (
  score: number,
  totalIssues?: number,
): "excellent" | "good" | "warning" | "critical" => {
  // If no issues, show good status instead of excellent
  if (totalIssues === 0) return "good";

  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  if (score >= 50) return "warning";
  return "critical";
};

export const getHealthStatusColor = (
  status: "excellent" | "good" | "warning" | "critical",
): string => {
  switch (status) {
    case "excellent":
      return "border-green-500 bg-green-100";
    case "good":
      return "border-blue-500 bg-blue-100";
    case "warning":
      return "border-yellow-500 bg-yellow-100";
    case "critical":
      return "border-red-500 bg-red-100";
    default:
      return "border-gray-500 bg-gray-100";
  }
};

export const getSeverityColor = (
  severity: "low" | "medium" | "high",
): string => {
  switch (severity) {
    case "low":
      return "text-green-600 bg-green-100";
    case "medium":
      return "text-yellow-600 bg-yellow-100";
    case "high":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getIssueTypeIcon = (type: IssueType): string => {
  switch (type) {
    case "sick":
      return "🤒";
    case "mortality":
      return "💀";
    case "notes":
      return "📝";
    default:
      return "📋";
  }
};

export const getSmileyIcon = (score: number): string => {
  if (score >= 90) return "😊";
  if (score >= 75) return "🙂";
  if (score >= 50) return "😐";
  return "😟";
};

export const formatDate = (dateString: string): string => {
  // Handle different date formats
  let date: Date;

  // Check if the date is in YYYY/MM/DD format
  if (dateString.includes("/")) {
    const [year, month, day] = dateString.split("/");
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else {
    date = new Date(dateString);
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return dateString; // Return original string if parsing fails
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const filterIssuesByType = (
  issues: HealthIssue[],
  type: IssueType,
): HealthIssue[] => {
  return issues.filter((issue) => issue.type === type);
};

export const groupIssuesByDate = (
  issues: HealthIssue[],
): Record<string, HealthIssue[]> => {
  return issues.reduce(
    (groups, issue) => {
      const date = issue.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(issue);
      return groups;
    },
    {} as Record<string, HealthIssue[]>,
  );
};
