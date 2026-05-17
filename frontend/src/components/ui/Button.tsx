interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost";
  isLoading?: boolean;
}

export default function Button({
  variant = "primary",
  isLoading,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    ghost: "bg-gray-800 hover:bg-gray-700 text-gray-200",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
