interface BadgeProps {
  label: string;
  variant?: "blue" | "green" | "yellow" | "red" | "gray";
}

export default function Badge({ label, variant = "gray" }: BadgeProps) {
  const variants = {
    blue: "bg-blue-900/50 text-blue-300 border-blue-700",
    green: "bg-green-900/50 text-green-300 border-green-700",
    yellow: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
    red: "bg-red-900/50 text-red-300 border-red-700",
    gray: "bg-gray-800 text-gray-300 border-gray-700",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${variants[variant]}`}
    >
      {label}
    </span>
  );
}
