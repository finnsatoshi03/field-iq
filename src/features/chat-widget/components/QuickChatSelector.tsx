import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useState } from "react";
import { QUICK_CHAT_OPTIONS, REPORT_OPTIONS } from "../const";

interface QuickChatSelectorProps {
  reportContext?: {
    reportType: keyof typeof REPORT_OPTIONS;
    reportSubType: string;
  };
  onSelect: (optionId: string, optionLabel: string) => void;
  disabled?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.15,
      ease: "easeOut" as const,
    },
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

export const QuickChatSelector = ({
  reportContext,
  onSelect,
  disabled = false,
}: QuickChatSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Get quick chat options based on report context
  const getQuickChatOptions = (): Array<{
    id: string;
    label: string;
    emoji: string;
  }> => {
    if (!reportContext) return [];

    const options =
      QUICK_CHAT_OPTIONS[
        reportContext.reportSubType as keyof typeof QUICK_CHAT_OPTIONS
      ];
    return options || [];
  };

  const options = getQuickChatOptions();

  if (options.length === 0) {
    return (
      <div className="text-center py-3">
        <p className="text-xs text-gray-500">No quick options available.</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-700">
            Quick options
          </span>
          <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full">
            {options.length}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronUp className="size-4 text-gray-500" />
        </motion.div>
      </button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={collapseVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="px-3 py-2 bg-white"
          >
            {/* Compact Chip/Pill Layout */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-1.5"
            >
              {options.map((option) => (
                <motion.button
                  key={option.id}
                  variants={chipVariants}
                  whileHover={disabled ? undefined : { scale: 1.02 }}
                  whileTap={disabled ? undefined : { scale: 0.98 }}
                  onClick={() => !disabled && onSelect(option.id, option.label)}
                  disabled={disabled}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                    disabled
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 hover:shadow-sm active:shadow-none border border-transparent hover:border-blue-200"
                  }`}
                >
                  <span className="text-xs">{option.emoji}</span>
                  <span className="leading-none">{option.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
