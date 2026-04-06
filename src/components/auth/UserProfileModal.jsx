import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const UserProfileModal = () => {
  const { user, isUserProfileOpen, closeUserProfile, updateUser } = useAuth();
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    github: '',
    linkedin: '',
    photo: '',
    codechef: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isUserProfileOpen && user) {
      setFormData({
        name: user.name || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        photo: user.photo || '',
        codechef: user.codechef || '',
        password: '',
        confirmPassword: ''
      });
      setMessage('');
    }
  }, [isUserProfileOpen, user]);

  if (!isUserProfileOpen || !user) return null;

  const onChange = (key) => (e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const payload = {
      name: formData.name,
      github: formData.github,
      linkedin: formData.linkedin,
      photo: formData.photo,
      codechef: formData.codechef
    };

    if (formData.password) payload.password = formData.password;

    const response = await updateUser(user._id || user.id || '', payload);

    if (response.success) {
      addNotification('Profile updated successfully', { type: 'success' });
      closeUserProfile();
      window.location.reload();
    } else {
      setMessage(response.message || 'Failed to update profile');
    }
  };

  return (
    <div className="modal-overlay" onClick={closeUserProfile} style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 12000, justifyContent: 'center', alignItems: 'center' }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '500px', background: 'var(--bg-secondary)', borderRadius: '14px', padding: '1.5rem', position: 'relative' }}>
        <button onClick={closeUserProfile} style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', fontSize: '1.35rem', cursor: 'pointer' }}>&times;</button>
        <h3>Your Profile</h3>
        <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '0.75rem' }}>
          <label>Name<input type="text" value={formData.name} onChange={onChange('name')} required /></label>
          <label>GitHub URL<input type="url" value={formData.github} onChange={onChange('github')} placeholder="https://github.com/username" /></label>
          <label>LinkedIn URL<input type="url" value={formData.linkedin} onChange={onChange('linkedin')} placeholder="https://linkedin.com/in/username" /></label>
          <label>Photo URL<input type="url" value={formData.photo} onChange={onChange('photo')} placeholder="https://..." /></label>
          <label>CodeChef Profile<input type="url" value={formData.codechef} onChange={onChange('codechef')} placeholder="https://www.codechef.com/users/username" /></label>
          <label>New Password<input type="password" value={formData.password} onChange={onChange('password')} /></label>
          <label>Confirm Password<input type="password" value={formData.confirmPassword} onChange={onChange('confirmPassword')} /></label>
          {message && <p style={{ color: 'var(--text-danger)', margin: '0' }}>{message}</p>}
          <button type="submit" className="btn btn-primary">Save Profile</button>
        </form>
      </div>
    </div>
  );
};

export default UserProfileModal;
