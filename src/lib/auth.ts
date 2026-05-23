// Authentication utilities for AuthPhi integration

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  roles: string[];
}

export function getToken(): string | null {
  // In production, token is in httpOnly cookie set by AuthPhi
  // For development, we can store in localStorage
  if (typeof window === "undefined") return null;
  return localStorage.getItem("phi_token");
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("phi_token", token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("phi_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function hasRole(role: string): boolean {
  const user = getUser();
  if (!user) return false;
  return user.roles.includes(role);
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("phi_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

export function setUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("phi_user", JSON.stringify(user));
}

export function logout(): void {
  clearToken();
  if (typeof window !== "undefined") {
    localStorage.removeItem("phi_user");
    window.location.href = "/";
  }
}
