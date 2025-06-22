export interface DealerIssue {
  id: string;
  dealerName: string;
  dealerCode: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    region: string;
  };
  issues: IssueType[];
  severity: "low" | "medium" | "high" | "critical";
  lastUpdated: string;
  contactPerson: string;
  phone: string;
  email: string;
}

export interface IssueType {
  type: "stockout" | "delivery" | "pricing";
  description: string;
  reportedDate: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
}

export interface IssueMetrics {
  totalDealers: number;
  totalIssues: number;
  stockoutIssues: number;
  deliveryIssues: number;
  pricingIssues: number;
  criticalIssues: number;
  resolvedIssues: number;
}

export interface MapPin {
  id: string;
  position: { lat: number; lng: number };
  severity: "low" | "medium" | "high" | "critical";
  dealerName: string;
  issueCount: number;
}

export const ISSUE_TYPES = {
  STOCKOUT: "stockout",
  DELIVERY: "delivery",
  PRICING: "pricing",
} as const;

export const SEVERITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

export const ISSUE_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in-progress",
  RESOLVED: "resolved",
} as const;

export const SEVERITY_COLORS = {
  low: "#10b981", // emerald-500
  medium: "#f59e0b", // amber-500
  high: "#ef4444", // red-500
  critical: "#dc2626", // red-600
} as const;

export const ISSUE_TYPE_COLORS = {
  stockout: "#ef4444", // red-500
  delivery: "#f59e0b", // amber-500
  pricing: "#8b5cf6", // violet-500
} as const;

export const MOCK_DEALER_ISSUES: DealerIssue[] = [
  {
    id: "1",
    dealerName: "Manila Central Agri Supply",
    dealerCode: "MCA-001",
    location: {
      lat: 14.5995,
      lng: 120.9842,
      address: "Quezon City, Metro Manila",
      region: "NCR",
    },
    issues: [
      {
        type: "stockout",
        description: "Rice seeds out of stock for 2 weeks",
        reportedDate: "2024-01-15",
        status: "open",
        priority: "high",
      },
      {
        type: "delivery",
        description: "Delayed fertilizer delivery",
        reportedDate: "2024-01-18",
        status: "in-progress",
        priority: "medium",
      },
    ],
    severity: "high",
    lastUpdated: "2024-01-20",
    contactPerson: "Juan Dela Cruz",
    phone: "+63 917 123 4567",
    email: "juan@manila-agri.com",
  },
  {
    id: "2",
    dealerName: "Cebu Farm Solutions",
    dealerCode: "CFS-002",
    location: {
      lat: 10.3157,
      lng: 123.8854,
      address: "Cebu City, Cebu",
      region: "Central Visayas",
    },
    issues: [
      {
        type: "pricing",
        description: "Pricing discrepancy on pesticides",
        reportedDate: "2024-01-19",
        status: "open",
        priority: "medium",
      },
    ],
    severity: "medium",
    lastUpdated: "2024-01-19",
    contactPerson: "Maria Santos",
    phone: "+63 932 987 6543",
    email: "maria@cebu-farm.com",
  },
  {
    id: "3",
    dealerName: "Davao Agricultural Hub",
    dealerCode: "DAH-003",
    location: {
      lat: 7.1907,
      lng: 125.4553,
      address: "Davao City, Davao del Sur",
      region: "Davao Region",
    },
    issues: [
      {
        type: "stockout",
        description: "Critical shortage of corn seeds",
        reportedDate: "2024-01-16",
        status: "open",
        priority: "high",
      },
      {
        type: "delivery",
        description: "Equipment delivery issues",
        reportedDate: "2024-01-17",
        status: "in-progress",
        priority: "high",
      },
      {
        type: "pricing",
        description: "Incorrect pricing on bulk orders",
        reportedDate: "2024-01-18",
        status: "resolved",
        priority: "low",
      },
    ],
    severity: "critical",
    lastUpdated: "2024-01-20",
    contactPerson: "Pedro Reyes",
    phone: "+63 945 555 1234",
    email: "pedro@davao-agri.com",
  },
  {
    id: "4",
    dealerName: "Baguio Highland Supplies",
    dealerCode: "BHS-004",
    location: {
      lat: 16.4023,
      lng: 120.596,
      address: "Baguio City, Benguet",
      region: "Cordillera",
    },
    issues: [
      {
        type: "delivery",
        description: "Weather-related delivery delays",
        reportedDate: "2024-01-14",
        status: "resolved",
        priority: "medium",
      },
    ],
    severity: "low",
    lastUpdated: "2024-01-19",
    contactPerson: "Anna Flores",
    phone: "+63 926 777 8888",
    email: "anna@baguio-highland.com",
  },
  {
    id: "5",
    dealerName: "Iloilo Rice Center",
    dealerCode: "IRC-005",
    location: {
      lat: 10.7202,
      lng: 122.5621,
      address: "Iloilo City, Iloilo",
      region: "Western Visayas",
    },
    issues: [
      {
        type: "stockout",
        description: "Herbicide shortage affecting multiple farms",
        reportedDate: "2024-01-17",
        status: "in-progress",
        priority: "high",
      },
    ],
    severity: "high",
    lastUpdated: "2024-01-20",
    contactPerson: "Roberto Cruz",
    phone: "+63 918 444 5555",
    email: "roberto@iloilo-rice.com",
  },
];

export const VIEW_MODES = {
  MAP: "map",
  HEATMAP: "heatmap",
  LIST: "list",
} as const;

export type ViewMode = (typeof VIEW_MODES)[keyof typeof VIEW_MODES];
export type IssueTypeKey = (typeof ISSUE_TYPES)[keyof typeof ISSUE_TYPES];
export type SeverityLevel =
  (typeof SEVERITY_LEVELS)[keyof typeof SEVERITY_LEVELS];
export type IssueStatusType = (typeof ISSUE_STATUS)[keyof typeof ISSUE_STATUS];
