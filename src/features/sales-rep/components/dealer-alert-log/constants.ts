// Types
export interface Alert {
  id: number;
  type: "warning" | "success";
  title: string;
  description: string;
  timestamp: string;
}

export interface Farm {
  name: string;
  location: string;
  status: "visited" | "added";
  datetime: Date;
}

// Mock Data
export const mockAlerts: Alert[] = [
  {
    id: 1,
    type: "warning",
    title: "Low Stock Alert",
    description: "Fertilizer inventory below 20% at Bataan Branch",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "success",
    title: "New Order Received",
    description: "₱45,000 order from Rodriguez Farm Co.",
    timestamp: "4 hours ago",
  },
  {
    id: 3,
    type: "warning",
    title: "Delayed Delivery",
    description: "Shipment to Pampanga delayed due to weather",
    timestamp: "6 hours ago",
  },
  {
    id: 4,
    type: "success",
    title: "Payment Received",
    description: "₱32,000 payment from Santos Agricultural",
    timestamp: "1 day ago",
  },
  {
    id: 5,
    type: "warning",
    title: "Equipment Maintenance",
    description: "Scheduled maintenance for delivery truck #3",
    timestamp: "2 days ago",
  },
  {
    id: 6,
    type: "success",
    title: "Contract Renewal",
    description: "₱120,000 annual contract renewed with Mindanao Farms",
    timestamp: "3 days ago",
  },
];

export const mockFarms: Farm[] = [
  {
    name: "Makiling Farm",
    location: "Laguna",
    status: "visited",
    datetime: new Date("2024-01-15T14:30:00"),
  },
  {
    name: "Sunrise Agriculture",
    location: "Bataan",
    status: "added",
    datetime: new Date("2024-01-15T11:45:00"),
  },
  {
    name: "Golden Harvest Co.",
    location: "Pampanga",
    status: "visited",
    datetime: new Date("2024-01-14T16:20:00"),
  },
  {
    name: "Verde Valley Farm",
    location: "Nueva Ecija",
    status: "added",
    datetime: new Date("2024-01-14T09:15:00"),
  },
  {
    name: "Pacific Agri Corp",
    location: "Tarlac",
    status: "visited",
    datetime: new Date("2024-01-13T13:00:00"),
  },
  {
    name: "Mountain View Farms",
    location: "Benguet",
    status: "added",
    datetime: new Date("2024-01-12T10:20:00"),
  },
  {
    name: "Coastal Agriculture Ltd",
    location: "Pangasinan",
    status: "visited",
    datetime: new Date("2024-01-11T15:45:00"),
  },
];
