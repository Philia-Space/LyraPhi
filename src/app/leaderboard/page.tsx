"use client";

import { useState, useEffect } from "react";
import { shikenphiApi } from "@/lib/api";
import LevelBadge from "@/components/LevelBadge";

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  total_score: number;
  exam_count: number;
  avg_percentage: number;
  level?: string;
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState("alltime");
  const [level, setLevel] = useState("");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [period, level]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await shikenphiApi.getLeaderboard({
        period,
        level: level || undefined,
      });
      setEntries(data.entries || []);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200">
      {/* Academic Page Header */}
      <h1 className="text-2xl sm:text-3xl font-black mb-8 tracking-widest font-mono uppercase text-slate-800 dark:text-white border-b-2 border-slate-900 dark:border-white pb-2">
        ACADEMIC LEADERBOARD
      </h1>

      {/* Filters Container - Strictly Sharp */}
      <div className="w-full max-w-3xl mb-8 space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-none shadow-none">
        <div>
          <h2 className="text-[10px] font-black font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
            SELECT TIME PERIOD
          </h2>
          <div className="flex gap-2">
            {["alltime", "weekly", "monthly"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 border-2 text-[10px] font-black uppercase tracking-widest font-mono rounded-none transition-colors duration-150 cursor-pointer ${
                  period === p
                    ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200"
                }`}
              >
                {p === "alltime" ? "All Time" : p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[10px] font-black font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
            FILTER BY JLPT LEVEL
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setLevel("")}
              className={`px-3 py-1.5 border text-[10px] font-black uppercase tracking-widest font-mono rounded-none transition-colors duration-150 cursor-pointer ${
                level === ""
                  ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-450 hover:text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200"
              }`}
            >
              All Levels
            </button>
            {["N5", "N4", "N3", "N2", "N1"].map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-3 py-1.5 border text-[10px] font-black uppercase tracking-widest font-mono rounded-none transition-colors duration-150 cursor-pointer ${
                  level === l
                    ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-450 hover:text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard Table Panel - Sharp UI */}
      <div className="w-full max-w-3xl border border-slate-200 dark:border-slate-800 rounded-none overflow-hidden bg-white dark:bg-slate-900 shadow-none transition-colors duration-200">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-none h-6 w-6 border-2 border-t-transparent border-slate-900 dark:border-slate-100 mx-auto"></div>
            <p className="mt-4 text-[10px] font-mono font-black uppercase tracking-widest text-slate-500 dark:text-slate-450 animate-pulse">
              Retrieving Ranking Database...
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3.5 text-left text-[10px] font-black font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Rank
                </th>
                <th className="px-4 py-3.5 text-left text-[10px] font-black font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Candidate
                </th>
                <th className="px-4 py-3.5 text-right text-[10px] font-black font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Total Score
                </th>
                <th className="px-4 py-3.5 text-right text-[10px] font-black font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Exams Taken
                </th>
                <th className="px-4 py-3.5 text-right text-[10px] font-black font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Accuracy
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    No academic records found on this filter.
                  </td>
                </tr>
              ) : (
                entries.map((entry, index) => (
                  <tr 
                    key={entry.user_id} 
                    className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/35 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 text-xs font-mono font-black text-slate-500 dark:text-slate-400">
                      {index === 0 && <span className="text-yellow-600">🥇</span>}
                      {index === 1 && <span className="text-slate-400">🥈</span>}
                      {index === 2 && <span className="text-amber-600">🥉</span>}
                      {index > 2 && <span>#{index + 1}</span>}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                      {entry.display_name}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-mono font-black text-slate-800 dark:text-slate-200">
                      {entry.total_score.toLocaleString()} XP
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">
                      {entry.exam_count} sessions
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-block px-2 py-0.5 font-mono text-[10px] font-black border border-green-200 text-green-800 bg-green-50/50 dark:border-green-900/50 dark:text-green-300 dark:bg-green-950/20">
                        {entry.avg_percentage}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
