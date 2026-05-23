interface LevelBadgeProps {
  level: string;
  size?: "sm" | "md" | "lg";
}

export default function LevelBadge({ level, size = "md" }: LevelBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  const colors: Record<string, string> = {
    N5: "bg-green-100 text-green-800 border-green-300",
    N4: "bg-blue-100 text-blue-800 border-blue-300",
    N3: "bg-amber-100 text-amber-800 border-amber-300",
    N2: "bg-orange-100 text-orange-800 border-orange-300",
    N1: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <span
      className={`inline-block rounded-full border font-semibold ${sizeClasses[size]} ${
        colors[level] || "bg-gray-100 text-gray-800 border-gray-300"
      }`}
    >
      {level}
    </span>
  );
}
