import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          LyraPhi
        </Link>
        <div className="flex gap-4">
          <Link href="/exam" className="hover:text-blue-600">
            Exam
          </Link>
          <Link href="/leaderboard" className="hover:text-blue-600">
            Leaderboard
          </Link>
          <Link href="/profile" className="hover:text-blue-600">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
