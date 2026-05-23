"use client";

import { useSearchParams } from "next/navigation";
import LevelBadge from "@/components/LevelBadge";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const score = searchParams.get("score");

  // Demo data - in real app, fetch from API
  const result = {
    score: 45,
    total: 75,
    percentage: score ? parseInt(score) : 60,
    timeSpent: 2340,
    sectionBreakdown: {
      grammar: 12,
      reading: 10,
      listening: 8,
    },
    level: "N3",
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Exam Results</h1>

      <div className="w-full max-w-2xl space-y-6">
        {/* Score Card */}
        <div className="bg-white border rounded-lg p-8 shadow-sm text-center">
          <div className="text-sm text-gray-500 mb-2">Your Score</div>
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {result.percentage}%
          </div>
          <div className="text-lg text-gray-600">
            {result.score} / {result.total} correct
          </div>
          <div className="mt-4">
            <LevelBadge level={result.level} size="md" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Time Spent</div>
            <div className="text-2xl font-bold">{formatTime(result.timeSpent)}</div>
          </div>
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Questions</div>
            <div className="text-2xl font-bold">{result.total}</div>
          </div>
        </div>

        {/* Section Breakdown */}
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Section Breakdown</h2>
          <div className="space-y-3">
            {Object.entries(result.sectionBreakdown).map(([section, correct]) => {
              const total = 25; // approximate
              const percentage = Math.round((correct / total) * 100);
              return (
                <div key={section}>
                  <div className="flex justify-between mb-1">
                    <span className="capitalize font-medium">{section}</span>
                    <span className="text-gray-600">
                      {correct}/{total} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <a
            href="/exam"
            className="flex-1 text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Take Another Exam
          </a>
          <a
            href="/leaderboard"
            className="flex-1 text-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            View Leaderboard
          </a>
        </div>
      </div>
    </main>
  );
}
