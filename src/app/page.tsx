"use client";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-sans text-sm">
        {/* Academic Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-widest font-mono uppercase text-slate-800 dark:text-white border-b-4 border-slate-800 dark:border-white pb-3 inline-block">
            LYRAPHI
          </h1>
          <p className="text-sm sm:text-base font-mono uppercase font-black tracking-widest text-slate-500 dark:text-slate-400 mt-2">
            Professional JLPT Assessment Platform
          </p>
        </div>

        {/* Module Cards Grid — 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Archive Card — Main entry, MODULE 01 */}
          <a
            href="/archive"
            className="group block border-2 border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-900/10 p-6 transition-all duration-200 hover:border-amber-500 dark:hover:border-amber-400 hover:scale-[1.02] rounded-none cursor-pointer"
          >
            <div className="flex flex-col h-full justify-between gap-4">
              <div>
                <h2 className="text-xs font-mono font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-amber-600 transition-colors mb-2">
                  MODULE 01
                </h2>
                <h3 className="text-lg font-black uppercase tracking-wider font-mono text-slate-800 dark:text-slate-100">
                  EXAM ARCHIVE
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2 font-medium">
                  Browse real JLPT exams by year (2010–2025). Questions in original chronological order — or pick a random practice.
                </p>
              </div>
              <div className="text-xs font-mono font-black uppercase tracking-widest text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-2">
                Browse Archive
                <span className="inline-block transition-transform group-hover:translate-x-1 duration-200">
                  &rarr;
                </span>
              </div>
            </div>
          </a>

          {/* Leaderboard Card */}
          <a
            href="/leaderboard"
            className="group block border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all duration-200 hover:border-slate-800 dark:hover:border-slate-300 hover:scale-[1.02] rounded-none cursor-pointer"
          >
            <div className="flex flex-col h-full justify-between gap-4">
              <div>
                <h2 className="text-xs font-mono font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors mb-2">
                  MODULE 02
                </h2>
                <h3 className="text-lg font-black uppercase tracking-wider font-mono text-slate-800 dark:text-slate-100">
                  LEADERBOARD
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2 font-medium">
                  Compare results, average accuracy, and total scores globally. Compete for the best scores in N5–N1 levels.
                </p>
              </div>
              <div className="text-xs font-mono font-black uppercase tracking-widest text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-2">
                View Rankings
                <span className="inline-block transition-transform group-hover:translate-x-1 duration-200">
                  &rarr;
                </span>
              </div>
            </div>
          </a>

          {/* Profile Card */}
          <a
            href="/profile"
            className="group block border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all duration-200 hover:border-slate-800 dark:hover:border-slate-300 hover:scale-[1.02] rounded-none cursor-pointer"
          >
            <div className="flex flex-col h-full justify-between gap-4">
              <div>
                <h2 className="text-xs font-mono font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors mb-2">
                  MODULE 03
                </h2>
                <h3 className="text-lg font-black uppercase tracking-wider font-mono text-slate-800 dark:text-slate-100">
                  USER PROFILE
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2 font-medium">
                  Review academic history, XP points accumulation, learning streaks, exam completion stats, and rank tier progress.
                </p>
              </div>
              <div className="text-xs font-mono font-black uppercase tracking-widest text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-2">
                Check Progress
                <span className="inline-block transition-transform group-hover:translate-x-1 duration-200">
                  &rarr;
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* Small Footer Detail */}
        <div className="text-center mt-20 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
          Secure Academic Authentication Console &copy; 2026 LyraPhi
        </div>
      </div>
    </main>
  );
}
