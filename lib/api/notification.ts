const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  read_at?: string;
  data?: Record<string, any>;
  created_at: string;
}

export interface MotivationRequest {
  message_type: string;
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

export class NotificationAPI {
  static async getNotifications(unreadOnly: boolean = false): Promise<{
    notifications: Notification[];
    total: number;
    unread_count: number;
  }> {
    const result = await fetchWithAuth(`${API_URL}/api/notifications?unread_only=${unreadOnly}`);
    return result.data;
  }

  static async markAsRead(notificationId: string): Promise<Notification> {
    const result = await fetchWithAuth(`${API_URL}/api/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
    return result.data.notification;
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    await fetchWithAuth(`${API_URL}/api/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  static async sendMotivation(messageType: string): Promise<Notification> {
    const result = await fetchWithAuth(`${API_URL}/api/notifications/motivation`, {
      method: 'POST',
      body: JSON.stringify({ message_type: messageType }),
    });
    return result.data.notification;
  }
}