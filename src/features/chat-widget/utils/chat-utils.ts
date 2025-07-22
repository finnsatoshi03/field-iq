import {
  type ChatMode,
  REPORT_OPTIONS,
  SUGGESTED_CHAT_TEMPLATES,
} from "../const";

export const getInitialMessage = (
  type: string,
  chatMode: ChatMode = "normal",
  reportContext?: {
    reportType: keyof typeof REPORT_OPTIONS;
    reportSubType: string;
  },
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

// Placeholder function for API-based suggested chats
export const getAPISuggestedChats = async (
  conversationContext: string,
  reportType: string,
  reportSubType: string,
): Promise<string[]> => {
  // This is a placeholder for future API implementation
  // In the future, this would call an AI service to generate contextual suggestions

  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // For now, return template suggestions based on context
    const templates = [];

    if (reportType === "report-sales") {
      if (reportSubType === "daily-sales" || reportSubType === "weekly-sales") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.sales_performance);
      }
      if (reportSubType === "client-visit") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.client_relationship);
      }
      if (reportSubType === "territory-update") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.territory_management);
      }
    }

    if (reportType === "report-issue-sales") {
      if (reportSubType === "product-or-field-issues") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.product_knowledge);
      }
      if (reportSubType === "dealer-problems") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.client_relationship);
      }
    }

    // Farmer-specific templates
    if (reportType === "report-issue") {
      if (reportSubType === "health-issue") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.flock_health);
      }
      if (reportSubType === "feed-issue") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.feed_management);
      }
      if (reportSubType === "equipment-issue") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.equipment_maintenance);
      }
      if (reportSubType === "other-issue") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.environmental_monitoring);
      }
    }

    if (reportType === "log-performance") {
      if (
        reportSubType === "egg-production" ||
        reportSubType === "feed-consumption" ||
        reportSubType === "flock-mortality" ||
        reportSubType === "growth-metrics"
      ) {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.performance_tracking);
      }
      if (reportSubType === "other-performance") {
        templates.push(...SUGGESTED_CHAT_TEMPLATES.environmental_monitoring);
      }
    }

    // Return a subset of templates (simulating AI selection)
    return templates.slice(0, 3);
  } catch (error) {
    console.error("Error fetching API suggested chats:", error);
    return [];
  }
};

export const getAIResponse = async (userMessage: string, intent: number): Promise<string> => {
  // Simple response logic based on keywords
  
  // // Handle quick selections
  // if (message.includes("quick selection:")) {
  //   const selectionText = message.replace("quick selection:", "").trim();
  //   return `Thank you for letting me know about ${selectionText}. Based on this information, I recommend monitoring this closely. Would you like specific advice on how to address this?`;
  // }

  // if (message.includes("feed") || message.includes("nutrition")) {
  //   return "For optimal chicken nutrition, I recommend a balanced diet with proper protein levels. Could you tell me more about your current feeding schedule?";
  // }
  // if (message.includes("egg") || message.includes("production")) {
  //   return "Egg production depends on several factors including nutrition, lighting, and flock health. What specific concerns do you have about egg production?";
  // }
  // if (message.includes("health") || message.includes("sick")) {
  //   return "Chicken health is crucial for productivity. Are you noticing any specific symptoms in your flock?";
  // }

  try {      
    const response = await fetch("http://127.0.0.1:8000/farmer/chat", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: userMessage,
        user_id: 3,
        chat_id: 18,
        intent_id: intent
      }),
    });

    const data = await response.json();
    
    return data.data.response || "Received a response, but it was not in the expected format.";
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Sorry I can't answer your question right now. Can you please try again later.";
  }

  // return "I understand your concern. Let me help you with that. Could you provide more details so I can give you the most accurate assistance?";
};
