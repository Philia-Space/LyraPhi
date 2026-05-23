"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { shikenphiApi } from "@/lib/api";

interface Question {
  id: string;
  prompt: string;
  context?: string;
  options: Array<{
    id: string;
    value: string;
    label: string;
  }>;
}

export default function ExamSessionPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      const data = await shikenphiApi.getSession(sessionId);
      setSessionData(data.session);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to load session");
      setLoading(false);
    }
  };

  const handleAnswer = async (questionIndex: number, optionValue: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionValue }));

    try {
      await shikenphiApi.saveAnswer(sessionId, questionIndex, optionValue);
    } catch (err) {
      console.error("Failed to save answer:", err);
    }
  };

  const handleSubmit = async () => {
    if (!confirm("Are you sure you want to submit? You cannot change answers after submission.")) {
      return;
    }

    try {
      const result = await shikenphiApi.submitSession(sessionId);
      window.location.href = `/results/${sessionId}?score=${result.percentage}`;
    } catch (err: any) {
      setError(err.message || "Failed to submit exam");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <button
            onClick={() => window.location.href = "/exam"}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Exam Selection
          </button>
        </div>
      </div>
    );
  }

  // Placeholder question for demo
  const questions: Question[] = [
    {
      id: "qst_demo_1",
      prompt: "この文の意味として最も適当なものを選びなさい。\n日本語を勉強しています。",
      context: "Choose the best answer.",
      options: [
        { id: "opt_1", value: "1", label: "I am studying Japanese." },
        { id: "opt_2", value: "2", label: "I like Japanese food." },
        { id: "opt_3", value: "3", label: "I visited Japan last year." },
        { id: "opt_4", value: "4", label: "I want to go to Japan." },
      ],
    },
  ];

  const question = questions[currentQuestion];
  const totalQuestions = sessionData?.question_count || 1;

  return (
    <div className="flex min-h-screen">
      {/* Question Navigator Sidebar */}
      <div className="w-64 border-r bg-gray-50 p-4">
        <h3 className="font-semibold mb-4">Questions</h3>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: Math.min(totalQuestions, 75) }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuestion(i)}
              className={`w-8 h-8 rounded text-sm font-medium ${
                i === currentQuestion
                  ? "bg-blue-600 text-white"
                  : answers[i]
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-white border border-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span>Unanswered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>Current</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {totalQuestions}
              </span>
              <h2 className="text-xl font-semibold">
                {sessionData?.level} Level Exam
              </h2>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            {question.context && (
              <p className="text-gray-600 mb-4">{question.context}</p>
            )}
            <h3 className="text-lg font-medium mb-6">{question.prompt}</h3>

            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(currentQuestion, option.value)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                    answers[currentQuestion] === option.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-semibold mr-3">{option.value}.</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>

            {currentQuestion < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
