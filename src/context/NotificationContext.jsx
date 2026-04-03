import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, options = {}) => {
    const id = Date.now();
    const notification = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration || 5000,
      autoClose: options.autoClose !== false,
      closable: options.closable !== false,
      icon: options.icon,
    };

    setNotifications((prev) => [...prev, notification]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success: (message, options) => addNotification(message, { ...options, type: 'success', icon: '✓' }),
    error: (message, options) => addNotification(message, { ...options, type: 'error', icon: '✕' }),
    warning: (message, options) => addNotification(message, { ...options, type: 'warning', icon: '⚠' }),
    info: (message, options) => addNotification(message, { ...options, type: 'info', icon: 'ℹ' }),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
