import type { UserRole } from "@/lib/types";

// Constants for role-based messages (chicken agriculture related)
export const ROLE_BASED_MESSAGES: Record<
  Exclude<UserRole, "admin" | "dev">,
  string[]
> = {
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
    { id: "get-info", label: "Get Info", emoji: "ℹ️", type: "chat" as const },
    {
      id: "ask-question",
      label: "Ask Question",
      emoji: "❓",
      type: "chat" as const,
    },
    {
      id: "report-issue-sales",
      label: "Report Issue",
      emoji: "📝",
      type: "report" as const,
    },
    {
      id: "report-sales",
      label: "Report Sales Activity",
      emoji: "📊",
      type: "report" as const,
    },
  ],
  farmer: [
    {
      id: "get-guides",
      label: "Get Guides",
      emoji: "📖",
      type: "chat" as const,
    },
    {
      id: "report-issue",
      label: "Report Issue",
      emoji: "📝",
      type: "report" as const,
    },
    {
      id: "ask-question",
      label: "Ask Question",
      emoji: "🤖",
      type: "chat" as const,
    },
    {
      id: "log-performance",
      label: "Log Performance",
      emoji: "✍️",
      type: "report" as const,
    },
  ],
} as const;

// Report/Log selector options
export const REPORT_OPTIONS = {
  "report-sales": [
    { id: "daily-sales", label: "Daily Sales Report", emoji: "📅" },
    { id: "weekly-sales", label: "Weekly Sales Summary", emoji: "📊" },
    { id: "client-visit", label: "Client Visit Report", emoji: "🤝" },
    { id: "territory-update", label: "Territory Update", emoji: "🗺️" },
    { id: "other-sales", label: "Other Sales Report", emoji: "📝" },
  ],
  "report-issue-sales": [
    { id: "dealer-problems", label: "Dealer Problems", emoji: "🤝" },
    {
      id: "product-or-field-issues",
      label: "Product or Field Issues",
      emoji: "🌽",
    },
    { id: "other-sales", label: "Other Issues", emoji: "🤖" },
  ],
  "report-issue": [
    { id: "health-issue", label: "Health Issue", emoji: "🏥" },
    { id: "feed-issue", label: "Feed Issue", emoji: "🌾" },
    { id: "equipment-issue", label: "Equipment Issue", emoji: "🔧" },
    { id: "other-issue", label: "Other Issue", emoji: "🤖" },
  ],
  "report-problem": [
    { id: "flock-health", label: "Flock Health Issue", emoji: "🏥" },
    { id: "feed-problem", label: "Feed Problem", emoji: "🌾" },
    { id: "equipment-issue", label: "Equipment Issue", emoji: "⚙️" },
    { id: "other-problem", label: "Other Problem", emoji: "🤖" },
  ],
  "log-performance": [
    { id: "egg-production", label: "Egg Production", emoji: "🥚" },
    { id: "feed-consumption", label: "Feed Consumption", emoji: "📊" },
    { id: "flock-mortality", label: "Flock Mortality", emoji: "📋" },
    { id: "growth-metrics", label: "Growth Metrics", emoji: "📈" },
    { id: "other-performance", label: "Other Performance", emoji: "🤖" },
  ],
} as const;

