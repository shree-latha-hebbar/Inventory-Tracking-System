import React, { useEffect } from 'react';

/**
 * Reusable Toast Notification Component
 * 
 * @param {string} message - The message to display
 * @param {string} type - 'success' or 'error' (default: 'success')
 * @param {function} onClose - Callback to close the toast
 */
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    console.log("Toast mounted:", message);
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose, message]);

  const bgColor = type === 'success' ? '#16a34a' : '#dc2626'; // Green-600 or Red-600
  const icon = type === 'success' ? '✅' : '❌';

  return (
    <div 
      className="it-slide-in"
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 9999,
        pointerEvents: "auto"
      }}
    >
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          minWidth: "300px",
          background: bgColor,
          color: "#fff",
          padding: "16px 20px",
          borderRadius: "12px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <span style={{ fontSize: "1.25rem", marginRight: "12px" }}>{icon}</span>
        <div style={{ flex: 1, fontWeight: "700", fontSize: "0.9rem" }}>
          {message}
        </div>
        <button 
          onClick={onClose}
          style={{
            marginLeft: "16px",
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "#fff",
            width: "24px",
            height: "24px",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem"
          }}
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
