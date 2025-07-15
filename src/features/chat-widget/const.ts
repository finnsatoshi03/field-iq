import type { UserRole } from "@/lib/types";

// Constants for role-based messages (chicken agriculture related)
export const ROLE_BASED_MESSAGES: Record<UserRole, string[]> = {
  admin: [
    "Need help managing your farm operations? 🐔",
    "Questions about flock analytics? Let's chat! 📊",
    "Need assistance with farm management? I'm here! 🏡",
    "Want to optimize your poultry business? Ask me! 💼",
  ],
  sales_rep: [
    "Need help with client presentations? 🎯",
    "Questions about poultry products? Let's discuss! 🥚",
    "Want to boost your sales performance? I can help! 📈",
    "Need assistance with farmer relationships? Chat with me! 🤝",
  ],
  farmer: [
    "Need help with your chickens? I'm here! 🐓",
    "Questions about feed optimization? Let's chat! 🌾",
    "Want to improve egg production? Ask me! 🥚",
    "Need assistance with flock health? I can help! 🏥",
  ],
  dev: [
    "Need technical support? I'm ready to help! 💻",
    "Questions about system integration? Let's debug! 🔧",
    "Want to optimize farm tech? I can assist! ⚙️",
    "Need help with API documentation? Chat with me! 📚",
  ],
};

// Chat stage types
export type ChatStage = "welcome" | "report" | "chat";

// Chat modes for different conversation types
export type ChatMode = "normal" | "report" | "quick";

// Chat mood configurations for different modes
export const CHAT_MODES = {
  normal: {
    hasInput: true,
    isInteractive: true,
    mood: "general",
  },
  report: {
    hasInput: true,
    isInteractive: true,
    mood: "report-focused", // For future use - prompt-based context
  },
  quick: {
    hasInput: false,
    isInteractive: true,
    mood: "selection-based", // For future use - quick selection only
  },
} as const;

// Role-specific options for chat stages
export const CHAT_OPTIONS = {
  sales_rep: [
    {
      id: "ask-question",
      label: "Ask Question",
      emoji: "❓",
      type: "chat" as const,
      intent: 0,
    },
    {
      id: "report-issue",
      label: "Report Issue",
      emoji: "📝",
      type: "report" as const,
      intent: null
    },
    {
      id: "report-sales",
      label: "Log Performance",
      emoji: "📊",
      type: "report" as const,
      intent: null
    },
  ],
  farmer: [
    {
      id: "ask-question",
      label: "Ask Question",
      emoji: "🤖",
      type: "chat" as const,
      intent: 0,
    },
    {
      id: "report-issue",
      label: "Report Health Issues",
      emoji: "📝",
      type: "chat" as const,
      intent: 2,
    },
    {
      id: "get-info",
      label: "Ask if Safe",
      emoji: "📝",
      type: "chat" as const,
      intent: 3,
    },
    {
      id: "report-sales",
      label: "Log Farm Performance",
      emoji: "✍️",
      type: "chat" as const,
      intent: 7,
    },
  ],
} as const;

// Report/Log selector options
export const REPORT_OPTIONS = {
  "report-sales": [
    { id: "daily-sales", intent: 7, label: "Sales Report", emoji: "📅" },
    { id: "farm-visit", intent: 8, label: "Farm Visit", emoji: "🤝" },
  ],
  "report-issue": [
    { id: "dealer-issue", intent: 2, label: "Dealer Issue", emoji: "🏥" },
    { id: "farm-issue", intent: 3, label: "Farm Issue", emoji: "🌾" }
  ],
  "report-problem": [
    { id: "flock-health", intent: null, label: "Flock Health Issue", emoji: "🏥" },
    { id: "feed-problem", intent: null, label: "Feed Problem", emoji: "🌾" },
    { id: "equipment-issue", intent: null, label: "Equipment Issue", emoji: "⚙️" },
    { id: "other-problem", intent: null, label: "Other Problem", emoji: "🤖" },
  ],
  "log-performance": [
    { id: "egg-production", intent: null, label: "Egg Production", emoji: "🥚" },
    { id: "feed-consumption", intent: null, label: "Feed Consumption", emoji: "📊" },
    { id: "flock-mortality", intent: null, label: "Flock Mortality", emoji: "📋" },
    { id: "growth-metrics", intent: null, label: "Growth Metrics", emoji: "📈" },
    { id: "other-performance", intent: null, label: "Other Performance", emoji: "🤖" },
  ],
} as const;

// Chat mode mapping for different report types
export const getChatModeForReportType = (
  reportType: keyof typeof REPORT_OPTIONS
): ChatMode => {
  if (reportType === "log-performance") {
    return "quick"; // Log performance uses quick chat (selection-based, no input)
  }
  return "report"; // All other reports use report mode (has input, report-focused mood)
};

// Quick chat options for log performance (selection-based)
export const QUICK_CHAT_OPTIONS = {
  "egg-production": [
    { id: "low-production", label: "Low egg production", emoji: "📉" },
    { id: "peak-production", label: "Peak production achieved", emoji: "📈" },
    { id: "quality-issues", label: "Egg quality concerns", emoji: "🥚" },
    {
      id: "seasonal-changes",
      label: "Seasonal production changes",
      emoji: "🌦️",
    },
  ],
  "feed-consumption": [
    {
      id: "increased-consumption",
      label: "Feed consumption increased",
      emoji: "⬆️",
    },
    {
      id: "decreased-consumption",
      label: "Feed consumption decreased",
      emoji: "⬇️",
    },
    { id: "feed-waste", label: "Feed waste concerns", emoji: "🗑️" },
    { id: "feed-quality", label: "Feed quality issues", emoji: "🌾" },
  ],
  "flock-mortality": [
    {
      id: "high-mortality",
      label: "Higher than normal mortality",
      emoji: "📊",
    },
    { id: "disease-outbreak", label: "Possible disease outbreak", emoji: "🦠" },
    { id: "age-related", label: "Age-related mortality", emoji: "📅" },
    { id: "environmental", label: "Environmental factors", emoji: "🌡️" },
  ],
  "growth-metrics": [
    { id: "slow-growth", label: "Slower than expected growth", emoji: "📉" },
    { id: "optimal-growth", label: "Optimal growth rates", emoji: "📈" },
    { id: "weight-concerns", label: "Weight concerns", emoji: "⚖️" },
    { id: "health-metrics", label: "Health metric issues", emoji: "🏥" },
  ],
  "other-performance": [
    { id: "behavioral-changes", label: "Behavioral changes", emoji: "🐔" },
    { id: "environmental-impact", label: "Environmental factors", emoji: "🌡️" },
    { id: "management-issues", label: "Management concerns", emoji: "👤" },
    {
      id: "equipment-performance",
      label: "Equipment performance",
      emoji: "⚙️",
    },
  ],
} as const;
