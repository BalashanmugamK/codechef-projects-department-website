import { useState } from 'react';
import { gameDev } from '../../data/mockData';
import { getMemberPlaceholder } from '../../utils/placeholderUtils';
import { classifyEvent, getHappeningSoon, sortEvents, formatEventDate } from '../../utils/dateUtils';

const GameDev = () => {
    const [activeTab, setActiveTab] = useState('members');
    const [eventFilter, setEventFilter] = useState('upcoming');

    const renderMembers = () => (
        <>
            <div style={{
                background: 'linear-gradient(135deg, var(--accent-primary-light), rgba(102, 126, 234, 0.1))',
                padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem',
                borderLeft: '4px solid var(--accent-primary)'
            }}>
                <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Game Development Team</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Passionate developers creating immersive interactive experiences using modern game engines.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {gameDev.members.map((member, idx) => (
                    <div key={member.name} className="card" style={{ animationDelay: `${idx * 0.1}s`, textAlign: 'center' }}>
                        <img
                            src={member.photo || getMemberPlaceholder(member)}
                            alt={member.name}
                            className="pfp"
                            style={{ marginBottom: '1rem' }}
                            loading="lazy"
                            onError={(e) => { e.target.src = getMemberPlaceholder(member); }}
                        />
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{member.name}</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>Game Developer</p>
                    </div>
                ))}
            </div>
        </>
    );

    const renderProjects = () => (
        <>
            <div style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(102, 126, 234, 0.1))',
                padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem',
                borderLeft: '4px solid var(--accent-info)'
            }}>
                <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Featured Game Projects</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>A curated selection of games and interactive prototypes built by the Game Dev team.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {gameDev.projects.map((proj, idx) => (
                    <div key={proj.title} className="card" style={{ animationDelay: `${idx * 0.1}s` }}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--accent-info), var(--accent-primary))',
                            padding: '2rem', borderRadius: '0.75rem', textAlign: 'center', marginBottom: '1rem'
                        }}>
                            <span style={{ fontSize: '2.5rem', display: 'block' }}>🎮</span>
                        </div>
                        <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-primary)' }}>{proj.title}</h4>
                        <a href={proj.link || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%' }}>
                            View on GitHub ↗
                        </a>
                    </div>
                ))}
            </div>
        </>
    );

    const renderTools = () => {
        const toolIcons = {
            'Unity': '🎮',
            'Godot': '🦆',
            'Unreal Engine': '🚀',
            'Custom C++ Engine': '⚙️'
        };
        return (
            <>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(255, 107, 53, 0.1))',
                    padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem',
                    borderLeft: '4px solid var(--accent-warning)'
                }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Tools & Engines</h3>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>The toolchain powering our game creation and prototyping workflows.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {gameDev.tools.map((tool, idx) => {
                        const toolName = typeof tool === 'string' ? tool : tool.name;
                        return (
                            <div key={toolName} className="card" style={{
                                textAlign: 'center', display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', minHeight: '180px',
                                animationDelay: `${idx * 0.1}s`
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{toolIcons[toolName] || '🔧'}</div>
                                <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{toolName}</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', margin: '0.5rem 0 0 0' }}>Professional-grade technology</p>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    const renderEvents = () => {
        const processed = gameDev.events.map((event) => ({
            ...event,
            status: classifyEvent(event),
            isSoon: getHappeningSoon(event)
        }));

        const filtered = processed.filter((event) => eventFilter === 'all' || event.status === eventFilter);
        const sorted = sortEvents(filtered, eventFilter);

        return (
            <>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(102, 126, 234, 0.1))',
                    padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem',
                    borderLeft: '4px solid var(--accent-success)'
                }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Game Dev Events & Workshops</h3>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Upcoming and recent Game Dev events, now sorted by status.</p>
                </div>

                <div className="tabs-container" style={{ marginBottom: '1rem' }}>
                    {['all', 'upcoming', 'ongoing', 'past'].map((type) => (
                        <button
                            key={type}
                            className={`tab-btn ${eventFilter === type ? 'active' : ''}`}
                            onClick={() => setEventFilter(type)}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                {sorted.length === 0 ? (
                    <div className="empty-state-box" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <div className="empty-icon">📅</div>
                        <p>No {eventFilter} game dev events at the moment.</p>
                    </div>
                ) : (
                    <div className="gamedev-events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {sorted.map((event, idx) => (
                            <div key={event.title} className="gamedev-event-card" style={{ animationDelay: `${idx * 0.08}s`, padding: '1.5rem', borderRadius: '18px', minHeight: '220px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <strong style={{ color: 'var(--text-primary)' }}>{event.title}</strong>
                                    <span style={{ padding: '0.35rem 0.85rem', borderRadius: '999px', background: event.status === 'past' ? 'rgba(245, 158, 11, 0.12)' : event.status === 'ongoing' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.12)', color: event.status === 'past' ? 'var(--accent-warning)' : event.status === 'ongoing' ? 'var(--accent-success)' : 'var(--accent-info)', fontSize: '0.8rem', fontWeight: 700 }}>
                                        {event.status.toUpperCase()}
                                    </span>
                                </div>
                                <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)' }}>{formatEventDate(event.date, event.time)}</p>
                                <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{event.description || 'Join this event to level up your skills and collaborate with other creators.'}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>📍 {event.location || 'VIT Chennai'}</span>
                                    <button className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>Learn More</button>
                                </div>
                                {event.isSoon && <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(255, 107, 53, 0.1)', borderRadius: '14px', color: 'var(--accent-primary)', fontWeight: 600 }}>Happening soon — reserve your seat!</div>}
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    };

    return (
        <section className="section" id="gamedev">
            <div className="section-header">
                <h2 className="section-title">Game Development Wing</h2>
                <p className="section-subtitle">Creating interactive experiences</p>
            </div>

            <div className="tabs-container">
                {['members', 'projects', 'tools', 'events'].map((tab) => (
                    <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="gamedev-grid" id="gamedevDisplay">
                {activeTab === 'members' && renderMembers()}
                {activeTab === 'projects' && renderProjects()}
                {activeTab === 'tools' && renderTools()}
                {activeTab === 'events' && renderEvents()}
            </div>
        </section>
    );
};

export default GameDev;
