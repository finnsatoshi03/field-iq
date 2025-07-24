import type { SalesRepLog } from "@/features/sales-rep/types";
import type { Farm, ProcessedFarm } from "./constants";

export const formatDateTime = (date: Date) => {
  const dateString = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeString = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return { dateString, timeString };
};

// Process API timestamp to relative time
export const formatRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  } else if (diffHours > 0) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  } else if (diffMinutes > 0) {
    return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
  } else {
    return "Just now";
  }
};

// Process farms API data to match component expectations
export const processFarmsData = (farms: Farm[]): ProcessedFarm[] => {
  return farms.map((farm) => {
    // Parse the date and time
    const dateTime = new Date(`${farm.visit_date} ${farm.visit_time}`);

    // Map visit_type to status
    let status: "visited" | "added" | "overdue";
    switch (farm.visit_type) {
      case "completed_visit":
        status = "visited";
        break;
      case "planned_visit":
        status = "added";
        break;
      case "overdue":
        status = "overdue";
        break;
      default:
        status = "added";
    }

    return {
      name: farm.farm_name || "Unknown Farm",
      location: farm.location,
      status,
      datetime: dateTime,
      visit_type: farm.visit_type,
    };
  });
};

export const getAddedFarmsCount = (farms: ProcessedFarm[]) => {
  return farms.filter((f) => f.status === "added").length;
};

export const getVisitedFarmsCount = (farms: ProcessedFarm[]) => {
  return farms.filter((f) => f.status === "visited").length;
};

// Process logs API data to match component expectations
export const processLogsData = (logs: SalesRepLog[]) => {
  return logs.map((log) => ({
    ...log,
    description: log.description || "", // Handle null descriptions
    timestamp: formatRelativeTime(log.timestamp),
  }));
};
