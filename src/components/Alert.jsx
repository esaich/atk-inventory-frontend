// src/components/Alert.jsx

export default function Alert({ 
  type = "info", 
  message, 
  onClose,
  closable = false 
}) {
  
  const styles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-500",
      text: "text-green-800",
      icon: "✅"
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-500",
      text: "text-red-800",
      icon: "❌"
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-500",
      text: "text-yellow-800",
      icon: "⚠️"
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-500",
      text: "text-blue-800",
      icon: "ℹ️"
    }
  };

  const style = styles[type];

  return (
    <div className={`${style.bg} ${style.text} border-2 ${style.border} rounded-lg p-4 flex items-start gap-3`}>
      <span className="text-xl">{style.icon}</span>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {closable && (
        <button
          onClick={onClose}
          className={`${style.text} hover:opacity-70 font-bold text-lg`}
        >
          ×
        </button>
      )}
    </div>
  );
}