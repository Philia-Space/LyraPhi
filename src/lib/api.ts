// API client for Philia-Space microservices
// These are proxied through Next.js rewrites in next.config.js

const API_BASE = "/api";

export interface ApiError {
  code: string;
  message: string;
}

export async function fetchJson<T = any>(url: string, options?: RequestInit): Promise<T> {
  // Get token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("phi_token") : null;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options?.headers as Record<string, string>,
  };
  
  // Add auth token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// Auth APIs
export const authApi = {
  login: (username: string, password: string) =>
    fetchJson<{ success: boolean; data?: { access_token: string; user: { id: string; username: string; name: string; roles: string[] } }; error?: ApiError }>(
      `${API_BASE}/auth/login`,
      { method: "POST", body: JSON.stringify({ username, password }) }
    ),

  me: () =>
    fetchJson<{ success: boolean; data?: { user: { id: string; username: string; name: string; roles: string[] } }; error?: ApiError }>(
      `${API_BASE}/auth/me`
    ),
};

// MondaiPhi APIs
export const mondaiphiApi = {
  listQuestions: (params?: { level?: string; section?: string; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.level) searchParams.set("level", params.level);
    if (params?.section) searchParams.set("section", params.section);
    if (params?.limit) searchParams.set("limit", String(params.limit));
    return fetchJson(`${API_BASE}/mondai/questions?${searchParams}`);
  },

  getQuestion: (id: string) =>
    fetchJson(`${API_BASE}/mondai/questions/${id}`),

  listTemplates: () =>
    fetchJson(`${API_BASE}/mondai/templates`),

  getAsset: (id: string) =>
    fetch(`${API_BASE}/mondai/assets/${id}`),

  // Admin APIs
  adminCreateQuestion: (body: { level: string; section: string; prompt: string; context?: string; answer_value: string; answer_note?: string; passage_id?: string; options?: { value: string; label: string; sort_order: number }[] }) =>
    fetchJson(`${API_BASE}/mondai/admin/questions`, { method: "POST", body: JSON.stringify(body) }),

  adminUpdateQuestion: (id: string, body: { prompt?: string; context?: string; answer_value?: string; answer_note?: string }) =>
    fetchJson(`${API_BASE}/mondai/admin/questions/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  adminDeleteQuestion: (id: string) =>
    fetchJson(`${API_BASE}/mondai/admin/questions/${id}`, { method: "DELETE" }),
};

// ShikenPhi APIs
export const shikenphiApi = {
  createSession: (body: { level: string; templateId?: string }) =>
    fetchJson<{ success: boolean; data?: { session_id: string } }>(
      `${API_BASE}/shiken/sessions`,
      { method: "POST", body: JSON.stringify(body) }
    ),

  getSession: (id: string) =>
    fetchJson(`${API_BASE}/shiken/sessions/${id}`),

  saveAnswer: (sessionId: string, questionIndex: number, selectedOption: string) =>
    fetchJson(
      `${API_BASE}/shiken/sessions/${sessionId}/answers`,
      { method: "POST", body: JSON.stringify({ question_index: questionIndex, selected_option: selectedOption }) }
    ),

  submitSession: (id: string) =>
    fetchJson<{ success: boolean; data?: { score: number; total: number; percentage: number; result_id: string; section_breakdown: any; question_results: any[]; achievements_unlocked?: any[] } }>(
      `${API_BASE}/shiken/sessions/${id}/submit`,
      { method: "POST" }
    ),

  getResult: (id: string) =>
    fetchJson(`${API_BASE}/shiken/results/${id}`),

  getResultReview: (resultId: string) =>
    fetchJson(`${API_BASE}/shiken/results/${resultId}/review`),

  getResults: (userId?: string) => {
    const params = new URLSearchParams();
    if (userId) params.set("user_id", userId);
    return fetchJson(`${API_BASE}/shiken/results?${params}`);
  },

  getLeaderboard: (params?: { period?: string; level?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.set("period", params.period);
    if (params?.level) searchParams.set("level", params.level);
    return fetchJson(`${API_BASE}/shiken/leaderboard?${searchParams}`);
  },

  getStats: (userId?: string) => {
    const params = new URLSearchParams();
    if (userId) params.set("user_id", userId);
    return fetchJson(`${API_BASE}/shiken/profile/stats?${params}`);
  },

  getStreaks: (userId?: string) => {
    const params = new URLSearchParams();
    if (userId) params.set("user_id", userId);
    return fetchJson(`${API_BASE}/shiken/profile/streaks?${params}`);
  },

  getAchievements: (userId: string) => {
    const params = new URLSearchParams();
    params.set("user_id", userId);
    return fetchJson(`${API_BASE}/shiken/profile/achievements?${params}`);
  },
};
