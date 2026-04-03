import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import ccLogo from '../assets/cc.svg';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout, openLogin, openAdminLogin, openAdminDashboard } = useAuth();
    const { addNotification } = useNotification();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const location = useLocation();

    // Scroll tracking for active link highlighting
    const updateActiveLink = useCallback(() => {
        const sections = document.querySelectorAll('.section, .hero');
        const scrollPosition = window.scrollY + 120;

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.offsetTop <= scrollPosition) {
                setActiveSection(section.id);
                break;
            }
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            updateActiveLink();
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [updateActiveLink]);

    const closeMenu = () => setIsOpen(false);

    const handleUserLogin = () => {
        if (user && user.role === 'admin') {
            const confirmLogout = window.confirm(
                'You are currently logged in as admin. Logout admin session to open User Login?'
            );
            if (confirmLogout) {
                logout();
                openLogin();
            }
            return;
        }
        openLogin();
    };

    const handleNavClick = (e, id) => {
        closeMenu();
        if (location.pathname === '/') {
            e.preventDefault();
            const element = document.getElementById(id);
            if (element) {
                const navbar = document.querySelector('.navbar');
                const offset = navbar ? navbar.offsetHeight : 80;
                const targetPosition = element.offsetTop - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        }
    };

    const navLinks = [
        { name: 'Home', id: 'home' },
        { name: 'About', id: 'about' },
        { name: 'People', id: 'people' },
        { name: 'Events', id: 'events' },
        { name: 'Projects', id: 'projects' },
        { name: 'Research', id: 'research' },
        { name: 'Achievements', id: 'achievements' },
        { name: 'Game Dev', id: 'gamedev' },
        { name: 'Quest System', id: 'quest' }
    ];

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={() => window.scrollTo(0, 0)}>
                    <img src={ccLogo} alt="CodeChef Logo" className="logo-img" style={{ height: '60px', width: 'auto' }} loading="lazy" />
                    <span className="logo-text">Projects</span>
                </Link>

                {/* Desktop Menu - Also Mobile Menu when active */}
                <div className={`nav-menu ${isOpen ? 'active' : ''}`} id="navMenu">
                    {navLinks.map((link) => (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                            onClick={(e) => handleNavClick(e, link.id)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <a href="https://codechefvitcc.vercel.app/" target="_blank" rel="noopener noreferrer" className="nav-link">
                        Main Club ↗
                    </a>
                </div>

                {/* Controls */}
                <div className="nav-controls">
                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                        {theme === 'light' ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        )}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {user ? (
                            <>
                                {['admin', 'super-admin'].includes(user.role) && (
                                    <button onClick={openAdminDashboard} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                                        Dashboard
                                    </button>
                                )}
                                <span id="userProfile" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                                    👤 {user.name}
                                </span>
                                <button
                                    onClick={() => {
                                        logout();
                                        addNotification('Logged out Successfully!', { type: 'success' });
                                    }}
                                    className="btn btn-danger"
                                    title="Logout"
                                    id="userLogoutBtn"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn btn-secondary" onClick={handleUserLogin} id="userLoginBtn">
                                    👤 User Login
                                </button>
                                <button className="btn btn-primary" onClick={openAdminLogin} id="loginBtn">
                                    🔒 Admin
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                        {isOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;