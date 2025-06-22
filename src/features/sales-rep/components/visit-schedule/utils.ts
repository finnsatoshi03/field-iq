import { type Visit, type DailyPlan, VISIT_STATUS } from "./constants";

export const formatVisitDate = (date: Date) => {
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

export const formatTimeOnly = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDateOnly = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const isToday = (date: Date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isTomorrow = (date: Date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
};

export const isOverdue = (visit: Visit) => {
  return (
    visit.status === VISIT_STATUS.OVERDUE ||
    (visit.status === VISIT_STATUS.SCHEDULED &&
      visit.scheduledDate < new Date())
  );
};

export const getOverdueVisits = (visits: Visit[]) => {
  return visits
    .filter(isOverdue)
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
};

export const getUpcomingVisits = (visits: Visit[]) => {
  const now = new Date();
  return visits
    .filter(
      (visit) =>
        visit.status === VISIT_STATUS.SCHEDULED && visit.scheduledDate >= now
    )
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
};

export const getVisitsForDate = (visits: Visit[], date: Date) => {
  return visits.filter(
    (visit) => visit.scheduledDate.toDateString() === date.toDateString()
  );
};

export const getScheduledDates = (visits: Visit[]) => {
  const dates = new Set();
  visits.forEach((visit) => {
    if (visit.status === VISIT_STATUS.SCHEDULED) {
      dates.add(visit.scheduledDate.toDateString());
    }
  });
  return Array.from(dates).map((dateString) => new Date(dateString as string));
};

export const getDayOfWeekLabel = (date: Date) => {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";

  return date.toLocaleDateString("en-US", { weekday: "long" });
};

export const getRelativeDateLabel = (date: Date) => {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";

  const daysDiff = Math.ceil(
    (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysDiff < 0)
    return `${Math.abs(daysDiff)} day${Math.abs(daysDiff) > 1 ? "s" : ""} ago`;
  if (daysDiff <= 7) return `In ${daysDiff} day${daysDiff > 1 ? "s" : ""}`;

  return formatDateOnly(date);
};

export const getPriorityColor = (priority: "high" | "medium" | "low") => {
  switch (priority) {
    case "high":
      return "text-red-600 dark:text-red-400";
    case "medium":
      return "text-orange-600 dark:text-orange-400";
    case "low":
      return "text-green-600 dark:text-green-400";
    default:
      return "text-muted-foreground";
  }
};

export const getPriorityBadgeColor = (priority: "high" | "medium" | "low") => {
  switch (priority) {
    case "high":
      return "bg-red-600 text-red-50";
    case "medium":
      return "bg-orange-600 text-orange-50";
    case "low":
      return "bg-green-600 text-green-50";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case VISIT_STATUS.SCHEDULED:
      return "text-blue-600 dark:text-blue-400";
    case VISIT_STATUS.COMPLETED:
      return "text-green-600 dark:text-green-400";
    case VISIT_STATUS.OVERDUE:
      return "text-red-600 dark:text-red-400";
    case VISIT_STATUS.CANCELLED:
      return "text-gray-600 dark:text-gray-400";
    default:
      return "text-muted-foreground";
  }
};

export const calculateTaskProgress = (dailyPlan: DailyPlan) => {
  const completedTasks = dailyPlan.tasks.filter(
    (task) => task.completed
  ).length;
  const totalTasks = dailyPlan.tasks.length;
  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
};

export const getTotalEstimatedDuration = (tasks: any[]) => {
  return tasks.reduce((total, task) => total + task.estimatedDuration, 0);
};

export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};
