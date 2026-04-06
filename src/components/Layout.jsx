import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet, useLocation } from 'react-router-dom';
import LoginModal from './auth/LoginModal';
import AdminLoginModal from './auth/AdminLoginModal';
import SignupModal from './auth/SignupModal';
import ForgotPasswordModal from './auth/ForgotPasswordModal';
import UserProfileModal from './auth/UserProfileModal';
import CustomCursor from './CustomCursor';
import useScrollAnimations from '../utils/useScrollAnimations';
import AdminModal from './auth/AdminModal';
import { useAuth } from '../context/AuthContext';
import { fetchWithRetry } from '../utils/api';
import { useEffect } from 'react';

const Layout = () => {
    useScrollAnimations();
    const { isAdminDashboardOpen, closeAdminDashboard, user } = useAuth();
    const location = useLocation();
    const hideNavbar = location.pathname === '/recruitment' || location.pathname.startsWith('/recruitment/');

    // Debug log for admin dashboard state
    useEffect(() => {
        console.log('AdminDashboardOpen:', isAdminDashboardOpen, 'User role:', user?.role);
    }, [isAdminDashboardOpen, user?.role]);

    useEffect(() => {
        fetchWithRetry('/api/ping', { method: 'GET' }, 2)
            .then((data) => {
                if (!data.success) {
                    console.warn('Backend ping warning:', data.error);
                }
            })
            .catch((error) => {
                console.warn('Backend ping failed:', error);
            });
    }, []);

    return (
        <div className="app-layout">
            <CustomCursor />
            {!hideNavbar && <Navbar />}
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
            <LoginModal />
            <AdminLoginModal />
            <UserProfileModal />
            {isAdminDashboardOpen && <AdminModal isOpen={isAdminDashboardOpen} onClose={closeAdminDashboard} />}
            <SignupModal />
            <ForgotPasswordModal />
        </div>
    );
};

export default Layout;
