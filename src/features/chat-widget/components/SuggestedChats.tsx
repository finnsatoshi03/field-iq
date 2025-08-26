import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useState } from "react";
import { SUGGESTED_CHAT_OPTIONS, SUGGESTED_CHAT_TEMPLATES } from "../const";

interface SuggestedChatsProps {
  reportType: string;
  reportSubType: string;
  onSelect: (suggestion: string) => void;
  disabled?: boolean;
  showTemplates?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.05,
      duration: 0.3,
    },
  },
};

const suggestionVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
    },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.15 },
  },
  tap: {
    scale: 0.98,
  },
};

const collapseVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut" as const,
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut" as const,
    },
  },
};

export const SuggestedChats = ({
  reportType,
  reportSubType,
  onSelect,
  disabled = false,
  showTemplates = false,
}: SuggestedChatsProps) => {
  const [isQuickNotesExpanded, setIsQuickNotesExpanded] = useState(true);
  const [isSuggestedTopicsExpanded, setIsSuggestedTopicsExpanded] =
    useState(true);

  // Get initial suggestions based on report type and subtype
  const getInitialSuggestions = () => {
    const typeOptions =
      SUGGESTED_CHAT_OPTIONS[reportType as keyof typeof SUGGESTED_CHAT_OPTIONS];
    if (!typeOptions) return [];

    const subtypeOptions =
      typeOptions[reportSubType as keyof typeof typeOptions];
    return (subtypeOptions || []) as Array<{
      id: string;
      label: string;
      emoji: string;
    }>;
  };

  // Get template suggestions (for API responses)
  const getTemplateSuggestions = () => {
    // This would be replaced with actual API call
    // For now, return template suggestions based on context
    const templates: string[] = [];

    if (reportType === "report-sales") {
      if (reportSubType === "daily-sales" || reportSubType === "weekly-sales") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.sales_performance);
      }
      if (reportSubType === "client-visit") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.client_relationship);
      }
      if (reportSubType === "territory-update") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.territory_management);
      }
    }

    if (reportType === "report-issue-sales") {
      if (reportSubType === "product-or-field-issues") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.product_knowledge);
      }
      if (reportSubType === "dealer-problems") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.client_relationship);
      }
    }

    // Farmer-specific templates
    if (reportType === "report-issue") {
      if (reportSubType === "health-issue") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.flock_health);
      }
      if (reportSubType === "feed-issue") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.feed_management);
      }
      if (reportSubType === "equipment-issue") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.equipment_maintenance);
      }
      if (reportSubType === "other-issue") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.environmental_monitoring);
      }
    }

    if (reportType === "log-performance") {
      if (
        reportSubType === "egg-production" ||
        reportSubType === "feed-consumption" ||
        reportSubType === "flock-mortality" ||
        reportSubType === "growth-metrics"
      ) {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.performance_tracking);
      }
      if (reportSubType === "other-performance") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.environmental_monitoring);
      }
    }

    return templates.slice(0, 3); // Limit to 3 template suggestions
  };

  const initialSuggestions = getInitialSuggestions();
  const templateSuggestions = showTemplates ? getTemplateSuggestions() : [];

  // Type guard to ensure suggestions are properly typed
  const validInitialSuggestions = initialSuggestions.filter(
    (suggestion) =>
      suggestion &&
      typeof suggestion === "object" &&
      "id" in suggestion &&
      "label" in suggestion,
  );

  if (
    validInitialSuggestions.length === 0 &&
    templateSuggestions.length === 0
  ) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      {/* Quick Notes Section */}
      {validInitialSuggestions.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setIsQuickNotesExpanded(!isQuickNotesExpanded)}
            className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
            disabled={disabled}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700">
                Quick notes
              </span>
              <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full">
                {validInitialSuggestions.length}
              </span>
            </div>
            <motion.div
              animate={{ rotate: isQuickNotesExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="size-4 text-gray-500" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isQuickNotesExpanded && (
              <motion.div
                variants={collapseVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="px-3 py-2 bg-white"
              >
                <div className="flex flex-wrap gap-2">
                  {validInitialSuggestions.map((suggestion) => (
                    <motion.button
                      key={suggestion.id}
                      variants={suggestionVariants}
                      whileHover={disabled ? undefined : "hover"}
                      whileTap={disabled ? undefined : "tap"}
                      onClick={() => !disabled && onSelect(suggestion.label)}
                      disabled={disabled}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                        disabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                      }`}
                    >
                      <span className="text-sm">{suggestion.emoji}</span>
                      <span className="leading-tight">{suggestion.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Template Suggestions (API-based) */}
      {templateSuggestions.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() =>
              setIsSuggestedTopicsExpanded(!isSuggestedTopicsExpanded)
            }
            className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
            disabled={disabled}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700">
                Suggested topics
              </span>
              <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full">
                {templateSuggestions.length}
              </span>
            </div>
            <motion.div
              animate={{ rotate: isSuggestedTopicsExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="size-4 text-gray-500" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isSuggestedTopicsExpanded && (
              <motion.div
                variants={collapseVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="px-3 py-2 bg-white"
              >
                <div className="flex flex-wrap gap-2">
                  {templateSuggestions.map((template, index) => (
                    <motion.button
                      key={index}
                      variants={suggestionVariants}
                      whileHover={disabled ? undefined : "hover"}
                      whileTap={disabled ? undefined : "tap"}
                      onClick={() => !disabled && onSelect(template)}
                      disabled={disabled}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                        disabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 border border-green-200 hover:border-green-300 shadow-sm hover:shadow-md"
                      }`}
                    >
                      <span className="text-sm">📝</span>
                      <span className="leading-tight">{template}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
