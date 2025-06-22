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

// GPS Direction utilities
export const openGoogleMapsDirections = (
  visit: Visit,
  userLocation?: { lat: number; lng: number }
) => {
  if (!visit.gpsCoordinates && !visit.location) {
    console.warn("No location data available for this visit");
    return;
  }

  // Check if user is on mobile device
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  let url: string;

  if (visit.gpsCoordinates) {
    const { lat, lng } = visit.gpsCoordinates;
    const destination = `${lat},${lng}`;

    if (userLocation) {
      // With starting location
      const origin = `${userLocation.lat},${userLocation.lng}`;
      if (isMobile) {
        // Try app first, fallback to web
        url = `google.maps://?saddr=${origin}&daddr=${destination}&directionsmode=driving`;
        window.location.href = url;

        // Fallback after delay
        setTimeout(() => {
          const webUrl = `https://www.google.com/maps/dir/${origin}/${destination}`;
          window.open(webUrl, "_blank");
        }, 1500);
        return;
      } else {
        // Desktop web version
        url = `https://www.google.com/maps/dir/${origin}/${destination}`;
      }
    } else {
      // Without starting location
      if (isMobile) {
        url = `google.maps://?daddr=${destination}&directionsmode=driving`;
        window.location.href = url;

        setTimeout(() => {
          const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
          window.open(webUrl, "_blank");
        }, 1500);
        return;
      } else {
        url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
      }
    }
  } else {
    // Fallback to address search
    const destination = encodeURIComponent(
      `${visit.farmName}, ${visit.location}`
    );
    if (userLocation) {
      const origin = `${userLocation.lat},${userLocation.lng}`;
      url = `https://www.google.com/maps/dir/${origin}/${destination}`;
    } else {
      url = `https://www.google.com/maps/search/${destination}`;
    }
  }

  window.open(url, "_blank");
};

export const openWazeDirections = (
  visit: Visit,
  userLocation?: { lat: number; lng: number }
) => {
  if (!visit.gpsCoordinates) {
    console.warn("GPS coordinates not available for this visit");
    return;
  }

  const { lat, lng } = visit.gpsCoordinates;
  let url: string;

  if (userLocation) {
    url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes&from=${userLocation.lat},${userLocation.lng}`;
  } else {
    url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  }

  window.open(url, "_blank");
};

export const openAppleMapsDirections = (
  visit: Visit,
  userLocation?: { lat: number; lng: number }
) => {
  let url: string;

  if (visit.gpsCoordinates) {
    const { lat, lng } = visit.gpsCoordinates;
    const destination = `${lat},${lng}`;

    if (userLocation) {
      const origin = `${userLocation.lat},${userLocation.lng}`;
      url = `http://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=d`;
    } else {
      url = `http://maps.apple.com/?daddr=${destination}&dirflg=d`;
    }
  } else {
    // Fallback to address search
    const destination = encodeURIComponent(
      `${visit.farmName}, ${visit.location}`
    );
    if (userLocation) {
      const origin = `${userLocation.lat},${userLocation.lng}`;
      url = `http://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=d`;
    } else {
      url = `http://maps.apple.com/?q=${destination}`;
    }
  }

  window.open(url, "_blank");
};

export const openMapboxDirections = (
  visit: Visit,
  userLocation?: { lat: number; lng: number }
) => {
  if (!visit.gpsCoordinates) {
    console.warn("GPS coordinates not available for this visit");
    return;
  }

  const { lat, lng } = visit.gpsCoordinates;
  let url: string;

  if (userLocation) {
    url = `https://www.mapbox.com/directions/#/${userLocation.lng},${userLocation.lat};${lng},${lat}`;
  } else {
    url = `https://www.mapbox.com/directions/#//${lng},${lat}`;
  }

  window.open(url, "_blank");
};

export const getDirectionsOptions = () => [
  {
    id: "google",
    name: "Google Maps",
    icon: "🗺️",
    action: openGoogleMapsDirections,
  },
  {
    id: "waze",
    name: "Waze",
    icon: "🚗",
    action: openWazeDirections,
  },
  {
    id: "apple",
    name: "Apple Maps",
    icon: "🍎",
    action: openAppleMapsDirections,
  },
  {
    id: "mapbox",
    name: "Mapbox",
    icon: "📍",
    action: openMapboxDirections,
  },
];

export const hasGpsCoordinates = (visit: Visit): boolean => {
  return !!(visit.gpsCoordinates?.lat && visit.gpsCoordinates?.lng);
};
