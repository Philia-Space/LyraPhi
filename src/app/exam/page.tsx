"use client";

import { useState, useEffect } from "react";
import { mondaiphiApi, shikenphiApi } from "@/lib/api";
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
      // Create session
      const session = await shikenphiApi.createSession({
        level,
        templateId: "tpl_balanced_75",
      });

      // Navigate to exam session
      window.location.href = `/exam/${session.sessionId}`;
    } catch (err: any) {
      setError(err.message || "Failed to start exam");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">JLPT Exam</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md">
          {error}
        </div>
      )}

      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Select Your Level
          </h2>
          <div className="grid grid-cols-5 gap-4">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => startExam(level)}
                disabled={loading}
                className={`p-6 rounded-xl border-2 font-bold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm`}
                style={{
                  borderColor:
                    selectedLevel === level
                      ? `var(--jlpt-${level.toLowerCase()})`
                      : "#e5e7eb",
                }}
              >
                <LevelBadge level={level} size="lg" />
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Creating exam session...</p>
          </div>
        )}

        <div className="mt-8 p-6 border rounded-lg bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Each exam contains questions from Grammar, Reading, and Listening sections</li>
            <li>You can flag questions for review</li>
            <li>Timer is displayed but not enforced server-side</li>
            <li>Results are shown immediately after submission</li>
            <li>Sessions expire after 24 hours</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
