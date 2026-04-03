import { useState } from 'react';
import { gameDev } from '../../data/mockData';
import { getMemberPlaceholder } from '../../utils/placeholderUtils';

const GameDev = () => {
    const [activeTab, setActiveTab] = useState('members');

    const renderMembers = () => (
        <>
            <div style={{
                background: 'linear-gradient(135deg, var(--accent-primary-light), rgba(102, 126, 234, 0.1))',
                padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem',
                borderLeft: '4px solid var(--accent-primary)'
            }}>
                <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Game Development Team</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Passionate developers creating innovative interactive experiences using cutting-edge game engines and technologies.</p>
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
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Showcase of games and interactive experiences developed by the Game Development Wing.</p>
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
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Development Tools & Engines</h3>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Professional-grade tools and engines used by our game development team.</p>
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
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', margin: '0.5rem 0 0 0' }}>Professional Tool</p>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    const renderEvents = () => (
        <>
            <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(102, 126, 234, 0.1))',
                padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem',
                borderLeft: '4px solid var(--accent-success)'
            }}>
                <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Game Dev Events & Workshops</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Upcoming and recent events organized by the Game Development Wing.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {gameDev.events.map((event, idx) => (
                    <div key={event.title} className="card" style={{ borderLeft: '4px solid var(--accent-success)', animationDelay: `${idx * 0.1}s` }}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--accent-success), var(--accent-tertiary))',
                            color: 'white', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                            display: 'inline-block', marginBottom: '1rem', fontSize: '0.8rem', fontWeight: 600
                        }}>UPCOMING</div>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{event.title}</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📅 {event.date}</span>
                        </p>
                        <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Learn More</button>
                    </div>
                ))}
            </div>
        </>
    );

    return (
        <section className="section" id="gamedev">
            <div className="section-header">
                <h2 className="section-title">Game Development Wing</h2>
                <p className="section-subtitle">Creating interactive experiences</p>
            </div>

            <div className="tabs-container">
                {['members', 'projects', 'tools', 'events'].map(tab => (
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
