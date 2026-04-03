import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet, useLocation } from 'react-router-dom';
import LoginModal from './auth/LoginModal';
import AdminLoginModal from './auth/AdminLoginModal';
import SignupModal from './auth/SignupModal';
import ForgotPasswordModal from './auth/ForgotPasswordModal';
import CustomCursor from './CustomCursor';
import useScrollAnimations from '../utils/useScrollAnimations';
import AdminModal from './auth/AdminModal';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    useScrollAnimations();
    const { isAdminDashboardOpen, closeAdminDashboard } = useAuth();
    const location = useLocation();
    const hideNavbar = location.pathname === '/recruitment' || location.pathname.startsWith('/recruitment/');

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
            <AdminModal isOpen={isAdminDashboardOpen} onClose={closeAdminDashboard} />
            <SignupModal />
            <ForgotPasswordModal />
        </div>
    );
};

export default Layout;
