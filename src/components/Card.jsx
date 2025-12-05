// src/components/Card.jsx

export default function Card({ 
  title, 
  children, 
  className = "",
  headerAction = null,
  footer = null,
  padding = true
}) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header */}
      {title && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      {/* Content */}
      <div className={padding ? "p-6" : ""}>
        {children}
      </div>
      
      {/* Footer */}
      {footer && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
}