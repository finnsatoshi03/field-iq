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
  console.log(conversationContext);
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

export const getAIResponse = (userMessage: string): string => {
  // Simple response logic based on keywords
  const message = userMessage.toLowerCase();

  // Handle quick selections
  if (message.includes("quick selection:")) {
    const selectionText = message.replace("quick selection:", "").trim();
    return `I've noted your entry about ${selectionText}. This information has been recorded for your records. Is there anything else you'd like to add to this note?`;
  }

  // Handle diary-style entries for sales representatives
  if (
    message.includes("didn't sign contract") ||
    message.includes("contract")
  ) {
    return "I've recorded the contract issue. This is important to track for follow-up. Would you like to add any specific details about why the contract wasn't signed or what next steps you're planning?";
  }

  if (
    message.includes("had meeting with client") ||
    message.includes("client meeting")
  ) {
    return "I've noted your client meeting. It's good to keep track of these interactions. Would you like to add any outcomes, action items, or follow-up tasks from this meeting?";
  }

  if (
    message.includes("visited new territory") ||
    message.includes("territory visit")
  ) {
    return "I've recorded your territory visit. New territories can present great opportunities. Would you like to add any observations about the market, potential clients, or challenges you encountered?";
  }

  if (
    message.includes("met/fell short of daily target") ||
    message.includes("daily target")
  ) {
    return "I've noted your target performance. It's important to track these metrics. Would you like to add any factors that contributed to this outcome or strategies for improvement?";
  }

  if (
    message.includes("dealer filed complaint") ||
    message.includes("dealer complaint")
  ) {
    return "I've recorded the dealer complaint. This requires immediate attention. Would you like to add details about the nature of the complaint and any immediate actions you've taken?";
  }

  if (
    message.includes("dealer expressed dissatisfaction") ||
    message.includes("dealer dissatisfaction")
  ) {
    return "I've noted the dealer's dissatisfaction. This is important for relationship management. Would you like to add any specific concerns they raised or steps you're taking to address them?";
  }

  if (
    message.includes("product malfunction") ||
    message.includes("product problem")
  ) {
    return "I've recorded the product malfunction report. This is critical for quality control. Would you like to add specific details about the issue, affected products, or customer impact?";
  }

  if (
    message.includes("field-related problem") ||
    message.includes("field issue")
  ) {
    return "I've noted the field-related problem. These issues can affect multiple stakeholders. Would you like to add any specific details about the location, impact, or potential solutions?";
  }

  if (message.includes("urgent matter") || message.includes("urgent")) {
    return "I've flagged this as an urgent matter. This requires immediate attention. Would you like to add any specific details about the urgency, potential impact, or immediate actions needed?";
  }

  if (message.includes("safety concern") || message.includes("safety")) {
    return "I've recorded the safety concern. Safety is our top priority. Would you like to add specific details about the safety issue, location, and any immediate actions taken?";
  }

  // Handle general note-taking entries
  if (message.includes("summary") || message.includes("performance")) {
    return "I've recorded your performance summary. This is valuable for tracking progress. Would you like to add any specific metrics, achievements, or areas for improvement?";
  }

  if (message.includes("feedback") || message.includes("client feedback")) {
    return "I've noted the client feedback. This is valuable for relationship building. Would you like to add any specific comments, suggestions, or action items from the feedback?";
  }

  if (message.includes("follow-up") || message.includes("next steps")) {
    return "I've recorded the follow-up actions needed. Good follow-up is crucial for success. Would you like to add any specific tasks, deadlines, or priorities for these follow-ups?";
  }

  if (
    message.includes("opportunities") ||
    message.includes("sales opportunities")
  ) {
    return "I've noted the sales opportunities identified. These are valuable for growth. Would you like to add any specific details about the opportunities, potential value, or next steps?";
  }

  if (message.includes("challenges") || message.includes("problems")) {
    return "I've recorded the challenges you're facing. Understanding obstacles helps in finding solutions. Would you like to add any specific details about the challenges or potential solutions you're considering?";
  }

  if (message.includes("competitor") || message.includes("competition")) {
    return "I've noted the competitor activities. This information is valuable for strategy. Would you like to add any specific details about what competitors are doing or how it affects your business?";
  }

  // Handle farmer-specific diary entries
  if (message.includes("feed") || message.includes("nutrition")) {
    return "I've recorded your feed-related note. Nutrition is crucial for flock health. Would you like to add any specific details about feed consumption, quality issues, or nutritional concerns?";
  }

  if (message.includes("egg") || message.includes("production")) {
    return "I've noted your egg production entry. This is important for tracking flock performance. Would you like to add any specific metrics, changes, or concerns about production levels?";
  }

  if (message.includes("health") || message.includes("sick")) {
    return "I've recorded the health concern. Flock health is critical. Would you like to add any specific symptoms, affected birds, or actions you've taken to address the health issue?";
  }

  // Handle specific farmer diary entries
  if (
    message.includes("birds showing signs of illness") ||
    message.includes("sick birds")
  ) {
    return "I've recorded the illness observation. This is critical for flock health. Would you like to add specific symptoms, number of affected birds, or any immediate actions you've taken?";
  }

  if (
    message.includes("increased mortality rate") ||
    message.includes("mortality increase")
  ) {
    return "I've noted the mortality increase. This requires immediate attention. Would you like to add details about the number of losses, age of affected birds, or potential causes?";
  }

  if (
    message.includes("unusual bird behavior") ||
    message.includes("behavior changes")
  ) {
    return "I've recorded the behavior changes. This could indicate health or environmental issues. Would you like to add specific behaviors observed or potential triggers?";
  }

  if (
    message.includes("feed quality concerns") ||
    message.includes("feed quality")
  ) {
    return "I've noted the feed quality concern. This affects flock nutrition and performance. Would you like to add specific quality issues, affected feed batches, or supplier information?";
  }

  if (
    message.includes("reduced feed consumption") ||
    message.includes("consumption drop")
  ) {
    return "I've recorded the feed consumption drop. This could indicate health or environmental issues. Would you like to add specific consumption levels, duration, or potential causes?";
  }

  if (
    message.includes("equipment malfunction") ||
    message.includes("equipment breakdown")
  ) {
    return "I've noted the equipment malfunction. This affects operational efficiency. Would you like to add specific equipment details, impact on operations, or repair needs?";
  }

  if (
    message.includes("daily egg count") ||
    message.includes("egg count recorded")
  ) {
    return "I've recorded your egg count. This is valuable for tracking production trends. Would you like to add any specific metrics, quality observations, or comparison to previous days?";
  }

  if (
    message.includes("egg production decreased") ||
    message.includes("production drop")
  ) {
    return "I've noted the production decrease. This is important to track. Would you like to add specific numbers, duration of the decrease, or potential contributing factors?";
  }

  if (
    message.includes("daily feed consumption") ||
    message.includes("feed consumption")
  ) {
    return "I've recorded your feed consumption data. This helps track efficiency. Would you like to add specific consumption amounts, efficiency metrics, or cost analysis?";
  }

  if (
    message.includes("mortality rate recorded") ||
    message.includes("mortality rate")
  ) {
    return "I've noted the mortality rate. This is critical for flock health monitoring. Would you like to add specific numbers, age groups affected, or potential causes?";
  }

  if (
    message.includes("weight gain recorded") ||
    message.includes("weight gain")
  ) {
    return "I've recorded the weight gain data. This tracks flock development. Would you like to add specific weight measurements, growth rates, or comparison to targets?";
  }

  if (
    message.includes("general flock observation") ||
    message.includes("flock observation")
  ) {
    return "I've recorded your flock observation. These notes are valuable for overall management. Would you like to add any specific behaviors, environmental factors, or management actions?";
  }

  // Generic response for other diary entries
  return "I've recorded your note. This information has been saved for your records. Is there anything else you'd like to add to make this entry more complete?";
};
