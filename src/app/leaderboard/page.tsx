export default function LeaderboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>
      <div className="w-full max-w-3xl">
        <div className="flex gap-4 mb-6">
          {["All Time", "Weekly", "Monthly"].map((period) => (
            <button
              key={period}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100"
            >
              {period}
            </button>
          ))}
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-right">Score</th>
                <th className="px-4 py-3 text-right">Exams</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3">Raychi</td>
                <td className="px-4 py-3 text-right">2,340</td>
                <td className="px-4 py-3 text-right">34</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
