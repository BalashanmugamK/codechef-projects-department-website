import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import PasswordValidator from '../../utils/passwordValidator';
// import { motion, AnimatePresence } from 'framer-motion';
import ccLogo from '../../assets/cc.svg';

const SignupModal = () => {
    const { isSignupOpen, closeSignup, registerUser, openLogin } = useAuth();
    const { addNotification } = useNotification();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [strength, setStrength] = useState({ score: 0, strength: 'weak', feedback: [] });

    const handlePasswordChange = (e) => {
        const newPass = e.target.value;
        setPassword(newPass);
        if (newPass) {
            setStrength(PasswordValidator.validatePassword(newPass));
        } else {
            setStrength({ score: 0, strength: 'weak', feedback: [] });
        }
    };

    const getRequirements = () => [
        { id: 'length', label: '8+ characters', met: password.length >= 8 },
        { id: 'uppercase', label: 'Uppercase letter', met: /[A-Z]/.test(password) },
        { id: 'lowercase', label: 'Lowercase letter', met: /[a-z]/.test(password) },
        { id: 'number', label: 'Number', met: /\d/.test(password) },
        { id: 'special', label: 'Special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
    ];

    const getStrengthColor = () => {
        switch (strength.strength) {
            case 'weak': return '#ef4444';
            case 'fair': return '#f59e0b';
            case 'good': return '#eab308';
            case 'strong': return '#10b981';
            default: return '#ef4444';
        }
    };

    const getStrengthEmoji = () => {
        switch (strength.strength) {
            case 'weak': return '🔴';
            case 'fair': return '🟡';
            case 'good': return '🟠';
            case 'strong': return '🟢';
            default: return '🔴';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (strength.strength === 'weak') {
            setError('Password is too weak');
            setIsLoading(false);
            return;
        }

        try {
            await registerUser({ name, email, password });
            addNotification('Account created successfully! You can login.', { type: 'success' });
            closeSignup();
            openLogin();
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isSignupOpen) return null;

    return (
        <div className="modal-overlay" onClick={closeSignup} style={{
            display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', zIndex: 1000, justifyContent: 'center', alignItems: 'center',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <div className="modal-content login-box" onClick={(e) => e.stopPropagation()} style={{
                background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px',
                width: '90%', maxWidth: '450px', position: 'relative', overflowY: 'auto', maxHeight: '90vh',
                animation: 'modalIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <button className="close-modal" onClick={closeSignup} style={{
                    position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none',
                    color: 'var(--text-secondary)', cursor: 'pointer'
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className="login-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src={ccLogo} alt="CodeChef" className="login-logo" style={{ width: '60px', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }} />
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Join the CodeChef Community</p>
                </div>

                {error && <div className="error-message" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                        <div className="password-field">
                            <input
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                            />
                        </div>

                        {/* Password Strength Indicator */}
                        {password && (
                            <div className="password-strength-container" style={{ marginTop: '0.5rem' }}>
                                <div className="password-strength-text" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                    <span className="password-strength-label" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Password Strength:</span>
                                    <span className="password-strength-value" style={{ fontSize: '0.75rem', fontWeight: 600, color: getStrengthColor() }}>
                                        {getStrengthEmoji()} {strength.strength.charAt(0).toUpperCase() + strength.strength.slice(1)}
                                    </span>
                                </div>
                                <div className="password-strength-meter" style={{ display: 'flex', gap: '4px' }}>
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="password-strength-bar" style={{
                                            flex: 1, height: '4px', borderRadius: '2px',
                                            background: strength.score >= i * 25 ? getStrengthColor() : 'var(--bg-tertiary)',
                                            transition: 'background 0.3s ease'
                                        }} />
                                    ))}
                                </div>
                                <div className="password-requirements" style={{ marginTop: '0.5rem' }}>
                                    {getRequirements().map(req => (
                                        <div key={req.id} className={`requirement-item ${req.met ? 'met' : 'unmet'}`}
                                            style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.1rem 0', color: req.met ? 'var(--accent-success, #10b981)' : 'var(--text-secondary)' }}>
                                            <span className="requirement-icon" style={{ opacity: req.met ? 1 : 0.5 }}>{req.met ? '✓' : '✖'}</span>
                                            <span style={{ opacity: req.met ? 1 : 0.7 }}>{req.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Confirm Password</label>
                        <div className="password-field">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                            />
                        </div>
                        {confirmPassword && password !== confirmPassword && (
                            <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>Passwords do not match</p>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }} disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    <div className="login-note-container" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <p className="login-note">
                            Already have an account?{' '}
                            <button type="button" className="text-link" onClick={openLogin} style={{ color: 'var(--accent-primary)', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                Login here
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupModal;
