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
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>

      {/* Filters */}
      <div className="w-full max-w-3xl mb-6 space-y-4">
        <div className="flex gap-4">
          {["alltime", "weekly", "monthly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg border capitalize ${
                period === p
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-50"
              }`}
            >
              {p === "alltime" ? "All Time" : p}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setLevel("")}
            className={`px-3 py-1 rounded border text-sm ${
              level === "" ? "bg-blue-100 border-blue-300" : "hover:bg-gray-50"
            }`}
          >
            All Levels
          </button>
          {["N5", "N4", "N3", "N2", "N1"].map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-3 py-1 rounded border text-sm ${
                level === l ? "bg-blue-100 border-blue-300" : "hover:bg-gray-50"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="w-full max-w-3xl border rounded-lg overflow-hidden bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Rank</th>
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-right font-semibold">Score</th>
                <th className="px-4 py-3 text-right font-semibold">Exams</th>
                <th className="px-4 py-3 text-right font-semibold">Avg %</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No entries yet. Be the first to take an exam!
                  </td>
                </tr>
              ) : (
                entries.map((entry, index) => (
                  <tr key={entry.user_id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {index === 0 && <span className="text-yellow-500">🥇</span>}
                      {index === 1 && <span className="text-gray-400">🥈</span>}
                      {index === 2 && <span className="text-amber-600">🥉</span>}
                      {index > 2 && <span className="text-gray-500">#{index + 1}</span>}
                    </td>
                    <td className="px-4 py-3 font-medium">{entry.display_name}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {entry.total_score.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {entry.exam_count}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
