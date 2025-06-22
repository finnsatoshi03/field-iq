export const VISIT_STATUS = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  OVERDUE: "overdue",
  CANCELLED: "cancelled",
} as const;

export const VISIT_TYPES = {
  INITIAL: "initial",
  FOLLOW_UP: "follow_up",
  MAINTENANCE: "maintenance",
  DELIVERY: "delivery",
} as const;

export type VisitStatus = (typeof VISIT_STATUS)[keyof typeof VISIT_STATUS];
export type VisitType = (typeof VISIT_TYPES)[keyof typeof VISIT_TYPES];

export interface Visit {
  id: string;
  farmName: string;
  location: string;
  scheduledDate: Date;
  status: VisitStatus;
  type: VisitType;
  notes?: string;
  gpsCoordinates?: {
    lat: number;
    lng: number;
  };
  contactPerson: string;
  phoneNumber: string;
  priority: "high" | "medium" | "low";
}

export interface DailyPlan {
  id: string;
  date: Date;
  tasks: Task[];
  totalVisits: number;
  completedVisits: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  type: "visit" | "follow_up" | "administrative" | "other";
  estimatedDuration: number; // in minutes
}

// Mock data
export const mockVisits: Visit[] = [
  {
    id: "1",
    farmName: "Makiling Farm",
    location: "Laguna",
    scheduledDate: new Date("2024-01-15T09:00:00"),
    status: VISIT_STATUS.SCHEDULED,
    type: VISIT_TYPES.INITIAL,
    contactPerson: "Juan dela Cruz",
    phoneNumber: "+63 917 123 4567",
    priority: "high",
    notes: "New client consultation for rice farming equipment",
    gpsCoordinates: { lat: 14.1693, lng: 121.2416 },
  },
  {
    id: "2",
    farmName: "Sunrise Agriculture",
    location: "Bataan",
    scheduledDate: new Date("2024-01-15T14:30:00"),
    status: VISIT_STATUS.SCHEDULED,
    type: VISIT_TYPES.FOLLOW_UP,
    contactPerson: "Maria Santos",
    phoneNumber: "+63 918 987 6543",
    priority: "medium",
    notes: "Follow up on fertilizer delivery and usage feedback",
    gpsCoordinates: { lat: 14.676, lng: 120.4842 },
  },
  {
    id: "3",
    farmName: "Golden Harvest Co.",
    location: "Pampanga",
    scheduledDate: new Date("2024-01-12T10:00:00"),
    status: VISIT_STATUS.OVERDUE,
    type: VISIT_TYPES.MAINTENANCE,
    contactPerson: "Pedro Garcia",
    phoneNumber: "+63 919 555 1234",
    priority: "high",
    notes: "Equipment maintenance check - irrigation system",
    gpsCoordinates: { lat: 15.0794, lng: 120.62 },
  },
  {
    id: "4",
    farmName: "Verde Valley Farm",
    location: "Nueva Ecija",
    scheduledDate: new Date("2024-01-16T11:00:00"),
    status: VISIT_STATUS.SCHEDULED,
    type: VISIT_TYPES.DELIVERY,
    contactPerson: "Ana Rodriguez",
    phoneNumber: "+63 920 777 8888",
    priority: "medium",
    notes: "Seed delivery and planting consultation",
    gpsCoordinates: { lat: 15.5784, lng: 120.9726 },
  },
  {
    id: "5",
    farmName: "Pacific Agri Corp",
    location: "Tarlac",
    scheduledDate: new Date("2024-01-17T08:30:00"),
    status: VISIT_STATUS.SCHEDULED,
    type: VISIT_TYPES.FOLLOW_UP,
    contactPerson: "Roberto Mendez",
    phoneNumber: "+63 921 333 2222",
    priority: "low",
    notes: "Quarterly review and contract renewal discussion",
    gpsCoordinates: { lat: 15.4735, lng: 120.5965 },
  },
  {
    id: "6",
    farmName: "Mountain View Farms",
    location: "Benguet",
    scheduledDate: new Date("2024-01-10T13:00:00"),
    status: VISIT_STATUS.OVERDUE,
    type: VISIT_TYPES.INITIAL,
    contactPerson: "Lisa Fernandez",
    phoneNumber: "+63 922 444 5555",
    priority: "high",
    notes: "Organic farming consultation and product demo",
    gpsCoordinates: { lat: 16.4023, lng: 120.596 },
  },
];

export const mockDailyPlans: DailyPlan[] = [
  {
    id: "1",
    date: new Date("2024-01-15"),
    totalVisits: 2,
    completedVisits: 0,
    tasks: [
      {
        id: "1",
        title: "Visit Makiling Farm",
        description: "New client consultation for rice farming equipment",
        completed: false,
        type: "visit",
        estimatedDuration: 120,
      },
      {
        id: "2",
        title: "Follow up with Sunrise Agriculture",
        description: "Check on fertilizer delivery feedback",
        completed: false,
        type: "follow_up",
        estimatedDuration: 90,
      },
      {
        id: "3",
        title: "Update CRM records",
        description: "Update client interaction logs and next steps",
        completed: false,
        type: "administrative",
        estimatedDuration: 30,
      },
    ],
  },
  {
    id: "2",
    date: new Date("2024-01-16"),
    totalVisits: 1,
    completedVisits: 0,
    tasks: [
      {
        id: "4",
        title: "Seed delivery to Verde Valley Farm",
        description: "Deliver seeds and provide planting consultation",
        completed: false,
        type: "visit",
        estimatedDuration: 180,
      },
      {
        id: "5",
        title: "Prepare quarterly reports",
        description: "Compile Q4 sales and visit reports",
        completed: false,
        type: "administrative",
        estimatedDuration: 60,
      },
    ],
  },
];
