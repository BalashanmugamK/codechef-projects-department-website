import { createContext, useContext, useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Failed to parse user session:', error);
                localStorage.removeItem('currentUser');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.status === 401) {
                return { success: false, message: 'Invalid email or password' };
            }

            if (!response.ok) {
                return { success: false, message: data.message || 'Server error. Try again.' };
            }

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                return { success: true, user: data.user };
            }

            return { success: false, message: data.message || 'Server error. Try again.' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Server error. Try again.' };
        }
    };

    const adminLogin = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/admin-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, message: data.message || 'Admin login failed' };
            }

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                return { success: true, user: data.user };
            }

            return { success: false, message: data.message || 'Admin login failed' };
        } catch (error) {
            console.error('Admin login error:', error);
            return { success: false, message: 'Server error. Try again.' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const registerUser = async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, message: data.message || 'Registration failed' };
            }

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                return { success: true, user: data.user };
            }

            return { success: false, message: data.message || 'Registration failed' };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Server error. Try again.' };
        }
    };

    const getAdmins = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/accounts`);
            if (!response.ok) {
                throw new Error(`Failed to fetch admins: ${response.status}`);
            }
            const data = await response.json();
            return data.success ? data.accounts : [];
        } catch (error) {
            console.error('Failed to fetch admins:', error);
            return [];
        }
    };

    const addAdmin = async (adminData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/accounts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(adminData)
            });

            const data = await response.json();
            if (!response.ok) {
                return { success: false, message: data.message || 'Failed to add admin' };
            }

            return data;
        } catch (error) {
            console.error('Add admin error:', error);
            return { success: false, message: 'Server error. Try again.' };
        }
    };

    const updateAdminPassword = async (email, currentPassword, newPassword) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/accounts/${email}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();
            if (!response.ok) {
                return { success: false, message: data.message || 'Failed to update password' };
            }

            return data;
        } catch (error) {
            console.error('Update password error:', error);
            return { success: false, message: 'Server error. Try again.' };
        }
    };

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
    const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

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

    return (
        <AuthContext.Provider value={{
            user, loading, login, adminLogin, logout, registerUser,
            getAdmins, addAdmin, updateAdminPassword,
            isLoginOpen, openLogin, closeLogin,
            isSignupOpen, openSignup, closeSignup,
            isForgotPasswordOpen, openForgotPassword, closeForgotPassword,
            isAdminLoginOpen, openAdminLogin, closeAdminLogin,
            isAdminDashboardOpen, openAdminDashboard, closeAdminDashboard
        }}>
            {children}
        </AuthContext.Provider>
    );
};