// Suggested chat options for sales representatives
export const SUGGESTED_CHAT_OPTIONS = {
  // Initial suggestions for sales reports
  "report-sales": {
    "daily-sales": [
      {
        id: "dealer-contract",
        label: "Dealer didn't sign contract",
        emoji: "📝",
      },
      {
        id: "client-meeting",
        label: "Had meeting with client",
        emoji: "🤝",
      },
      {
        id: "territory-visit",
        label: "Visited new territory",
        emoji: "🗺️",
      },
      {
        id: "sales-target",
        label: "Met/fell short of daily target",
        emoji: "🎯",
      },
    ],
    "weekly-sales": [
      {
        id: "weekly-performance",
        label: "Weekly performance summary",
        emoji: "📊",
      },
      {
        id: "top-clients",
        label: "Top performing clients this week",
        emoji: "⭐",
      },
      {
        id: "challenges-faced",
        label: "Challenges faced this week",
        emoji: "⚠️",
      },
      {
        id: "next-week-plan",
        label: "Plans for next week",
        emoji: "📅",
      },
    ],
    "client-visit": [
      {
        id: "visit-outcome",
        label: "Client visit outcome",
        emoji: "✅",
      },
      {
        id: "client-feedback",
        label: "Client provided feedback",
        emoji: "💬",
      },
      {
        id: "follow-up-needed",
        label: "Follow-up actions needed",
        emoji: "📞",
      },
      {
        id: "sales-opportunities",
        label: "New sales opportunities identified",
        emoji: "💰",
      },
    ],
    "territory-update": [
      {
        id: "territory-changes",
        label: "Changes in territory",
        emoji: "🗺️",
      },
      {
        id: "market-trends",
        label: "Market trends observed",
        emoji: "📈",
      },
      {
        id: "competition-update",
        label: "Competitor activities",
        emoji: "👥",
      },
      {
        id: "territory-potential",
        label: "Territory potential assessment",
        emoji: "🚀",
      },
    ],
    "other-sales": [
      {
        id: "general-update",
        label: "General sales update",
        emoji: "📝",
      },
      {
        id: "special-circumstances",
        label: "Special circumstances to note",
        emoji: "⚠️",
      },
      {
        id: "training-needed",
        label: "Training or support needed",
        emoji: "📚",
      },
      {
        id: "equipment-issues",
        label: "Equipment or technical issues",
        emoji: "🔧",
      },
    ],
  },
  "report-issue-sales": {
    "dealer-problems": [
      {
        id: "dealer-complaint",
        label: "Dealer filed complaint",
        emoji: "😤",
      },
      {
        id: "dealer-dissatisfaction",
        label: "Dealer expressed dissatisfaction",
        emoji: "😞",
      },
      {
        id: "dealer-request",
        label: "Dealer made special request",
        emoji: "🙏",
      },
      {
        id: "dealer-feedback",
        label: "Dealer provided feedback",
        emoji: "💬",
      },
    ],
    "product-or-field-issues": [
      {
        id: "product-problem",
        label: "Product malfunction reported",
        emoji: "🔧",
      },
      {
        id: "field-issue",
        label: "Field-related problem",
        emoji: "🌾",
      },
      {
        id: "quality-issue",
        label: "Quality control issue",
        emoji: "⚠️",
      },
      {
        id: "delivery-problem",
        label: "Delivery or logistics issue",
        emoji: "🚚",
      },
    ],
    "other-sales": [
      {
        id: "general-issue",
        label: "General issue to report",
        emoji: "📝",
      },
      {
        id: "urgent-matter",
        label: "Urgent matter requiring attention",
        emoji: "🚨",
      },
      {
        id: "safety-concern",
        label: "Safety concern",
        emoji: "🛡️",
      },
      {
        id: "compliance-issue",
        label: "Compliance or regulatory issue",
        emoji: "📋",
      },
    ],
  },
} as const;

// Template suggestions for AI-generated prompts (based on context)
export const SUGGESTED_CHAT_TEMPLATES = {
  sales_performance: [
    "Today's sales activities and outcomes",
    "Key client interactions and feedback",
    "Territory performance and market observations",
    "Challenges encountered and solutions implemented",
  ],
  client_relationship: [
    "Client meeting outcomes and action items",
    "Client feedback and satisfaction levels",
    "Relationship building activities",
    "Follow-up tasks and next steps",
  ],
  territory_management: [
    "Territory changes and market dynamics",
    "Competitor activities and market positioning",
    "Growth opportunities identified",
    "Territory performance metrics",
  ],
  product_knowledge: [
    "Product performance in the field",
    "Technical issues and resolutions",
    "Customer product feedback",
    "Product training and support needs",
  ],
  issue_resolution: [
    "Issue details and impact assessment",
    "Resolution steps taken",
    "Prevention measures implemented",
    "Lessons learned and recommendations",
  ],
} as const;

// Chat mode mapping for different report types
export const getChatModeForReportType = (
  reportType: keyof typeof REPORT_OPTIONS,
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
