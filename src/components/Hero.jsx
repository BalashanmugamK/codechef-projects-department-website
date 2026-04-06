import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Hero = () => {
    const codeRef = useRef(null);
    const cursorRef = useRef(null);
    const [content, setContent] = useState({
        heroTitle: 'Projects Department',
        heroSubtitle: 'Building real-world applications, research-driven solutions, and collaborative software systems',
        heroButtonText: 'Join Our Team',
        heroButtonLink: '/recruitment'
    });
    const [showLoginHint, setShowLoginHint] = useState(false);
    const { user, openLogin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const storedContent = JSON.parse(localStorage.getItem('contentData')) || {};
        if (storedContent && Object.keys(storedContent).length > 0) {
            setContent(prev => ({ ...prev, ...storedContent }));
            return;
        }

        setContent({
            heroTitle: 'Projects Department',
            heroSubtitle: 'Building real-world applications, research-driven solutions, and collaborative software systems',
            heroButtonText: 'Join Our Team',
            heroButtonLink: '/recruitment'
        });
    }, []);

    const codeLines = [
        "const Projects = {",
        "  innovation: 'limitless',",
        "  collaboration: 'essential',",
        "  impact: 'global'",
        "};"
    ];

    const getColorForToken = useCallback((token) => {
        if (/^(const|let|var)$/.test(token)) return '#ec2395';
        if (/^[A-Z]/.test(token)) return '#45d9fa';
        if (/^[a-z_]/.test(token)) return '#00ff88';
        if (/^['"]/.test(token)) return '#ffa500';
        return '#ffffff';
    }, []);

    const tokenizeLine = useCallback((line) => {
        const tokens = [];
        let current = '';
        let inString = false;
        let stringChar = '';

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if ((char === '"' || char === "'") && !inString) {
                if (current) tokens.push({ text: current, color: getColorForToken(current) });
                current = '';
                inString = true;
                stringChar = char;
                current += char;
            } else if (char === stringChar && inString && line[i - 1] !== '\\') {
                current += char;
                tokens.push({ text: current, color: '#ffa500' });
                current = '';
                inString = false;
            } else if (inString) {
                current += char;
            } else if (/[\s:{}[\]=,;]/.test(char)) {
                if (current) tokens.push({ text: current, color: getColorForToken(current) });
                tokens.push({ text: char, color: '#8c00ff' });
                current = '';
            } else {
                current += char;
            }
        }
        if (current) tokens.push({ text: current, color: getColorForToken(current) });
        return tokens;
    }, [getColorForToken]);

    const updateCursorPosition = useCallback(() => {
        if (!cursorRef.current || !codeRef.current) return;

        const anchor = codeRef.current.querySelector('.caret-anchor');
        const card = codeRef.current;

        if (!cursorRef.current || !card) return;
        if (!anchor) {
            if (cursorRef.current) {
                cursorRef.current.style.left = '12px';
                cursorRef.current.style.top = '12px';
            }
            return;
        }

        requestAnimationFrame(() => {
            const anchorRect = anchor.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();

            const left = Math.max(8, anchorRect.left - cardRect.left + anchorRect.width);
            const top = Math.max(8, anchorRect.top - cardRect.top);

            if (cursorRef.current) {
                cursorRef.current.style.left = left + 'px';
                cursorRef.current.style.top = top + 'px';

                if (cursorRef.current.style.opacity === '0') {
                    cursorRef.current.style.opacity = '1';
                }
            }
        });
    }, []);

    const wait = (ms) => new Promise((res) => setTimeout(res, ms));

    useEffect(() => {
        let mounted = true;

        const typeBlock = async () => {
            if (!codeRef.current) return;

            const preElement = codeRef.current.querySelector('.code-output');
            if (!preElement) return;

            // Clear content but keep the cursor
            preElement.textContent = '';

            for (let lineIdx = 0; lineIdx < codeLines.length; lineIdx++) {
                const line = codeLines[lineIdx];
                const tokens = tokenizeLine(line);

                for (let tokenIdx = 0; tokenIdx < tokens.length; tokenIdx++) {
                    const token = tokens[tokenIdx];

                    for (let charIdx = 0; charIdx < token.text.length; charIdx++) {
                        if (!mounted) return;

                        const char = token.text[charIdx];
                        const charSpan = document.createElement('span');
                        charSpan.style.color = token.color;
                        charSpan.textContent = char;

                        if (preElement) {
                            preElement.appendChild(charSpan);

                            // Ensure caret anchor exists at end
                            let anchor = preElement.querySelector('.caret-anchor');
                            if (!anchor) {
                                anchor = document.createElement('span');
                                anchor.className = 'caret-anchor';
                                anchor.style.display = 'inline-block';
                                anchor.style.width = '0px';
                                anchor.style.height = '1em';
                                preElement.appendChild(anchor);
                            } else {
                                preElement.appendChild(anchor);
                            }

                            updateCursorPosition();
                        }
                        await wait(30 + Math.random() * 40);
                    }
                }

                // Add line break
                if (lineIdx < codeLines.length - 1 && preElement) {
                    const br = document.createElement('br');
                    preElement.appendChild(br);
                }
                await wait(600);
            }
        };

        const clearBlock = async () => {
            if (!codeRef.current) return;
            const preElement = codeRef.current.querySelector('.code-output');
            if (!preElement) return;
            preElement.textContent = '';
            updateCursorPosition();
        };

        const typeLoop = async () => {
            await wait(1000);

            while (mounted) {
                await typeBlock();
                await wait(2000);
                await clearBlock();
                await wait(600);
            }
        };

        typeLoop();
        return () => { mounted = false; };
    }, [tokenizeLine, updateCursorPosition]);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const blobs = document.querySelectorAll('.gradient-blob');
            if (blobs && blobs.length > 0) {
                blobs.forEach((blob, index) => {
                    if (blob) {
                        const yPos = scrolled * (0.5 + index * 0.2);
                        blob.style.transform = `translateY(${yPos}px)`;
                    }
                });
            }
        };

        const updateContent = () => {
            const storedContent = JSON.parse(localStorage.getItem('contentData')) || {};
            if (storedContent && Object.keys(storedContent).length > 0) {
                setContent(prev => ({ ...prev, ...storedContent }));
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('contentUpdate', updateContent);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('contentUpdate', updateContent);
        };
    }, []);

    const { addNotification } = useNotification();

    const handleHeroCTA = (event) => {
        event.preventDefault();

        if (user && ['admin', 'super-admin'].includes(user.role)) {
            addNotification('You are already an admin and part of the team!', { type: 'info' });
            return;
        }

        if (!user) {
            addNotification('Login to Apply for Recruitment', { type: 'warning' });
            openLogin();
            return;
        }

        const url = content.heroButtonLink || '/recruitment';
        if (url.startsWith('http')) {
            window.location.href = url;
        } else if (url.startsWith('#')) {
            const target = document.querySelector(url);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate(url);
        }
    };

    return (
        <section className="hero" id="home">
            <div className="hero-background">
                <div className="gradient-blob blob-1"></div>
                <div className="gradient-blob blob-2"></div>
                <div className="gradient-blob blob-3"></div>
            </div>

            <div className="hero-content">
                <div className="hero-text">
                    <h1 className="hero-title">
                        <span className="text-animate word-1">Welcome to</span>
                        <span className="text-animate word-2 highlight">{content?.heroTitle || 'Projects Department'}</span>
                    </h1>
                    <p className="hero-subtitle">{content?.heroSubtitle || 'Building real-world applications, research-driven solutions, and collaborative software systems'}</p>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">50+</span>
                            <span className="stat-label">Members</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">20+</span>
                            <span className="stat-label">Projects</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">10+</span>
                            <span className="stat-label">Research Papers</span>
                        </div>
                    </div>
                    <div className="hero-buttons">
                        <a id="joinTeamBtn" href={content.heroButtonLink || '/recruitment'} onClick={handleHeroCTA} className="btn btn-primary btn-lg">
                            {content.heroButtonText || 'Join Our Team'}
                        </a>
                        <a href="#projects" className="btn btn-secondary btn-lg">Explore Projects</a>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="code-card" ref={codeRef} style={{ position: 'relative' }}>
                        <pre className="code-output" style={{ margin: 0 }}>
                        </pre>
                        <span className="typing-cursor" ref={cursorRef} aria-hidden="true" style={{ position: 'absolute', left: '12px', top: '12px' }}>▍</span>
                    </div>
                </div>
            </div>

            <div className="scroll-indicator">
                <span>Scroll to explore</span>
                <div className="mouse-scroll">
                    <div className="scroll-wheel"></div>
                </div>
            </div>

            {showLoginHint && (
                <div className="modal-overlay" onClick={() => setShowLoginHint(false)}>
                    <div className="modal-content hero-login-modal" onClick={(event) => event.stopPropagation()}>
                        <button className="close-modal" onClick={() => setShowLoginHint(false)} aria-label="Close login prompt">&times;</button>
                        <div className="hero-login-icon" aria-hidden="true">Login</div>
                        <h3 className="hero-login-title">Login Required</h3>
                        <p className="hero-login-text">You must be logged in to access the recruitment application process.</p>
                        <div className="hero-login-actions">
                            <button className="btn btn-primary btn-block" onClick={() => { setShowLoginHint(false); openLogin(); }}>
                                Login Now
                            </button>
                            <button className="btn btn-secondary btn-block" onClick={() => setShowLoginHint(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Hero;