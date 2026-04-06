import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ccLogo from '../assets/cc.svg';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [footerCopy, setFooterCopy] = useState(
        'Building innovative solutions, conducting research, and fostering a collaborative environment for aspiring developers and tech enthusiasts.'
    );

    useEffect(() => {
        const updateFooter = () => {
            const storedContent = JSON.parse(localStorage.getItem('contentData')) || {};
            setFooterCopy(storedContent.footerText || 'Building innovative solutions, conducting research, and fostering a collaborative environment for aspiring developers and tech enthusiasts.');
        };

        updateFooter();
        window.addEventListener('contentUpdate', updateFooter);
        return () => window.removeEventListener('contentUpdate', updateFooter);
    }, []);
        'Building innovative solutions, conducting research, and fostering a collaborative environment for aspiring developers and tech enthusiasts.';

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-column footer-brand">
                        <div className="footer-logo">
                            <img src={ccLogo} alt="CodeChef Projects" className="footer-logo-img" />
                            <span className="footer-logo-text">Projects Department</span>
                        </div>
                        <p className="footer-description">
                            {footerCopy}
                        </p>
                        <div className="footer-social">
                            <a href="https://www.linkedin.com/company/codechef-vit-chapter" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM21 19h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                <span className="social-label">LinkedIn</span>
                            </a>
                            <a href="https://twitter.com/codechefvit" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                <span className="social-label">Twitter</span>
                            </a>
                            <a href="https://www.instagram.com/codechefvit" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                <span className="social-label">Instagram</span>
                            </a>
                            <a href="https://discord.gg/codechefvit" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Discord">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6516-.2472-1.2723-.5497-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.418-2.1568 2.4189z" /></svg>
                                <span className="social-label">Discord</span>
                            </a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h3 className="footer-heading">Quick Links</h3>
                        <ul className="footer-links">
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#people">Our Team</a></li>
                            <li><a href="#events">Events</a></li>
                            <li><a href="#projects">Projects</a></li>
                            <li><a href="#research">Research</a></li>
                            <li><a href="#achievements">Achievements</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3 className="footer-heading">Resources</h3>
                        <ul className="footer-links">
                            <li><a href="https://codechefvitcc.vercel.app/" target="_blank" rel="noopener noreferrer">Main Club ↗</a></li>
                            <li><Link to="/recruitment">Join Us</Link></li>
                            <li><a href="#gamedev">Game Dev Wing</a></li>
                            <li><a href="#quest">Quest System</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3 className="footer-heading">Contact</h3>
                        <ul className="footer-contact">
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <a href="mailto:codechef@vit.ac.in">codechef@vit.ac.in</a>
                            </li>
                            <li>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <a href="https://maps.app.goo.gl/ZUfAeCbCdkDdDFLf8" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>VIT University Chennai Campus, Vandalur-Kelambakkam Road, Chennai-600127, Tamil Nadu</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © <span id="currentYear">{currentYear}</span> CodeChef VIT Chennai - Projects Department. All rights reserved.
                    </p>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy Policy</a>
                        <span className="separator">•</span>
                        <a href="#">Terms of Service</a>
                        <span className="separator">•</span>
                        <a href="https://codechefvitcc.vercel.app/" target="_blank" rel="noopener noreferrer">Main Club ↗</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
