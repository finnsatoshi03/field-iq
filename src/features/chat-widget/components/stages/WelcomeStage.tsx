import { motion } from "framer-motion";
import { CHAT_OPTIONS } from "../../const";
import type { UserRole } from "@/lib/types";

interface WelcomeStageProps {
  userRole: UserRole;
  onOptionSelect: (optionId: string, type: "chat" | "report") => void;
}

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: "easeOut" as const,
    },
  }),
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
  },
};

export const WelcomeStage = ({
  userRole,
  onOptionSelect,
}: WelcomeStageProps) => {
  // Only allow sales_rep and farmer roles
  if (userRole !== "sales_rep" && userRole !== "farmer") {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Chat support is available for Sales Representatives and Farmers
            only.
          </p>
        </div>
      </div>
    );
  }

  const options = CHAT_OPTIONS[userRole];

  return (
    <div className="flex-1 px-4 pb-4">
      <div className="space-y-1">
        {options.map((option, index) => {
          const isLastOption = index === options.length - 1;
          return (
            <motion.button
              key={option.id}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              custom={index}
              onClick={() => onOptionSelect(option.id, option.type)}
              className="w-full flex items-center gap-1"
            >
              <span className="text-3xl">{option.emoji}</span>
              <span
                className={`px-4 py-1.5 rounded font-medium text-sm leading-relaxed ${
                  isLastOption
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {option.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
