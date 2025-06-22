import {
  format,
  parseISO,
  subDays,
  subWeeks,
  subMonths,
  isAfter,
  isBefore,
  isWithinInterval,
} from "date-fns";
import type {
  FarmRegistration,
  SalesRep,
  RegistrationMetrics,
  TimeSeriesData,
  RegistrationType,
  RegistrationStatus,
  TimePeriod,
  ChartType,
} from "./constants";
import {
  MOCK_FARM_REGISTRATIONS,
  MOCK_SALES_REPS,
  MOCK_TIME_SERIES_DATA,
} from "./constants";

export interface FilterOptions {
  registrationType?: RegistrationType | "all";
  status?: RegistrationStatus | "all";
  salesRep?: string | "all";
  region?: string | "all";
  timePeriod?: TimePeriod;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export const getFilteredRegistrations = (
  registrations: FarmRegistration[] = MOCK_FARM_REGISTRATIONS,
  filters: FilterOptions = {}
): FarmRegistration[] => {
  return registrations.filter((registration) => {
    // Registration Type Filter
    if (filters.registrationType && filters.registrationType !== "all") {
      if (registration.registrationType !== filters.registrationType)
        return false;
    }

    // Status Filter
    if (filters.status && filters.status !== "all") {
      if (registration.status !== filters.status) return false;
    }

    // Sales Rep Filter
    if (filters.salesRep && filters.salesRep !== "all") {
      if (registration.salesRepId !== filters.salesRep) return false;
    }

    // Region Filter
    if (filters.region && filters.region !== "all") {
      if (registration.location.region !== filters.region) return false;
    }

    // Date Range Filter
    if (filters.dateRange) {
      const registrationDate = parseISO(registration.registrationDate);
      if (
        !isWithinInterval(registrationDate, {
          start: filters.dateRange.from,
          end: filters.dateRange.to,
        })
      )
        return false;
    }

    // Time Period Filter
    if (filters.timePeriod) {
      const registrationDate = parseISO(registration.registrationDate);
      const now = new Date();
      let threshold: Date;

      switch (filters.timePeriod) {
        case "week":
          threshold = subWeeks(now, 1);
          break;
        case "month":
          threshold = subMonths(now, 1);
          break;
        case "quarter":
          threshold = subMonths(now, 3);
          break;
        case "year":
          threshold = subMonths(now, 12);
          break;
        default:
          threshold = subMonths(now, 1);
      }

      if (isBefore(registrationDate, threshold)) return false;
    }

    return true;
  });
};

export const calculateRegistrationMetrics = (
  registrations: FarmRegistration[] = MOCK_FARM_REGISTRATIONS
): RegistrationMetrics => {
  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const oneMonthAgo = subMonths(now, 1);

  const thisWeekRegistrations = registrations.filter((reg) =>
    isAfter(parseISO(reg.registrationDate), oneWeekAgo)
  );

  const thisMonthRegistrations = registrations.filter((reg) =>
    isAfter(parseISO(reg.registrationDate), oneMonthAgo)
  );

  const newAccounts = registrations.filter(
    (reg) => reg.registrationType === "new"
  ).length;
  const expansions = registrations.filter(
    (reg) => reg.registrationType === "expansion"
  ).length;
  const conversions = registrations.filter(
    (reg) => reg.registrationType === "conversion"
  ).length;

  const activeRegistrations = registrations.filter(
    (reg) => reg.status === "active"
  );
  const totalFarmSize = activeRegistrations.reduce(
    (sum, reg) => sum + reg.farmSize,
    0
  );
  const averageFarmSize =
    activeRegistrations.length > 0
      ? totalFarmSize / activeRegistrations.length
      : 0;

  const totalRevenue = activeRegistrations.reduce(
    (sum, reg) => sum + reg.monthlyRevenue,
    0
  );

  // Calculate penetration rate (mock calculation based on total potential farms)
  const totalPotentialFarms = 10000; // Mock value
  const penetrationRate = (registrations.length / totalPotentialFarms) * 100;

  return {
    totalRegistrations: registrations.length,
    newAccounts,
    expansions,
    conversions,
    thisWeek: thisWeekRegistrations.length,
    thisMonth: thisMonthRegistrations.length,
    averageFarmSize: Math.round(averageFarmSize * 10) / 10,
    totalRevenue,
    penetrationRate: Math.round(penetrationRate * 100) / 100,
  };
};

export const getRegistrationsByRegion = (
  registrations: FarmRegistration[] = MOCK_FARM_REGISTRATIONS
): Record<string, number> => {
  return registrations.reduce(
    (acc, registration) => {
      const region = registration.location.region;
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
};

export const getRegistrationsBySalesRep = (
  registrations: FarmRegistration[] = MOCK_FARM_REGISTRATIONS,
  salesReps: SalesRep[] = MOCK_SALES_REPS
): SalesRep[] => {
  const registrationCounts = registrations.reduce(
    (acc, registration) => {
      const repId = registration.salesRepId;
      acc[repId] = (acc[repId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return salesReps.map((rep) => ({
    ...rep,
    registrationsThisMonth: registrationCounts[rep.id] || 0,
  }));
};

export const getChartData = (
  chartType: ChartType,
  timePeriod: TimePeriod = "month",
  timeSeriesData: TimeSeriesData[] = MOCK_TIME_SERIES_DATA
): Array<{ date: string; value: number; formattedDate: string }> => {
  const now = new Date();
  let filteredData = timeSeriesData;

  // Filter data based on time period
  switch (timePeriod) {
    case "week":
      filteredData = timeSeriesData.slice(-4); // Last 4 weeks
      break;
    case "month":
      filteredData = timeSeriesData.slice(-12); // Last 12 weeks
      break;
    case "quarter":
      filteredData = timeSeriesData.slice(-12); // Last quarter (12 weeks)
      break;
    case "year":
      filteredData = timeSeriesData; // All available data
      break;
  }

  return filteredData.map((data) => {
    const date = parseISO(data.date);
    let value: number;

    switch (chartType) {
      case "registrations":
        value = data.registrations;
        break;
      case "revenue":
        value = data.revenue;
        break;
      case "farmSize":
        value = data.farmSize;
        break;
      default:
        value = data.registrations;
    }

    return {
      date: data.date,
      value,
      formattedDate: format(date, "MMM dd"),
    };
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat("en-PH").format(number);
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage}%`;
};

export const formatHectares = (hectares: number): string => {
  return `${hectares} ha`;
};

export const getRegistrationTypeColor = (type: RegistrationType): string => {
  const colors = {
    new: "bg-green-500",
    expansion: "bg-blue-500",
    conversion: "bg-purple-500",
  };
  return colors[type] || "bg-gray-500";
};

export const getRegistrationTypeBadgeVariant = (
  type: RegistrationType
): "default" | "secondary" | "destructive" | "outline" => {
  const variants = {
    new: "default" as const,
    expansion: "secondary" as const,
    conversion: "outline" as const,
  };
  return variants[type] || "default";
};

export const getStatusColor = (status: RegistrationStatus): string => {
  const colors = {
    active: "text-green-600 bg-green-50",
    pending: "text-yellow-600 bg-yellow-50",
    inactive: "text-red-600 bg-red-50",
  };
  return colors[status] || "text-gray-600 bg-gray-50";
};

export const getRegistrationTrend = (
  current: number,
  previous: number
): { percentage: number; isPositive: boolean } => {
  if (previous === 0) {
    return { percentage: current > 0 ? 100 : 0, isPositive: current > 0 };
  }

  const percentage = Math.round(((current - previous) / previous) * 100);
  return { percentage: Math.abs(percentage), isPositive: percentage >= 0 };
};

export const getMapMarkerSize = (registrationCount: number): number => {
  // Scale marker size based on registration count
  const baseSize = 8;
  const maxSize = 24;
  const scaleFactor = Math.min(registrationCount / 5, 3); // Max scale of 3x
  return Math.min(baseSize + scaleFactor * 4, maxSize);
};

export const getMapMarkerColor = (
  registrationType: RegistrationType
): string => {
  const colors = {
    new: "#22c55e", // green-500
    expansion: "#3b82f6", // blue-500
    conversion: "#a855f7", // purple-500
  };
  return colors[registrationType] || "#6b7280"; // gray-500
};
