import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import ccLogo from '../../assets/cc.svg';

const AdminLoginModal = () => {
    const { isAdminLoginOpen, closeAdminLogin, adminLogin, getAdmins, openAdminDashboard } = useAuth();
    const { addNotification } = useNotification();
    const [email, setEmail] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await adminLogin(email, password);
            if (result.success) {
                addNotification(result.message, { type: 'success' });
                closeAdminLogin();
                openAdminDashboard();
                setEmail('');
                setPassword('');
            } else {
                setError(result.message || 'Invalid admin credentials');
            }
        } catch (err) {
            setError(err.message || 'Invalid admin credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const closeWithAnimation = () => {
        setIsClosing(true);
        window.setTimeout(() => {
            setIsClosing(false);
            closeAdminLogin();
        }, 260);
    };

    if (!isAdminLoginOpen) return null;

    return (
        <div className={`modal-overlay ${isClosing ? 'modal-closing' : ''}`} onClick={closeWithAnimation} style={{
            display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', zIndex: 1000, justifyContent: 'center', alignItems: 'center',
            animation: isClosing ? 'none' : 'fadeIn 0.3s ease-out'
        }}>
            <div className="modal-content login-box" onClick={(e) => e.stopPropagation()} style={{
                background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px',
                width: '90%', maxWidth: '420px', position: 'relative',
                animation: 'modalIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <button className="close-modal" onClick={closeWithAnimation} style={{
                    position: 'absolute', top: '14px', right: '18px', background: 'transparent', border: 'none',
                    color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem'
                }}>
                    &times;
                </button>

                <div className="login-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src={ccLogo} alt="CodeChef" className="login-logo" style={{ width: '95px', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }} />
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Admin Login</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>CodeChef Projects Department</p>
                </div>

                {error && <div className="error-message" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label htmlFor="adminEmail" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
                        <input
                            type="email"
                            id="adminEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@codechef-projects.com"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="adminPassword" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                        <div className="password-field" style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="adminPassword"
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
                </form>
            </div>
        </div>
    );
};

export default AdminLoginModal;
