"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { shikenphiApi } from "@/lib/api";
import LevelBadge from "@/components/LevelBadge";

interface SectionBreakdown {
  [key: string]: number;
}

interface ResultData {
  id: string;
  session_id: string;
  user_id: string;
  level: string;
  score: number;
  total_questions: number;
  percentage: number;
  section_breakdown: SectionBreakdown;
  time_spent_seconds: number;
  completed_at: string;
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resultId = searchParams.get("resultId");
  const sessionId = searchParams.get("sessionId");
  const fallbackScore = searchParams.get("score");

  useEffect(() => {
    loadResult();
  }, [resultId, sessionId]);

  const loadResult = async () => {
    try {
      if (resultId) {
        const res = await shikenphiApi.getResult(resultId);
        const payload = res.data || res;
        setResult(payload);
      } else if (sessionId) {
        const res = await shikenphiApi.getResult(sessionId);
        const payload = res.data || res;
        setResult(payload);
      }
    } catch (err: unknown) {
      console.error("[LyraPhi] Failed to fetch result:", err);
      setError(err instanceof Error ? err.message : "Failed to load results.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const sectionLabels: Record<string, string> = {
    grammar: "Language Knowledge (Grammar/Vocab)",
    vocabulary: "Language Knowledge (Vocabulary)",
    reading: "Reading Comprehension",
    listening: "Listening Comprehension",
  };

  const sectionTotals: Record<string, number> = {};
  if (result?.section_breakdown) {
    for (const [section, correct] of Object.entries(result.section_breakdown)) {
      sectionTotals[section] = correct;
    }
  }

  const percentage = result?.percentage ?? (fallbackScore ? parseInt(fallbackScore) : 0);
  const score = result?.score ?? 0;
  const total = result?.total_questions ?? 75;
  const level = result?.level ?? "N5";
  const timeSpent = result?.time_spent_seconds ?? 0;
  const breakdown = result?.section_breakdown ?? {};

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <h1 className="text-2xl sm:text-3xl font-black mb-8 tracking-widest font-mono uppercase text-slate-800 dark:text-white border-b-2 border-slate-900 dark:border-white pb-2 select-none">
        ASSESSMENT SCORE SHEET
      </h1>

      {loading ? (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-none h-6 w-6 border-2 border-t-transparent border-slate-900 dark:border-slate-100 mx-auto"></div>
          <p className="mt-4 text-[10px] font-mono font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 animate-pulse">
            Generating score report...
          </p>
        </div>
      ) : error ? (
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-none text-center">
          <p className="text-xs font-mono text-slate-800 dark:text-slate-200">{error}</p>
          <button
            onClick={() => router.push("/archive")}
            className="mt-4 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest rounded-none cursor-pointer font-mono"
          >
            Return to Exam
          </button>
        </div>
      ) : (
        <div className="w-full max-w-2xl space-y-4 sm:space-y-6">
          {/* Main Score Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-none rounded-none text-center">
            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono mb-2 select-none">
              TOTAL SCORE ACHIEVEMENT
            </div>
            <div className="text-6xl sm:text-7xl font-mono font-black text-slate-800 dark:text-slate-100 mb-2">
              {percentage}%
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              {score} / {total} Questions Correct
            </div>
            <div className="mt-4 flex justify-center">
              <LevelBadge level={level} size="lg" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-none rounded-none">
              <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono mb-1.5 select-none">
                TIME ELAPSED
              </div>
              <div className="text-xl sm:text-2xl font-mono font-black text-slate-800 dark:text-slate-200">
                {formatTime(timeSpent)}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-none rounded-none">
              <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono mb-1.5 select-none">
                QUESTION COUNT
              </div>
              <div className="text-xl sm:text-2xl font-mono font-black text-slate-800 dark:text-slate-200">
                {total}
              </div>
            </div>
          </div>

          {/* Section Breakdown */}
          {Object.keys(breakdown).length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-none rounded-none">
              <h2 className="text-xs font-black uppercase tracking-widest font-mono mb-4 text-slate-800 dark:text-slate-200 select-none">
                MODULE BREAKDOWN SUMMARY
              </h2>
              <div className="space-y-4">
                {Object.entries(breakdown).map(([section, correct]) => {
                  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
                  return (
                    <div key={section} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {sectionLabels[section] || section.toUpperCase()}
                        </span>
                        <span className="font-mono text-slate-500 dark:text-slate-400">
                          {correct} correct
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-3 p-[1px] rounded-none overflow-hidden flex items-center">
                        <div
                          className="bg-slate-800 dark:bg-slate-200 h-full rounded-none transition-all"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                const rid = result?.id || resultId;
                if (rid) router.push(`/results/${rid}/review`);
              }}
              className="flex-1 py-3 border-2 border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-black uppercase tracking-widest rounded-none transition-colors cursor-pointer font-mono"
            >
              Review Answers
            </button>
            <button
              onClick={() => router.push("/archive")}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest rounded-none border border-slate-900 dark:border-slate-100 transition-colors shadow-sm cursor-pointer font-mono"
            >
              Take Another Exam
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest rounded-none transition-colors cursor-pointer font-mono"
            >
              Return to Console
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen flex-col items-center p-6 sm:p-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <div className="p-12 text-center">
          <div className="animate-spin rounded-none h-6 w-6 border-2 border-t-transparent border-slate-900 dark:border-slate-100 mx-auto"></div>
          <p className="mt-4 text-[10px] font-mono font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 animate-pulse">
            Loading results...
          </p>
        </div>
      </main>
    }>
      <ResultsContent />
    </Suspense>
  );
}
