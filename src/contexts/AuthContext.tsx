"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthUser {
  id: string;
  username: string;
  name: string;
  roles: string[];
}

export interface VerifyRoleResponse {
  allowed: boolean;
  is_admin?: boolean;
  login_method?: "discord" | "local";
  user_roles?: string[];
  required_roles?: string[];
  matched_roles?: string[];
  guild_id?: string;
  in_guild?: boolean;
  message?: string;
  discord_user?: {
    id: string;
    username: string;
  };
  note?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  completeDiscordLogin: (
    accessToken: string,
    userData: AuthUser,
    redirectTo?: string
  ) => Promise<{ allowed: boolean; data?: VerifyRoleResponse }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data?.user) {
            setUser(data.data.user);
          }
        }
      } catch {
        // not authenticated
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      if (data.success && data.data?.access_token) {
        const { access_token, user: userData } = data.data;
        
        // Set httpOnly cookie via server-side API
        await fetch("/api/auth/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token, user: userData }),
        });
        
        // Local login — skip role verification
        setUser(userData);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  /**
   * Completes a Discord OAuth login by setting the cookie, verifying the Discord
   * role, and either granting access or redirecting to /access-denied.
   *
   * Returns { allowed: true } if access is granted, or { allowed: false } with
   * the verify-role response data if access is denied.
   */
  const completeDiscordLogin = async (
    accessToken: string,
    userData: AuthUser,
    redirectTo?: string
  ): Promise<{ allowed: boolean; data?: VerifyRoleResponse }> => {
    try {
      // Step 1: Set httpOnly cookie so subsequent requests are authenticated
      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: accessToken, user: userData }),
      });

      // Step 2: Verify Discord role
      const verifyRes = await fetch("/api/auth/discord/verify-role", {
        credentials: "include",
      });

      if (!verifyRes.ok) {
        // If verify-role fails, fall back to allowing access
        console.warn("[LyraPhi] verify-role API failed, allowing access");
        setUser(userData);
        return { allowed: true };
      }

      const verifyPayload = await verifyRes.json();
      const verifyData: VerifyRoleResponse = verifyPayload.data || verifyPayload;

      // Admin users always allowed
      if (verifyData.is_admin) {
        setUser(userData);
        return { allowed: true };
      }

      // Local login always allowed
      if (verifyData.login_method === "local") {
        setUser(userData);
        return { allowed: true };
      }

      // Discord user with valid role
      if (verifyData.allowed) {
        setUser(userData);
        return { allowed: true };
      }

      // Access denied — store result for access-denied page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("verify_role_result", JSON.stringify(verifyData));
      }

      // Do NOT set user — redirect to access-denied
      if (typeof window !== "undefined") {
        window.location.href = "/access-denied";
      }

      return { allowed: false, data: verifyData };
    } catch (error) {
      console.error("[LyraPhi] completeDiscordLogin failed:", error);
      // Fail open — allow access if verification fails
      setUser(userData);
      return { allowed: true };
    }
  };

  const logout = () => {
    fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) ?? false;
  };

  const value: AuthContextType = {
    user,
    login,
    completeDiscordLogin,
    logout,
    isLoading,
    isAuthenticated: !!user,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
