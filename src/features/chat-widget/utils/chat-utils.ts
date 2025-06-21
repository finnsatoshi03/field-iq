import { type ChatMode, REPORT_OPTIONS } from "../const";

export const getInitialMessage = (
  type: string,
  chatMode: ChatMode = "normal",
  reportContext?: {
    reportType: keyof typeof REPORT_OPTIONS;
    reportSubType: string;
  }
): string => {
  // Handle report mode with context
  if (chatMode === "report" && reportContext) {
    return `I see you've submitted a ${reportContext.reportType.replace("-", " ")} about ${reportContext.reportSubType.replace("-", " ")}. How can I help you with this?`;
  }

  // Handle quick chat mode
  if (chatMode === "quick") {
    return "Please select from the options below to continue our conversation about your performance data.";
  }

  // Default messages based on chat type
  switch (type) {
    case "ask-question":
      return "Hi! I'm here to help answer any questions you have. What would you like to know?";
    case "get-info":
    case "get-guides":
      return "What information can I help you find today?";
    case "ask-feed":
      return "I'd be happy to help with your feed-related questions! What would you like to know about chicken feed?";
    default:
      return "Hello! How can I assist you today?";
  }
};

export const getAIResponse = (userMessage: string): string => {
  // Simple response logic based on keywords
  const message = userMessage.toLowerCase();

  // Handle quick selections
  if (message.includes("quick selection:")) {
    const selectionText = message.replace("quick selection:", "").trim();
    return `Thank you for letting me know about ${selectionText}. Based on this information, I recommend monitoring this closely. Would you like specific advice on how to address this?`;
  }

  if (message.includes("feed") || message.includes("nutrition")) {
    return "For optimal chicken nutrition, I recommend a balanced diet with proper protein levels. Could you tell me more about your current feeding schedule?";
  }
  if (message.includes("egg") || message.includes("production")) {
    return "Egg production depends on several factors including nutrition, lighting, and flock health. What specific concerns do you have about egg production?";
  }
  if (message.includes("health") || message.includes("sick")) {
    return "Chicken health is crucial for productivity. Are you noticing any specific symptoms in your flock?";
  }

  return "I understand your concern. Let me help you with that. Could you provide more details so I can give you the most accurate assistance?";
};
