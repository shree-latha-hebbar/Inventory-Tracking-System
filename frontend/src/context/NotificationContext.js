import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    // Auto hide after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          animation: 'slideIn 0.3s ease-out forwards',
        }}>
          <div style={{
            background: notification.type === 'success' ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #dc2626, #ef4444)',
            color: '#fff',
            padding: '16px 24px',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: '800',
            fontSize: '0.95rem',
            minWidth: '300px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <span style={{ fontSize: '1.2rem' }}>{notification.type === 'success' ? '✅' : '❌'}</span>
            {notification.message}
          </div>
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </NotificationContext.Provider>
  );
};
