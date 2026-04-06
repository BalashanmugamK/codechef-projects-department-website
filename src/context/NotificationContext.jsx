import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchWithRetry, API_URL } from '../utils/api';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const authContext = useAuth();
  const { user, token } = authContext || {};
  const [notifications, setNotifications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    if (!user || !token) return;

    try {
      setLoading(true);
      const data = await fetchWithRetry(`${API_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (data.success) {
        setAlerts(data.notifications.map(notification => ({
          id: notification._id,
          message: notification.message,
          type: 'info',
          read: false, // Backend handles read status
          createdAt: notification.sentAt,
          expiresAt: notification.expiresAt
        })));
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  // Auto-fetch notifications on mount and when user/token changes
  useEffect(() => {
    if (user && token) {
      fetchNotifications();
      // Set up periodic refresh every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, token, fetchNotifications]);

  const addNotification = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random();
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

  const addAlert = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random();
    const alert = {
      id,
      message,
      type: options.type || 'info',
      read: false,
      duration: options.duration || 10000,
      createdAt: new Date().toISOString(),
    };
    setAlerts((prev) => [alert, ...prev]);
    return id;
  }, []);

  const getUnreadCount = useCallback(() => alerts.filter((item) => !item.read).length, [alerts]);

  const markAlertRead = useCallback(async (id) => {
    if (!token) return;

    try {
      const data = await fetchWithRetry(`${API_URL}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (data.success) {
        setAlerts((prev) => prev.map((alert) =>
          alert.id === id ? { ...alert, read: true } : alert
        ));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [token]);

  const dismissAlert = useCallback(async (id) => {
    if (!token) return;

    try {
      const data = await fetchWithRetry(`${API_URL}/api/notifications/${id}/dismiss`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (data.success) {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      }
    } catch (error) {
      console.error('Failed to dismiss notification:', error);
    }
  }, [token]);

  const markAllAlertsRead = useCallback(async () => {
    if (!token) return;

    // Mark all alerts as read locally first for immediate UI feedback
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })));

    // Then mark each one as read on the backend
    const promises = alerts.map(alert => markAlertRead(alert.id));
    await Promise.all(promises);
  }, [alerts, markAlertRead, token]);

  const clearAlerts = useCallback(async () => {
    if (!token) return;

    const promises = alerts.map(alert =>
      fetchWithRetry(`${API_URL}/api/notifications/${alert.id}/dismiss`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
    );

    try {
      await Promise.all(promises);
      setAlerts([]);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
      fetchNotifications();
    }
  }, [alerts, token, fetchNotifications]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    alerts,
    addAlert,
    markAlertRead,
    dismissAlert,
    markAllAlertsRead,
    clearAlerts,
    getUnreadCount,
    fetchNotifications,
    loading,
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
