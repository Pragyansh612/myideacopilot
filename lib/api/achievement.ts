const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Achievement {
  id: string;
  user_id: string;
  achievement_code: string;
  unlocked_at: string;
  created_at: string;
}

export interface AchievementDefinition {
  code: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  category: string;
  criteria: Record<string, any>;
}

export interface AchievementResponse extends Achievement {
  definition?: AchievementDefinition;
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

export class AchievementAPI {
  static async getUserAchievements(): Promise<AchievementResponse[]> {
    const result = await fetchWithAuth(`${API_URL}/api/achievements`);
    return result.data.achievements;
  }

  static async getAllAchievements(): Promise<AchievementDefinition[]> {
    const result = await fetchWithAuth(`${API_URL}/api/achievements/all`);
    return result.data.achievements;
  }
}