"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { shikenphiApi } from "@/lib/api";
import AudioPlayer from "@/components/AudioPlayer";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Option {
  id: string;
  value: string;
  label: string;
}

interface Asset {
  type: string;
  url: string;
}

interface Passage {
  content: string;
}

interface Question {
  id: string;
  section?: string;
  prompt: string;
  context?: string;
  passage?: Passage;
  assets?: Asset[];
  options: Option[];
}

const BASE_DEMO_QUESTIONS: Question[] = [
  {
    id: "qst_1",
    section: "grammar",
    context: "次の文の（　）に入れるのに最もよいものを、１・２・３・４から一つ選びなさい。",
    prompt: "日本語を毎日練習している（　）、だんだん話せるようになってきました。",
    options: [
      { id: "opt_1", value: "1", label: "おかげで" },
      { id: "opt_2", value: "2", label: "せいで" },
      { id: "opt_3", value: "3", label: "かわりに" },
      { id: "opt_4", value: "4", label: "たびに" },
    ],
  },
  {
    id: "qst_2",
    section: "grammar",
    context: "次の文の（　）に入れるのに最もよいものを、１・２・３・４から一つ選びなさい。",
    prompt: "この仕事は時間がかかりますが、最後まで（　）やり遂げたいと思います。",
    options: [
      { id: "opt_1", value: "1", label: "あきらめずに" },
      { id: "opt_2", value: "2", label: "あきらめながら" },
      { id: "opt_3", value: "3", label: "あきらめて" },
      { id: "opt_4", value: "4", label: "あきらめるなら" },
    ],
  },
  {
    id: "qst_3",
    section: "reading",
    context: "次の文章を読んで、後の問いに対する答えとして最もよいものを、１・２・３・４から一つ選びなさい。",
    passage: {
      content: "最近、スマートフォンの使いすぎが社会問題になっています。特に若い人たちの間で、コミュニケーションをとるために常に画面を見つめる姿が目立ちます。しかし、対面での対話をおろそかにすることは、本当の絆を育む妨げになりかねません。時にはデバイスを置いて、目の前の人との対話を楽しむことが推奨されています。"
    },
    prompt: "この文章で筆者が最も言いたいことは何か。",
    options: [
      { id: "opt_1", value: "1", label: "スマートフォンの使い方を全面的にやめるべきだ。" },
      { id: "opt_2", value: "2", label: "対話の質を高めるために、スマホを置いて対面での対話を大切にすべきだ。" },
      { id: "opt_3", value: "3", label: "若者はスマホを制限なく利用してよい。" },
      { id: "opt_4", value: "4", label: "スマートフォンの進歩が人間関係を壊した。" },
    ],
  },
  {
    id: "qst_4",
    section: "listening",
    context: "問題用紙に何が書いてあるか、あらかじめ聞きなさい。音声を再生して正しい答えを選んでください。",
    assets: [
      { type: "audio", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }
    ],
    prompt: "男の人と女の人が話しています。二人は明日何時に会いますか。",
    options: [
      { id: "opt_1", value: "1", label: "午前9時" },
      { id: "opt_2", value: "2", label: "午前10時" },
      { id: "opt_3", value: "3", label: "午後12時" },
      { id: "opt_4", value: "4", label: "午後2時" },
    ],
  },
  {
    id: "qst_5",
    section: "listening",
    context: "質問を聞いて、正しい番号を選択してください。",
    assets: [
      { type: "audio", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
      { type: "image", url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60" }
    ],
    prompt: "この写真を見て、正しい内容を選びなさい。",
    options: [
      { id: "opt_1", value: "1", label: "本を読んでいる様子" },
      { id: "opt_2", value: "2", label: "音楽を聴いている様子" },
      { id: "opt_3", value: "3", label: "食事をしている様子" },
      { id: "opt_4", value: "4", label: "運動をしている様子" },
    ],
  },
];

// Generate exactly 105 questions programmatically (35 grammar, 35 reading, 35 listening)
const DEMO_QUESTIONS: Question[] = [];

// 1. Grammar: 35 questions (indices 0 to 34)
for (let i = 0; i < 35; i++) {
  const base = BASE_DEMO_QUESTIONS[i % 2];
  DEMO_QUESTIONS.push({
    ...base,
    id: `qst_g_${i + 1}`,
    prompt: `[Grammar Q-${i + 1}] ${base.prompt}`,
  });
}

// 2. Reading: 35 questions (indices 35 to 69)
for (let i = 0; i < 35; i++) {
  const base = BASE_DEMO_QUESTIONS[2];
  DEMO_QUESTIONS.push({
    ...base,
    id: `qst_r_${i + 1}`,
    prompt: `[Reading Q-${i + 1}] ${base.prompt}`,
  });
}

// 3. Listening: 35 questions (indices 70 to 104)
for (let i = 0; i < 35; i++) {
  const base = BASE_DEMO_QUESTIONS[3 + (i % 2)];
  DEMO_QUESTIONS.push({
    ...base,
    id: `qst_l_${i + 1}`,
    prompt: `[Listening Q-${i + 1}] ${base.prompt}`,
  });
}

export default function ExamSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [sessionData, setSessionData] = useState<any>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: "" });
  const [isDark, setIsDark] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Theme Sync
  useEffect(() => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    setIsDark(isCurrentlyDark);
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  // Load session
  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      const data = await shikenphiApi.getSession(sessionId);
      setSessionData(data.session);
    } catch (err: any) {
      console.warn("[LyraPhi] Backend API not available. Falling back to local dummy session mode.", err);
      setSessionData({
        sessionId: sessionId,
        level: "N5",
        question_count: DEMO_QUESTIONS.length,
      });
    } finally {
      const savedTimer = sessionStorage.getItem(`lyra_timer_${sessionId}`);
      if (savedTimer) {
        setTimerSeconds(parseInt(savedTimer, 10) || 0);
      }
      setLoading(false);
    }
  };

  // Timer runner
  useEffect(() => {
    if (loading || error) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        const newVal = prev + 1;
        sessionStorage.setItem(`lyra_timer_${sessionId}`, String(newVal));
        return newVal;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, error, sessionId]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleAnswer = async (questionIndex: number, optionValue: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionValue }));
    try {
      await shikenphiApi.saveAnswer(sessionId, questionIndex, optionValue);
    } catch (err) {
      console.warn("[LyraPhi] Failed to save answer to backend:", err);
    }
  };

  const toggleFlag = (index: number) => {
    setFlaggedQuestions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const triggerSubmitConfirm = () => {
    const totalQ = sessionData?.question_count || DEMO_QUESTIONS.length;
    const answeredCount = Object.keys(answers).length;
    const unanswered = totalQ - answeredCount;

    let msg = "Are you sure you want to finish the assessment?";
    if (unanswered > 0) {
      msg = `You have ${unanswered} unanswered question${
        unanswered > 1 ? "s" : ""
      }. Are you sure you want to finish?`;
    }
    setConfirmDialog({ show: true, message: msg });
  };

  const executeSubmit = async () => {
    setConfirmDialog({ show: false, message: "" });
    setLoading(true);
    try {
      const result = await shikenphiApi.submitSession(sessionId);
      sessionStorage.removeItem(`lyra_timer_${sessionId}`);
      router.push(`/results?sessionId=${sessionId}&score=${result.percentage}`);
    } catch (err: any) {
      console.warn("[LyraPhi] Failed to submit exam to backend. Simulating local score calculation.", err);
      const answeredCount = Object.keys(answers).length;
      const percentage = Math.round((answeredCount / totalQuestions) * 100);
      sessionStorage.removeItem(`lyra_timer_${sessionId}`);
      router.push(`/results?sessionId=${sessionId}&score=${percentage}`);
    }
  };

  const exitSession = () => {
    if (confirm("Exit assessment? Progress will not be saved.")) {
      sessionStorage.removeItem(`lyra_timer_${sessionId}`);
      router.push("/exam");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-slate-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 items-center justify-center p-4">
        <div className="text-center p-6 bg-white dark:bg-slate-900 rounded-none border border-slate-300 dark:border-slate-700 shadow-sm max-w-sm w-full">
          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed mb-6 font-mono text-left break-words bg-slate-50 dark:bg-slate-950 p-3 border dark:border-slate-800">
            {error}
          </p>
          <button
            onClick={() => router.push("/exam")}
            className="w-full py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest rounded-none hover:bg-slate-800 dark:hover:bg-white transition-colors cursor-pointer"
          >
            Return to Level Selection
          </button>
        </div>
      </div>
    );
  }

  const questions: Question[] = sessionData?.questions || DEMO_QUESTIONS;
  const totalQuestions = questions.length;
  const question = questions[currentQuestion] || questions[0];

  const audioAsset = question.assets?.find((a) => a.type === "audio");
  const imageAsset = question.assets?.find((a) => a.type === "image");

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.keys(flaggedQuestions).filter((k) => flaggedQuestions[parseInt(k)] === true).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const sectionLabelMap: Record<string, string> = {
    grammar: "LANGUAGE KNOWLEDGE ASSESSMENT",
    reading: "READING ASSESSMENT",
    listening: "LISTENING ASSESSMENT",
  };
  const currentSectionLabel = sectionLabelMap[question.section || ""] || "ASSESSMENT";
  const examTitle = `${sessionData?.level || "N5"} BALANCED 75 - EXAM BUNDLE A`;

  // Compute question indices dynamically based on actual loaded questions
  const grammarIndices: number[] = [];
  const readingIndices: number[] = [];
  const listeningIndices: number[] = [];

  questions.forEach((q, idx) => {
    if (q.section === "grammar") {
      grammarIndices.push(idx);
    } else if (q.section === "reading") {
      readingIndices.push(idx);
    } else if (q.section === "listening") {
      listeningIndices.push(idx);
    } else {
      grammarIndices.push(idx);
    }
  });

  const sections = [
    {
      key: "grammar",
      label: "LANGUAGE KNOWLEDGE / 文字・語彙・文法",
      indices: grammarIndices
    },
    {
      key: "reading",
      label: "READING / 読解",
      indices: readingIndices
    },
    {
      key: "listening",
      label: "LISTENING / 聴解",
      indices: listeningIndices
    }
  ];

  // Professional Academic colors
  const colorClasses = {
    current: "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100",
    answered: "bg-teal-50/50 dark:bg-teal-950/20 text-teal-800 dark:text-teal-400 border-teal-300 dark:border-teal-800",
    flagged: "bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-900/50",
    unanswered: "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600",
  };

  const getQuestionColor = (idx: number) => {
    if (currentQuestion === idx) return "current";
    if (flaggedQuestions[idx]) return "flagged";
    if (answers[idx] !== undefined) return "answered";
    return "unanswered";
  };

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isSectionCollapsed = (key: string) => collapsedSections[key] === true;

  const renderQuestionNavigator = () => (
    <div className="flex flex-col h-full">
      <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 font-mono">
        QUESTION NAVIGATOR
      </h3>

      <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
        {sections.map((section) => (
          <div key={section.key} className="border border-slate-200 dark:border-slate-800 rounded-none overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => toggleSection(section.key)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50/60 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-950/80 transition-colors cursor-pointer border-b border-slate-200 dark:border-slate-800 rounded-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-300 text-left leading-tight font-sans">
                  {section.label}
                </span>
                <span className="text-[10px] sm:text-xs font-mono font-black text-slate-400 dark:text-slate-500 shrink-0">
                  {section.indices.filter((idx) => answers[idx] !== undefined).length}/{section.indices.length}
                </span>
              </div>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transition-transform shrink-0 ${
                  isSectionCollapsed(section.key) ? "" : "rotate-180"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {!isSectionCollapsed(section.key) && (
              <div className="p-3 bg-white dark:bg-slate-900 border-none">
                <div className="grid grid-cols-6 gap-1.5">
                  {section.indices.map((idx) => (
                    <button
                      key={"sec-" + idx}
                      onClick={() => {
                        setCurrentQuestion(idx);
                        setShowMobileNav(false);
                      }}
                      className={`relative aspect-square rounded-none flex items-center justify-center text-xs font-mono font-bold border transition-all cursor-pointer ${
                        colorClasses[getQuestionColor(idx)]
                      }`}
                    >
                      {idx + 1}
                      {flaggedQuestions[idx] && (
                        <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-amber-500"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 my-3"></div>

      {/* Progress & stats block */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-500 dark:text-slate-400">Answered questions</span>
          <span className="font-mono font-black text-slate-800 dark:text-slate-200">
            {answeredCount} / {totalQuestions}
          </span>
        </div>
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-500 dark:text-slate-400">Flagged questions</span>
          <span className="font-mono font-black text-amber-600 dark:text-amber-400">{flaggedCount}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-none overflow-hidden border dark:border-slate-800">
          <div
            className="h-full bg-teal-500 rounded-none transition-all"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Legend Block */}
      <div className="space-y-1.5 mb-4 text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-slate-900 dark:bg-slate-100 inline-block border border-slate-900 dark:border-slate-100"></span>
          <span className="text-slate-500 dark:text-slate-400">Active Location</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-300 dark:border-teal-800 inline-block"></span>
          <span className="text-slate-500 dark:text-slate-400">Answered Segment</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 inline-block"></span>
          <span className="text-slate-500 dark:text-slate-400">Flagged Segment</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 inline-block"></span>
          <span className="text-slate-500 dark:text-slate-400">Unanswered Segment</span>
        </div>
      </div>

      <button
        onClick={triggerSubmitConfirm}
        className="w-full py-3 bg-red-950 dark:bg-red-800 text-white font-black rounded-none text-[10px] tracking-widest hover:bg-red-900 dark:hover:bg-red-700 transition-colors shadow-sm cursor-pointer uppercase font-mono"
      >
        FINISH ASSESSMENT
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <ConfirmDialog
        show={confirmDialog.show}
        message={confirmDialog.message}
        onConfirm={executeSubmit}
        onCancel={() => setConfirmDialog({ show: false, message: "" })}
      />

      {/* Header exactly like Ayumu but sharped */}
      <header className="h-12 flex items-center justify-between px-3 sm:px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 z-20 shadow-none">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-sm font-black text-slate-900 dark:text-white tracking-widest font-mono select-none">
            LYRAPHI.
          </span>
          <button
            onClick={toggleTheme}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
              </svg>
            )}
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono hidden sm:block">
            {currentSectionLabel}
          </span>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-450 uppercase tracking-widest font-mono hidden lg:block">
            {examTitle}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Navigator trigger */}
          <button
            onClick={() => setShowMobileNav(true)}
            className="sm:hidden flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {answeredCount}/{totalQuestions}
          </button>

          {/* Monospace Active Timer */}
          <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 border border-slate-200 dark:border-slate-800 rounded-none">
            {formatTimer(timerSeconds)}
          </span>

          <button
            onClick={exitSession}
            className="text-[10px] font-black uppercase tracking-widest text-red-650 dark:text-red-450 hover:bg-red-50 dark:hover:bg-red-950/20 px-2.5 py-1 border border-red-200 dark:border-red-900 transition-colors rounded-none cursor-pointer"
          >
            EXIT
          </button>
        </div>
      </header>

      {/* Main panel layout */}
      <div className="flex flex-1 overflow-hidden w-full">
        {/* Left column Main Panel - Zero Rounded */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 scrollbar-thin">
          <div className="bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 shadow-none w-full transition-all">
            
            {/* Header info */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono select-none">
                  QUESTION {currentQuestion + 1} OF {totalQuestions}
                </span>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase font-mono tracking-widest">
                  {question.section || "grammar"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleFlag(currentQuestion)}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-none border transition-colors cursor-pointer ${
                    flaggedQuestions[currentQuestion]
                      ? "border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-750"
                      : "border-slate-300 text-slate-800 hover:bg-slate-50 dark:border-slate-750 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  <span>{flaggedQuestions[currentQuestion] ? "Flagged" : "Flag for review"}</span>
                </button>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-none border select-none ${
                    answers[currentQuestion] !== undefined
                      ? "bg-teal-50 dark:bg-teal-950/20 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {answers[currentQuestion] !== undefined ? "Answered" : "No response"}
                </span>
              </div>
            </div>

            {/* Listening Section Audio Player */}
            {audioAsset && (
              <div className="px-6 pt-4">
                <AudioPlayer audioUrl={audioAsset.url} />
              </div>
            )}

            {/* Listening Section Image Card - Sharp */}
            {imageAsset && (
              <div className="px-6 pt-4">
                <div className="border border-slate-200 dark:border-slate-800 rounded-none overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 p-4 flex justify-center shadow-none">
                  <img
                    src={imageAsset.url}
                    alt="Question Illustration"
                    className="max-w-full h-auto max-h-80 object-contain rounded-none"
                  />
                </div>
              </div>
            )}

            {/* Reading Section Passage - Sharp */}
            {question.passage && (
              <div className="px-6 pt-4">
                <div className="bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-none p-4">
                  <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-2 font-mono select-none">
                    PASSAGE
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line text-justify font-sans font-normal">
                    {question.passage.content}
                  </p>
                </div>
              </div>
            )}

            {/* Prompts context */}
            <div className="px-6 pt-4 pb-2">
              {question.context && (
                <p className="text-[10px] font-semibold dark:font-medium text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-1.5 font-mono select-none">
                  {question.context}
                </p>
              )}
              <h3 className="text-sm sm:text-base font-medium dark:font-normal text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {question.prompt}
              </h3>
            </div>

            {/* Options list exactly like Ayumu (Sharp check Indicators, uniform readable text colors) */}
            <div className="px-6 pb-6 pt-2">
              <div className="space-y-2">
                {question.options.map((option, idx) => {
                  const isChecked = answers[currentQuestion] === option.value;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(currentQuestion, option.value)}
                      className={`w-full flex items-center gap-3 rounded-none border px-4 py-3 text-left transition-colors cursor-pointer active:scale-[0.995] ${
                        isChecked
                          ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                      }`}
                    >
                      {/* Checkbox square indicator - Sharp */}
                      <span
                        className={`w-4 h-4 rounded-none border flex items-center justify-center shrink-0 transition-all ${
                          isChecked
                            ? "border-slate-900 dark:border-slate-100"
                            : "border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {isChecked && (
                          <span className="w-2.5 h-2.5 rounded-none bg-slate-900 dark:bg-slate-100 animate-scale-in"></span>
                        )}
                      </span>

                      <span className="text-xs sm:text-sm font-semibold dark:font-medium text-slate-800 dark:text-slate-200 mr-1 select-none font-mono">
                        {idx + 1}.
                      </span>
                      <span className="text-xs sm:text-sm font-medium dark:font-normal text-slate-800 dark:text-slate-200 font-sans">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation Action Footer - Sharped */}
          <div className="flex items-center justify-between mt-4 gap-2">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-none hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer font-mono"
            >
              Previous
            </button>
            <div className="flex gap-2 sm:gap-3">
              {currentQuestion < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestion((prev) => prev + 1)}
                  className="px-6 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-none transition-colors cursor-pointer font-mono"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={triggerSubmitConfirm}
                  className="px-6 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-none transition-colors cursor-pointer font-mono"
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Right Side Sidebar Navigator exactly like Ayumu but sharped */}
        <aside className="hidden sm:block w-72 lg:w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-4 flex flex-col shrink-0 overflow-y-auto scrollbar-thin">
          {renderQuestionNavigator()}
        </aside>
      </div>

      {/* Mobile Drawer Navigator Overlay - Sharped */}
      {showMobileNav && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowMobileNav(false)}
          />

          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-slate-900 p-4 flex flex-col overflow-y-auto shadow-xl z-10 animate-slide-in rounded-none">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
                Navigator
              </h3>
              <button
                onClick={() => setShowMobileNav(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {renderQuestionNavigator()}
          </div>
        </div>
      )}
    </div>
  );
}
