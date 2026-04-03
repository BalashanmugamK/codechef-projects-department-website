import { useState } from 'react';
import { achievements } from '../../data/mockData';
import { getAnimationDelayStyle } from '../../utils/animationUtils';

const Achievements = () => {
    const [activeTab, setActiveTab] = useState('awards'); // awards, milestones, hackathons

    const filteredAchievements = achievements[activeTab] || [];

    return (
        <section className="section" id="achievements">
            <div className="section-header">
                <h2 className="section-title">Achievements & Milestones</h2>
                <p className="section-subtitle">Celebrating our success</p>
            </div>

            <div className="tabs-container">
                {['awards', 'milestones', 'hackathons'].map((tab) => (
                    <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                        data-type={tab}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="achievements-grid" id="achievementDisplay">
                {filteredAchievements.map((item, index) => (
                    <div className="achievement-card" key={item.id}
                        style={{
                            background: 'var(--bg-secondary)', borderRadius: '12px', padding: '2rem',
                            border: '1px solid var(--border-color)', textAlign: 'center',
                            transition: 'transform 0.3s ease',
                            animation: 'fadeInUp 0.6s ease forwards',
                            ...getAnimationDelayStyle(index)
                        }}
                    >
                        <div className="achievement-icon" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                            {item.icon}
                        </div>
                        <h3 className="achievement-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                            {item.title}
                        </h3>
                        {item.year && (
                            <span className="achievement-year" style={{
                                display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(255, 107, 53, 0.1)',
                                color: 'var(--accent-primary)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
                                margin: '0.5rem 0'
                            }}>
                                {item.year}
                            </span>
                        )}
                        <p className="achievement-desc" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Achievements;
