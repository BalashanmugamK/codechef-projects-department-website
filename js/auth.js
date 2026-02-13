// ============================================
// AUTHENTICATION SYSTEM - FIXED & COMPLETE
// NO SCROLL LOCK - ADMIN LOGIN ONLY
// ============================================

class AuthManager {
  constructor() {
    this.loginModal = document.getElementById('loginModal');
    this.adminModal = document.getElementById('adminModal');
    this.loginForm = document.getElementById('loginForm');
    this.adminToggle = document.getElementById('loginBtn');
    this.closeLoginModal = document.getElementById('closeLoginModal');
    this.closeAdminModal = document.getElementById('closeAdminModal');
    this.adminLogout = document.getElementById('adminLogout');
    this.currentUser = null;
    
    // Load admins from localStorage or initialize with defaults
    this.admins = this.loadAdmins();

    this.init();
  }

  loadAdmins() {
    const storedAdmins = localStorage.getItem('adminAccounts');
    if (storedAdmins) {
      try {
        return JSON.parse(storedAdmins);
      } catch (e) {
        console.error('Error parsing admin accounts:', e);
      }
    }
    
    // Default admin accounts
    const defaultAdmins = [
      {
        email: 'admin@codechef-projects.com',
        password: 'Admin@123',
        createdAt: new Date().toISOString(),
        role: 'super-admin'
      },
      {
        email: 'lead@codechef-projects.com',
        password: 'Lead@123',
        createdAt: new Date().toISOString(),
        role: 'admin'
      }
    ];
    
    // Save default admins to localStorage
    localStorage.setItem('adminAccounts', JSON.stringify(defaultAdmins));
    return defaultAdmins;
  }

  saveAdmins() {
    localStorage.setItem('adminAccounts', JSON.stringify(this.admins));
  }

  init() {
    // Initialize the auth manager
    this.hideAllModals();
    this.setupEventListeners();
    this.checkLoginStatus();
    this.updateAdminUI();
  }

  hideAllModals() {
    if (this.loginModal) {
      this.loginModal.style.display = 'none';
    }
    if (this.adminModal) {
      this.adminModal.style.display = 'none';
    }
    // Ensure body scrolling is ALWAYS enabled
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
  }

