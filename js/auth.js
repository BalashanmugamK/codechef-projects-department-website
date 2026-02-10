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
    this.admins = [
      {
        email: 'admin@codechef-projects.com',
        password: 'Admin@123'
      },
      {
        email: 'lead@codechef-projects.com',
        password: 'Lead@123'
      }
    ];

    this.init();
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
      this.showNotification('✓ Login successful! Welcome back.', 'success');
      this.loginForm.reset();

      setTimeout(() => {
        this.closeLogin();
        
        setTimeout(() => {
          this.openAdmin();
          this.updateAdminUI();
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
    if (!this.currentUser) {
      console.log('No current user - opening login');
      this.openLogin();
    } else {
      console.log('User already logged in - opening admin panel');
      this.openAdmin();
    }
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
    if (this.currentUser && this.currentUser.role === 'admin') {
      const userInfo = document.getElementById('adminUserInfo');
      if (userInfo) {
        userInfo.textContent = `👤 ${this.currentUser.email}`;
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
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new AuthManager();
});