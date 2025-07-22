import type {
  ChatMode,
  ChatStage,
  REPORT_OPTIONS,
} from "@/features/chat-widget/const";
import { create } from "zustand";

interface ChatWidgetState {
  isOpen: boolean;
  currentStage: ChatStage;
  selectedOption: string;
  reportType: keyof typeof REPORT_OPTIONS | "";
  reportSubType: string;
  chatMode: ChatMode;
}

interface ChatWidgetActions {
  openChat: () => void;
  closeChat: () => void;
  openDailySalesReport: () => void;
  openGrowthMetricsReport: () => void;
  openFeedConsumptionReport: () => void;
  openFlockMortalityReport: () => void;
  openChatWithReportContext: (
    reportType: keyof typeof REPORT_OPTIONS,
    reportSubType: string,
    selectedOption: string,
  ) => void;
  resetState: () => void;
  setStage: (stage: ChatStage) => void;
  setSelectedOption: (option: string) => void;
  setReportType: (reportType: keyof typeof REPORT_OPTIONS | "") => void;
  setReportSubType: (reportSubType: string) => void;
  setChatMode: (mode: ChatMode) => void;
}

type ChatWidgetStore = ChatWidgetState & ChatWidgetActions;

const initialState: ChatWidgetState = {
  isOpen: false,
  currentStage: "welcome",
  selectedOption: "",
  reportType: "",
  reportSubType: "",
  chatMode: "normal",
};

export const useChatWidgetStore = create<ChatWidgetStore>((set, get) => ({
  ...initialState,

  openChat: () => {
    set({ isOpen: true });
  },

  closeChat: () => {
    set({ isOpen: false });
  },

  openDailySalesReport: () => {
    set({
      isOpen: true,
      currentStage: "chat",
      selectedOption: "report-sales",
      reportType: "report-sales",
      reportSubType: "daily-sales",
      chatMode: "report",
    });
  },

  openGrowthMetricsReport: () => {
    set({
      isOpen: true,
      currentStage: "chat",
      selectedOption: "log-performance",
      reportType: "log-performance",
      reportSubType: "growth-metrics",
      chatMode: "report",
    });
  },

  openFeedConsumptionReport: () => {
    set({
      isOpen: true,
      currentStage: "chat",
      selectedOption: "log-performance",
      reportType: "log-performance",
      reportSubType: "feed-consumption",
      chatMode: "report",
    });
  },

  openFlockMortalityReport: () => {
    set({
      isOpen: true,
      currentStage: "chat",
      selectedOption: "log-performance",
      reportType: "log-performance",
      reportSubType: "flock-mortality",
      chatMode: "report",
    });
  },

  openChatWithReportContext: (
    reportType: keyof typeof REPORT_OPTIONS,
    reportSubType: string,
    selectedOption: string,
  ) => {
    set({
      isOpen: true,
      currentStage: "chat",
      selectedOption,
      reportType,
      reportSubType,
      chatMode: "report",
    });
  },

  resetState: () => {
    set(initialState);
  },

  setStage: (stage: ChatStage) => {
    set({ currentStage: stage });
  },

  setSelectedOption: (option: string) => {
    set({ selectedOption: option });
  },

  setReportType: (reportType: keyof typeof REPORT_OPTIONS | "") => {
    set({ reportType });
  },

  setReportSubType: (reportSubType: string) => {
    set({ reportSubType });
  },

  setChatMode: (mode: ChatMode) => {
    set({ chatMode: mode });
  },
}));
