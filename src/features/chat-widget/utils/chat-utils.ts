import { FIELD_IQ_API_CONFIG } from "@/lib/config";
import type { UserRole } from "@/lib/types";
import { useUserStore } from "@/store/user-store";
import { type ChatMode, REPORT_OPTIONS } from "../const";

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
    const reportType = reportContext.reportType.replaceAll("-", " ");
    const reportSubType = reportContext.reportSubType.replaceAll("-", " ");

    // Format based on report type
    if (reportType === "report issue sales") {
      if (reportSubType === "sales rep problems") {
        return "You've chosen Report Issue → Sales Rep Problems. Let's log the details so I can route it to the right team. What happened?";
      }
      if (reportSubType === "product or field issues") {
        return "You've chosen Report Issue → Product or Field Issues. Let's capture the details so I can help. What's the problem?";
      }
      if (reportSubType === "dealer problems") {
        return "You've chosen Report Issue → Dealer Problems. Let's log the details so I can route it to the right team. What happened?";
      }
    }

    if (reportType === "report sales") {
      if (reportSubType === "sales report") {
        return "You've chosen Log Performance → Sales Report. Let's record the details. Share the following information: farm name, product, amount ordered, and date of transaction.";
      }
      if (reportSubType === "daily sales") {
        return "You've chosen Log Performance → Sales Report. Let's record the details. Share the following information: farm name, product, amount ordered, and date of transaction.";
      }
      if (reportSubType === "farm visit") {
        return "You've chosen Log Performance → Farm Visit. Let's log the details. Share the following information: farm name, product, visit date and status.";
      }
    }

    // Default report message
    return `You've chosen ${reportType} → ${reportSubType}. How can I help you with this?`;
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
  console.log(conversationContext);
  // This is a placeholder for future API implementation
  // In the future, this would call an AI service to generate contextual suggestions

  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // For now, return template suggestions based on context
    const templates: string[] = [];

    if (reportType === "report-sales") {
      if (reportSubType === "daily-sales" || reportSubType === "weekly-sales") {
        // templates.push(...SUGGESTED_CHAT_TEMPLATES.sales_performance);
      }
      if (reportSubType === "client-visit") {
        // templates.push(...SUGGESTED_CHAT_TEMPLATES.client_relationship);
      }
      if (reportSubType === "territory-update") {
        // templates.push(...SUGGESTED_CHAT_TEMPLATES.territory_management);
      }
    }

    if (reportType === "report-issue-sales") {
      if (reportSubType === "product-or-field-issues") {
        // templates.push(...SUGGESTED_CHAT_TEMPLATES.product_knowledge);
      }
      if (reportSubType === "dealer-problems") {
        // templates.push(...SUGGESTED_CHAT_TEMPLATES.client_relationship);
      }
    }

    // Farmer-specific templates
    if (reportType === "report-issue") {
      if (reportSubType === "health-issue") {
        // templates.push(...SUGGESTED_CHAT_TEMPLATES.flock_health);
      }
      if (reportSubType === "feed-issue") {
        // templates.push(...SUGGESTED_CHAT_TEMPLATES.feed_management);
      }
      if (reportSubType === "equipment-issue") {
        // templates.push(...SUGGESTED_CHAT_TEMPLATES.equipment_maintenance);
      }
      if (reportSubType === "other-issue") {
        // templates.push(...SUGGESTED_CHAT_TEMPLATES.environmental_monitoring);
      }
    }

    if (reportType === "log-performance") {
      // if (
      //   reportSubType === "egg-production" ||
      //   reportSubType === "feed-consumption" ||
      //   reportSubType === "flock-mortality" ||
      //   reportSubType === "growth-metrics"
      // ) {
      //   templates.push(...SUGGESTED_CHAT_TEMPLATES.performance_tracking);
      // }
      // if (reportSubType === "other-performance") {
      //   templates.push(...SUGGESTED_CHAT_TEMPLATES.environmental_monitoring);
      // }
    }

    // Return a subset of templates (simulating AI selection)
    return templates.slice(0, 3);
  } catch (error) {
    console.error("Error fetching API suggested chats:", error);
    return [];
  }
};

const getChatEndpointByRole = (role: UserRole): string => {
  const baseUrl = FIELD_IQ_API_CONFIG.baseUrl;

  switch (role) {
    case "farmer":
      return `${baseUrl}${FIELD_IQ_API_CONFIG.endpoints.farmer_v2.chat_ai}`;
    case "sales_rep":
      return `${baseUrl}${FIELD_IQ_API_CONFIG.endpoints.sales_rep.chat}`;
    default:
      throw new Error(`Chat is not available for role: ${role}`);
  }
};

export interface AIResponse {
  message: string;
  nextAction?: string;
  logType?: string;
}

export const getAIResponse = async (
  userMessage: string,
  intent: number,
  userRole: UserRole,
  userId?: number,
  chatId?: number,
): Promise<AIResponse> => {
  // Validate that the user role is allowed to access chat
  if (userRole !== "farmer" && userRole !== "sales_rep") {
    throw new Error(`Chat is not available for role: ${userRole}`);
  }

  try {
    const endpoint = getChatEndpointByRole(userRole);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: userMessage,
        user_id: userId || 1,
        chat_id: chatId || 18,
        intent_id: intent,
      }),
    });

    const data = await response.json();

    // Parse the response to extract next_action and other metadata
    const responseMessage =
      data.data.response ||
      "Received a response, but it was not in the expected format.";
    const nextAction = data.data.next_action;
    const logType = data.data.log_type;

    return {
      message: responseMessage,
      nextAction,
      logType,
    };
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return {
      message:
        "Sorry I can't answer your question right now. Can you please try again later.",
    };
  }
};

/**
 * Hook to get AI response using the authenticated user's role
 * Only farmers and sales_reps can access the chat functionality
 */
export const useAIChat = () => {
  const { user } = useUserStore();

  const sendMessage = async (
    userMessage: string,
    intent: number,
    chatId?: number,
  ): Promise<AIResponse> => {
    if (!user) {
      throw new Error("User must be authenticated to use chat");
    }

    if (user.role !== "farmer" && user.role !== "sales_rep") {
      throw new Error(`Chat is not available for role: ${user.role}`);
    }

    return getAIResponse(
      userMessage,
      intent,
      user.role,
      user.profileId || undefined,
      chatId,
    );
  };

  const canUseChat = user?.role === "farmer" || user?.role === "sales_rep";

  return {
    sendMessage,
    canUseChat,
    userRole: user?.role,
    userId: user?.profileId,
  };
};
