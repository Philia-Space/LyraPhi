"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { mondaiphiApi } from "@/lib/api";
import { DataTable, CrudForm } from "@philiaspace/phi-dashboard";
import type { ColumnDef, FormField } from "@philiaspace/phi-dashboard";

interface Question extends Record<string, unknown> {
  id: string;
  level: string;
  section: string;
  prompt: string;
  passage_id?: string;
  source_group_key?: string;
}

interface QuestionsResponse {
  questions: Question[];
  count: number;
}

type ModalMode = "create" | "edit" | null;

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, hasRole } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState("N3");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!isLoading && isAuthenticated && !hasRole("admin")) {
      router.push("/");
      return;
    }
  }, [isLoading, isAuthenticated, hasRole, router]);

  useEffect(() => {
    if (isAuthenticated && hasRole("admin")) {
      fetchQuestions();
    }
  }, [selectedLevel, isAuthenticated, hasRole]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mondaiphiApi.listQuestions({
        level: selectedLevel,
        limit: 50,
      }) as QuestionsResponse;
      setQuestions(data.questions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row: Question) => {
    if (!confirm(`Delete question ${row.id.slice(0, 16)}...? This cannot be undone.`)) {
      return;
    }
    try {
      await mondaiphiApi.adminDeleteQuestion(row.id);
      setQuestions((prev) => prev.filter((q) => q.id !== row.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleEdit = (row: Question) => {
    setEditingQuestion(row);
    setModalMode("edit");
    setFormError(null);
  };

  const handleCreate = () => {
    setEditingQuestion(null);
    setModalMode("create");
    setFormError(null);
  };

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setFormLoading(true);
    setFormError(null);
    try {
      if (modalMode === "edit" && editingQuestion) {
        await mondaiphiApi.adminUpdateQuestion(editingQuestion.id, {
          prompt: data.prompt as string,
          context: data.context as string,
          answer_value: data.answer_value as string,
          answer_note: data.answer_note as string,
        });
      } else if (modalMode === "create") {
        await mondaiphiApi.adminCreateQuestion({
          level: data.level as string,
          section: data.section as string,
          prompt: data.prompt as string,
          context: data.context as string,
          answer_value: data.answer_value as string,
          answer_note: data.answer_note as string,
          options: [
            { value: "1", label: data.option_1 as string || "Option 1", sort_order: 0 },
            { value: "2", label: data.option_2 as string || "Option 2", sort_order: 1 },
            { value: "3", label: data.option_3 as string || "Option 3", sort_order: 2 },
            { value: "4", label: data.option_4 as string || "Option 4", sort_order: 3 },
          ],
        });
      }
      setModalMode(null);
      setEditingQuestion(null);
      fetchQuestions();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setFormLoading(false);
    }
  };

  const columns: ColumnDef<Question>[] = [
    { key: "id", title: "ID", render: (row) => (
      <span className="font-mono text-xs text-slate-400">{row.id.slice(0, 16)}...</span>
    )},
    { key: "level", title: "Level" },
    { key: "section", title: "Section" },
    { key: "prompt", title: "Prompt", render: (row) => (
      <span className="line-clamp-2 max-w-md">{row.prompt}</span>
    )},
    { key: "passage_id", title: "Passage", render: (row) => (
      row.passage_id ? (
        <span className="font-mono text-xs text-blue-400">{row.passage_id.slice(0, 12)}...</span>
      ) : (
        <span className="text-slate-500">-</span>
      )
    )},
  ];

  const editFields: FormField[] = [
    { key: "prompt", label: "Prompt", type: "textarea", required: true, rows: 3 },
    { key: "context", label: "Context", type: "textarea", rows: 2 },
    { key: "answer_value", label: "Answer Value", type: "text", required: true },
    { key: "answer_note", label: "Answer Note", type: "textarea", rows: 2 },
  ];

  const createFields: FormField[] = [
    { key: "level", label: "Level", type: "select", required: true, options: [
      { value: "N5", label: "N5" },
      { value: "N4", label: "N4" },
      { value: "N3", label: "N3" },
      { value: "N2", label: "N2" },
      { value: "N1", label: "N1" },
    ]},
    { key: "section", label: "Section", type: "select", required: true, options: [
      { value: "grammar", label: "Grammar" },
      { value: "reading", label: "Reading" },
      { value: "listening", label: "Listening" },
    ]},
    { key: "prompt", label: "Prompt", type: "textarea", required: true, rows: 3 },
    { key: "context", label: "Context", type: "textarea", rows: 2 },
    { key: "answer_value", label: "Answer Value", type: "text", required: true },
    { key: "answer_note", label: "Answer Note", type: "textarea", rows: 2 },
    { key: "option_1", label: "Option 1", type: "text", required: true },
    { key: "option_2", label: "Option 2", type: "text", required: true },
    { key: "option_3", label: "Option 3", type: "text", required: true },
    { key: "option_4", label: "Option 4", type: "text", required: true },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm font-mono text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !hasRole("admin")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-widest font-mono uppercase text-slate-900 dark:text-slate-100">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono">
            Manage JLPT questions and content
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
            <div className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-500 dark:text-slate-400">
              Total Questions
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 mt-1">
              5,531
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
            <div className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-500 dark:text-slate-400">
              Passages
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 mt-1">
              381
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
            <div className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-500 dark:text-slate-400">
              Assets
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 mt-1">
              2,089
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
            <div className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-500 dark:text-slate-400">
              Templates
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 mt-1">
              1
            </div>
          </div>
        </div>

        {/* Level Filter + Create */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-500 dark:text-slate-400">
              Level:
            </span>
            <div className="flex gap-2">
              {["N5", "N4", "N3", "N2", "N1"].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`text-[10px] font-black uppercase tracking-widest font-mono px-3 py-1.5 border transition-all cursor-pointer ${
                    selectedLevel === level
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="text-[10px] font-black uppercase tracking-widest font-mono px-4 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-900 dark:border-slate-100 hover:opacity-80 transition-opacity cursor-pointer"
          >
            + New Question
          </button>
        </div>

        {/* Questions Table */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-mono">
            {error}
          </div>
        )}

        <DataTable
          data={questions}
          columns={columns}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="mt-8 text-[10px] font-mono text-slate-400">
          Logged in as: {user?.username} | Role: {user?.roles?.join(", ")}
        </div>
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-black tracking-widest font-mono uppercase text-slate-900 dark:text-slate-100">
                {modalMode === "edit" ? "Edit Question" : "Create Question"}
              </h2>
              <button
                onClick={() => { setModalMode(null); setEditingQuestion(null); }}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer text-lg leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              {formError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-mono">
                  {formError}
                </div>
              )}
              <CrudForm
                fields={modalMode === "edit" ? editFields : createFields}
                initialData={modalMode === "edit" && editingQuestion ? {
                  prompt: editingQuestion.prompt,
                } : undefined}
                onSubmit={handleFormSubmit}
                onCancel={() => { setModalMode(null); setEditingQuestion(null); }}
                loading={formLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
