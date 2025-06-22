export const HEALTH_STATUS = {
  EXCELLENT: "excellent",
  GOOD: "good",
  WARNING: "warning",
  CRITICAL: "critical",
} as const;

export const TIME_PERIODS = {
  DAILY: "daily",
  WEEKLY: "weekly",
} as const;

export const ISSUE_TYPES = {
  SICK: "sick",
  MORTALITY: "mortality",
  NOTES: "notes",
} as const;

export type HealthStatus = (typeof HEALTH_STATUS)[keyof typeof HEALTH_STATUS];
export type TimePeriod = (typeof TIME_PERIODS)[keyof typeof TIME_PERIODS];
export type IssueType = (typeof ISSUE_TYPES)[keyof typeof ISSUE_TYPES];

export interface HealthIssue {
  id: string;
  date: string;
  type: IssueType;
  count: number;
  severity: "low" | "medium" | "high";
  description: string;
  notes?: string;
}

export interface HealthSummary {
  totalIssues: number;
  sickCount: number;
  mortalityCount: number;
  notesCount: number;
  healthScore: number;
  trend: "improving" | "stable" | "declining";
  lastUpdated: string;
}

// Mock data
export const MOCK_DAILY_ISSUES: HealthIssue[] = [
  {
    id: "1",
    date: "2024-01-15",
    type: ISSUE_TYPES.SICK,
    count: 3,
    severity: "low",
    description: "Respiratory symptoms observed",
    notes: "Mild coughing in 3 birds, monitoring closely",
  },
  {
    id: "2",
    date: "2024-01-15",
    type: ISSUE_TYPES.MORTALITY,
    count: 1,
    severity: "medium",
    description: "Single mortality case",
    notes: "Found dead bird in morning inspection",
  },
  {
    id: "3",
    date: "2024-01-14",
    type: ISSUE_TYPES.SICK,
    count: 5,
    severity: "medium",
    description: "Decreased feed intake",
    notes: "5 birds showing reduced appetite",
  },
  {
    id: "4",
    date: "2024-01-14",
    type: ISSUE_TYPES.NOTES,
    count: 0,
    severity: "low",
    description: "General observation",
    notes: "All other birds appear healthy",
  },
  {
    id: "5",
    date: "2024-01-13",
    type: ISSUE_TYPES.MORTALITY,
    count: 2,
    severity: "high",
    description: "Multiple mortalities",
    notes: "Two birds found dead, investigating cause",
  },
];

export const MOCK_WEEKLY_ISSUES: HealthIssue[] = [
  {
    id: "w1",
    date: "2024-01-08",
    type: ISSUE_TYPES.SICK,
    count: 12,
    severity: "medium",
    description: "Weekly sick count",
    notes: "Mostly respiratory issues, improving with treatment",
  },
  {
    id: "w2",
    date: "2024-01-08",
    type: ISSUE_TYPES.MORTALITY,
    count: 4,
    severity: "medium",
    description: "Weekly mortality count",
    notes: "Within acceptable range for flock size",
  },
  {
    id: "w3",
    date: "2024-01-01",
    type: ISSUE_TYPES.SICK,
    count: 8,
    severity: "low",
    description: "Previous week sick count",
    notes: "Minor health issues, all resolved",
  },
  {
    id: "w4",
    date: "2024-01-01",
    type: ISSUE_TYPES.MORTALITY,
    count: 2,
    severity: "low",
    description: "Previous week mortality",
    notes: "Normal mortality rate for this age",
  },
];

export const MOCK_HEALTH_SUMMARY: HealthSummary = {
  totalIssues: 8,
  sickCount: 3,
  mortalityCount: 1,
  notesCount: 1,
  healthScore: 85,
  trend: "improving",
  lastUpdated: "2024-01-15",
};
