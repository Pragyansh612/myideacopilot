const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ChatRequest {
  query: string;
  idea_id?: string;
  feature_id?: string;
  phase_id?: string;
  competitor_id?: string;
}

export interface ChatResponse {
  response: string;
  context_used: {
    idea?: any;
    feature?: any;
    phase?: any;
    competitor?: any;
    ideas?: any[];
    features?: any[];
    competitors?: any[];
  };
  query_type: string;
  tokens_used?: number;
  response_time_ms: number;
}

export interface ChatHistoryItem {
  id: string;
  user_id: string;
  idea_id?: string;
  query_type: string;
  user_prompt: string;
  ai_response: string;
  ai_model?: string;
  tokens_used?: number;
  response_time_ms?: number;
  context_data?: {
    query_type?: string;
    context_entities?: string[];
    matched_contexts?: any;
  };
  created_at: string;
}

export interface ChatHistoryResponse {
  logs: ChatHistoryItem[];
  total: number;
  limit: number;
  skip: number;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}

export class CopilotAPI {
  static async chat(data: ChatRequest): Promise<ChatResponse> {
    const result = await fetchWithAuth(`${API_URL}/api/copilot/chat`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.data;
  }

  static async getHistory(limit: number = 50, skip: number = 0): Promise<ChatHistoryResponse> {
    const result = await fetchWithAuth(`${API_URL}/api/copilot/history?limit=${limit}&skip=${skip}`);
    return result.data;
  }
}