import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import ccLogo from '../../assets/cc.svg';

const LoginModal = () => {
    const { isLoginOpen, closeLogin, login, openSignup, openForgotPassword } = useAuth();
    const { addNotification } = useNotification();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                const message = result.message || `Welcome back, ${result.user.name}!`;
                addNotification(message, { type: 'success' });
                closeLogin();
                setEmail('');
                setPassword('');
                return;
            }

            setError(result.message || 'Server error. Try again.');
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Invalid email or password');
            } else {
                setError('Server error. Try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const [isClosing, setIsClosing] = useState(false);

    const closeWithAnimation = () => {
        setIsClosing(true);
        window.setTimeout(() => {
            setIsClosing(false);
            closeLogin();
        }, 260);
    };

    if (!isLoginOpen) return null;

    return (
        <div className={`modal-overlay ${isClosing ? 'modal-closing' : ''}`} onClick={closeWithAnimation} style={{
            display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', zIndex: 1000, justifyContent: 'center', alignItems: 'center',
            animation: isClosing ? 'none' : 'fadeIn 0.3s ease-out'
        }}>
            <div className="modal-content login-box" onClick={(e) => e.stopPropagation()} style={{
                background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px',
                width: '90%', maxWidth: '420px', position: 'relative',
                animation: 'modalIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                maxHeight: '90vh', overflowY: 'auto'
            }}>
                <button className="close-modal" onClick={closeWithAnimation} style={{
                    position: 'absolute', top: '14px', right: '18px', background: 'transparent', border: 'none',
                    color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem'
                }}>
                    &times;
                </button>

                <div className="login-header" style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
                    <img src={ccLogo} alt="CodeChef" className="login-logo" style={{ width: '95px', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }} />
                    <h2 style={{ fontSize: '1.3rem', marginBottom: '0.35rem' }}>User Login</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Access your profile and contributions</p>
                </div>

                {error && <div className="error-message" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                        <label htmlFor="userEmail" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
                        <input
                            type="email"
                            id="userEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="userPassword" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                        <div className="password-field" style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="userPassword"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{ flex: 1, width: '100%', padding: '0.75rem', paddingRight: '45px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute', right: '12px', background: 'none', border: 'none',
                                    cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', padding: '5px',
                                    height: '30px', width: '30px', zIndex: 10
                                }}
                            >
                                {showPassword ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }} disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="login-note-container" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <p className="login-note" style={{ marginBottom: '0.5rem' }}>
                            Don't have an account?{' '}
                            <button type="button" className="text-link" onClick={openSignup} style={{ color: 'var(--accent-primary)', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                Sign up here
                            </button>
                        </p>
                        <p className="login-note">
                            <button type="button" className="text-link" onClick={openForgotPassword} style={{ color: 'var(--accent-primary)', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                Forgot password?
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
