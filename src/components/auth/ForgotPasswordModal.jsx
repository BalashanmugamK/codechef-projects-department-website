import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { fetchWithRetry } from '../../utils/api';
import ccLogo from '../../assets/cc.svg';

const ForgotPasswordModal = () => {
    const { isForgotPasswordOpen, closeForgotPassword, openLogin } = useAuth();
    const { addNotification } = useNotification();
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await fetchWithRetry('/api/auth/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (data.success) {
                addNotification('Password recovery email would be sent!', { type: 'info' });
                setSent(true);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Server error');
        }
    };

    const handleBackToLogin = () => {
        setSent(false);
        setEmail('');
        setError('');
        closeForgotPassword();
        openLogin();
    };

    const handleClose = () => {
        setSent(false);
        setEmail('');
        setError('');
        closeForgotPassword();
    };

    if (!isForgotPasswordOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose} style={{
            display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', zIndex: 1000, justifyContent: 'center', alignItems: 'center',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <div className="modal-content login-box" onClick={(e) => e.stopPropagation()} style={{
                background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px',
                width: '90%', maxWidth: '420px', position: 'relative',
                animation: 'modalIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <button className="close-modal" onClick={handleClose} style={{
                    position: 'absolute', top: '14px', right: '18px', background: 'transparent', border: 'none',
                    color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem'
                }}>
                    &times;
                </button>

                <div className="login-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src={ccLogo} alt="CodeChef" className="login-logo" style={{ width: '95px', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }} />
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Forgot Password</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Reset your account password</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label htmlFor="forgotEmail" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                        <input
                            type="email"
                            id="forgotEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        />
                        <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.5rem' }}>
                            Enter the email associated with your account
                        </small>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>
                        Send Recovery Email
                    </button>

                    <p className="login-note" style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Remember your password?{' '}
                        <button type="button" className="text-link" onClick={handleBackToLogin} style={{ color: 'var(--accent-primary)', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}>
                            Back to login
                        </button>
                    </p>
                </form>

                {error && (
                    <div style={{
                        marginTop: '1rem', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center',
                        color: 'var(--accent-error, #ef4444)', background: 'rgba(239, 68, 68, 0.1)'
                    }}>
                        {error}
                    </div>
                )}

                {sent && (
                    <div style={{
                        marginTop: '1rem', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center',
                        color: 'var(--accent-success, #10b981)', background: 'rgba(16, 185, 129, 0.1)'
                    }}>
                        ✓ Recovery email sent! Check your inbox for password reset instructions.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
