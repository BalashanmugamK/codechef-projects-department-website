import { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
  const { user } = useAuth();
  const { alerts, markAlertRead, dismissAlert, markAllAlertsRead, clearAlerts, getUnreadCount, loading } = useNotification();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const unreadCount = getUnreadCount();

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const onItemClick = (alertId) => {
    markAlertRead(alertId);
  };

  const onDismissClick = (e, alertId) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    dismissAlert(alertId);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={handleToggle}
        style={{
          background: 'var(--accent-primary-light)',
          border: '2px solid var(--accent-primary)',
          cursor: 'pointer',
          position: 'relative',
          padding: '0.6rem 0.8rem',
          fontSize: '1.3rem',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          boxShadow: unreadCount > 0 ? '0 4px 12px rgba(255, 107, 53, 0.3)' : 'none',
          transform: unreadCount > 0 ? 'scale(1.05)' : 'scale(1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label="Toggle notifications"
        title={unreadCount > 0 ? `${unreadCount} new notification(s)` : 'Notifications'}
        onMouseEnter={(e) => {
          if (unreadCount > 0) e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = unreadCount > 0 ? 'scale(1.05)' : 'scale(1)';
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', 
            top: '-8px', 
            right: '-8px',
            width: '24px', 
            height: '24px',
            background: 'linear-gradient(135deg, #ff6b35, #f03a2f)',
            borderRadius: '50%',
            color: 'white',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            border: '2px solid white',
            boxShadow: '0 2px 8px rgba(255, 107, 53, 0.4)',
            animation: 'pulse 2s infinite'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          marginTop: '0.6rem',
          width: '360px',
          maxHeight: '450px',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-secondary)',
          border: '2px solid var(--accent-primary)',
          borderRadius: '12px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--border-color)' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: '600' }}>
              🔔 Notifications
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={markAllAlertsRead}
                disabled={loading || alerts.length === 0}
                className="btn btn-secondary"
                style={{
                  fontSize: '0.8rem',
                  padding: '0.4rem 0.8rem',
                  opacity: loading || alerts.length === 0 ? 0.5 : 1,
                  cursor: loading || alerts.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Mark all read
              </button>
              <button
                onClick={clearAlerts}
                disabled={loading || alerts.length === 0}
                className="btn btn-secondary"
                style={{
                  fontSize: '0.8rem',
                  padding: '0.4rem 0.8rem',
                  opacity: loading || alerts.length === 0 ? 0.5 : 1,
                  cursor: loading || alerts.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Clear all
              </button>
            </div>
          </div>

          {loading && alerts.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1.5rem' }}>
              ⏳ Loading notifications...
            </p>
          )}

          {!loading && alerts.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1.5rem' }}>
              📭 No notifications yet
            </p>
          )}

          {alerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                border: '2px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.8rem',
                marginBottom: '0.6rem',
                backgroundColor: alert.read ? 'var(--bg-primary)' : 'rgba(255, 107, 53, 0.08)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s ease',
                borderLeft: alert.read ? '4px solid transparent' : '4px solid var(--accent-primary)',
                boxShadow: alert.read ? 'none' : '0 2px 8px rgba(255, 107, 53, 0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = alert.read ? 'none' : '0 2px 8px rgba(255, 107, 53, 0.15)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div
                  onClick={() => onItemClick(alert.id)}
                  style={{ flex: 1 }}
                >
                  <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                    {new Date(alert.createdAt).toLocaleString()}
                  </small>
                  <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>
                    {alert.message}
                  </p>
                </div>
                <button
                  onClick={(e) => onDismissClick(e, alert.id)}
                  style={{
                    background: 'rgba(255, 107, 53, 0.1)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    color: 'var(--accent-error)',
                    padding: '0.3rem 0.5rem',
                    marginLeft: '0.5rem',
                    borderRadius: '6px',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    fontWeight: 'bold'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 107, 53, 0.25)';
                    e.target.style.transform = 'scale(1.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 107, 53, 0.1)';
                    e.target.style.transform = 'scale(1)';
                  }}
                  title="Dismiss notification"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
