import type { Farm } from "./constants";

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

export const getAddedFarmsCount = (farms: Farm[]) => {
  return farms.filter((f) => f.status === "added").length;
};

export const getVisitedFarmsCount = (farms: Farm[]) => {
  return farms.filter((f) => f.status === "visited").length;
};
