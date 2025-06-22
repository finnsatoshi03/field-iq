import { TRAINING_STATUS, DIFFICULTY_LEVEL } from "./constants";
import type { TrainingModule, UserProgress, TrainingStatus } from "./constants";

// Status and Badge Color Functions
export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case TRAINING_STATUS.COMPLETED:
      return "bg-green-600 text-green-50";
    case TRAINING_STATUS.IN_PROGRESS:
      return "bg-blue-600 text-blue-50";
    case TRAINING_STATUS.NOT_STARTED:
      return "bg-gray-600 text-gray-50";
    case TRAINING_STATUS.EXPIRED:
      return "bg-red-600 text-red-50";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const getDifficultyBadgeColor = (difficulty: string) => {
  switch (difficulty) {
    case DIFFICULTY_LEVEL.BEGINNER:
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
    case DIFFICULTY_LEVEL.INTERMEDIATE:
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800";
    case DIFFICULTY_LEVEL.ADVANCED:
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const getRarityBadgeColor = (rarity: string) => {
  switch (rarity) {
    case "common":
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
    case "rare":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    case "epic":
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
    case "legendary":
      return "bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 border-orange-200 dark:from-orange-900/20 dark:to-yellow-900/20 dark:text-orange-400 dark:border-orange-800";
    default:
      return "bg-muted text-muted-foreground";
  }
};

// Formatting Functions
export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

export const formatCategoryName = (category: string) => {
  return category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export const formatStatusName = (status: string) => {
  return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export const formatDateRelative = (date: Date) => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

// Data Processing Functions
export const getInProgressModules = (modules: TrainingModule[]) => {
  return modules.filter(
    (module) => module.status === TRAINING_STATUS.IN_PROGRESS
  );
};

export const getOverdueModules = (modules: TrainingModule[]) => {
  return modules.filter(
    (module) =>
      module.dueDate &&
      module.dueDate < new Date() &&
      module.status !== TRAINING_STATUS.COMPLETED
  );
};

export const getCompletedModules = (modules: TrainingModule[]) => {
  return modules.filter(
    (module) => module.status === TRAINING_STATUS.COMPLETED
  );
};

export const getNotStartedModules = (modules: TrainingModule[]) => {
  return modules.filter(
    (module) => module.status === TRAINING_STATUS.NOT_STARTED
  );
};

export const getExpiredModules = (modules: TrainingModule[]) => {
  return modules.filter((module) => module.status === TRAINING_STATUS.EXPIRED);
};

// Progress and Motivation Functions
export const getMotivationalMessage = (progress: UserProgress) => {
  if (progress.overallProgress >= 90) {
    return "🎉 Amazing! You're almost at 100% completion!";
  } else if (progress.overallProgress >= 75) {
    return "🚀 Great progress! You're in the final stretch!";
  } else if (progress.overallProgress >= 50) {
    return "💪 You're halfway there! Keep up the great work!";
  } else if (progress.overallProgress >= 25) {
    return "📈 Good start! Momentum is building!";
  } else {
    return "🌱 Every expert was once a beginner. Let's get started!";
  }
};

export const calculateOverallProgress = (modules: TrainingModule[]) => {
  if (modules.length === 0) return 0;

  const completedModules = getCompletedModules(modules);
  return Math.round((completedModules.length / modules.length) * 100);
};

export const calculateTotalPoints = (modules: TrainingModule[]) => {
  return getCompletedModules(modules).reduce(
    (sum, module) => sum + module.points,
    0
  );
};

// Badge Functions
export const canEarnBadge = (badge: any, modules: TrainingModule[]) => {
  const completedModuleIds = getCompletedModules(modules).map((m) => m.id);
  return badge.requiredModules.every((moduleId: string) =>
    completedModuleIds.includes(moduleId)
  );
};

// Module Status Helpers
export const isModuleOverdue = (module: TrainingModule) => {
  return (
    module.dueDate &&
    module.dueDate < new Date() &&
    module.status !== TRAINING_STATUS.COMPLETED
  );
};

export const isModuleRequired = (module: TrainingModule) => {
  return module.isRequired;
};

export const getModulesByCategory = (
  modules: TrainingModule[],
  category: string
) => {
  return modules.filter((module) => module.category === category);
};

export const getModulesByDifficulty = (
  modules: TrainingModule[],
  difficulty: string
) => {
  return modules.filter((module) => module.difficulty === difficulty);
};

export const getModulesByStatus = (
  modules: TrainingModule[],
  status: TrainingStatus
) => {
  return modules.filter((module) => module.status === status);
};
