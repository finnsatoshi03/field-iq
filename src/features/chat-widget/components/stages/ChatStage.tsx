import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatBubble } from "../ChatBubble";
import { TypingIndicator } from "../TypingIndicator";
import { getInitialMessage } from "../../utils/chat-utils";
import { useChatMessages } from "../../hooks/use-chat-messages";
import { QuickChatSelector } from "../QuickChatSelector";
import { CHAT_MODES, type ChatMode, REPORT_OPTIONS } from "../../const";

interface ChatStageProps {
  chatType: string;
  chatMode?: ChatMode;
  reportContext?: {
    reportType: keyof typeof REPORT_OPTIONS;
    reportSubType: string;
  };
}

export const ChatStage = ({
  chatType,
  chatMode = "normal",
  reportContext,
}: ChatStageProps) => {
  const { messages, isTyping, addMessage, handleFeedback, sendAIResponse } =
    useChatMessages(getInitialMessage(chatType, chatMode, reportContext));

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chatConfig = CHAT_MODES[chatMode];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && chatConfig.hasInput) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage, chatConfig.hasInput]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    addMessage({
      id: Date.now(),
      message: inputMessage,
      isUser: true,
      timestamp: new Date(),
      feedback: null,
    });

    const userMessageContent = inputMessage;
    setInputMessage("");

    // Send AI response after user message
    sendAIResponse(userMessageContent);
  };

  const handleQuickChatSelect = (optionId: string, optionLabel: string) => {
    // Add user message from quick selection
    addMessage({
      id: Date.now(),
      message: optionLabel,
      isUser: true,
      timestamp: new Date(),
      feedback: null,
    });

    // Send AI response based on selection
    sendAIResponse(`Quick selection: ${optionId} - ${optionLabel}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 h-full min-h-0 rounded-b-lg flex flex-col bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 h-full min-h-0">
        <div className="space-y-2">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg.message}
              isUser={msg.isUser}
              timestamp={msg.timestamp}
              feedback={msg.feedback}
              onFeedback={handleFeedback}
            />
          ))}

          <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Different based on chat mode */}
      <div className="border-t border-gray-100 rounded-b-lg p-4 bg-gray-50/50">
        {chatConfig.hasInput ? (
          // Normal input for regular and report chat modes
          <>
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message FieldIQ AI${chatMode === "report" ? " about your report" : ""}...`}
                rows={1}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all resize-none text-sm leading-relaxed bg-white max-h-32 overflow-y-auto"
                style={{ minHeight: "44px" }}
                disabled={isTyping}
              />

              {/* Send button - only show when there's input */}
              <AnimatePresence>
                {inputMessage.trim() && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="absolute right-2 bottom-2 w-8 h-8 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    aria-label="Send message"
                  >
                    <Send className="size-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center mt-3">
              <p className="text-xs text-gray-500">
                FieldIQ AI can make mistakes. Please verify important
                information.
              </p>
            </div>
          </>
        ) : (
          // Quick chat selector for quick mode (compact, no extra container)
          <QuickChatSelector
            reportContext={reportContext}
            onSelect={handleQuickChatSelect}
            disabled={isTyping}
          />
        )}
      </div>
    </div>
  );
};
