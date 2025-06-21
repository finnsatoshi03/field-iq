import { ThumbsUp, ThumbsDown } from "lucide-react";
import { motion } from "framer-motion";
import { FaviconIcon } from "./FaviconIcon";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  feedback?: "up" | "down" | null;
  onFeedback?: (messageId: number, type: "up" | "down") => void;
}

// Use JavaScript's built-in relative time formatter
const getRelativeTime = (timestamp: Date): string => {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - timestamp.getTime()) / 1000
  );

  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(-diffInSeconds, "second");
  } else if (Math.abs(diffInSeconds) < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return rtf.format(-minutes, "minute");
  } else if (Math.abs(diffInSeconds) < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return rtf.format(-hours, "hour");
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return rtf.format(-days, "day");
  }
};

export const ChatBubble = ({
  message,
  isUser,
  timestamp,
  feedback,
  onFeedback,
}: ChatBubbleProps) => {
  if (isUser) {
    // User messages - Claude/ChatGPT style (right-aligned bubble, no avatar, left-aligned text)
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex justify-end"
      >
        <div className="max-w-[75%]">
          <div className="bg-primary text-primary-foreground px-4 py-3 rounded-lg rounded-br-none text-sm leading-relaxed">
            <p className="whitespace-pre-wrap text-left">{message}</p>
          </div>
          <div className="flex justify-end mt-1 px-1">
            <span className="text-xs text-gray-500">
              {getRelativeTime(timestamp)}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // AI messages - with avatar and feedback
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex gap-3"
    >
      {/* Avatar */}
      <FaviconIcon className="text-gray-700 size-7" />

      {/* Message Content */}
      <div className="max-w-[75%]">
        <div className="bg-gray-50 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none border border-gray-100 text-sm leading-relaxed">
          <p className="whitespace-pre-wrap">{message}</p>
        </div>

        {/* Timestamp and Feedback */}
        <div className="flex items-center gap-2 mt-1 px-1">
          <span className="text-xs text-gray-500">
            {getRelativeTime(timestamp)}
          </span>

          {/* Feedback buttons for AI messages only */}
          {onFeedback && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onFeedback(Date.now(), "up")}
                className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                  feedback === "up"
                    ? "bg-green-100 text-green-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                aria-label="Thumbs up"
              >
                <ThumbsUp className="size-3" />
              </button>
              <button
                onClick={() => onFeedback(Date.now(), "down")}
                className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                  feedback === "down"
                    ? "bg-red-100 text-red-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                aria-label="Thumbs down"
              >
                <ThumbsDown className="size-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
