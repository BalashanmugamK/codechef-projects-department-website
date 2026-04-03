import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import ccLogo from '../assets/cc.svg';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ROLE_OPTIONS = [
    { value: 'frontend', label: 'Frontend Developer' },
    { value: 'backend', label: 'Backend Developer' },
    { value: 'fullstack', label: 'Full Stack Developer' },
    { value: 'gamedev', label: 'Game Developer' },
    { value: 'research', label: 'Researcher' },
    { value: 'designer', label: 'UI/UX Designer' }
];

const REQUIREMENTS = [
    'Strong problem-solving and coding skills',
    'Passion for learning new technologies',
    'Collaborative team player mindset',
    'Commitment to code quality and best practices',
    'Initiative to take on challenging projects',
    'Good communication and documentation skills'
];

const Recruitment = () => {
    const { user, openLogin } = useAuth();
    const { toggleTheme } = useTheme();
    const [submitted, setSubmitted] = useState(false);
    const [showBooking, setShowBooking] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [bookingMsg, setBookingMsg] = useState('');
    const [interviewSlots, setInterviewSlots] = useState([]);
    const [existingBookings, setExistingBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [systemConfig, setSystemConfig] = useState({ recruitmentOpen: true, maintenanceMode: false });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        semester: '',
        role: '',
        skills: '',
        experience: '',
        portfolio: '',
        linkedin: ''
    });

    const { addNotification } = useNotification();

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    useEffect(() => {
        const fetchSystemConfig = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/system`);
                const data = await response.json();
                if (data.success && data.system) {
                    setSystemConfig({
                        recruitmentOpen: data.system.recruitmentOpen ?? true,
                        maintenanceMode: data.system.maintenanceMode ?? false
                    });
                }
            } catch (err) {
                console.error('Failed to fetch system state:', err);
            }
        };

        fetchSystemConfig();
    }, []);

    useEffect(() => {
        if (submitted) {
            fetchInterviewSlots();
        }
    }, [submitted]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const fetchInterviewSlots = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/interview-slots`);
            const data = await response.json();
            if (data.success) {
                setInterviewSlots(data.slots);
                if (data.slots.length > 0) {
                    await fetchUserBookings();
                    setShowBooking(true);
                }
            }
        } catch (err) {
            console.error('Failed to fetch interview slots:', err);
            setError('Failed to fetch interview slots');
        }
    };

    const fetchUserBookings = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/${formData.email}`);
            const data = await response.json();
            if (data.success) {
                setExistingBookings(data.bookings);
            }
        } catch (err) {
            console.error('Failed to fetch user bookings:', err);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (systemConfig.maintenanceMode) {
            setError('Recruitment is temporarily unavailable because maintenance mode is enabled.');
            return;
        }

        if (!systemConfig.recruitmentOpen) {
            setError('Recruitment is currently closed. Please check back later.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setSubmitted(true);
                addNotification('Application submitted successfully! We will contact you soon.', 'success', 3000);
            } else {
                setError(data.message || 'Failed to submit application');
                addNotification(data.message || 'Failed to submit application', 'error', 3000);
            }
        } catch (err) {
            console.error('Application error:', err);
            setError(err.message || 'Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmBooking = async () => {
        if (!selectedSlot) {
            setBookingMsg('Please select a slot.');
            return;
        }

        const slotParts = selectedSlot.split('|');
        if (slotParts.length !== 2) {
            setBookingMsg('Invalid slot format. Please try again.');
            return;
        }

        const [date, time] = slotParts;
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: formData.email, date, time })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setBookingMsg(`Booked: ${date} @ ${time}`);
                setSelectedSlot('');
                await fetchUserBookings();
                setTimeout(() => {
                    setSubmitted(true);
                    setShowBooking(false);
                }, 1500);
            } else {
                setBookingMsg(data.message || 'Failed to book slot');
            }
        } catch (err) {
            console.error('Booking error:', err);
            setBookingMsg(err.message || 'Failed to book slot. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStatusCard = (title, text) => (
        <div className="recruitment-status-card">
            <h2>{title}</h2>
            <p>{text}</p>
        </div>
    );

    return (
        <div className="recruitment-page">
            <nav className="navbar" id="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo" title="Back to Home">
                        <img src={ccLogo} alt="CodeChef Logo" className="logo-img" style={{ height: '60px', width: 'auto' }} loading="lazy" />
                        <span className="logo-text">Projects</span>
                    </Link>

                    <div className="nav-controls">
                        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark/Light Mode" aria-label="Theme Toggle">
                            <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                            <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        </button>
                        <Link to="/" className="btn btn-secondary">← Back Home</Link>
                    </div>
                </div>
            </nav>

            <div className={`recruitment-wrapper ${!user ? 'blurred-content' : ''}`}>
                <Link to="/" className="back-link">
                    <span>←</span> Back to Homepage
                </Link>

                <div className="recruitment-header">
                    <h1>Join Our Team</h1>
                    <p>
                        Be part of a passionate community building innovative solutions,
                        conducting research, and pushing the boundaries of technology
                    </p>
                </div>

                <div className="recruitment-container">
                    <div className="recruitment-info">
                        <h2>Why Join Us?</h2>
                        <p>
                            CodeChef Projects Department is a hub for innovation and collaboration.
                            We work on cutting-edge projects, explore emerging technologies, and create
                            impactful solutions that matter.
                        </p>

                        <h3 className="recruitment-subheading">We're Looking For:</h3>
                        <ul className="requirements-list">
                            {REQUIREMENTS.map((item) => <li key={item}>{item}</li>)}
                        </ul>

                        <h3 className="recruitment-subheading">Available Roles:</h3>
                        <ul className="requirements-list">
                            {ROLE_OPTIONS.map((role) => <li key={role.value}>{role.label}</li>)}
                        </ul>
                    </div>

                    <div className="recruitment-form-container">
                        {systemConfig.maintenanceMode ? renderStatusCard('Maintenance Mode', 'Recruitment is temporarily paused while maintenance mode is enabled.') : null}
                        {!systemConfig.maintenanceMode && !systemConfig.recruitmentOpen ? renderStatusCard('Recruitment Closed', 'Applications are currently closed. Please check back later.') : null}

                        {!systemConfig.maintenanceMode && systemConfig.recruitmentOpen && submitted ? (
                            <div className="recruitment-status-card recruitment-success-card">
                                <div className="recruitment-success-icon" aria-hidden="true">🎉</div>
                                <h2>Application Submitted!</h2>
                                <p>Thank you for applying. We will review your application and get back to you soon.</p>

                                {showBooking ? (
                                    <div className="booking-panel">
                                        <h3>Book Interview Slot</h3>
                                        <p>Select a date and time for your interview from available slots.</p>

                                        {interviewSlots.length === 0 ? (
                                            <p className="booking-empty">No interview slots available yet.</p>
                                        ) : (
                                            <div className="booking-slots">
                                                {interviewSlots.map((slot) => {
                                                    const taken = existingBookings.some((booking) => booking.date === slot.date && booking.time === slot.time);
                                                    return (
                                                        <label key={`${slot.date}-${slot.time}`} className={`booking-slot ${taken ? 'is-taken' : ''}`}>
                                                            <div className="booking-slot-main">
                                                                <input
                                                                    type="radio"
                                                                    name="slotSel"
                                                                    value={`${slot.date}|${slot.time}`}
                                                                    disabled={taken}
                                                                    onChange={(event) => setSelectedSlot(event.target.value)}
                                                                />
                                                                <div>{slot.date} @ {slot.time}</div>
                                                            </div>
                                                            <div className="booking-slot-status">{taken ? 'Taken' : 'Available'}</div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <div className="booking-actions">
                                            <button className="btn btn-primary" onClick={handleConfirmBooking} disabled={loading}>
                                                {loading ? 'Booking...' : 'Confirm Booking'}
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => setShowBooking(false)} disabled={loading}>
                                                Cancel
                                            </button>
                                        </div>

                                        {bookingMsg && (
                                            <div className={`booking-message ${bookingMsg.startsWith('Booked:') ? 'success' : ''}`}>
                                                {bookingMsg}
                                            </div>
                                        )}
                                    </div>
                                ) : null}

                                {!showBooking && (
                                    <button onClick={() => setSubmitted(false)} className="btn btn-secondary">
                                        Submit Another Response
                                    </button>
                                )}
                            </div>
                        ) : null}

                        {!systemConfig.maintenanceMode && systemConfig.recruitmentOpen && !submitted ? (
                            <form className="recruitment-form" onSubmit={handleSubmit}>
                                {error && <div className="recruitment-error">{error}</div>}

                                <div className="form-group">
                                    <label htmlFor="name">Full Name *</label>
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="semester">Semester *</label>
                                    <select id="semester" name="semester" value={formData.semester} onChange={handleChange} required>
                                        <option value="">-- Select Semester --</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((semester) => (
                                            <option key={semester} value={semester}>
                                                {semester === 1 ? '1st' : semester === 2 ? '2nd' : semester === 3 ? '3rd' : `${semester}th`} Semester
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="role">Preferred Role *</label>
                                    <select id="role" name="role" value={formData.role} onChange={handleChange} required>
                                        <option value="">-- Select Role --</option>
                                        {ROLE_OPTIONS.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="skills">Key Skills (comma separated) *</label>
                                    <input type="text" id="skills" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python..." required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="experience">Why should we select you? *</label>
                                    <textarea id="experience" name="experience" value={formData.experience} onChange={handleChange} placeholder="Tell us about your experience, projects, and why you want to join..." required rows={4}></textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="portfolio">Portfolio / GitHub URL *</label>
                                    <input type="url" id="portfolio" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="https://github.com/yourprofile" required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="linkedin">LinkedIn URL *</label>
                                    <input type="url" id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://www.linkedin.com/in/yourprofile" required />
                                </div>

                                <div className="form-group">
                                    <input type="submit" value={loading ? 'Submitting...' : 'Submit Application'} disabled={loading} />
                                </div>
                            </form>
                        ) : null}
                    </div>
                </div>

                <div className="note-box">
                    <strong>📌 Important:</strong> All applications will be reviewed carefully. Selected candidates will be notified within 5-7 business days for the interview round.
                </div>
            </div>

            {!user && (
                <div className="recruitment-login-overlay">
                    <div className="recruitment-login-modal">
                        <h2>🔐 Login Required</h2>
                        <p>You need to be logged in to view the recruitment form.</p>
                        <button onClick={openLogin} className="btn btn-primary">Open Login</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recruitment;