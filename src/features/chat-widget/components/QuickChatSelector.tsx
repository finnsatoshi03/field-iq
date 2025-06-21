import { motion } from "framer-motion";
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

export const QuickChatSelector = ({
  reportContext,
  onSelect,
  disabled = false,
}: QuickChatSelectorProps) => {
  // Get quick chat options based on report context
  const getQuickChatOptions = () => {
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
    <div className="space-y-2">
      {/* Compact Header */}
      <p className="text-xs text-gray-600 font-medium text-center">
        Quick options:
      </p>

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

      {/* Ultra-compact footer */}
      <p className="text-xs text-gray-400 text-center">
        {options.length} options
      </p>
    </div>
  );
};