  setupEventListeners() {
    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    if (this.adminToggle) {
      this.adminToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openAdminPanel();
      });
    }

    if (this.closeLoginModal) {
      this.closeLoginModal.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeLogin();
      });
    }

    if (this.closeAdminModal) {
      this.closeAdminModal.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeAdmin();
      });
    }

    if (this.adminLogout) {
      this.adminLogout.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }

    // Close modal when clicking outside
    if (this.loginModal) {
      this.loginModal.addEventListener('click', (e) => {
        if (e.target === this.loginModal) {
          this.closeLogin();
        }
      });
    }

    if (this.adminModal) {
      this.adminModal.addEventListener('click', (e) => {
        if (e.target === this.adminModal) {
          this.closeAdmin();
        }
      });
    }

    // Tab switching in admin panel
    document.querySelectorAll('.admin-tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => this.switchAdminTab(e));
    });

    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeLogin();
        this.closeAdmin();
      }
    });
  }

  handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const admin = this.admins.find(
      (a) => a.email === email && a.password === password
    );

    if (admin) {
      this.currentUser = {
        email: email,
        role: 'admin',
        loginTime: new Date()
      };

      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      if (window.userAuth && typeof window.userAuth.updateUserUI === 'function') {
        window.userAuth.currentUser = null;
        window.userAuth.updateUserUI();
      }
      this.showNotification('✓ Login successful! Welcome back.', 'success');
      this.loginForm.reset();

      setTimeout(() => {
        this.closeLogin();
        this.updateAdminUI();
        
        setTimeout(() => {
          this.openAdmin();
        }, 200);
      }, 300);

    } else {
      this.showNotification('✗ Invalid email or password.', 'error');
      this.loginForm.reset();
    }
  }

  checkLoginStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.role === 'admin') {
          this.currentUser = parsed;
        }
      } catch (e) {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
      }
    }
  }

  openAdminPanel() {
    console.log('openAdminPanel called', { currentUser: this.currentUser });
    
    // Check if a regular user is logged in
    const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (current && current.role === 'user') {
      this.showUserLogoutConfirmPopup();
      return;
    }
    
    if (!this.currentUser) {
      console.log('No current user - opening login');
      this.openLogin();
    } else if (this.currentUser.role === 'admin') {
      console.log('Admin already logged in - opening admin panel');
      this.openAdmin();
    }
  }

  showUserLogoutConfirmPopup() {
    // Create custom popup for user to logout before admin login
    const popup = document.createElement('div');
    popup.className = 'logout-confirm-popup';
    popup.innerHTML = `
      <div class="logout-popup-overlay"></div>
      <div class="logout-popup-content">
        <h3>Switch to Admin Login</h3>
        <p>You are currently logged in as a user. Please logout first to access the admin panel.</p>
        <div class="logout-popup-buttons">
          <button class="btn btn-secondary logout-popup-cancel">Cancel</button>
          <button class="btn btn-danger logout-popup-confirm">Logout & Continue</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(popup);
    
    const cancelBtn = popup.querySelector('.logout-popup-cancel');
    const confirmBtn = popup.querySelector('.logout-popup-confirm');
    
    const closePopup = () => popup.remove();
    
    cancelBtn.addEventListener('click', closePopup);
    confirmBtn.addEventListener('click', () => {
      closePopup();
      // Logout the user
      localStorage.removeItem('currentUser');
      this.currentUser = null;
      if (window.userAuth && typeof window.userAuth.updateUserUI === 'function') {
        window.userAuth.currentUser = null;
        window.userAuth.updateUserUI();
      }
      this.showNotification('✓ User logged out. Now you can login as admin.', 'success');
      // Open admin login after logout
      setTimeout(() => this.openLogin(), 300);
    });
    
    popup.querySelector('.logout-popup-overlay').addEventListener('click', closePopup);
  }

  openLogin() {
    console.log('openLogin called', { loginModal: this.loginModal });
    if (this.loginModal) {
      console.log('Setting loginModal display to flex');
      this.loginModal.style.display = 'flex';
      // NO SCROLL LOCK - body can scroll
      this.loginModal.style.overflowY = 'auto';
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
      
      // Focus on first input
      setTimeout(() => {
        const firstInput = this.loginModal.querySelector('input');
        if (firstInput) firstInput.focus();
      }, 100);
    }
  }

  closeLogin() {
    if (this.loginModal) {
      this.loginModal.style.display = 'none';
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
    }
  }

  openAdmin() {
    console.log('openAdmin called', { adminModal: this.adminModal });
    if (this.adminModal) {
      console.log('Opening admin modal');
      this.adminModal.style.display = 'flex';
      this.adminModal.classList.add('active');
      // NO SCROLL LOCK - body can scroll
      this.adminModal.style.overflowY = 'auto';
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
      
      // Initialize the admin panel if needed
      if (window.adminPanel && typeof window.adminPanel.loadMembers === 'function') {
        console.log('Reloading admin panel data');
        window.adminPanel.loadMembers();
      }
    }
  }

  closeAdmin() {
    if (this.adminModal) {
      this.adminModal.style.display = 'none';
      this.adminModal.classList.remove('active');
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.closeAdmin();
    this.showNotification('✓ Logged out successfully!', 'success');

    if (this.loginForm) {
      this.loginForm.reset();
    }
    
    this.updateAdminUI();
  }

  switchAdminTab(e) {
    const tabName = e.target.dataset.tab;

    document.querySelectorAll('.admin-tab-btn').forEach((btn) => {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');

    document.querySelectorAll('.admin-tab-content').forEach((content) => {
      content.classList.remove('active');
    });

    const activeContent = document.querySelector(
      `.admin-tab-content[data-tab="${tabName}"]`
    );
    if (activeContent) {
      activeContent.classList.add('active');
    }
    
    // Load recruitment applications if switching to recruitment tab
    if (tabName === 'recruitment' && window.enhancedAdminPanel) {
      window.enhancedAdminPanel.loadApplications();
    }
  }

  updateAdminUI() {
    const adminStatusIcon = document.getElementById('adminStatusIcon');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    
    if (this.currentUser && this.currentUser.role === 'admin') {
      // Admin is logged in - unlock
      if (adminStatusIcon) {
        adminStatusIcon.textContent = '🔓';
      }
      if (adminLogoutBtn) {
        adminLogoutBtn.style.display = 'block';
      }
      const userInfo = document.getElementById('adminUserInfo');
      if (userInfo) {
        userInfo.textContent = `👤 ${this.currentUser.email}`;
      }
    } else {
      // Admin is logged out - lock
      if (adminStatusIcon) {
        adminStatusIcon.textContent = '🔒';
      }
      if (adminLogoutBtn) {
        adminLogoutBtn.style.display = 'none';
      }
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const bgColor = type === 'success' ? '#10b981' : 
                    type === 'error' ? '#ef4444' : 
                    '#3b82f6';

    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${bgColor};
      color: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10002;
      animation: slideInDown 0.4s ease-out;
      font-weight: 500;
      max-width: 350px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideInUp 0.4s ease-out reverse';
      setTimeout(() => notification.remove(), 400);
    }, 3000);
  }

  // Admin account management methods
  addAdminAccount(email, password) {
    // Check if admin already exists
    if (this.admins.find(a => a.email === email)) {
      return { success: false, message: 'Admin email already exists.' };
    }

    // Validate password strength
    const validation = PasswordValidator.validatePassword(password);
    if (!validation.isValid) {
      return { success: false, message: 'Password does not meet security requirements.' };
    }

    const newAdmin = {
      email: email,
      password: password, // In production, hash this
      createdAt: new Date().toISOString(),
      role: 'admin'
    };

    this.admins.push(newAdmin);
    this.saveAdmins();
    
    return { success: true, message: 'Admin account created successfully.' };
  }

  deleteAdminAccount(email) {
    // Prevent deletion of super admin
    const admin = this.admins.find(a => a.email === email);
    if (admin && admin.role === 'super-admin') {
      return { success: false, message: 'Cannot delete super admin account.' };
    }

    this.admins = this.admins.filter(a => a.email !== email);
    this.saveAdmins();
    
    return { success: true, message: 'Admin account deleted successfully.' };
  }

  updateAdminPassword(email, newPassword) {
    // Validate password strength
    const validation = PasswordValidator.validatePassword(newPassword);
    if (!validation.isValid) {
      return { success: false, message: 'Password does not meet security requirements.' };
    }

    const admin = this.admins.find(a => a.email === email);
    if (!admin) {
      return { success: false, message: 'Admin account not found.' };
    }

    admin.password = newPassword;
    admin.updatedAt = new Date().toISOString();
    this.saveAdmins();
    
    return { success: true, message: 'Password updated successfully.' };
  }

  getAdminAccounts() {
    return this.admins.map(a => ({
      email: a.email,
      createdAt: a.createdAt,
      role: a.role
    }));
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // expose auth manager globally so other modules can interact with admin session
  try {
    window.authManager = new AuthManager();
  } catch (e) {
    console.error('Error initializing AuthManager', e);
  }
});