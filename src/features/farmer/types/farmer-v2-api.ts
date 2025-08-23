// Farmer V2 API Types

// Chat AI Types
export interface ChatAiRequest {
  prompt: string;
  user_id: number;
  chat_id: number;
  intent_id: number;
  ticket_id: string;
}

export interface ChatAiResponse {
  response: string;
  chat_id: number;
  intent_id: number;
  ticket_id: string;
  timestamp: string;
}

// Feed Programs Types
export interface CreateFeedProgramRequest {
  farmer_user_profile_id: number;
  feed_product_id: number;
}

export interface CreateFeedProgramResponse {
  id: number;
  farmer_user_profile_id: number;
  feed_product_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FeedProgram {
  id: number;
  farmer_user_profile_id: number;
  feed_product_id: number;
  status: "active" | "completed" | "incomplete";
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface ActiveFeedProgramResponse {
  feed_program: FeedProgram | null;
}

export interface FeedProduct {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface ActiveFeedProductResponse {
  feed_product: FeedProduct | null;
}

export interface CompleteFeedProgramResponse {
  success: boolean;
  message: string;
  feed_program: FeedProgram;
}

export interface IncompleteFeedProgramResponse {
  success: boolean;
  message: string;
  feed_program: FeedProgram;
}
