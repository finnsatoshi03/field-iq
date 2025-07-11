export const VIEW_MODES = {
  LIST: "list",
  CATEGORIES: "categories",
  STATS: "stats",
} as const;

export type ViewMode = (typeof VIEW_MODES)[keyof typeof VIEW_MODES];

export const FAQ_CATEGORIES = [
  "General",
  "Products",
  "Nutrition",
  "Health",
  "Management",
  "Pricing",
  "Support",
  "Technical",
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export const FAQ_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DRAFT: "draft",
} as const;

export type FaqStatus = (typeof FAQ_STATUS)[keyof typeof FAQ_STATUS];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  status: FaqStatus;
  priority: number;
  views: number;
  lastUpdated: string;
  createdBy: string;
  tags: string[];
}

export const MOCK_FAQ_DATA: FaqItem[] = [
  {
    id: "1",
    question: "How do I calculate FCR for my broiler operation?",
    answer:
      "FCR (Feed Conversion Ratio) = Total feed consumed (kg) ÷ Total weight gained (kg). For broilers, target FCR is 1.4-1.8. Use the app's performance tracker to monitor your FCR in real-time and compare against industry benchmarks.",
    category: "Technical",
    status: "active",
    priority: 1,
    views: 2340,
    lastUpdated: "2024-01-20",
    createdBy: "Chat AI Assistant",
    tags: ["FCR", "broiler", "calculation", "performance"],
  },
  {
    id: "2",
    question: "What's the best feeding schedule for layers?",
    answer:
      "For commercial layers: Pre-starter (0-6 weeks), Starter (6-10 weeks), Grower (10-16 weeks), Pre-lay (16-18 weeks), Layer (18+ weeks). Adjust based on breed requirements. The app provides customized feeding schedules based on your flock data.",
    category: "Nutrition",
    status: "active",
    priority: 1,
    views: 1980,
    lastUpdated: "2024-01-19",
    createdBy: "Chat AI Assistant",
    tags: ["layers", "feeding", "schedule", "phases"],
  },
  {
    id: "3",
    question: "How to improve feed conversion in hot weather?",
    answer:
      "In hot weather: Increase feeding frequency during cooler hours, ensure adequate ventilation, provide cool fresh water, add electrolytes, consider feed additives for heat stress. Monitor FCR closely as it typically increases 0.1-0.3 points in extreme heat.",
    category: "Management",
    status: "active",
    priority: 2,
    views: 1650,
    lastUpdated: "2024-01-18",
    createdBy: "Chat AI Assistant",
    tags: ["heat-stress", "FCR", "management", "weather"],
  },
  {
    id: "4",
    question: "What feed ingredients should I avoid for organic certification?",
    answer:
      "Avoid: Synthetic amino acids, antibiotics, growth promoters, GMO ingredients, animal by-products from non-organic sources. Use certified organic grains, natural protein sources, and approved mineral supplements. Check certification requirements in your region.",
    category: "Products",
    status: "active",
    priority: 3,
    views: 1420,
    lastUpdated: "2024-01-17",
    createdBy: "Chat AI Assistant",
    tags: ["organic", "certification", "ingredients", "compliance"],
  },
  {
    id: "5",
    question: "How much protein should be in starter feed?",
    answer:
      "Broiler starter: 22-24% crude protein. Layer starter: 18-20% crude protein. Protein quality matters - ensure balanced amino acid profile with lysine, methionine, and threonine. Adjust based on growth targets and local ingredient availability.",
    category: "Nutrition",
    status: "active",
    priority: 2,
    views: 1380,
    lastUpdated: "2024-01-16",
    createdBy: "Chat AI Assistant",
    tags: ["protein", "starter", "amino-acids", "nutrition"],
  },
  {
    id: "6",
    question: "Why is my feed conversion getting worse?",
    answer:
      "Common causes: Heat stress, disease pressure, poor feed quality, inconsistent feeding, water issues, overcrowding, genetic factors. Use the health monitoring features to identify patterns and consult with nutritionists for specific recommendations.",
    category: "Health",
    status: "active",
    priority: 1,
    views: 1250,
    lastUpdated: "2024-01-15",
    createdBy: "Chat AI Assistant",
    tags: ["FCR", "troubleshooting", "performance", "health"],
  },
  {
    id: "7",
    question: "How to transition between feed phases safely?",
    answer:
      "Gradual transition over 3-5 days: Day 1-2: 75% old + 25% new, Day 3-4: 50% each, Day 5: 25% old + 75% new, Day 6: 100% new feed. Monitor intake and bird behavior during transition periods.",
    category: "Management",
    status: "active",
    priority: 3,
    views: 890,
    lastUpdated: "2024-01-14",
    createdBy: "Chat AI Assistant",
    tags: ["transition", "phases", "management", "feeding"],
  },
  {
    id: "8",
    question: "What's causing low egg production in my layers?",
    answer:
      "Check: Nutrition (protein 16-18%, calcium 3.5-4%), lighting (14-16 hours), water quality, stress factors, disease status, age of flock. The app's egg tracking feature helps identify trends and potential causes.",
    category: "Health",
    status: "active",
    priority: 2,
    views: 1150,
    lastUpdated: "2024-01-13",
    createdBy: "Chat AI Assistant",
    tags: ["egg-production", "layers", "nutrition", "troubleshooting"],
  },
  {
    id: "9",
    question: "How to calculate daily feed requirements?",
    answer:
      "Formula: Birds × Expected daily intake per bird. Broilers: 50-150g/day (age dependent), Layers: 110-125g/day. Factor in 5-10% wastage. The app's feed calculator provides precise requirements based on your flock data.",
    category: "Technical",
    status: "draft",
    priority: 4,
    views: 720,
    lastUpdated: "2024-01-12",
    createdBy: "Chat AI Assistant",
    tags: ["calculation", "feed-requirements", "planning", "intake"],
  },
  {
    id: "10",
    question: "What are the signs of mycotoxin contamination?",
    answer:
      "Signs: Reduced feed intake, poor FCR, decreased egg production, increased mortality, liver damage, immune suppression. Test feed samples regularly, use mold inhibitors, ensure proper storage conditions (moisture <14%).",
    category: "Health",
    status: "active",
    priority: 1,
    views: 1680,
    lastUpdated: "2024-01-11",
    createdBy: "Chat AI Assistant",
    tags: ["mycotoxins", "contamination", "health", "feed-quality"],
  },
  {
    id: "11",
    question: "How much water do chickens need daily?",
    answer:
      "Water consumption: Broilers 1.5-2x feed intake, Layers 200-300ml/day. Ratio increases in hot weather (up to 4x feed intake). Ensure clean, fresh water availability 24/7. Monitor using the app's water tracking feature.",
    category: "Management",
    status: "active",
    priority: 3,
    views: 950,
    lastUpdated: "2024-01-10",
    createdBy: "Chat AI Assistant",
    tags: ["water", "consumption", "management", "intake"],
  },
  {
    id: "12",
    question: "When should I use medicated feed?",
    answer:
      "Use medicated feed for: Coccidiosis prevention (0-16 weeks), disease outbreaks, high-risk periods, new flock introduction. Follow withdrawal periods before slaughter/egg collection. Consult veterinarians for specific recommendations.",
    category: "Health",
    status: "active",
    priority: 2,
    views: 1320,
    lastUpdated: "2024-01-09",
    createdBy: "Chat AI Assistant",
    tags: ["medicated", "coccidiosis", "prevention", "withdrawal"],
  },
];

export const PRIORITY_LEVELS = [
  { value: 1, label: "High Priority" },
  { value: 2, label: "Medium Priority" },
  { value: 3, label: "Low Priority" },
] as const;

export const STATUS_COLORS = {
  [FAQ_STATUS.ACTIVE]: "bg-green-100 text-green-800",
  [FAQ_STATUS.INACTIVE]: "bg-gray-100 text-gray-800",
  [FAQ_STATUS.DRAFT]: "bg-yellow-100 text-yellow-800",
} as const;

export const CATEGORY_COLORS = {
  General: "bg-blue-100 text-blue-800",
  Products: "bg-purple-100 text-purple-800",
  Nutrition: "bg-green-100 text-green-800",
  Health: "bg-red-100 text-red-800",
  Management: "bg-orange-100 text-orange-800",
  Pricing: "bg-yellow-100 text-yellow-800",
  Support: "bg-indigo-100 text-indigo-800",
  Technical: "bg-pink-100 text-pink-800",
} as const;
