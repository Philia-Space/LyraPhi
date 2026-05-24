"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import LevelBadge from "@/components/LevelBadge";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const score = searchParams.get("score");
  const sessionId = searchParams.get("sessionId") || "sess_mock";

  const isMock = sessionId.includes("mock");
  const percentage = score ? parseInt(score) : 60;

  // N5 BALANCED 75 has 75 questions total; Local mock scale test has exactly 105 questions
  const totalQuestions = isMock ? 105 : 75;
  const totalCorrect = Math.round((percentage / 100) * totalQuestions);

  const grammarTotal = isMock ? 35 : 35;
  const readingTotal = isMock ? 35 : 20;
  const listeningTotal = isMock ? 35 : 20;

  const [timeSpent, setTimeSpent] = useState(isMock ? 1240 : 3450);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTimer = sessionStorage.getItem(`lyra_timer_${sessionId}`);
      if (savedTimer) {
        const secs = parseInt(savedTimer, 10);
        if (secs > 0) {
          setTimeSpent(secs);
        }
      }
    }
  }, [sessionId]);

  const result = {
    score: totalCorrect,
    total: totalQuestions,
    percentage: percentage,
    sectionBreakdown: {
      grammar: Math.round((percentage / 100) * grammarTotal),
      reading: Math.round((percentage / 100) * readingTotal),
      listening: Math.round((percentage / 100) * listeningTotal),
    },
    level: "N5",
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <h1 className="text-2xl sm:text-3xl font-black mb-8 tracking-widest font-mono uppercase text-slate-800 dark:text-white border-b-2 border-slate-900 dark:border-white pb-2 select-none">
        ASSESSMENT SCORE SHEET
      </h1>

      <div className="w-full max-w-2xl space-y-4 sm:space-y-6">
        {/* Main Score Card - Sharp */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-none rounded-none text-center">
          <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono mb-2 select-none">
            TOTAL SCORE ACHIEVEMENT
          </div>
          <div className="text-6xl sm:text-7xl font-mono font-black text-slate-800 dark:text-slate-100 mb-2">
            {result.percentage}%
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-slate-500 dark:text-slate-450 tracking-wider uppercase">
            {result.score} / {result.total} Questions Correct
          </div>
          <div className="mt-4 flex justify-center">
            <LevelBadge level={result.level} size="lg" />
          </div>
        </div>

        {/* Stats Grid - Sharp */}
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
              {result.total}
            </div>
          </div>
        </div>

        {/* Section Breakdown - Sharp */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-none rounded-none">
          <h2 className="text-xs font-black uppercase tracking-widest font-mono mb-4 text-slate-800 dark:text-slate-200 select-none">
            MODULE BREAKDOWN SUMMARY
          </h2>
          <div className="space-y-4">
            {Object.entries(result.sectionBreakdown).map(([section, correct]) => {
              const total = section === "grammar" ? grammarTotal : section === "listening" ? listeningTotal : readingTotal;
              const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
              const labelMap: Record<string, string> = {
                grammar: "Language Knowledge (Grammar/Vocab)",
                reading: "Reading Comprehension",
                listening: "Listening Comprehension"
              };
              return (
                <div key={section} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {labelMap[section] || section.toUpperCase()}
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      {correct}/{total} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-3 p-[1px] rounded-none overflow-hidden flex items-center">
                    <div
                      className="bg-slate-800 dark:bg-slate-200 h-full rounded-none transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions Button Row - Sharped */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push("/exam")}
            className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest rounded-none border border-slate-900 dark:border-slate-100 transition-colors shadow-sm cursor-pointer font-mono"
          >
            Take Another Exam
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex-1 py-3 border border-slate-300 dark:border-slate-750 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest rounded-none transition-colors cursor-pointer font-mono"
          >
            Return to Console
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen flex-col items-center p-6 sm:p-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <div className="p-12 text-center">
          <div className="animate-spin rounded-none h-6 w-6 border-2 border-t-transparent border-slate-900 dark:border-slate-100 mx-auto"></div>
          <p className="mt-4 text-[10px] font-mono font-black uppercase tracking-widest text-slate-500 dark:text-slate-450 animate-pulse">
            Generating score report...
          </p>
        </div>
      </main>
    }>
      <ResultsContent />
    </Suspense>
  );
}
