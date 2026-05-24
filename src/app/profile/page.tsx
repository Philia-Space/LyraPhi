"use client";

import { useState, useEffect } from "react";
import { shikenphiApi } from "@/lib/api";

interface UserStats {
  user_id: string;
  total_exams: number;
  total_questions_answered: number;
  total_correct: number;
  avg_score: number;
  best_score: number;
  best_level: string;
  total_xp: number;
  current_rank: string;
  current_streak: number;
  longest_streak: number;
}

export default function ProfilePage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await shikenphiApi.getStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const defaultStats: UserStats = {
    user_id: "demo_user",
    total_exams: 0,
    total_questions_answered: 0,
    total_correct: 0,
    avg_score: 0,
    best_score: 0,
    best_level: "N5",
    total_xp: 0,
    current_rank: "Beginner",
    current_streak: 0,
    longest_streak: 0,
  };

  const displayStats = stats || defaultStats;

  const ranks = [
    { name: "Beginner", minXP: 0 },
    { name: "Apprentice", minXP: 500 },
    { name: "Scholar", minXP: 1500 },
    { name: "Master", minXP: 5000 },
    { name: "Sensei", minXP: 10000 },
  ];

  const currentRank =
    ranks.find((r) => displayStats.total_xp < (r.minXP || Infinity)) ||
    ranks[ranks.length - 1];
  const nextRank = ranks[ranks.indexOf(currentRank) + 1];

  const xpProgress = nextRank
    ? ((displayStats.total_xp - currentRank.minXP) /
        (nextRank.minXP - currentRank.minXP)) *
      100
    : 100;

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200">
      {/* Academic Page Header */}
      <h1 className="text-2xl sm:text-3xl font-black mb-8 tracking-widest font-mono uppercase text-slate-800 dark:text-white border-b-2 border-slate-900 dark:border-white pb-2">
        CANDIDATE DOSSIER
      </h1>

      {loading ? (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-none h-6 w-6 border-2 border-t-transparent border-slate-900 dark:border-slate-100 mx-auto"></div>
          <p className="mt-4 text-[10px] font-mono font-black uppercase tracking-widest text-slate-500 dark:text-slate-450 animate-pulse">
            Loading Dossier Records...
          </p>
        </div>
      ) : (
        <div className="w-full max-w-2xl space-y-6">
          
          {/* Rank & XP Card - Sharp UI */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-none shadow-none transition-colors duration-200">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div>
                <h2 className="text-[10px] font-black font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  CURRENT ACCREDITATION
                </h2>
                <p className="text-2xl font-black font-mono uppercase tracking-wider text-slate-800 dark:text-white mt-1">
                  {displayStats.current_rank}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-[10px] font-black font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  TOTAL EXPERIENCE
                </div>
                <div className="text-2xl font-black font-mono text-slate-800 dark:text-white mt-1">
                  {displayStats.total_xp.toLocaleString()} XP
                </div>
              </div>
            </div>

            {nextRank && (
              <div className="mt-6">
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-450 dark:text-slate-500 mb-1.5">
                  <span>{currentRank.minXP} XP</span>
                  <span>{nextRank.minXP} XP</span>
                </div>
                {/* Sharp Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-none h-3 p-[1px] flex items-center">
                  <div
                    className="bg-slate-800 dark:bg-slate-200 h-full rounded-none transition-all duration-300"
                    style={{ width: `${Math.max(0, Math.min(100, xpProgress))}%` }}
                  ></div>
                </div>
                <p className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-2">
                  {nextRank.minXP - displayStats.total_xp} XP required to advance to {nextRank.name}
                </p>
              </div>
            )}
          </div>

          {/* Stats Grid - All metrics colored identically (Professional/Uniform) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-none text-center shadow-none transition-colors duration-200">
              <div className="text-3xl font-black font-mono text-slate-800 dark:text-white">
                {displayStats.total_exams}
              </div>
              <div className="text-[10px] font-black font-mono uppercase tracking-widest text-slate-450 dark:text-slate-500 mt-2">
                Exams Completed
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-none text-center shadow-none transition-colors duration-200">
              <div className="text-3xl font-black font-mono text-slate-800 dark:text-white">
                {displayStats.avg_score}%
              </div>
              <div className="text-[10px] font-black font-mono uppercase tracking-widest text-slate-450 dark:text-slate-500 mt-2">
                Average Accuracy
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-none text-center shadow-none transition-colors duration-200">
              <div className="text-3xl font-black font-mono text-slate-800 dark:text-white">
                {displayStats.best_score}%
              </div>
              <div className="text-[10px] font-black font-mono uppercase tracking-widest text-slate-450 dark:text-slate-500 mt-2">
                Personal Record
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-none text-center shadow-none transition-colors duration-200">
              <div className="text-3xl font-black font-mono text-slate-800 dark:text-white">
                {displayStats.current_streak}
              </div>
              <div className="text-[10px] font-black font-mono uppercase tracking-widest text-slate-450 dark:text-slate-500 mt-2">
                Current Streak
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-none text-center shadow-none transition-colors duration-200">
              <div className="text-3xl font-black font-mono text-slate-800 dark:text-white">
                {displayStats.longest_streak}
              </div>
              <div className="text-[10px] font-black font-mono uppercase tracking-widest text-slate-450 dark:text-slate-500 mt-2">
                Longest Streak
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-none text-center shadow-none transition-colors duration-200">
              <div className="text-3xl font-black font-mono text-slate-800 dark:text-white">
                {displayStats.best_level}
              </div>
              <div className="text-[10px] font-black font-mono uppercase tracking-widest text-slate-450 dark:text-slate-500 mt-2">
                Highest Level
              </div>
            </div>

          </div>

          {/* Recent Activity Panel - Sharp UI */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-none shadow-none transition-colors duration-200">
            <h2 className="text-[10px] font-black font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
              HISTORICAL ASSESSMENT RECORD
            </h2>
            <p className="text-xs font-mono font-bold text-slate-450 dark:text-slate-500 text-center py-6 uppercase tracking-wider">
              No recent assessment runs. Take an exam to initialize your timeline!
            </p>
          </div>

        </div>
      )}
    </main>
  );
}
