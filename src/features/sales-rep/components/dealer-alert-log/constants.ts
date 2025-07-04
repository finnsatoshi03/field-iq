// // Types
// export interface Alert {
//   id: number;
//   type: "warning" | "success";
//   title: string;
//   description: string;
//   timestamp: string;
// }

// export interface Farm {
//   name: string;
//   location: string;
//   status: "visited" | "added";
//   datetime: Date;
// }

// // Mock Data
// export const mockAlerts: Alert[] = [
//   {
//     id: 1,
//     type: "warning",
//     title: "Low Stock Alert",
//     description: "Fertilizer inventory below 20% at Bataan Branch",
//     timestamp: "2 hours ago",
//   },
//   {
//     id: 2,
//     type: "success",
//     title: "New Order Received",
//     description: "₱45,000 order from Rodriguez Farm Co.",
//     timestamp: "4 hours ago",
//   },
//   {
//     id: 3,
//     type: "warning",
//     title: "Delayed Delivery",
//     description: "Shipment to Pampanga delayed due to weather",
//     timestamp: "6 hours ago",
//   },
//   {
//     id: 4,
//     type: "success",
//     title: "Payment Received",
//     description: "₱32,000 payment from Santos Agricultural",
//     timestamp: "1 day ago",
//   },
//   {
//     id: 5,
//     type: "warning",
//     title: "Equipment Maintenance",
//     description: "Scheduled maintenance for delivery truck #3",
//     timestamp: "2 days ago",
//   },
//   {
//     id: 6,
//     type: "success",
//     title: "Contract Renewal",
//     description: "₱120,000 annual contract renewed with Mindanao Farms",
//     timestamp: "3 days ago",
//   },
// ];

// export const mockFarms: Farm[] = [
//   {
//     name: "Makiling Farm",
//     location: "Laguna",
//     status: "visited",
//     datetime: new Date("2024-01-15T14:30:00"),
//   },
//   {
//     name: "Sunrise Agriculture",
//     location: "Bataan",
//     status: "added",
//     datetime: new Date("2024-01-15T11:45:00"),
//   },
//   {
//     name: "Golden Harvest Co.",
//     location: "Pampanga",
//     status: "visited",
//     datetime: new Date("2024-01-14T16:20:00"),
//   },
//   {
//     name: "Verde Valley Farm",
//     location: "Nueva Ecija",
//     status: "added",
//     datetime: new Date("2024-01-14T09:15:00"),
//   },
//   {
//     name: "Pacific Agri Corp",
//     location: "Tarlac",
//     status: "visited",
//     datetime: new Date("2024-01-13T13:00:00"),
//   },
//   {
//     name: "Mountain View Farms",
//     location: "Benguet",
//     status: "added",
//     datetime: new Date("2024-01-12T10:20:00"),
//   },
//   {
//     name: "Coastal Agriculture Ltd",
//     location: "Pangasinan",
//     status: "visited",
//     datetime: new Date("2024-01-11T15:45:00"),
//   },
// ];


// Types
export interface Alert {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface Farm {
  name: string;
  location: string;
  status: string;
  datetime: Date;
}

// Fetch Alerts
export async function fetchAlerts(userId: number): Promise<Alert[]> {
  const res = await fetch(`http://127.0.0.1:8000/salesrep/sales-rep-logs?user_id=${userId}`);
  const json = await res.json();
  const data = json.data.data;
    
  
  return data.map((item: any, index: number) => ({
    id: index + 1,
    type: item.type,
    title: item.title,
    description: item.description,
    timestamp: getRelativeTime(item.timestamp),
  }));
}

export async function fetchFarms(userId: number): Promise<Farm[]> {
  const res = await fetch(`http://127.0.0.1:8000/salesrep/farms?user_id=${userId}`);
  const json = await res.json();
  const data = json.data.farms
    
  ;

  return data.map((item: any) => {
    const dateStr = `${item.visit_date} ${item.visit_time}`;
    return {
      name: item.farm_name,
      location: item.location,
      status: item.visit_type === "completed_visit" ? "visited" : "added",
      datetime: new Date(dateStr),
    };
  });
}

// Helper: Relative time formatter
function getRelativeTime(dateString: string): string {
  const now = new Date();
  const then = new Date(dateString);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}
