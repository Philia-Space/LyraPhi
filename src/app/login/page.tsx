"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

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
          <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 text-center">
            Default credentials: admin / admin
          </p>
        </div>
      </div>
    </main>
  );
}
