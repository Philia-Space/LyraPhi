"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface VerifyRoleResult {
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

function loadStoredResult(): VerifyRoleResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("verify_role_result");
    if (raw) {
      return JSON.parse(raw) as VerifyRoleResult;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function clearStoredResult() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("verify_role_result");
  }
}

export default function AccessDeniedPage() {
  const router = useRouter();
  const [result, setResult] = useState<VerifyRoleResult | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const inviteUrl =
    process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "https://discord.gg/philiaspace";

  useEffect(() => {
    // Try to load stored result from sessionStorage
    const stored = loadStoredResult();
    if (stored) {
      setResult(stored);
      setIsChecking(false);
      return;
    }

    // If no stored result, call verify-role API to get fresh data
    async function verify() {
      try {
        const res = await fetch("/api/auth/discord/verify-role", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const payload = data.data || data;
          setResult(payload as VerifyRoleResult);
          // If allowed, redirect to home
          if (payload.allowed) {
            router.replace("/");
            return;
          }
        }
      } catch {
        // ignore
      } finally {
        setIsChecking(false);
      }
    }
    verify();
  }, [router]);

  const handleTryAgain = () => {
    clearStoredResult();
    // Redirect to AuthPhi Discord OAuth flow
    const redirectTo = encodeURIComponent(window.location.origin + "/login");
    window.location.href = "/api/auth/discord/authorize?redirect_to=" + redirectTo;
  };

  if (isChecking) {
    return (
      <main className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-none h-6 w-6 border-2 border-t-transparent border-slate-900 dark:border-slate-100" />
          <p className="mt-4 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
            Verifying access...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-60px)] flex-col items-center px-6 py-12 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-black tracking-widest font-mono uppercase text-slate-900 dark:text-slate-100">
            ⛔ ACCESS DENIED
          </h1>
          <p className="mt-3 text-xs font-mono uppercase font-black tracking-widest text-slate-500 dark:text-slate-400">
            Discord Role Verification Required
          </p>
        </div>

        {/* Section 1 — Explanation */}
        <div className="border-2 border-slate-900 dark:border-slate-100 p-6 mb-6">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 leading-relaxed">
            You don&apos;t have the required Discord role to access JLPT practice exams.
          </p>

          {result?.required_roles && result.required_roles.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-500 mb-2">
                Required Roles:
              </p>
              <ul className="space-y-1">
                {result.required_roles.map((role) => (
                  <li
                    key={role}
                    className="text-xs font-mono text-slate-600 dark:text-slate-400"
                  >
                    ▸ {role}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result?.in_guild === false && (
            <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-900">
              <p className="text-[10px] font-mono font-black uppercase tracking-widest text-red-600 dark:text-red-400">
                You are not a member of the PhiliaSpace Discord server.
              </p>
            </div>
          )}

          {result?.message && result.in_guild !== false && (
            <p className="mt-3 text-[10px] font-mono text-slate-500 dark:text-slate-400 italic">
              {result.message}
            </p>
          )}
        </div>

        {/* Section 2 — Step 1: Join Discord */}
        <div className="border-2 border-slate-200 dark:border-slate-800 p-6 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-lg font-black font-mono text-slate-900 dark:text-slate-100">
              01
            </span>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest font-mono text-slate-800 dark:text-slate-200">
                Join Discord Server
              </h2>
              <p className="mt-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 leading-relaxed">
                You must be a member of the PhiliaSpace Discord server to verify your
                JLPT level.
              </p>
              <a
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block px-4 py-2 border-2 border-slate-900 dark:border-slate-100 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest font-mono hover:scale-[1.02] transition-transform cursor-pointer"
              >
                Join Server →
              </a>
            </div>
          </div>
        </div>

        {/* Section 3 — Step 2: Take the Quiz */}
        <div className="border-2 border-slate-200 dark:border-slate-800 p-6 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-lg font-black font-mono text-slate-900 dark:text-slate-100">
              02
            </span>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest font-mono text-slate-800 dark:text-slate-200">
                Take the Quiz
              </h2>
              <p className="mt-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 leading-relaxed">
                Answer questions in our Discord bot to earn your JLPT role
                (N5 through N1). The bot will assign the role that matches your
                proficiency level.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4 — Step 3: Return & Login Again */}
        <div className="border-2 border-slate-200 dark:border-slate-800 p-6 mb-10">
          <div className="flex items-start gap-3">
            <span className="text-lg font-black font-mono text-slate-900 dark:text-slate-100">
              03
            </span>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest font-mono text-slate-800 dark:text-slate-200">
                Return &amp; Login Again
              </h2>
              <p className="mt-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 leading-relaxed">
                Once you have the required role, log in again with Discord to
                verify your access.
              </p>
              <button
                onClick={handleTryAgain}
                className="mt-3 w-full py-2.5 border-2 border-slate-900 dark:border-slate-100 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest font-mono hover:scale-[1.02] transition-transform disabled:opacity-50 cursor-pointer"
              >
                Try Again — Login with Discord
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        {result?.guild_id && (
          <div className="text-center">
            <p className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
              Discord Server ID: {result.guild_id}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
