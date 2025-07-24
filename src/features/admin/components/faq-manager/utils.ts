import type { FaqItem } from "./constants";

export interface FilterOptions {
  search: string;
  category: string | "all"; // Changed from FaqCategory to string
  status: string | "all"; // Changed from FaqStatus to string
  priority: number | "all";
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

export const getDefaultFilters = (): FilterOptions => ({
  search: "",
  category: "all",
  status: "all",
  priority: "all",
  dateRange: {
    from: null,
    to: null,
  },
});

export const filterFaqItems = (
  items: FaqItem[],
  filters: FilterOptions,
): FaqItem[] => {
  return items.filter((item) => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch =
        item.question.toLowerCase().includes(searchTerm) ||
        item.answer.toLowerCase().includes(searchTerm) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchTerm));

      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category !== "all" && item.category !== filters.category) {
      return false;
    }

    // Status filter
    if (filters.status !== "all" && item.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority !== "all" && item.priority !== filters.priority) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      const itemDate = new Date(item.lastUpdated);

      if (filters.dateRange.from && itemDate < filters.dateRange.from) {
        return false;
      }

      if (filters.dateRange.to && itemDate > filters.dateRange.to) {
        return false;
      }
    }

    return true;
  });
};

export const sortFaqItems = (
  items: FaqItem[],
  sortBy: string,
  sortOrder: "asc" | "desc" = "asc",
): FaqItem[] => {
  return [...items].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case "priority":
        aValue = a.priority;
        bValue = b.priority;
        break;
      case "views":
        aValue = a.views;
        bValue = b.views;
        break;
      case "lastUpdated":
        aValue = new Date(a.lastUpdated);
        bValue = new Date(b.lastUpdated);
        break;
      case "question":
        aValue = a.question.toLowerCase();
        bValue = b.question.toLowerCase();
        break;
      case "category":
        aValue = a.category.toLowerCase();
        bValue = b.category.toLowerCase();
        break;
      case "status":
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      default:
        aValue = a.question.toLowerCase();
        bValue = b.question.toLowerCase();
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
};

export const calculateFaqMetrics = (items: FaqItem[]) => {
  const totalFaqs = items.length;
  const activeFaqs = items.filter((item) => item.status === "active").length;
  const draftFaqs = items.filter((item) => item.status === "draft").length;
  const inactiveFaqs = items.filter(
    (item) => item.status === "inactive",
  ).length;
  const totalViews = items.reduce((sum, item) => sum + item.views, 0);
  const avgViews = totalFaqs > 0 ? Math.round(totalViews / totalFaqs) : 0;

  const highPriorityFaqs = items.filter((item) => item.priority <= 2).length;
  const mediumPriorityFaqs = items.filter(
    (item) => item.priority > 2 && item.priority <= 3,
  ).length;
  const lowPriorityFaqs = items.filter((item) => item.priority > 3).length;

  return {
    totalFaqs,
    activeFaqs,
    draftFaqs,
    inactiveFaqs,
    totalViews,
    avgViews,
    highPriorityFaqs,
    mediumPriorityFaqs,
    lowPriorityFaqs,
  };
};

export const getFaqsByCategory = (items: FaqItem[]) => {
  const categoryCounts = items.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>, // Changed from FaqCategory to string
  );

  return Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
    percentage: Math.round((count / items.length) * 100),
  }));
};

export const getTopViewedFaqs = (items: FaqItem[], limit: number = 5) => {
  return [...items].sort((a, b) => b.views - a.views).slice(0, limit);
};

export const getRecentlyUpdatedFaqs = (items: FaqItem[], limit: number = 5) => {
  return [...items]
    .sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
    )
    .slice(0, limit);
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

export const getStatusColor = (status: string) => {
  // Changed from FaqStatus to string
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getCategoryColor = (category: string) => {
  // Changed from FaqCategory to string
  const colors: Record<string, string> = {
    farm_visit: "bg-blue-100 text-blue-800",
    product_issue: "bg-red-100 text-red-800",
    general_inquiry: "bg-purple-100 text-purple-800",
    nutrition: "bg-green-100 text-green-800",
    health: "bg-red-100 text-red-800",
    management: "bg-orange-100 text-orange-800",
    pricing: "bg-yellow-100 text-yellow-800",
    support: "bg-indigo-100 text-indigo-800",
    technical: "bg-pink-100 text-pink-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createNewFaq = (): Omit<FaqItem, "id"> => ({
  question: "",
  answer: "",
  category: "general_inquiry", // Updated to match API categories
  status: "draft",
  priority: 4, // Updated to match API priority levels
  views: 0,
  lastUpdated: new Date().toISOString(),
  createdBy: "Admin",
  tags: [],
  is_featured: false, // Added field from API
});

export const validateFaqItem = (item: Partial<FaqItem>): string[] => {
  const errors: string[] = [];

  if (!item.question?.trim()) {
    errors.push("Question is required");
  }

  if (!item.answer?.trim()) {
    errors.push("Answer is required");
  }

  if (!item.category) {
    errors.push("Category is required");
  }

  if (!item.status) {
    errors.push("Status is required");
  }

  if (item.priority === undefined || item.priority < 1 || item.priority > 10) {
    errors.push("Priority must be between 1 and 10");
  }

  return errors;
};
