// Training Status Enums
export const TRAINING_STATUS = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  EXPIRED: "expired",
} as const;

export const TRAINING_CATEGORY = {
  PRODUCT_KNOWLEDGE: "product_knowledge",
  SALES_TECHNIQUES: "sales_techniques",
  SAFETY_COMPLIANCE: "safety_compliance",
  CUSTOMER_SERVICE: "customer_service",
  TECHNICAL_SKILLS: "technical_skills",
} as const;

export const DIFFICULTY_LEVEL = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

// Types
export type TrainingStatus =
  (typeof TRAINING_STATUS)[keyof typeof TRAINING_STATUS];
export type TrainingCategory =
  (typeof TRAINING_CATEGORY)[keyof typeof TRAINING_CATEGORY];
export type DifficultyLevel =
  (typeof DIFFICULTY_LEVEL)[keyof typeof DIFFICULTY_LEVEL];

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: TrainingCategory;
  status: TrainingStatus;
  difficulty: DifficultyLevel;
  progress: number;
  duration: number;
  completedDate?: Date;
  dueDate?: Date;
  badgeIcon: string;
  points: number;
  isRequired: boolean;
}

export interface TrainingBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: TrainingCategory;
  requiredModules: string[];
  earned: boolean;
  earnedDate?: Date;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface UserProgress {
  totalModules: number;
  completedModules: number;
  inProgressModules: number;
  totalPoints: number;
  earnedBadges: number;
  overallProgress: number;
  streak: number;
  lastActivity: Date;
}

// Mock Data
export const mockTrainingModules: TrainingModule[] = [
  {
    id: "1",
    title: "Fertilizer Product Knowledge",
    description:
      "Learn about different types of fertilizers, their applications, and benefits",
    category: TRAINING_CATEGORY.PRODUCT_KNOWLEDGE,
    status: TRAINING_STATUS.COMPLETED,
    difficulty: DIFFICULTY_LEVEL.BEGINNER,
    progress: 100,
    duration: 45,
    completedDate: new Date("2024-01-10"),
    badgeIcon: "🌱",
    points: 100,
    isRequired: true,
  },
  {
    id: "2",
    title: "Advanced Sales Negotiation",
    description: "Master negotiation techniques for closing larger deals",
    category: TRAINING_CATEGORY.SALES_TECHNIQUES,
    status: TRAINING_STATUS.IN_PROGRESS,
    difficulty: DIFFICULTY_LEVEL.ADVANCED,
    progress: 65,
    duration: 90,
    dueDate: new Date("2024-01-20"),
    badgeIcon: "🤝",
    points: 200,
    isRequired: false,
  },
  {
    id: "3",
    title: "Safety Protocols for Chemical Handling",
    description:
      "Essential safety procedures when handling agricultural chemicals",
    category: TRAINING_CATEGORY.SAFETY_COMPLIANCE,
    status: TRAINING_STATUS.COMPLETED,
    difficulty: DIFFICULTY_LEVEL.INTERMEDIATE,
    progress: 100,
    duration: 60,
    completedDate: new Date("2024-01-08"),
    badgeIcon: "🛡️",
    points: 150,
    isRequired: true,
  },
  {
    id: "4",
    title: "Customer Relationship Management",
    description: "Build lasting relationships with farming clients",
    category: TRAINING_CATEGORY.CUSTOMER_SERVICE,
    status: TRAINING_STATUS.NOT_STARTED,
    difficulty: DIFFICULTY_LEVEL.INTERMEDIATE,
    progress: 0,
    duration: 75,
    dueDate: new Date("2024-01-25"),
    badgeIcon: "👥",
    points: 120,
    isRequired: true,
  },
  {
    id: "5",
    title: "Soil Analysis Techniques",
    description:
      "Learn to analyze soil conditions and recommend appropriate solutions",
    category: TRAINING_CATEGORY.TECHNICAL_SKILLS,
    status: TRAINING_STATUS.IN_PROGRESS,
    difficulty: DIFFICULTY_LEVEL.ADVANCED,
    progress: 30,
    duration: 120,
    badgeIcon: "🔬",
    points: 250,
    isRequired: false,
  },
  {
    id: "6",
    title: "Digital Sales Tools Mastery",
    description: "Leverage technology for more effective sales processes",
    category: TRAINING_CATEGORY.SALES_TECHNIQUES,
    status: TRAINING_STATUS.EXPIRED,
    difficulty: DIFFICULTY_LEVEL.INTERMEDIATE,
    progress: 45,
    duration: 50,
    dueDate: new Date("2024-01-05"),
    badgeIcon: "💻",
    points: 130,
    isRequired: false,
  },
];

export const mockTrainingBadges: TrainingBadge[] = [
  {
    id: "1",
    name: "Product Expert",
    description: "Complete all product knowledge modules",
    icon: "🏆",
    category: TRAINING_CATEGORY.PRODUCT_KNOWLEDGE,
    requiredModules: ["1"],
    earned: true,
    earnedDate: new Date("2024-01-10"),
    rarity: "common",
  },
  {
    id: "2",
    name: "Safety Champion",
    description: "Master all safety compliance training",
    icon: "🛡️",
    category: TRAINING_CATEGORY.SAFETY_COMPLIANCE,
    requiredModules: ["3"],
    earned: true,
    earnedDate: new Date("2024-01-08"),
    rarity: "rare",
  },
  {
    id: "3",
    name: "Sales Ninja",
    description: "Complete advanced sales training modules",
    icon: "🥷",
    category: TRAINING_CATEGORY.SALES_TECHNIQUES,
    requiredModules: ["2"],
    earned: false,
    rarity: "epic",
  },
  {
    id: "4",
    name: "Technical Guru",
    description: "Master all technical skill modules",
    icon: "🔬",
    category: TRAINING_CATEGORY.TECHNICAL_SKILLS,
    requiredModules: ["5"],
    earned: false,
    rarity: "legendary",
  },
];

export const mockUserProgress: UserProgress = {
  totalModules: mockTrainingModules.length,
  completedModules: mockTrainingModules.filter(
    (m) => m.status === TRAINING_STATUS.COMPLETED
  ).length,
  inProgressModules: mockTrainingModules.filter(
    (m) => m.status === TRAINING_STATUS.IN_PROGRESS
  ).length,
  totalPoints: mockTrainingModules
    .filter((m) => m.status === TRAINING_STATUS.COMPLETED)
    .reduce((sum, m) => sum + m.points, 0),
  earnedBadges: mockTrainingBadges.filter((b) => b.earned).length,
  overallProgress: Math.round(
    (mockTrainingModules.filter((m) => m.status === TRAINING_STATUS.COMPLETED)
      .length /
      mockTrainingModules.length) *
      100
  ),
  streak: 5,
  lastActivity: new Date("2024-01-15"),
};
