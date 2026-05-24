// API client for Philia-Space microservices
// These are proxied through Next.js rewrites in next.config.js

const API_BASE = "/api";

export interface ApiError {
  code: string;
  message: string;
}

export async function fetchJson<T = any>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
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
    fetchJson<{ access_token: string; user: { id: string; username: string; roles: string[] } }>(
      `${API_BASE}/auth/login`,
      { method: "POST", body: JSON.stringify({ username, password }) }
    ),

  me: () =>
    fetchJson<{ user: { id: string; username: string; name: string; roles: string[] } }>(
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
};

// ShikenPhi APIs
export const shikenphiApi = {
  createSession: (body: { level: string; templateId?: string }) =>
    fetchJson<{ sessionId: string }>(
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
    fetchJson<{ score: number; total: number; percentage: number }>(
      `${API_BASE}/shiken/sessions/${id}/submit`,
      { method: "POST" }
    ),

  getResults: () =>
    fetchJson(`${API_BASE}/shiken/results`),

  getLeaderboard: (params?: { period?: string; level?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.set("period", params.period);
    if (params?.level) searchParams.set("level", params.level);
    return fetchJson(`${API_BASE}/shiken/leaderboard?${searchParams}`);
  },

  getStats: () =>
    fetchJson(`${API_BASE}/shiken/profile/stats`),

  getStreaks: () =>
    fetchJson(`${API_BASE}/shiken/profile/streaks`),
};
