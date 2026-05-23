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
      // TODO: Get actual user ID from auth context
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
    { name: "Beginner", minXP: 0, color: "bg-gray-100" },
    { name: "Apprentice", minXP: 500, color: "bg-green-100" },
    { name: "Scholar", minXP: 1500, color: "bg-blue-100" },
    { name: "Master", minXP: 5000, color: "bg-purple-100" },
    { name: "Sensei", minXP: 10000, color: "bg-yellow-100" },
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
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      {loading ? (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      ) : (
        <div className="w-full max-w-2xl space-y-6">
          {/* Rank Card */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Current Rank</h2>
                <p className="text-3xl font-bold text-blue-600">
                  {displayStats.current_rank}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total XP</div>
                <div className="text-2xl font-bold">
                  {displayStats.total_xp.toLocaleString()}
                </div>
              </div>
            </div>

            {nextRank && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{currentRank.minXP} XP</span>
                  <span>{nextRank.minXP} XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.max(0, Math.min(100, xpProgress))}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {nextRank.minXP - displayStats.total_xp} XP until {nextRank.name}
                </p>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-lg p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-blue-600">
                {displayStats.total_exams}
              </div>
              <div className="text-sm text-gray-500 mt-1">Total Exams</div>
            </div>
            <div className="bg-white border rounded-lg p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-green-600">
                {displayStats.avg_score}%
              </div>
              <div className="text-sm text-gray-500 mt-1">Avg Score</div>
            </div>
            <div className="bg-white border rounded-lg p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-purple-600">
                {displayStats.best_score}%
              </div>
              <div className="text-sm text-gray-500 mt-1">Best Score</div>
            </div>
            <div className="bg-white border rounded-lg p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-orange-600">
                {displayStats.current_streak}
              </div>
              <div className="text-sm text-gray-500 mt-1">Current Streak</div>
            </div>
            <div className="bg-white border rounded-lg p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-red-600">
                {displayStats.longest_streak}
              </div>
              <div className="text-sm text-gray-500 mt-1">Longest Streak</div>
            </div>
            <div className="bg-white border rounded-lg p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {displayStats.best_level}
              </div>
              <div className="text-sm text-gray-500 mt-1">Best Level</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <p className="text-gray-500 text-center py-4">
              No recent exams. Take your first exam to see activity here!
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
