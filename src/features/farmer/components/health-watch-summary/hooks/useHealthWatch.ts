import type {
  HealthIssue as ApiHealthIssue,
  HealthWatch as ApiHealthWatch,
} from "@/features/farmer/types";
import { useMemo, useState } from "react";
import {
  type HealthIssue,
  type HealthSummary,
  ISSUE_TYPES,
  type IssueType,
  TIME_PERIODS,
  type TimePeriod,
} from "../constants";

// Type guard to check if an issue has the expected structure
const isValidHealthIssue = (issue: any): issue is ApiHealthIssue => {
  return (
    issue &&
    typeof issue === "object" &&
    typeof issue.incident_type === "string" &&
    typeof issue.affected_count === "number" &&
    typeof issue.symptoms === "string"
  );
};

// Transform API incident type to component format
const transformApiIncidentType = (apiType: string): IssueType => {
  switch (apiType.toLowerCase()) {
    case "sickness":
    case "sick":
      return ISSUE_TYPES.SICK;
    case "mortality":
      return ISSUE_TYPES.MORTALITY;
    case "feed_rejection":
    case "notes":
    default:
      return ISSUE_TYPES.NOTES;
  }
};

// Transform API severity based on affected count and requires_vet_visit
const transformApiSeverity = (
  affectedCount: number,
  requiresVetVisit: boolean,
): "low" | "medium" | "high" => {
  if (requiresVetVisit || affectedCount >= 10) return "high";
  if (affectedCount >= 5) return "medium";
  return "low";
};

// Transform API data to component format
const transformApiDataToIssues = (
  apiHealthData?: ApiHealthWatch,
): HealthIssue[] => {
  if (
    !apiHealthData?.recent_issues ||
    apiHealthData.recent_issues.length === 0
  ) {
    return [];
  }

  // Filter and transform valid health issues
  return apiHealthData.recent_issues
    .filter(isValidHealthIssue)
    .map((issue, index) => ({
      id: index.toString(),
      date: issue.date || new Date().toISOString().split("T")[0],
      type: transformApiIncidentType(issue.incident_type),
      count: issue.affected_count,
      severity: transformApiSeverity(
        issue.affected_count,
        issue.requires_vet_visit || false,
      ),
      description: issue.symptoms || "No description available",
      notes:
        [
          issue.suspected_cause,
          issue.actions_taken,
          issue.feed_info && `Feed: ${issue.feed_info}`,
        ]
          .filter(Boolean)
          .join(" | ") || "No additional notes",
    }));
};

// Create summary from API data
const createSummaryFromApiData = (
  apiHealthData?: ApiHealthWatch,
): HealthSummary => {
  if (!apiHealthData) {
    return {
      totalIssues: 0,
      sickCount: 0,
      mortalityCount: 0,
      notesCount: 0,
      healthScore: 100,
      trend: "stable" as const,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
  }

  // Calculate trend based on health score
  const getTrend = (score: number): "improving" | "stable" | "declining" => {
    if (score >= 80) return "improving";
    if (score >= 60) return "stable";
    return "declining";
  };

  // Safely access issue_summary with fallbacks
  const issueSummary = apiHealthData.issue_summary || {
    sick: 0,
    mortality: 0,
    notes: 0,
  };

  const totalIssues =
    issueSummary.sick + issueSummary.mortality + issueSummary.notes;

  // Get the most recent date from recent_issues or use current date
  const lastUpdated =
    (apiHealthData.recent_issues &&
      apiHealthData.recent_issues.length > 0 &&
      apiHealthData.recent_issues[0]?.date) ||
    new Date().toISOString().split("T")[0];

  return {
    totalIssues,
    sickCount: issueSummary.sick,
    mortalityCount: issueSummary.mortality,
    notesCount: issueSummary.notes,
    healthScore: apiHealthData.health_score || 100,
    trend: getTrend(apiHealthData.health_score || 100),
    lastUpdated,
  };
};

export const useHealthWatch = (apiHealthData?: ApiHealthWatch) => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(TIME_PERIODS.DAILY);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newIssue, setNewIssue] = useState<Partial<HealthIssue>>({
    date: new Date().toISOString().split("T")[0],
    count: 0,
    type: undefined,
    severity: "low",
    description: "",
    notes: "",
  });

  // Transform API data to issues
  const allIssues = useMemo(() => {
    return transformApiDataToIssues(apiHealthData);
  }, [apiHealthData]);

  // Filter issues based on time period (for now, just return all since API doesn't distinguish)
  const issues = useMemo(() => {
    // In the future, you might want to filter by time period
    // For now, return all issues since API doesn't provide time-specific data
    return allIssues;
  }, [allIssues, timePeriod]);

  // Create summary from API data
  const summary = useMemo(() => {
    return createSummaryFromApiData(apiHealthData);
  }, [apiHealthData]);

  const handleAddIssue = () => {
    if (!newIssue.type || !newIssue.description) return;

    const issue: HealthIssue = {
      id: Date.now().toString(),
      date: newIssue.date || new Date().toISOString().split("T")[0],
      type: newIssue.type,
      count: newIssue.count || 0,
      severity: newIssue.severity || "low",
      description: newIssue.description,
      notes: newIssue.notes,
    };

    // This would typically send data to the API
    console.log("Adding new issue:", issue);

    // Reset form
    setNewIssue({
      date: new Date().toISOString().split("T")[0],
      count: 0,
      type: undefined,
      severity: "low",
      description: "",
      notes: "",
    });

    setIsAddDialogOpen(false);
  };

  const handleNewIssueChange = (updatedIssue: Partial<HealthIssue>) => {
    setNewIssue(updatedIssue);
  };

  return {
    timePeriod,
    setTimePeriod,
    issues,
    summary,
    isAddDialogOpen,
    setIsAddDialogOpen,
    newIssue,
    handleNewIssueChange,
    handleAddIssue,
  };
};
