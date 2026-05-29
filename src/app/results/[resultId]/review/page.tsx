"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { shikenphiApi } from "@/lib/api";
import LevelBadge from "@/components/LevelBadge";

interface OptionItem {
  value: string;
  label: string;
}

interface QuestionReview {
  question_id: string;
  section: string;
  prompt: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  options: OptionItem[];
}

type FilterMode = "all" | "wrong" | "correct";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.resultId as string;

  const [reviews, setReviews] = useState<QuestionReview[]>([]);
  const [level, setLevel] = useState("N5");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    loadReview();
  }, [resultId]);

  const loadReview = async () => {
    try {
      const res = await shikenphiApi.getResultReview(resultId);
      const data: { reviews?: QuestionReview[]; level?: string } = res.data || res;
      setReviews(data?.reviews || []);
      setLevel(data?.level || "N5");
    } catch (err) {
      console.error("[LyraPhi] Failed to load review:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentIdx(0);
  }, [filter]);

  const filtered = reviews.filter((r) => {
    if (filter === "wrong") return !r.is_correct;
    if (filter === "correct") return r.is_correct;
    return true;
  });

  const current = filtered[currentIdx];
  const totalFiltered = filtered.length;
  const wrongCount = reviews.filter((r) => !r.is_correct).length;
  const correctCount = reviews.filter((r) => r.is_correct).length;

  const sectionLabels: Record<string, string> = {
    grammar: "LANGUAGE KNOWLEDGE",
    vocabulary: "LANGUAGE KNOWLEDGE",
    reading: "READING",
    listening: "LISTENING",
  };

  const sectionGroups: { key: string; label: string; indices: number[] }[] = [];
  const sectionMap: Record<string, number[]> = {};
  for (let i = 0; i < reviews.length; i++) {
    const sec = reviews[i].section || "grammar";
    if (!sectionMap[sec]) sectionMap[sec] = [];
    sectionMap[sec].push(i);
  }
  const sectionOrder = ["grammar", "vocabulary", "reading", "listening"];
  for (const sec of sectionOrder) {
    if (sectionMap[sec]?.length) {
      sectionGroups.push({ key: sec, label: sectionLabels[sec] || sec.toUpperCase(), indices: sectionMap[sec] });
    }
  }

  const sectionOffsets: Record<string, number> = {};
  let offset = 0;
  for (const g of sectionGroups) {
    sectionOffsets[g.key] = offset;
    offset += g.indices.length;
  }

  const getDisplayNumber = (globalIdx: number): number => {
    const sec = reviews[globalIdx]?.section || "grammar";
    const base = sectionOffsets[sec] ?? 0;
    const group = sectionGroups.find((g) => g.key === sec);
    if (!group) return globalIdx + 1;
    const localIdx = group.indices.indexOf(globalIdx);
    return base + localIdx + 1;
  };

  const [showMobileNav, setShowMobileNav] = useState(false);

  const renderNavigator = (isMobile: boolean) => (
    <div className="space-y-3">
      <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono mb-2">
        QUESTION MAP
      </h3>
      {sectionGroups.map((group) => (
        <div key={group.key} className="border border-slate-200 dark:border-slate-800 rounded-none overflow-hidden">
          <div className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
              {group.label}
            </span>
          </div>
          <div className="p-2 grid grid-cols-5 gap-1.5">
            {group.indices.map((globalIdx) => {
              const r = reviews[globalIdx];
              const isActive = r === current;
              const isFiltered = filtered.includes(r);
              return (
                <button
                  key={globalIdx}
                  onClick={() => {
                    const filteredIdx = filtered.indexOf(r);
                    if (filteredIdx !== -1) setCurrentIdx(filteredIdx);
                    if (isMobile) setShowMobileNav(false);
                  }}
                  disabled={!isFiltered}
                  className={`w-8 h-8 text-[10px] font-black font-mono rounded-none border cursor-pointer transition-colors ${
                    isActive
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100"
                      : r.is_correct
                        ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:border-green-400"
                        : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 hover:border-red-400"
                  } ${!isFiltered ? "opacity-30 cursor-not-allowed" : ""}`}
                  title={`Q${getDisplayNumber(globalIdx)} — ${r.is_correct ? "Correct" : "Incorrect"}`}
                >
                  {getDisplayNumber(globalIdx)}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  const getOptionClass = (opt: OptionItem) => {
    const isUser = opt.value === current?.user_answer;
    const isCorrect = opt.value === current?.correct_answer;

    if (isUser && isCorrect) {
      return "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-950/30";
    }
    if (isUser && !isCorrect) {
      return "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-950/30";
    }
    if (isCorrect && !isUser) {
      return "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-950/30";
    }
    return "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900";
  };

  const getOptionBadge = (opt: OptionItem) => {
    const isUser = opt.value === current?.user_answer;
    const isCorrect = opt.value === current?.correct_answer;

    if (isUser && isCorrect) return "YOUR ANSWER ✓";
    if (isUser && !isCorrect) return "YOUR ANSWER ✗";
    if (isCorrect) return "CORRECT ✓";
    return null;
  };

  const displayPrompt = (prompt: string, section: string) => {
    if (!prompt || prompt === "[No prompt available]") {
      if (section === "listening") {
        return <em className="text-slate-400 dark:text-slate-500">Audio prompt — listen to the recording</em>;
      }
      return <em className="text-slate-400 dark:text-slate-500">No prompt available</em>;
    }
    return prompt;
  };

  if (loading) {
    return (
      <main className="flex min-h-screen bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-none h-8 w-8 border-2 border-t-transparent border-slate-900 dark:border-slate-100 mx-auto"></div>
          <p className="mt-3 text-[10px] font-mono font-black uppercase tracking-widest text-slate-400 animate-pulse">
            Loading review data...
          </p>
        </div>
      </main>
    );
  }

  if (totalFiltered === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center p-6 sm:p-8 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <h1 className="text-2xl font-black mb-8 tracking-widest font-mono uppercase text-slate-800 dark:text-white border-b-2 border-slate-900 dark:border-white pb-2">
          SESSION REVIEW
        </h1>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-none max-w-md w-full text-center">
          <p className="text-xs font-mono text-slate-500">
            No review data available for this filter.
          </p>
          <button
            onClick={() => router.push(`/results?resultId=${resultId}`)}
            className="mt-4 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest rounded-none cursor-pointer font-mono"
          >
            Back to Results
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="h-12 flex items-center justify-between px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/results?resultId=${resultId}`)}
            className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-mono cursor-pointer"
          >
            &larr; Results
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
            REVIEW MODE
          </span>
          <LevelBadge level={level} size="sm" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="sm:hidden px-3 py-1 text-[10px] font-black uppercase tracking-widest font-mono rounded-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 cursor-pointer"
          >
            MAP
          </button>
          {(["all", "wrong", "correct"] as FilterMode[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest font-mono rounded-none border transition-colors cursor-pointer ${
                filter === f
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100"
                  : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400"
              }`}
            >
              {f === "all" ? `All (${reviews.length})` : f === "wrong" ? `Wrong (${wrongCount})` : `Correct (${correctCount})`}
            </button>
          ))}
        </div>
      </header>

      {/* Mobile nav overlay */}
      {showMobileNav && (
        <div className="sm:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setShowMobileNav(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-3" onClick={(e) => e.stopPropagation()}>
            {renderNavigator(true)}
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Navigator Sidebar */}
        <div className="hidden sm:flex w-56 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto flex-col">
          <div className="p-3 flex-1 overflow-y-auto">
            {renderNavigator(false)}
          </div>
        </div>

        {/* Question Card */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none">
          {/* Question Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                QUESTION {current ? getDisplayNumber(reviews.indexOf(current)) : currentIdx + 1} OF {reviews.length}
              </span>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase font-mono tracking-widest">
                {sectionLabels[current?.section || ""] || current?.section?.toUpperCase()}
              </span>
            </div>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-none border select-none ${
                current?.is_correct
                  ? "bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800"
              }`}
            >
              {current?.is_correct ? "CORRECT" : "INCORRECT"}
            </span>
          </div>

          <div className="px-6 py-6 space-y-5">
            {/* Question Prompt */}
            {current?.prompt && (
              <div className="p-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-none">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 font-mono">
                  QUESTION
                </div>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {displayPrompt(current.prompt, current.section)}
                </div>
              </div>
            )}

            {/* All Options */}
            {current?.options && current.options.length > 0 && (
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 font-mono">
                  ANSWER CHOICES
                </div>
                <div className="space-y-2">
                  {current.options.map((opt, idx) => {
                    const badge = getOptionBadge(opt);
                    return (
                      <div
                        key={opt.value}
                        className={`p-3 border rounded-none flex items-start gap-3 ${getOptionClass(opt)}`}
                      >
                        <span className="text-xs font-black font-mono text-slate-400 dark:text-slate-500 shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-200 break-words">
                            {opt.label}
                          </div>
                        </div>
                        {badge && (
                          <span className={`text-[10px] font-black font-mono uppercase tracking-wider shrink-0 ${
                            badge.includes("✗")
                              ? "text-red-600 dark:text-red-400"
                              : "text-green-600 dark:text-green-400"
                          }`}>
                            {badge}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fallback if no options returned */}
            {(!current?.options || current.options.length === 0) && (
              <div className="space-y-3">
                <div className={`p-4 border rounded-none ${
                  current?.is_correct
                    ? "border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/10"
                    : "border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/10"
                }`}>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1 font-mono">
                    YOUR ANSWER
                  </div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {current?.user_answer || "(no answer)"}
                  </div>
                </div>
                {!current?.is_correct && (
                  <div className="p-4 border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/10 rounded-none">
                    <div className="text-[10px] font-black uppercase tracking-widest text-green-700 dark:text-green-400 mb-1 font-mono">
                      CORRECT ANSWER
                    </div>
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {current?.correct_answer}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              Question ID: {current?.question_id}
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <button
          onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-none hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer font-mono"
        >
          Previous
        </button>
        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
          {currentIdx + 1} / {totalFiltered}
        </span>
        <button
          onClick={() => setCurrentIdx((prev) => Math.min(totalFiltered - 1, prev + 1))}
          disabled={currentIdx >= totalFiltered - 1}
          className="px-6 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-none transition-colors cursor-pointer font-mono disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </main>
  );
}
