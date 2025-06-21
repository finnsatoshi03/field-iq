import { useState, useEffect } from "react";
import { X, Minimize2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useUser } from "@/hooks/use-user";
import { BYPASS_AUTH } from "@/lib/config";

import { WelcomeStage, ReportStage, ChatStage } from "./stages";
import {
  REPORT_OPTIONS,
  CHAT_OPTIONS,
  getChatModeForReportType,
  type ChatStage as ChatStageType,
  type ChatMode,
} from "../const";

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
  const [currentStage, setCurrentStage] = useState<ChatStageType>("welcome");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [reportType, setReportType] = useState<
    keyof typeof REPORT_OPTIONS | ""
  >("");
  const [chatMode, setChatMode] = useState<ChatMode>("normal");
  const [reportSubType, setReportSubType] = useState<string>("");

  // Reset stage when chat opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStage("welcome");
      setSelectedOption("");
      setReportType("");
      setChatMode("normal");
      setReportSubType("");
    }
  }, [isOpen]);

  const handleOptionSelect = (optionId: string, type: "chat" | "report") => {
    setSelectedOption(optionId);

    if (type === "report") {
      setReportType(optionId as keyof typeof REPORT_OPTIONS);
      setCurrentStage("report");
    } else {
      setCurrentStage("chat");
      setChatMode("normal");
    }
  };

  const handleReportSubmit = (reportSubType: string) => {
    // Instead of closing, proceed to chat with the appropriate mode
    setReportSubType(reportSubType);
    const mode = getChatModeForReportType(
      reportType as keyof typeof REPORT_OPTIONS
    );
    setChatMode(mode);
    setCurrentStage("chat");

    // Log the report submission for future use
    console.log("Report submitted:", {
      reportType,
      reportSubType,
      chatMode: mode,
    });
  };

  const handleBackToWelcome = () => {
    setCurrentStage("welcome");
    setSelectedOption("");
    setReportType("");
    setChatMode("normal");
    setReportSubType("");
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
            userRole={user?.role ?? "farmer"}
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
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
                aria-label="Minimize chat"
              >
                <Minimize2 className="size-4" />
              </button>
              <button
                onClick={onClose}
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
