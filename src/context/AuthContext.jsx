import { createContext, useContext, useEffect, useState } from 'react';
import { fetchWithRetry } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        const storedToken = localStorage.getItem('authToken');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Failed to parse user session:', error);
                localStorage.removeItem('currentUser');
            }
        }
        if (storedToken) {
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await fetchWithRetry('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!data.success) {
                return { success: false, message: data.error || data.message || 'Invalid email or password' };
            }

            if (data.success) {
                const authToken = data.token || data.user?.token || null;
                setUser(data.user);
                setToken(authToken);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                if (authToken) localStorage.setItem('authToken', authToken);
                return { success: true, user: data.user, token: authToken, message: `Welcome back, ${data.user.name}!` };
            }

            return { success: false, message: data.message || 'Server error. Try again.' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Server error. Try again.' };
        }
    };

    const adminLogin = async (email, password) => {
        try {
            const data = await fetchWithRetry('/api/auth/admin-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!data.success) {
                return { success: false, message: data.error || data.message || 'Admin login failed' };
            }

            if (data.success) {
                const authToken = data.token || data.user?.token || null;
                setUser(data.user);
                setToken(authToken);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                if (authToken) localStorage.setItem('authToken', authToken);
                return { success: true, user: data.user, token: authToken, message: 'Login Successful, Welcome Back!' };
            }

            return { success: false, message: data.message || 'Admin login failed' };
        } catch (error) {
            console.error('Admin login error:', error);
            return { success: false, message: 'Server error. Try again.' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
    };

    const registerUser = async (userData) => {
        try {
            const data = await fetchWithRetry('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!data.success) {
                return { success: false, message: data.error || data.message || 'Registration failed' };
            }

            if (data.success) {
                const authToken = data.token || data.user?.token || null;
                setUser(data.user);
                setToken(authToken);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                if (authToken) localStorage.setItem('authToken', authToken);
                return { success: true, user: data.user, token: authToken };
            }

            return { success: false, message: data.message || 'Registration failed' };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Server error. Try again.' };
        }
    };

    const getAdmins = async () => {
        try {
            console.log('getAdmins token:', token);
            if (!token) {
                throw new Error('No auth token available for admin requests');
            }

            const data = await fetchWithRetry('/api/admin/accounts', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!data.success) {
                console.warn('getAdmins helper returned failure:', data.error || data.message);
                return [];
            }

            if (Array.isArray(data.accounts)) {
                return data.accounts;
            }

            return Array.isArray(data) ? data : data.accounts || [];
        } catch (error) {
            console.error('Failed to fetch admins:', error);
            return [];
        }
    };

    const addAdmin = async (adminData) => {
        try {
            console.log('addAdmin token:', token);
            if (!token) {
                throw new Error('No auth token available for admin requests');
            }

            const data = await fetchWithRetry('/api/admin/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(adminData)
            });
            return data;
        } catch (error) {
            console.error('Add admin error:', error);
            return { success: false, message: 'Server error. Try again.' };
        }
    };

    const updateAdminPassword = async (email, currentPassword, newPassword) => {
        try {
            console.log('updateAdminPassword token:', token);
            if (!token) {
                throw new Error('No auth token available for admin requests');
            }

            const data = await fetchWithRetry(`/api/admin/accounts/${email}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            return data;
        } catch (error) {
            console.error('Update password error:', error);
            return { success: false, message: 'Server error. Try again.' };
        }
    };

    const getUsers = async () => {
        try {
            console.log('getUsers token:', token);
            if (!token) {
                throw new Error('No auth token available for user requests');
            }

            const data = await fetchWithRetry('/api/users', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!data.success) {
                console.warn('getUsers helper returned failure:', data.error || data.message);
                return [];
            }

            return data.users || [];
        } catch (error) {
            console.error('getUsers error:', error);
            return [];
        }
    };

    const deleteUser = async (id) => {
        try {
            const data = await fetchWithRetry(`/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
            });
            return data;
        } catch (error) {
            console.error('deleteUser error:', error);
            return { success: false, message: 'Server error. Try again.' };
        }
    };

    const updateUser = async (id, dataToUpdate) => {
        try {
            const data = await fetchWithRetry(`/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(dataToUpdate)
            });
            if (data.success && data.user) {
                if (user && (user._id === id || user.id === id || user.email === data.user.email)) {
                    const updatedUser = { ...user, ...data.user };
                    setUser(updatedUser);
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                }
            }
            return data;
        } catch (error) {
            console.error('updateUser error:', error);
            return { success: false, message: 'Server error. Try again.' };
        }
    };


    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
    const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

    const openLogin = () => { setIsLoginOpen(true); setIsSignupOpen(false); setIsForgotPasswordOpen(false); setIsAdminLoginOpen(false); };
    const closeLogin = () => setIsLoginOpen(false);
    const openSignup = () => { setIsSignupOpen(true); setIsLoginOpen(false); setIsForgotPasswordOpen(false); setIsAdminLoginOpen(false); };
    const closeSignup = () => setIsSignupOpen(false);
    const openForgotPassword = () => { setIsForgotPasswordOpen(true); setIsLoginOpen(false); setIsSignupOpen(false); setIsAdminLoginOpen(false); };
    const closeForgotPassword = () => setIsForgotPasswordOpen(false);
    const openAdminLogin = () => { setIsAdminLoginOpen(true); setIsLoginOpen(false); setIsSignupOpen(false); setIsForgotPasswordOpen(false); };
    const closeAdminLogin = () => setIsAdminLoginOpen(false);

    const openAdminDashboard = () => setIsAdminDashboardOpen(true);
    const closeAdminDashboard = () => setIsAdminDashboardOpen(false);
    const openUserProfile = () => setIsUserProfileOpen(true);
    const closeUserProfile = () => setIsUserProfileOpen(false);

    return (
        <AuthContext.Provider value={{
            user, loading, login, adminLogin, logout, registerUser,
            getAdmins, addAdmin, updateAdminPassword,
            getUsers, deleteUser, updateUser,
            isLoginOpen, openLogin, closeLogin,
            isSignupOpen, openSignup, closeSignup,
            isForgotPasswordOpen, openForgotPassword, closeForgotPassword,
            isAdminLoginOpen, openAdminLogin, closeAdminLogin,
            isAdminDashboardOpen, openAdminDashboard, closeAdminDashboard,
            isUserProfileOpen, openUserProfile, closeUserProfile,
            token
        }}>
            {children}
        </AuthContext.Provider>
    );
};
