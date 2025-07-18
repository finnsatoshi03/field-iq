import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Minimize2, X } from "lucide-react";
import { useEffect } from "react";

import { useUser } from "@/hooks/use-user";
import { BYPASS_AUTH } from "@/lib/config";
import { useChatWidgetStore } from "@/store";

import {
  CHAT_OPTIONS,
  getChatModeForReportType,
  REPORT_OPTIONS,
} from "../const";
import { ChatStage, ReportStage, WelcomeStage } from "./stages";

const chatWindowVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatWindow = ({ isOpen, onClose }: ChatWindowProps) => {
  const { user } = useUser();

  // Use store for state management
  const {
    currentStage,
    selectedOption,
    reportType,
    reportSubType,
    chatMode,
    setStage,
    setSelectedOption,
    setReportType,
    setReportSubType,
    setChatMode,
    resetState,
  } = useChatWidgetStore();

  // Reset stage when chat opens (only if it's in welcome stage)
  useEffect(() => {
    if (isOpen && currentStage === "welcome") {
      // Only reset if we're in welcome stage - this allows direct navigation to specific modes
      setSelectedOption("");
      setReportType("");
      setChatMode("normal");
      setReportSubType("");
    }
  }, [
    isOpen,
    currentStage,
    setSelectedOption,
    setReportType,
    setChatMode,
    setReportSubType,
  ]);

  const handleOptionSelect = (optionId: string, type: "chat" | "report") => {
    setSelectedOption(optionId);

    if (type === "report") {
      setReportType(optionId as keyof typeof REPORT_OPTIONS);
      setStage("report");
    } else {
      setStage("chat");
      setChatMode("normal");
    }
  };

  const handleReportSubmit = (reportSubType: string) => {
    // Instead of closing, proceed to chat with the appropriate mode
    setReportSubType(reportSubType);
    const mode = getChatModeForReportType(
      reportType as keyof typeof REPORT_OPTIONS,
    );
    setChatMode(mode);
    setStage("chat");

    // Log the report submission for future use
    console.log("Report submitted:", {
      reportType,
      reportSubType,
      chatMode: mode,
    });
  };

  const handleBackToWelcome = () => {
    setStage("welcome");
    setSelectedOption("");
    setReportType("");
    setChatMode("normal");
    setReportSubType("");
  };

  const handleClose = () => {
    // Reset to welcome stage when closing
    resetState();
    onClose();
  };

  // Helper function to get header title and description
  const getHeaderInfo = () => {
    if (currentStage === "welcome") {
      return {
        title: "Need help?",
        description: "How can I help you today",
        showBack: false,
      };
    }

    // Find the selected option details
    const userRole = user?.role ?? "sales_rep";
    const options = CHAT_OPTIONS[userRole as keyof typeof CHAT_OPTIONS] || [];
    const option = options.find((opt) => opt.id === selectedOption);

    if (currentStage === "report") {
      return {
        title: option?.label || "Report",
        description: "What would you like to report?",
        showBack: true,
      };
    }

    if (currentStage === "chat") {
      // Different descriptions based on chat mode
      let description = "Let's chat about this";
      if (chatMode === "report") {
        description = "Let's discuss your report";
      } else if (chatMode === "quick") {
        description = "Quick chat - select an option";
      }

      return {
        title: option?.label || "Chat",
        description,
        showBack: true,
      };
    }

    return {
      title: "Need help?",
      description: "How can I help you today",
      showBack: false,
    };
  };

  const headerInfo = getHeaderInfo();

  const renderCurrentStage = () => {
    if (!user && !BYPASS_AUTH) return null;

    switch (currentStage) {
      case "welcome":
        return (
          <WelcomeStage
            userRole={"sales_rep"}
            onOptionSelect={handleOptionSelect}
          />
        );
      case "report":
        return reportType ? (
          <ReportStage reportType={reportType} onSubmit={handleReportSubmit} />
        ) : null;
      case "chat":
        return (
          <ChatStage
            chatType={selectedOption}
            chatMode={chatMode}
            reportContext={
              reportType ? { reportType, reportSubType } : undefined
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={chatWindowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-20 right-4 max-w-92 w-fit max-h-[70vh] h-fit bg-white rounded-lg shadow-xl z-40 flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between gap-8 p-4">
            <div className="flex gap-3">
              {headerInfo.showBack && (
                <button
                  onClick={handleBackToWelcome}
                  className="text-gray-600 hover:text-gray-800 p-1 h-fit rounded hover:bg-gray-100 transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="size-4" />
                </button>
              )}
              <div className="flex-1">
                <h3 className="font-display leading-none font-semibold text-gray-800 text-lg">
                  {headerInfo.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {headerInfo.description}
                </p>
              </div>
            </div>
            <div className="flex items-center h-fit gap-2">
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
                aria-label="Minimize chat"
              >
                <Minimize2 className="size-4" />
              </button>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
                aria-label="Close chat"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Stage Content */}
          {renderCurrentStage()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
