import { useEffect, useState } from 'react';
import { useNotification } from '../context/NotificationContext';

const NotificationCenter = () => {
  const { notifications, removeNotification } = useNotification();
  const [displayedNotifications, setDisplayedNotifications] = useState([]);

  useEffect(() => {
    setDisplayedNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    const timers = notifications.map((notif) => {
      if (notif.autoClose !== false) {
        return setTimeout(() => {
          removeNotification(notif.id);
        }, notif.duration || 5000);
      }
      return null;
    });

    return () => {
      timers.forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [notifications, removeNotification]);

  if (!displayedNotifications.length) return null;

  return (
    <div className="notification-container" style={styles.container}>
      {displayedNotifications.map((notif) => (
        <div
          key={notif.id}
          className={`notification notification-${notif.type}`}
          style={{
            ...styles.notification,
            ...styles[notif.type],
          }}
        >
          <div style={styles.content}>
            {notif.icon && <span style={styles.icon}>{notif.icon}</span>}
            <span>{notif.message}</span>
          </div>
          {notif.closable !== false && (
            <button
              onClick={() => removeNotification(notif.id)}
              style={styles.closeBtn}
              aria-label="Close notification"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: '100px',
    right: '20px',
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '400px',
  },
  notification: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    animation: 'slideInDown 0.4s ease-out',
    fontWeight: '500',
    color: 'white',
  },
  success: {
    background: '#10b981',
  },
  error: {
    background: '#ef4444',
  },
  warning: {
    background: '#f59e0b',
  },
  info: {
    background: '#3b82f6',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flex: 1,
  },
  icon: {
    fontSize: '1.25rem',
    flexShrink: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1.25rem',
    padding: '0 0 0 1rem',
    flexShrink: 0,
  },
};

export default NotificationCenter;
