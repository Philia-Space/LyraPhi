export default function ExamPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">JLPT Exam</h1>
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Level</h2>
          <div className="grid grid-cols-5 gap-4">
            {["N5", "N4", "N3", "N2", "N1"].map((level) => (
              <button
                key={level}
                className={`p-4 rounded-lg border-2 font-bold transition-all hover:scale-105 bg-white`}
                style={{
                  borderColor: `var(--jlpt-${level.toLowerCase()})`,
                  color: `var(--jlpt-${level.toLowerCase()})`,
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-8 p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Each exam contains questions from Grammar, Reading, and Listening sections</li>
            <li>You can flag questions for review</li>
            <li>Timer is displayed but not enforced server-side</li>
            <li>Results are shown immediately after submission</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
