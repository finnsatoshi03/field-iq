import { useState } from "react";
import { useAIChat } from "../utils/chat-utils";

export interface Message {
  id: number;
  message: string;
  isUser: boolean;
  timestamp: Date;
  feedback?: "up" | "down" | null;
}

export const useChatMessages = (initialMessage: string) => {
  const { sendMessage } = useAIChat();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      message: initialMessage,
      isUser: false,
      timestamp: new Date(),
      feedback: null,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleFeedback = (messageId: number, type: "up" | "down") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, feedback: msg.feedback === type ? null : type }
          : msg,
      ),
    );
  };

  const sendAIResponse = async (userMessage: string, intent: number) => {
    setIsTyping(true);

    try {
      const aiMessage = await sendMessage(userMessage, intent);

      // Ensure the message is always a string
      const messageText =
        typeof aiMessage === "string"
          ? aiMessage
          : typeof aiMessage === "object" && aiMessage !== null
            ? JSON.stringify(aiMessage)
            : "Unable to process response";

      const response: Message = {
        id: Date.now() + 1,
        message: messageText,
        isUser: false,
        timestamp: new Date(),
        feedback: null,
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error("Error sending AI response:", error);

      const errorResponse: Message = {
        id: Date.now() + 1,
        message: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
        feedback: null,
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, errorResponse]);
    }
  };

  return {
    messages,
    isTyping,
    addMessage,
    handleFeedback,
    sendAIResponse,
  };
};
