import { useState } from 'react';
import { questSystem as questData } from '../../data/mockData';

const Quest = () => {
    const [activeTab, setActiveTab] = useState('leaderboard');
    const [selectedTeam, setSelectedTeam] = useState(null);

    const showTeamMembers = (teamName, members) => {
        setSelectedTeam({ teamName, members: members || ['Member 1', 'Member 2', 'Member 3'] });
    };
    const closeTeamModal = () => setSelectedTeam(null);

    const renderLeaderboard = () => (
        <div className="leaderboard-table">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Team Name</th>
                        <th>Votes (0-50)</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {questData.leaderboard.map((entry) => (
                        <tr key={`${entry.rank}-${entry.teamName}`} style={{ borderBottom: '1px solid var(--border-color)', transition: 'all 0.2s', cursor: 'pointer' }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <td key="rank" style={{ textAlign: 'center' }}>#{entry.rank}</td>
                            <td key="teamName">{entry.teamName}</td>
                            <td key="votes" style={{ textAlign: 'center' }}>
                                <div style={{
                                    display: 'inline-block',
                                    background: 'linear-gradient(90deg, var(--accent-success), var(--accent-primary))',
                                    color: 'white', padding: '0.5rem 1rem', borderRadius: '9999px',
                                    fontWeight: 700, fontSize: '1rem'
                                }}>
                                    {entry.votes || entry.points}/50
                                </div>
                            </td>
                            <td key="action" style={{ textAlign: 'center' }}>
                                <button className="btn btn-secondary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.95rem' }}
                                    onClick={() => showTeamMembers(entry.teamName, entry.members)}>
                                    View Members
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderContributions = () => (
        <div className="contributions-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {questData.contributions.map((contribution) => (
                <div key={contribution.id} className="card">
                    <h3>{contribution.user}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.625rem' }}>{contribution.task || contribution.contribution}</p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>📅 {contribution.date}</p>
                    <p style={{ color: 'var(--accent-success)', fontWeight: 600 }}>+{contribution.points} points</p>
                </div>
            ))}
        </div>
    );

    const renderWinners = () => (
        <div className="winners-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {questData.winners.map((winner) => (
                <div key={winner.month} className="card" style={{ textAlign: 'center' }}>
                    <h3>🏆 {winner.month}</h3>
                    <p style={{ color: 'var(--accent-success)', fontSize: '1.125rem', margin: '0.625rem 0' }}>{winner.winner || winner.name}</p>
                    <p style={{ color: 'var(--text-secondary)' }}>{winner.reward || `Total Contribution: ${winner.points} XP`}</p>
                </div>
            ))}
        </div>
    );

    return (
        <section className="section" id="quest">
            <div className="section-header">
                <h2 className="section-title">Internal Quest System</h2>
                <p className="section-subtitle">Gamified contribution tracking</p>
            </div>

            <div className="tabs-container">
                {['leaderboard', 'contributions', 'winners'].map((tab) => (
                    <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="quest-content" id="questDisplay">
                {activeTab === 'leaderboard' && renderLeaderboard()}
                {activeTab === 'contributions' && renderContributions()}
                {activeTab === 'winners' && renderWinners()}
            </div>

            {/* Team Members Modal — matches legacy showTeamMembers() */}
            {selectedTeam && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', zIndex: 11000
                }} onClick={closeTeamModal}>
                    <div style={{
                        background: 'var(--bg-primary)', padding: '2rem', borderRadius: '12px',
                        maxWidth: '500px', width: '90%', maxHeight: '70vh', overflowY: 'auto',
                        position: 'relative', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)', zIndex: 11001
                    }} onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeTeamModal} style={{
                            position: 'absolute', top: '10px', right: '15px', background: 'none',
                            border: 'none', fontSize: '30px', cursor: 'pointer', color: 'var(--text-secondary)', zIndex: 11002
                        }}>&times;</button>
                        <h2 style={{ color: 'var(--text-primary)', marginTop: 0 }}>{selectedTeam.teamName}</h2>
                        <div style={{ marginTop: '1.5rem' }}>
                            {selectedTeam.members.map((member, idx) => (
                                <div key={idx} style={{
                                    padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px',
                                    marginBottom: '0.75rem', borderLeft: '4px solid var(--accent-primary)'
                                }}>
                                    <strong style={{ color: 'var(--text-primary)' }}>{member}</strong><br />
                                    <small style={{ color: 'var(--text-secondary)' }}>Team Member #{idx + 1}</small>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Quest;
