export interface FarmRegistration {
  id: string;
  farmName: string;
  farmerName: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    region: string;
    province: string;
  };
  registrationDate: string;
  salesRep: string;
  salesRepId: string;
  farmSize: number; // in hectares
  cropTypes: string[];
  registrationType: "new" | "expansion" | "conversion";
  status: "active" | "pending" | "inactive";
  monthlyRevenue: number;
  contactInfo: {
    phone: string;
    email: string;
  };
}

export interface SalesRep {
  id: string;
  name: string;
  territory: string;
  registrationsThisMonth: number;
  totalRegistrations: number;
  targetRegistrations: number;
}

export interface RegistrationMetrics {
  totalRegistrations: number;
  newAccounts: number;
  expansions: number;
  conversions: number;
  thisWeek: number;
  thisMonth: number;
  averageFarmSize: number;
  totalRevenue: number;
  penetrationRate: number;
}

export interface TimeSeriesData {
  date: string;
  registrations: number;
  revenue: number;
  farmSize: number;
}

export const REGISTRATION_TYPES = {
  NEW: "new",
  EXPANSION: "expansion",
  CONVERSION: "conversion",
} as const;

export const REGISTRATION_STATUS = {
  ACTIVE: "active",
  PENDING: "pending",
  INACTIVE: "inactive",
} as const;

export const VIEW_MODES = {
  CHART: "chart",
  MAP: "map",
  STATS: "stats",
} as const;

export const TIME_PERIODS = {
  WEEK: "week",
  MONTH: "month",
  QUARTER: "quarter",
  YEAR: "year",
} as const;

export const CHART_TYPES = {
  REGISTRATIONS: "registrations",
  REVENUE: "revenue",
  FARM_SIZE: "farmSize",
} as const;

export const CROP_TYPES = [
  "Rice",
  "Corn",
  "Sugarcane",
  "Coconut",
  "Banana",
  "Vegetables",
  "Fruits",
  "Coffee",
  "Cacao",
  "Other",
];

export const PHILIPPINE_REGIONS = [
  "NCR",
  "Ilocos Region",
  "Cagayan Valley",
  "Central Luzon",
  "CALABARZON",
  "MIMAROPA",
  "Bicol Region",
  "Western Visayas",
  "Central Visayas",
  "Eastern Visayas",
  "Zamboanga Peninsula",
  "Northern Mindanao",
  "Davao Region",
  "SOCCSKSARGEN",
  "Caraga",
  "BARMM",
  "Cordillera",
];

// Mock Sales Reps Data
export const MOCK_SALES_REPS: SalesRep[] = [
  {
    id: "rep-001",
    name: "Maria Santos",
    territory: "Central Luzon",
    registrationsThisMonth: 12,
    totalRegistrations: 145,
    targetRegistrations: 15,
  },
  {
    id: "rep-002",
    name: "Juan Dela Cruz",
    territory: "CALABARZON",
    registrationsThisMonth: 8,
    totalRegistrations: 98,
    targetRegistrations: 12,
  },
  {
    id: "rep-003",
    name: "Pedro Reyes",
    territory: "Central Visayas",
    registrationsThisMonth: 15,
    totalRegistrations: 187,
    targetRegistrations: 18,
  },
  {
    id: "rep-004",
    name: "Ana Rodriguez",
    territory: "Davao Region",
    registrationsThisMonth: 10,
    totalRegistrations: 156,
    targetRegistrations: 14,
  },
  {
    id: "rep-005",
    name: "Carlos Mendoza",
    territory: "Western Visayas",
    registrationsThisMonth: 6,
    totalRegistrations: 89,
    targetRegistrations: 10,
  },
];

