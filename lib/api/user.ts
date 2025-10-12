const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_xp: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date?: string;
  ideas_created: number;
  ideas_completed: number;
  ai_suggestions_applied: number;
  collaborations_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserStatsUpdate {
  total_ideas?: number;
  ideas_this_month?: number;
  ideas_completed?: number;
  ideas_in_progress?: number;
  total_features?: number;
  features_completed?: number;
  total_phases?: number;
  phases_completed?: number;
  total_categories?: number;
  ai_suggestions_generated?: number;
  current_streak?: number;
  longest_streak?: number;
  total_xp?: number;
  current_level?: number;
}

export interface StatsIncrement {
  field: string;
  amount: number;
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

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export class UserAPI {
  static async getProfile(): Promise<UserProfile> {
    const result = await fetchWithAuth(`${API_URL}/api/profile`);
    return result.data.profile;
  }

  // Fixed: Correct endpoint is /api/stats (not /api/stats/stats)
  static async getStats(): Promise<UserStats> {
    const result = await fetchWithAuth(`${API_URL}/api/stats`);
    return result.data.stats;
  }

  static async updateStats(data: UserStatsUpdate): Promise<UserStats> {
    const result = await fetchWithAuth(`${API_URL}/api/stats/update`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.data.stats;
  }

  static async incrementStat(field: string, amount: number = 1): Promise<UserStats> {
    const result = await fetchWithAuth(`${API_URL}/api/stats/increment`, {
      method: 'POST',
      body: JSON.stringify({ field, amount }),
    });
    return result.data.stats;
  }

  // Fixed: xp_amount should be in body, not query params
  static async awardXP(xpAmount: number): Promise<UserStats> {
    const result = await fetchWithAuth(`${API_URL}/api/stats/award-xp`, {
      method: 'POST',
      body: JSON.stringify(xpAmount), // Send as integer in body
    });
    return result.data.stats;
  }
}