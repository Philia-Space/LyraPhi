"use client";

import { useState } from "react";
import { shikenphiApi } from "@/lib/api";
import LevelBadge from "@/components/LevelBadge";

export default function ExamPage() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const levels = ["N5", "N4", "N3", "N2", "N1"];

  const startExam = async (level: string) => {
    setLoading(true);
    setError(null);
    setSelectedLevel(level);

    try {
      const session = await shikenphiApi.createSession({
        level,
        templateId: "tpl_balanced_75",
      });
      window.location.href = `/exam/${session.sessionId}`;
    } catch (err: any) {
      console.warn("[LyraPhi] Backend API not available. Simulating local exam session creation.", err);
      const mockSessionId = `sess_mock_${Date.now()}`;
      window.location.href = `/exam/${mockSessionId}`;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <h1 className="text-2xl sm:text-3xl font-black mb-8 tracking-widest font-mono uppercase text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white pb-2">
        JLPT EXAMINATION CONSOLE
      </h1>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-300 dark:border-red-900 text-red-700 dark:text-red-400 px-4 py-3 rounded-none mb-6 max-w-md text-xs font-mono">
          {error}
        </div>
      )}

      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <h2 className="text-xs font-black mb-4 text-center uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">
            SELECT YOUR ASSESSMENT LEVEL
          </h2>
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {levels.map((level) => {
              const isSelected = selectedLevel === level;
              return (
                <button
                  key={level}
                  onClick={() => startExam(level)}
                  disabled={loading}
                  className={`p-4 sm:p-6 rounded-none border-2 font-black text-base sm:text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-900 shadow-sm cursor-pointer ${
                    isSelected
                      ? "border-slate-900 dark:border-slate-100"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600"
                  }`}
                >
                  <LevelBadge level={level} size="lg" />
                </button>
              );
            })}
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-none h-6 w-6 border-2 border-t-transparent border-slate-900 dark:border-slate-100"></div>
            <p className="mt-2 text-xs font-mono font-bold text-slate-550 dark:text-slate-400 uppercase tracking-widest animate-pulse">
              Generating Session Token...
            </p>
          </div>
        )}

        <div className="mt-8 p-5 sm:p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-none rounded-none">
          <h3 className="text-xs font-black uppercase tracking-widest font-mono mb-3 text-slate-800 dark:text-slate-200">
            Official Guidelines & Instructions
          </h3>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            <li>Each exam session contains balanced questions from Grammar, Reading, and Listening modules.</li>
            <li>You can flag specific questions for later review using the navigator sidebar.</li>
            <li>A countdown timer is displayed for convenience; it is not enforced server-side.</li>
            <li>Results breakdowns are displayed instantly upon submitting the assessment sheet.</li>
            <li>Unsubmitted active sessions will automatically expire after 24 hours of inactivity.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
