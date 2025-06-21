import { useState } from "react";
import { getAIResponse } from "../utils/chat-utils";

export interface Message {
  id: number;
  message: string;
  isUser: boolean;
  timestamp: Date;
  feedback?: "up" | "down" | null;
}

export const useChatMessages = (initialMessage: string) => {
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
          : msg
      )
    );
  };

  const sendAIResponse = (userMessage: string) => {
    setIsTyping(true);

    // Simulate AI response with realistic delay
    setTimeout(
      () => {
        setIsTyping(false);
        const response: Message = {
          id: Date.now() + 1,
          message: getAIResponse(userMessage),
          isUser: false,
          timestamp: new Date(),
          feedback: null,
        };
        setMessages((prev) => [...prev, response]);
      },
      1500 + Math.random() * 1000
    ); // Random delay between 1.5-2.5s
  };

  return {
    messages,
    isTyping,
    addMessage,
    handleFeedback,
    sendAIResponse,
  };
};
