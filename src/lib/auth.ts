// Authentication utilities for AuthPhi integration
// Note: With httpOnly cookies, token is not accessible from JavaScript.
// Auth state is managed via AuthContext and server-side API routes.

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  roles: string[];
}

/**
 * Check if user is authenticated by calling the /api/auth/me endpoint.
 * This is the preferred method since httpOnly cookies are sent automatically.
 */
export async function checkAuth(): Promise<AuthUser | null> {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data?.user) {
        return data.data.user as AuthUser;
      }
    }
  } catch {
    // not authenticated
  }
  return null;
}

/**
 * Logout user by clearing the httpOnly cookie via server-side API.
 */
export async function logout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // ignore errors
  }
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}

/**
 * @deprecated Use checkAuth() instead. Token is now in httpOnly cookie.
 */
export function getToken(): string | null {
  // Token is in httpOnly cookie, not accessible from JavaScript
  return null;
}

/**
 * @deprecated Token is now managed via httpOnly cookie set by server.
 */
export function setToken(_token: string): void {
  // No-op: token is managed via httpOnly cookie
}

/**
 * @deprecated Token is now managed via httpOnly cookie cleared by server.
 */
export function clearToken(): void {
  // No-op: token is managed via httpOnly cookie
}

/**
 * @deprecated Use checkAuth() or AuthContext instead.
 */
export function isAuthenticated(): boolean {
  // Cannot check httpOnly cookie from client-side
  // Use AuthContext or checkAuth() instead
  return false;
}

/**
 * @deprecated Use AuthContext.hasRole() instead.
 */
export function hasRole(_role: string): boolean {
  // Cannot check without user data
  // Use AuthContext.hasRole() instead
  return false;
}

/**
 * @deprecated Use checkAuth() or AuthContext instead.
 */
export function getUser(): AuthUser | null {
  // User data is no longer stored in localStorage
  // Use AuthContext or checkAuth() instead
  return null;
}

/**
 * @deprecated User data is now managed by AuthContext.
 */
export function setUser(_user: AuthUser): void {
  // No-op: user data is managed by AuthContext
}
