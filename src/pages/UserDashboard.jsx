import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { fetchWithRetry, API_URL } from '../utils/api';

const UserDashboard = ({ onClose }) => {
  const { user, token, updateUser, deleteUser, logout } = useAuth();
  const { theme } = useTheme();
  const { success, error } = useNotification();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: '', id: null });
  const modalRoot = typeof document !== 'undefined' ? document.body : null;

  const triggerDelete = (target) => {
    setDeleteTarget(target);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    setLoading(true);

    try {
      let data;

      if (deleteTarget.type === 'account') {
        data = await deleteUser(user?._id || user?.id || '');
      } else if (deleteTarget.type === 'project') {
        data = await fetchWithRetry(`${API_URL}/api/users/projects/${deleteTarget.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (deleteTarget.type === 'hackathon') {
        data = await fetchWithRetry(`${API_URL}/api/users/hackathons/${deleteTarget.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (data?.success) {
        if (deleteTarget.type === 'account') {
          success('Account deleted successfully');
          logout();
          onClose();
        }
        if (deleteTarget.type === 'project') {
          success('Project deleted successfully');
          fetchProjects();
        }
        if (deleteTarget.type === 'hackathon') {
          success('Hackathon deleted successfully');
          fetchHackathons();
        }
      } else {
        error(data?.message || 'Failed to delete item');
      }
    } catch (err) {
      error('Failed to delete item');
    } finally {
      setLoading(false);
      setDeleteTarget({ type: '', id: null });
    }
  };

  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    codechef: user?.codechef || '',
    photo: user?.photo || ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        codechef: user.codechef || '',
        photo: user.photo || ''
      });
    }
  }, [user]);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Projects and Hackathons state
  const [projects, setProjects] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '', github: '', demo: '' });
  const [newHackathon, setNewHackathon] = useState({ name: '', description: '', github: '', demo: '', position: '' });

  // Fetch user's projects and hackathons
  useEffect(() => {
    if (activeTab === 'projects') fetchProjects();
    if (activeTab === 'hackathons') fetchHackathons();
  }, [activeTab]);

  const fetchProjects = async () => {
    try {
      const data = await fetchWithRetry(`${API_URL}/api/users/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setProjects(data.projects || []);
    } catch (err) {
      error('Failed to fetch projects');
    }
  };

  const fetchHackathons = async () => {
    try {
      const data = await fetchWithRetry(`${API_URL}/api/users/hackathons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setHackathons(data.hackathons || []);
    } catch (err) {
      error('Failed to fetch hackathons');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await fetchWithRetry(`${API_URL}/api/users/profile`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          github: profileData.github,
          linkedin: profileData.linkedin,
          photo: profileData.photo,
          codechefHandle: profileData.codechef
        })
      });
      if (data.success) {
        if (data.user) updateUser(data.user);
        success('Profile updated successfully');
      } else {
        error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = (projectId) => {
    triggerDelete({ type: 'project', id: projectId });
  };

  const handleDeleteHackathon = (hackathonId) => {
    triggerDelete({ type: 'hackathon', id: hackathonId });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchWithRetry(`${API_URL}/api/users/change-password`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      if (data.success) {
        success('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        error(data.message || 'Failed to change password');
      }
    } catch (err) {
      error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await fetchWithRetry(`${API_URL}/api/users/projects`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProject)
      });
      if (data.success) {
        success('Project added successfully');
        setNewProject({ name: '', description: '', github: '', demo: '' });
        fetchProjects();
      } else {
        error(data.message || 'Failed to add project');
      }
    } catch (err) {
      error('Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHackathon = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await fetchWithRetry(`${API_URL}/api/users/hackathons`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newHackathon)
      });
      if (data.success) {
        success('Hackathon added successfully');
        setNewHackathon({ name: '', description: '', github: '', demo: '', position: '' });
        fetchHackathons();
      } else {
        error(data.message || 'Failed to add hackathon');
      }
    } catch (err) {
      error('Failed to add hackathon');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'password', label: 'Security', icon: '🔐' },
    { id: 'projects', label: 'Projects', icon: '💡' },
    { id: 'hackathons', label: 'Hackathons', icon: '🏆' }
  ];

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid var(--border-color)',
    borderRadius: '10px',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    transition: 'all 0.3s',
    boxSizing: 'border-box'
  };

  const inputFocusStyle = {
    ...inputStyle,
    outline: 'none',
    borderColor: 'var(--accent-primary)',
    boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.1)'
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.9rem 1.5rem',
    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-light))',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.95rem',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
    letterSpacing: '0.5px'
  };

  const dashboardModal = (
    <div
      className="user-dashboard-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 12000,
        background: theme === 'light' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
    >
      <div
        className="user-dashboard-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(1180px, 100%)',
          maxHeight: '95vh',
          overflow: 'hidden',
          borderRadius: '28px',
          boxShadow: theme === 'light' ? '0 20px 60px rgba(0, 0, 0, 0.15)' : '0 40px 120px rgba(15, 23, 42, 0.25)',
          backgroundColor: 'var(--bg-primary)',
          border: theme === 'light' ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Gradient Header */}
        <div style={{
          background: theme === 'light' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-light))',
          padding: '2rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{ margin: 0, fontSize: '1.75rem', color: '#fff', fontWeight: 700 }}>👤 User Dashboard</h2>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)' }}>Manage your profile and projects</p>
          </div>
          <button
            onClick={onClose}
            style={{
              fontSize: '1.5rem',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              color: '#fff',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 10,
              fontWeight: 600
            }}
            onMouseOver={(e) => { e.target.style.background = 'rgba(255,255,255,0.3)'; }}
            onMouseOut={(e) => { e.target.style.background = 'rgba(255,255,255,0.2)'; }}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.25rem',
          padding: '0.75rem',
          borderBottom: '1px solid var(--border-color)',
          overflowX: 'auto',
          flexShrink: 0,
          backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-light))'
                  : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                border: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'all 0.3s',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.backgroundColor = 'rgba(255, 107, 53, 0.08)';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem 1.5rem',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)'
        }}>
          {activeTab === 'profile' && (
            <>
              <form onSubmit={handleProfileUpdate}>
                <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(102, 126, 234, 0.05))', padding: '1.5rem', borderRadius: '14px', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
                  <h3 style={{ marginTop: 0, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Profile Information</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>Update your personal details and social profiles</p>
                </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>GitHub Profile</label>
                <input
                  type="url"
                  value={profileData.github}
                  onChange={(e) => setProfileData({...profileData, github: e.target.value})}
                  placeholder="https://github.com/username"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>LinkedIn Profile</label>
                <input
                  type="url"
                  value={profileData.linkedin}
                  onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
                  placeholder="https://linkedin.com/in/username"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>CodeChef Profile</label>
                <input
                  type="url"
                  value={profileData.codechef}
                  onChange={(e) => setProfileData({...profileData, codechef: e.target.value})}
                  placeholder="https://codechef.com/users/username"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{...buttonStyle, opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto'}}
                onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
              >
                {loading ? '⏳ Updating...' : '✓ Update Profile'}
              </button>
            </form>

            <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '14px', border: '2px solid rgba(239, 68, 68, 0.15)', background: 'rgba(254, 226, 226, 0.45)' }}>
              <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-primary)' }}>Danger Zone</h3>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', lineHeight: 1.7 }}>Delete your account permanently if you no longer want to use the platform. This cannot be undone.</p>
              <button
                type="button"
                onClick={() => triggerDelete({ type: 'account' })}
                disabled={loading}
                style={{
                  ...buttonStyle,
                  width: 'auto',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 1), rgba(239, 120, 120, 1))',
                  boxShadow: '0 8px 20px rgba(239, 68, 68, 0.24)'
                }}
              >
                {loading ? '⏳ Processing...' : 'Delete Account'}
              </button>
            </div>
            </>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange}>
              <div style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(168, 85, 247, 0.05))', padding: '1.5rem', borderRadius: '14px', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-danger)' }}>
                <h3 style={{ marginTop: 0, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Change Your Password</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>Strengthen your account security with a strong password</p>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  required
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{...buttonStyle, opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto'}}
                onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
              >
                {loading ? '⏳ Changing...' : '🔒 Change Password'}
              </button>
            </form>
          )}

          {activeTab === 'projects' && (
            <div>
              <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(102, 126, 234, 0.05))', padding: '1.5rem', borderRadius: '14px', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-info)' }}>
                <h3 style={{ marginTop: 0, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Add New Project</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>Showcase your projects and portfolio pieces</p>
              </div>

              <form onSubmit={handleAddProject} style={{ marginBottom: '2.5rem', padding: '1.5rem', border: '2px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <textarea
                    placeholder="Description - Tell us about your project"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    style={{...inputStyle, minHeight: '100px', resize: 'vertical'}}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <input
                    type="url"
                    placeholder="GitHub Repository URL"
                    value={newProject.github}
                    onChange={(e) => setNewProject({...newProject, github: e.target.value})}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <input
                    type="url"
                    placeholder="Demo or Live Link"
                    value={newProject.demo}
                    onChange={(e) => setNewProject({...newProject, demo: e.target.value})}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{...buttonStyle, opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto'}}
                  onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                  onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
                >
                  {loading ? '⏳ Adding...' : '➕ Add Project'}
                </button>
              </form>

              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', marginTop: 0 }}>Your Projects</h3>
              {projects.length === 0 ? (
                <div className="empty-state-box">
                  <div className="empty-icon">📁</div>
                  <p style={{ marginBottom: 0 }}>No projects yet. Add your first project to get started!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {projects.map((project, idx) => (
                    <div key={project._id} style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.04), rgba(102, 126, 234, 0.02))',
                      border: '2px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      transition: 'all 0.3s',
                      borderLeft: '4px solid var(--accent-info)',
                      animation: `slideUp 0.4s ease-out ${idx * 0.08}s both`
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-primary)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>💡 {project.name}</h4>
                          <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{project.description}</p>
                          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {project.github && (
                              <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '8px', color: 'var(--accent-info)', fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem', transition: 'all 0.3s' }}
                              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)'; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'; }}>
                                🔗 View Code
                              </a>
                            )}
                            {project.demo && (
                              <a href={project.demo} target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', color: 'var(--accent-success)', fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem', transition: 'all 0.3s' }}
                              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)'; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'; }}>
                                🌐 Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteProject(project._id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: 'none',
                            color: 'var(--accent-danger)',
                            cursor: 'pointer',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            transition: 'all 0.3s',
                            flexShrink: 0
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'hackathons' && (
            <div>
              <div style={{ background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.08), rgba(245, 158, 11, 0.05))', padding: '1.5rem', borderRadius: '14px', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-warning)' }}>
                <h3 style={{ marginTop: 0, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Add Hackathon Achievement</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>Document your hackathon wins and achievements</p>
              </div>

              <form onSubmit={handleAddHackathon} style={{ marginBottom: '2.5rem', padding: '1.5rem', border: '2px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <input
                    type="text"
                    placeholder="Hackathon Name"
                    value={newHackathon.name}
                    onChange={(e) => setNewHackathon({...newHackathon, name: e.target.value})}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <input
                    type="text"
                    placeholder="Your Position or Award (e.g., 1st Place, Best Innovation)"
                    value={newHackathon.position}
                    onChange={(e) => setNewHackathon({...newHackathon, position: e.target.value})}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <textarea
                    placeholder="Description - Tell us about your contribution and the project"
                    value={newHackathon.description}
                    onChange={(e) => setNewHackathon({...newHackathon, description: e.target.value})}
                    style={{...inputStyle, minHeight: '100px', resize: 'vertical'}}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <input
                    type="url"
                    placeholder="GitHub Repository URL"
                    value={newHackathon.github}
                    onChange={(e) => setNewHackathon({...newHackathon, github: e.target.value})}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <input
                    type="url"
                    placeholder="Demo or Devpost Link"
                    value={newHackathon.demo}
                    onChange={(e) => setNewHackathon({...newHackathon, demo: e.target.value})}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{...buttonStyle, opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto'}}
                  onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                  onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
                >
                  {loading ? '⏳ Adding...' : '🏆 Add Achievement'}
                </button>
              </form>

              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', marginTop: 0 }}>Your Hackathon Achievements</h3>
              {hackathons.length === 0 ? (
                <div className="empty-state-box">
                  <div className="empty-icon">🏆</div>
                  <p style={{ marginBottom: 0 }}>No hackathon achievements yet. Share your wins here!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {hackathons.map((hackathon, idx) => (
                    <div key={hackathon._id} style={{
                      background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.04), rgba(245, 158, 11, 0.02))',
                      border: '2px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      transition: 'all 0.3s',
                      borderLeft: '4px solid var(--accent-warning)',
                      animation: `slideUp 0.4s ease-out ${idx * 0.08}s both`
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-primary)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>🏆 {hackathon.name}</h4>
                          {hackathon.position && (
                            <p style={{ margin: '0 0 0.75rem 0', color: 'var(--accent-warning)', fontWeight: 700, fontSize: '0.95rem' }}>
                              🎖️ {hackathon.position}
                            </p>
                          )}
                          <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{hackathon.description}</p>
                          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {hackathon.github && (
                              <a href={hackathon.github} target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '8px', color: 'var(--accent-info)', fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem', transition: 'all 0.3s' }}
                              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)'; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'; }}>
                                🔗 View Code
                              </a>
                            )}
                            {hackathon.demo && (
                              <a href={hackathon.demo} target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', color: 'var(--accent-success)', fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem', transition: 'all 0.3s' }}
                              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)'; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'; }}>
                                🌐 Devpost Link
                              </a>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteHackathon(hackathon._id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: 'none',
                            color: 'var(--accent-danger)',
                            cursor: 'pointer',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            transition: 'all 0.3s',
                            flexShrink: 0
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 13000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme === 'light' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.6)',
            padding: '1.5rem'
          }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(540px, 100%)',
              borderRadius: '22px',
              backgroundColor: 'var(--bg-primary)',
              border: theme === 'light' ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: theme === 'light' ? '0 20px 60px rgba(0, 0, 0, 0.15)' : '0 32px 90px rgba(0, 0, 0, 0.28)',
              padding: '2rem',
              textAlign: 'center'
            }}
          >
            <h3 style={{ margin: 0, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Confirm Delete</h3>
            <p style={{ margin: '0 0 1.5rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {deleteTarget.type === 'account'
                ? 'This will permanently delete your account and all associated data.'
                : deleteTarget.type === 'project'
                ? 'This project will be permanently removed from your profile.'
                : 'This hackathon achievement will be permanently removed from your profile.'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  ...buttonStyle,
                  width: 'auto',
                  background: theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-primary)'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={loading}
                style={{
                  ...buttonStyle,
                  width: 'auto',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 1), rgba(239, 120, 120, 1))'
                }}
              >
                {loading ? '⏳ Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return modalRoot ? createPortal(dashboardModal, modalRoot) : dashboardModal;
};

export default UserDashboard;