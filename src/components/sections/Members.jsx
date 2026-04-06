import { useState, useEffect } from 'react';
import { getAnimationDelayStyle } from '../../utils/animationUtils';
import { getMemberPlaceholder } from '../../utils/placeholderUtils';
import { fetchWithRetry, API_URL } from '../../utils/api';
import { members as mockMembers } from '../../data/mockData';

const Members = () => {
  const [activeTenure, setActiveTenure] = useState('2025-26');
  const [activeGroup, setActiveGroup] = useState('leads');
  const [membersList, setMembersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const tenures = ['2025-26', '2024-25', '2023-24', 'alumni'];
  const groups = ['Core Team', 'Lead Developer', 'Researcher', 'Mentor', 'Alumni'];

  // Fetch members from backend
  const fetchMembers = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchWithRetry(`${API_URL}/api/members`, { method: 'GET' });
      if (data.success && Array.isArray(data.members)) {
        let filtered = data.members.filter(m => {
          const memberTenure = m.tenure || '2025-26';
          return memberTenure === activeTenure;
        });

        filtered = filtered.filter(m => {
          const memberGroup = m.group || 'Core Team';
          const mapActiveGroup = {
            'leads': 'Lead Developer',
            'members': 'Core Team',
            'mentors': 'Mentor'
          };
          const displayName = mapActiveGroup[activeGroup] || activeGroup;
          return memberGroup === displayName;
        });

        setMembersList(filtered);
        return;
      }

      throw new Error(data.error || 'Invalid members response from server');
    } catch (err) {
      console.error('Members fetch error:', err);
      const allMockMembers = [
        ...mockMembers.leads.map(m => ({ ...m, group: 'Lead Developer' })),
        ...mockMembers.members.map(m => ({ ...m, group: 'Core Team' })),
        ...mockMembers.mentors.map(m => ({ ...m, group: 'Mentor' }))
      ];
      let filtered = allMockMembers.filter(m => {
        const memberTenure = m.tenure || '2025-26';
        return memberTenure === activeTenure;
      });

      filtered = filtered.filter(m => {
        const memberGroup = m.group || 'Core Team';
        const mapActiveGroup = {
          'leads': 'Lead Developer',
          'members': 'Core Team',
          'mentors': 'Mentor'
        };
        const displayName = mapActiveGroup[activeGroup] || activeGroup;
        return memberGroup === displayName;
      });

      setMembersList(filtered);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [activeTenure, activeGroup]);

  const getDisplayLabel = (group) => {
    const mapping = {
      'leads': 'Leads',
      'members': 'Members',
      'mentors': 'Mentors'
    };
    return mapping[group] || group;
  };

  return (
    <section className="section" id="people">
      <div className="section-header">
        <h2 className="section-title">Meet Our Team</h2>
        <p className="section-subtitle">Talented developers, researchers, and innovators</p>
      </div>

      {/* Tenure Selector */}
      <div className="tenure-selector">
        {tenures.map((tenure) => (
          <button
            key={tenure}
            className={`tenure-btn ${activeTenure === tenure ? 'active' : ''}`}
            onClick={() => setActiveTenure(tenure)}
          >
            {tenure === 'alumni' ? 'Alumni' : tenure}
          </button>
        ))}
      </div>

      {/* Category Tabs */}
      <div className="tabs-container">
        {['leads', 'members', 'mentors'].map((group) => (
          <button
            key={group}
            className={`tab-btn ${activeGroup === group ? 'active' : ''}`}
            onClick={() => setActiveGroup(group)}
          >
            {getDisplayLabel(group)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div className="loading-spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid var(--border-color)',
            borderTop: '4px solid var(--accent-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading members...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div style={{
          background: '#fee2e2',
          color: '#991b1b',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #fecaca'
        }}>
          <p style={{ margin: 0 }}>❌ {error}</p>
        </div>
      )}

      {/* Members Grid */}
      <div className={`members-grid ${activeGroup === 'leads' ? 'leads-grid' : ''}`} id="memberDisplay">
        {!loading && membersList.length > 0 ? (
          membersList.map((member, index) => (
            <div
              key={member._id || index}
              className="card member-card"
              style={{
                animation: `fadeInUp 0.6s ease-out forwards`,
                ...getAnimationDelayStyle(index)
              }}
            >
              <img
                src={member.photo || getMemberPlaceholder(member)}
                alt={member.name}
                className="pfp"
                loading="lazy"
                onError={(e) => {
                  e.target.src = getMemberPlaceholder(member);
                }}
              />
              <h3>{member.name}</h3>
              <p>{member.role || 'Team Member'}</p>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '1rem',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{
                      flex: '1 1 auto',
                      minWidth: '80px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      justifyContent: 'center'
                    }}
                    title="LinkedIn Profile"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{
                      flex: '1 1 auto',
                      minWidth: '80px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      justifyContent: 'center'
                    }}
                    title="GitHub Profile"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <div className="card" style={{
              gridColumn: '1/-1',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <p style={{ color: 'var(--text-secondary)' }}>
                No members found for this selection.
              </p>
            </div>
          )
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .members-grid {
            grid-template-columns: 1fr;
          }
          
          .member-card {
            max-width: 100%;
          }

          .tenure-selector,
          .tabs-container {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .tenure-btn,
          .tab-btn {
            font-size: 0.75rem;
            padding: 0.4rem 0.8rem;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .members-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .member-card {
            max-width: 100%;
          }
        }

        @media (min-width: 1025px) {
          .members-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .members-grid.leads-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </section>
  );
};

export default Members;
