// src/components/Button.jsx

export default function Button({ 
  label, 
  onClick, 
  variant = "primary", 
  disabled = false,
  icon = null,
  fullWidth = false,
  size = "md",
  type = "button"
}) {
  
  // Variant styles
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    info: "bg-cyan-600 hover:bg-cyan-700 text-white",
    outline: "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300",
  };

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const baseStyles = "rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2";
  const disabledStyles = "opacity-50 cursor-not-allowed";
  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyles}
        ${disabled ? disabledStyles : ""}
      `}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}