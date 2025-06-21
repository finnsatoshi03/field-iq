import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const popupVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    x: 20,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    x: 20,
    y: 10,
    transition: {
      duration: 0.2,
    },
  },
};

interface PopupMessageProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const PopupMessage = ({
  message,
  isVisible,
  onClose,
}: PopupMessageProps) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        variants={popupVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="absolute bottom-full right-0 mb-2 w-64 bg-black text-white border border-gray-800 rounded-lg shadow-2xl p-3 cursor-pointer"
        onClick={onClose}
      >
        <div className="flex items-start justify-between">
          <p className="text-sm text-white pr-2">{message}</p>
          <button className="text-gray-300 hover:text-white mt-0.5 transition-colors">
            <X className="size-3" />
          </button>
        </div>
        <div className="absolute bottom-0 right-4 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-black translate-y-full"></div>
      </motion.div>
    )}
  </AnimatePresence>
);
