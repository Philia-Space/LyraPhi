export default function ProfilePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <div className="w-full max-w-2xl space-y-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-gray-500">Total Exams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">68.5%</div>
              <div className="text-sm text-gray-500">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm text-gray-500">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">Scholar</div>
              <div className="text-sm text-gray-500">Rank</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
