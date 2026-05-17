interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <input
        className={`bg-gray-800 border ${error ? "border-red-500" : "border-gray-700"} 
          rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500
          focus:outline-none focus:border-blue-500 transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
