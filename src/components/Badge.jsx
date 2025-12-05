// src/components/Badge.jsx

export default function Badge({ 
  text, 
  variant = "primary",
  size = "md" 
}) {
  
  const variantStyles = {
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-cyan-100 text-cyan-800",
    gray: "bg-gray-100 text-gray-800",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span className={`
      inline-flex items-center justify-center
      font-semibold rounded-full
      ${variantStyles[variant]}
      ${sizeStyles[size]}
    `}>
      {text}
    </span>
  );
}