// Mock Farm Registration Data
export const MOCK_FARM_REGISTRATIONS: FarmRegistration[] = [
  {
    id: "farm-001",
    farmName: "Sunrise Rice Farm",
    farmerName: "Roberto Garcia",
    location: {
      lat: 15.4818,
      lng: 120.6928,
      address: "San Fernando, Pampanga",
      region: "Central Luzon",
      province: "Pampanga",
    },
    registrationDate: "2024-01-15",
    salesRep: "Maria Santos",
    salesRepId: "rep-001",
    farmSize: 12.5,
    cropTypes: ["Rice", "Corn"],
    registrationType: "new",
    status: "active",
    monthlyRevenue: 45000,
    contactInfo: {
      phone: "+63 917 123 4567",
      email: "roberto@sunriserice.com",
    },
  },
  {
    id: "farm-002",
    farmName: "Golden Harvest Cooperative",
    farmerName: "Elena Villanueva",
    location: {
      lat: 14.2456,
      lng: 121.0467,
      address: "Los Baños, Laguna",
      region: "CALABARZON",
      province: "Laguna",
    },
    registrationDate: "2024-01-18",
    salesRep: "Juan Dela Cruz",
    salesRepId: "rep-002",
    farmSize: 25.3,
    cropTypes: ["Rice", "Vegetables"],
    registrationType: "expansion",
    status: "active",
    monthlyRevenue: 78000,
    contactInfo: {
      phone: "+63 918 987 6543",
      email: "elena@goldenharvest.coop",
    },
  },
  {
    id: "farm-003",
    farmName: "Mindanao Agri Corp",
    farmerName: "Miguel Fernandez",
    location: {
      lat: 7.0731,
      lng: 125.6128,
      address: "Davao City, Davao del Sur",
      region: "Davao Region",
      province: "Davao del Sur",
    },
    registrationDate: "2024-01-20",
    salesRep: "Ana Rodriguez",
    salesRepId: "rep-004",
    farmSize: 45.8,
    cropTypes: ["Banana", "Coconut", "Cacao"],
    registrationType: "new",
    status: "active",
    monthlyRevenue: 125000,
    contactInfo: {
      phone: "+63 920 555 7890",
      email: "miguel@mindanaoagri.com",
    },
  },
  {
    id: "farm-004",
    farmName: "Cebu Highland Farms",
    farmerName: "Sofia Cruz",
    location: {
      lat: 10.3157,
      lng: 123.8854,
      address: "Cebu City, Cebu",
      region: "Central Visayas",
      province: "Cebu",
    },
    registrationDate: "2024-01-12",
    salesRep: "Pedro Reyes",
    salesRepId: "rep-003",
    farmSize: 18.7,
    cropTypes: ["Vegetables", "Coffee"],
    registrationType: "conversion",
    status: "active",
    monthlyRevenue: 62000,
    contactInfo: {
      phone: "+63 932 444 5566",
      email: "sofia@cebuhighland.ph",
    },
  },
  {
    id: "farm-005",
    farmName: "Iloilo Sugar Plantation",
    farmerName: "Antonio Lopez",
    location: {
      lat: 10.7202,
      lng: 122.5621,
      address: "Iloilo City, Iloilo",
      region: "Western Visayas",
      province: "Iloilo",
    },
    registrationDate: "2024-01-22",
    salesRep: "Carlos Mendoza",
    salesRepId: "rep-005",
    farmSize: 67.2,
    cropTypes: ["Sugarcane", "Rice"],
    registrationType: "new",
    status: "pending",
    monthlyRevenue: 0,
    contactInfo: {
      phone: "+63 945 777 8899",
      email: "antonio@iloilosugar.com.ph",
    },
  },
  {
    id: "farm-006",
    farmName: "Northern Luzon Organic",
    farmerName: "Carmen Valdez",
    location: {
      lat: 16.6158,
      lng: 120.3209,
      address: "Baguio City, Benguet",
      region: "Cordillera",
      province: "Benguet",
    },
    registrationDate: "2024-01-10",
    salesRep: "Maria Santos",
    salesRepId: "rep-001",
    farmSize: 8.9,
    cropTypes: ["Vegetables", "Fruits"],
    registrationType: "new",
    status: "active",
    monthlyRevenue: 35000,
    contactInfo: {
      phone: "+63 926 111 2233",
      email: "carmen@nlorganic.com",
    },
  },
];

// Mock Time Series Data (last 12 weeks)
export const MOCK_TIME_SERIES_DATA: TimeSeriesData[] = [
  { date: "2024-01-01", registrations: 3, revenue: 125000, farmSize: 15.2 },
  { date: "2024-01-08", registrations: 5, revenue: 210000, farmSize: 18.7 },
  { date: "2024-01-15", registrations: 4, revenue: 180000, farmSize: 22.1 },
  { date: "2024-01-22", registrations: 7, revenue: 290000, farmSize: 19.5 },
  { date: "2024-01-29", registrations: 6, revenue: 245000, farmSize: 16.8 },
  { date: "2024-02-05", registrations: 8, revenue: 350000, farmSize: 25.3 },
  { date: "2024-02-12", registrations: 5, revenue: 195000, farmSize: 14.6 },
  { date: "2024-02-19", registrations: 9, revenue: 380000, farmSize: 28.9 },
  { date: "2024-02-26", registrations: 4, revenue: 165000, farmSize: 12.4 },
  { date: "2024-03-05", registrations: 11, revenue: 445000, farmSize: 31.7 },
  { date: "2024-03-12", registrations: 7, revenue: 285000, farmSize: 20.3 },
  { date: "2024-03-19", registrations: 6, revenue: 235000, farmSize: 17.9 },
];

export type RegistrationType =
  (typeof REGISTRATION_TYPES)[keyof typeof REGISTRATION_TYPES];
export type RegistrationStatus =
  (typeof REGISTRATION_STATUS)[keyof typeof REGISTRATION_STATUS];
export type ViewMode = (typeof VIEW_MODES)[keyof typeof VIEW_MODES];
export type TimePeriod = (typeof TIME_PERIODS)[keyof typeof TIME_PERIODS];
export type ChartType = (typeof CHART_TYPES)[keyof typeof CHART_TYPES];
