interface LevelBadgeProps {
  level: string;
  size?: "sm" | "md" | "lg";
}

export default function LevelBadge({ level, size = "md" }: LevelBadgeProps) {
  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5 tracking-wider font-bold",
    md: "text-xs px-2.5 py-1 tracking-widest font-black",
    lg: "text-sm px-4 py-1.5 tracking-widest font-black",
  };

  const colors: Record<string, string> = {
    N5: "bg-green-50 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-900/50",
    N4: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-900/50",
    N3: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/50",
    N2: "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/20 dark:text-orange-300 dark:border-orange-900/50",
    N1: "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-300 dark:border-red-900/50",
  };

  return (
    <span
      className={`inline-block rounded-none border font-mono uppercase ${sizeClasses[size]} ${
        colors[level] || "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
      }`}
    >
      {level}
    </span>
  );
}
