"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mondaiphiApi, shikenphiApi, ExamInfo, QuestionInfo } from "@/lib/api";
import LevelBadge from "@/components/LevelBadge";

const MONTH_NAMES: Record<number, string> = {
  7: "July",
  12: "December",
};

const SECTION_LABELS: Record<string, string> = {
  vocabulary: "文字・語彙 (Vocab/Grammar)",
  reading: "読解 (Reading)",
  listening: "聴解 (Listening)",
};

interface ExamWithQuestions {
  exam: ExamInfo;
  questionCount: number;
}

interface ExamSectionCounts {
  total: number;
  sections: Record<string, number>;
}

export default function ArchivePage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string>("N3");
  const [exams, setExams] = useState<ExamInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedExam, setExpandedExam] = useState<string | null>(null);
  const [examQuestions, setExamQuestions] = useState<Record<string, ExamSectionCounts>>({});

  const levels = ["N5", "N4", "N3", "N2", "N1"];

  useEffect(() => {
    loadExams();
  }, [selectedLevel]);

  const loadExams = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await mondaiphiApi.listExams({ level: selectedLevel });
      const examList = (res.data?.exams || []) as ExamInfo[];
      // Sort: practice at bottom, real exams by year desc then month desc
      examList.sort((a, b) => {
        if (a.is_practice !== b.is_practice) return a.is_practice ? 1 : -1;
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });
      setExams(examList);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  const toggleExam = async (examId: string) => {
    if (expandedExam === examId) {
      setExpandedExam(null);
      return;
    }
    setExpandedExam(examId);
    if (!examQuestions[examId]) {
      try {
        const res = await mondaiphiApi.getExamQuestions(examId);
        const questions: QuestionInfo[] = res.data?.questions || [];
        const total = questions.length;
        const sections: Record<string, number> = {};
        for (const q of questions) {
          const section = q.section || "unknown";
          sections[section] = (sections[section] || 0) + 1;
        }
        setExamQuestions((prev) => ({ ...prev, [examId]: { total, sections } }));
      } catch {
        // silently fail
      }
    }
  };

  const startExamFromArchive = async (examId: string) => {
    setLoading(true);
    try {
      // Create session with this exam's questions (ALL questions, no shuffle, no limit)
      const session = await shikenphiApi.createSession({
        exam_id: examId,
      });
      const sessionId = session.data?.session_id;
      if (sessionId) {
        router.push(`/exam/${sessionId}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to start exam");
      setLoading(false);
    }
  };

  const formatDate = (exam: ExamInfo): string => {
    if (exam.is_practice) return `📝 Practice ${exam.date_label.replace("practice-", "")}`;
    const monthName = MONTH_NAMES[exam.month] || `Month ${exam.month}`;
    return `${monthName} ${exam.year}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-widest font-mono uppercase text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white pb-2">
        JLPT EXAM ARCHIVE
      </h1>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-8">
        Browse real JLPT exams by year — questions in original chronological order
      </p>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-300 dark:border-red-900 text-red-700 dark:text-red-400 px-4 py-3 rounded-none mb-6 max-w-md text-xs font-mono">
          {error}
        </div>
      )}

      {/* Level filter for archive */}
      <div className="flex gap-2 mb-8">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => {
              setSelectedLevel(level);
              setExpandedExam(null);
              setExamQuestions({});
            }}
            className={`px-4 py-2 rounded-none border-2 font-black text-sm transition-all cursor-pointer ${
              selectedLevel === level
                ? "border-slate-900 dark:border-slate-100 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-400"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Exam list */}
      <div className="w-full max-w-3xl">
        {loading && exams.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-none h-6 w-6 border-2 border-t-transparent border-slate-900" />
            <p className="mt-2 text-xs font-mono font-bold uppercase">Loading archive...</p>
          </div>
        )}

        {!loading && exams.length === 0 && (
          <div className="text-center py-12 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <p className="text-sm font-mono text-slate-500">No exams found for {selectedLevel}. Run the import script first.</p>
          </div>
        )}

        <div className="space-y-3">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
            >
              {/* Exam header */}
              <div
                onClick={() => toggleExam(exam.id)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {expandedExam === exam.id ? "▼" : "▶"}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm">
                      {formatDate(exam)}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {exam.is_practice ? "Practice Exam" : "Official JLPT"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {examQuestions[exam.id] !== undefined && (
                    <span className="text-xs font-mono text-slate-500">
                      {examQuestions[exam.id].total} questions
                    </span>
                  )}
                  <LevelBadge level={exam.level} size="sm" />
                </div>
              </div>

              {/* Expanded content */}
              {expandedExam === exam.id && (
                <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {["vocabulary", "reading", "listening"].map((section, idx) => {
                      const counts = examQuestions[exam.id]?.sections;
                      const count = counts?.[section] ?? 0;
                      return (
                        <div
                          key={`${exam.id}-${section}-${idx}`}
                          className="border border-slate-200 dark:border-slate-800 p-3 text-center"
                        >
                          <p className="text-xs font-bold font-mono uppercase text-slate-500">
                            {section === "vocabulary" ? "Vocab" : section === "reading" ? "Reading" : "Listening"}
                          </p>
                          <p className="text-lg font-black">
                            {count > 0 ? count : "—"}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => startExamFromArchive(exam.id)}
                    disabled={loading}
                    className="w-full py-3 border-2 border-slate-900 dark:border-slate-100 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Starting..." : "Take This Exam"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
