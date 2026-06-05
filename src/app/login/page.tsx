"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, completeDiscordLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setIsLoading(true);
      // Exchange code for token via AuthPhi
      fetch("/api/auth/discord/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.success && data.data?.access_token) {
            const { access_token, user: userData } = data.data;
            const result = await completeDiscordLogin(access_token, userData);
            if (result.allowed) {
              router.replace("/");
            }
            // If not allowed, completeDiscordLogin already redirects to /access-denied
          } else {
            setError("Discord authentication failed. Please try again.");
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.error("[LyraPhi] Code exchange failed:", err);
          setError("Authentication failed. Please try again.");
          setIsLoading(false);
        });
      return;
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        router.push("/");
      } else {
        setError("Invalid username or password");
      }
    } catch {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordLogin = () => {
    // Redirect to AuthPhi's Discord OAuth authorize endpoint.
    // AuthPhi handles the full OAuth flow and redirects back to this page
    // with a ?code=... param that we redeem above.
    const redirectTo = encodeURIComponent(window.location.origin + "/login");
    window.location.href = "/api/auth/discord/authorize?redirect_to=" + redirectTo;
  };

  return (
    <main className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-sm p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-widest font-mono uppercase text-slate-900 dark:text-slate-100">
            LYRAPHI
          </h1>
          <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Authentication Required
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-[10px] font-mono text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest font-mono text-slate-600 dark:text-slate-400 mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-mono rounded-none focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest font-mono text-slate-600 dark:text-slate-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-mono rounded-none focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-700 dark:hover:bg-slate-300 text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest font-mono rounded-none transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleDiscordLogin}
            className="w-full py-2.5 flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white text-[10px] font-black uppercase tracking-widest font-mono rounded-none transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Continue with Discord
          </button>
          <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 text-center mt-3">
            Or use default credentials: admin / admin
          </p>
        </div>
      </div>
    </main>
  );
}
