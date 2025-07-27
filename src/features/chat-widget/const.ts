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
    {
      id: "ask-question",
      label: "Ask Question",
      emoji: "❓",
      type: "chat" as const,
      intent: 0,
    },
    {
      id: "report-issue-sales",
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
  "report-issue-sales": [
    { id: "dealer-problems", intent: 2, label: "Dealer Problems", emoji: "🤝" },
    {
      id: "product-or-field-issues",
      intent: 3,
      label: "Product or Field Issues",
      emoji: "🌽",
    },
    // { id: "other-sales", label: "Other Issues", emoji: "🤖" },
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
  // Farmer-specific suggestions for report issues
  "report-issue": {
    "health-issue": [
      {
        id: "sick-birds",
        label: "Birds showing signs of illness",
        emoji: "🏥",
      },
      {
        id: "mortality-increase",
        label: "Increased mortality rate",
        emoji: "💀",
      },
      {
        id: "behavior-changes",
        label: "Unusual bird behavior",
        emoji: "🤔",
      },
      {
        id: "disease-symptoms",
        label: "Disease symptoms observed",
        emoji: "🦠",
      },
    ],
    "feed-issue": [
      {
        id: "feed-quality",
        label: "Feed quality concerns",
        emoji: "🌾",
      },
      {
        id: "consumption-drop",
        label: "Reduced feed consumption",
        emoji: "📉",
      },
      {
        id: "feed-wastage",
        label: "Excessive feed wastage",
        emoji: "🗑️",
      },
      {
        id: "nutrition-problem",
        label: "Nutrition-related issues",
        emoji: "🥗",
      },
    ],
    "equipment-issue": [
      {
        id: "equipment-breakdown",
        label: "Equipment malfunction",
        emoji: "🔧",
      },
      {
        id: "system-failure",
        label: "System or automation failure",
        emoji: "⚙️",
      },
      {
        id: "maintenance-needed",
        label: "Maintenance required",
        emoji: "🔨",
      },
      {
        id: "safety-equipment",
        label: "Safety equipment issue",
        emoji: "🛡️",
      },
    ],
    "other-issue": [
      {
        id: "environmental-concern",
        label: "Environmental concern",
        emoji: "🌍",
      },
      {
        id: "weather-impact",
        label: "Weather-related problem",
        emoji: "🌦️",
      },
      {
        id: "infrastructure-issue",
        label: "Infrastructure problem",
        emoji: "🏗️",
      },
      {
        id: "general-problem",
        label: "Other general problem",
        emoji: "⚠️",
      },
    ],
  },
  // Farmer-specific suggestions for performance logging
  "log-performance": {
    "egg-production": [
      {
        id: "daily-eggs",
        label: "Daily egg count recorded",
        emoji: "🥚",
      },
      {
        id: "production-drop",
        label: "Egg production decreased",
        emoji: "📉",
      },
      {
        id: "quality-issues",
        label: "Egg quality problems",
        emoji: "🔍",
      },
      {
        id: "production-peak",
        label: "Peak production period",
        emoji: "📈",
      },
    ],
    "feed-consumption": [
      {
        id: "daily-consumption",
        label: "Daily feed consumption",
        emoji: "📊",
      },
      {
        id: "consumption-change",
        label: "Feed consumption pattern change",
        emoji: "🔄",
      },
      {
        id: "efficiency-metric",
        label: "Feed conversion efficiency",
        emoji: "⚡",
      },
      {
        id: "cost-analysis",
        label: "Feed cost analysis",
        emoji: "💰",
      },
    ],
    "flock-mortality": [
      {
        id: "mortality-rate",
        label: "Mortality rate recorded",
        emoji: "📋",
      },
      {
        id: "death-causes",
        label: "Death causes identified",
        emoji: "🔍",
      },
      {
        id: "age-related-losses",
        label: "Age-related mortality",
        emoji: "⏰",
      },
      {
        id: "prevention-measures",
        label: "Prevention measures taken",
        emoji: "🛡️",
      },
    ],
    "growth-metrics": [
      {
        id: "weight-gain",
        label: "Weight gain recorded",
        emoji: "⚖️",
      },
      {
        id: "growth-rate",
        label: "Growth rate measurement",
        emoji: "📏",
      },
      {
        id: "development-stage",
        label: "Development stage tracking",
        emoji: "🌱",
      },
      {
        id: "health-indicators",
        label: "Health indicators noted",
        emoji: "💪",
      },
    ],
    "other-performance": [
      {
        id: "general-observation",
        label: "General flock observation",
        emoji: "👀",
      },
      {
        id: "behavior-tracking",
        label: "Behavior pattern tracking",
        emoji: "📝",
      },
      {
        id: "environmental-factors",
        label: "Environmental factors noted",
        emoji: "🌡️",
      },
      {
        id: "management-action",
        label: "Management action taken",
        emoji: "👨‍🌾",
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
  // Farmer-specific templates
  flock_health: [
    "Flock health status and observations",
    "Disease symptoms and affected birds",
    "Treatment measures implemented",
    "Prevention strategies for future",
  ],
  feed_management: [
    "Feed consumption patterns and changes",
    "Feed quality assessment and issues",
    "Nutritional adjustments made",
    "Feed cost and efficiency analysis",
  ],
  equipment_maintenance: [
    "Equipment status and functionality",
    "Maintenance activities performed",
    "Repair needs and actions taken",
    "Safety equipment checks",
  ],
  performance_tracking: [
    "Daily performance metrics recorded",
    "Production trends and patterns",
    "Growth and development observations",
    "Management decisions and actions",
  ],
  environmental_monitoring: [
    "Environmental conditions and changes",
    "Weather impact on operations",
    "Infrastructure status and needs",
    "Environmental management actions",
  ],
} as const;

// Chat mode mapping for different report types
export const getChatModeForReportType = (
  reportType: keyof typeof REPORT_OPTIONS,
): ChatMode => {
  console.log(reportType);
  return "report"; // All reports use report mode (has input, report-focused mood)
};

// Quick chat options for log performance (selection-based)
export const QUICK_CHAT_OPTIONS = {
  // Removed log-performance options since farmers now use input mode
} as const;
