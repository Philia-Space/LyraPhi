"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else if (stored === "light") {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    } else {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    }
  }, []);

  // Hapus Navbar pada saat sesi aktif kuis berjalan (/exam/[sessionId])
  const isQuizActive = pathname.startsWith("/exam/") && pathname !== "/exam";
  
  if (isQuizActive) {
    return null;
  }

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <nav className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-200 shrink-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-base font-black tracking-widest font-mono uppercase text-slate-850 dark:text-slate-100 hover:opacity-80 transition-opacity"
        >
          LYRAPHI
        </Link>
        <div className="flex items-center gap-6">
          <div className="flex gap-5">
            <Link 
              href="/exam" 
              className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
            >
              Exam
            </Link>
            <Link 
              href="/leaderboard" 
              className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
            >
              Leaderboard
            </Link>
            <Link 
              href="/profile" 
              className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
            >
              Profile
            </Link>
            {user?.roles?.includes("admin") && (
              <Link 
                href="/admin" 
                className="text-[10px] font-black uppercase tracking-widest font-mono text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Vertical Divider */}
          <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800" />

          {/* Auth Buttons */}
          {mounted && (
            <>
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {user?.username}
                  </span>
                  <button
                    onClick={logout}
                    className="text-[10px] font-black uppercase tracking-widest font-mono px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all rounded-none cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-[10px] font-black uppercase tracking-widest font-mono px-2 py-1 bg-slate-900 dark:bg-slate-100 hover:bg-slate-700 dark:hover:bg-slate-300 text-white dark:text-slate-900 transition-all rounded-none"
                >
                  Login
                </Link>
              )}
            </>
          )}

          {/* Vertical Divider */}
          <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800" />

          {/* Theme Switcher Button - Strictly rounded-none */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 transition-all rounded-none cursor-pointer flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="5" strokeLinecap="round" strokeLinejoin="round" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
