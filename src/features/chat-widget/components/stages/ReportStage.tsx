import { motion } from "framer-motion";
import { REPORT_OPTIONS } from "../../const";

interface ReportStageProps {
  reportType: keyof typeof REPORT_OPTIONS;
  onSubmit: (reportSubType: string) => void;
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

export const ReportStage = ({ reportType, onSubmit }: ReportStageProps) => {
  const options = REPORT_OPTIONS[reportType];

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
              onClick={() => onSubmit(option.id)}
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
