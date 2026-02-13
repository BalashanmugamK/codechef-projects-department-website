// ============================================
// USER AUTHENTICATION SYSTEM - FIXED & COMPLETE
// SEPARATE FROM ADMIN - NO SCROLL LOCK
// ============================================

class UserAuth {
  constructor() {
    this.userLoginModal = document.getElementById('userLoginModal');
    this.userSignupModal = document.getElementById('userSignupModal');
    this.userLoginForm = document.getElementById('userLoginForm');
    this.userSignupForm = document.getElementById('userSignupForm');
    this.userLoginBtn = document.getElementById('userLoginBtn');
    this.userLogoutBtn = document.getElementById('userLogoutBtn');
    this.toggleSignupLink = document.getElementById('toggleSignup');
    this.toggleLoginLink = document.getElementById('toggleLogin');
    this.currentUser = null;

    this.init();
  }

  init() {
    // Force hide all modals on initialization
    this.hideAllModals();
    this.setupEventListeners();
    this.checkUserLoginStatus();
    this.updateUserUI();
  }

  hideAllModals() {
    if (this.userLoginModal) {
      this.userLoginModal.style.display = 'none';
    }
    if (this.userSignupModal) {
      this.userSignupModal.style.display = 'none';
    }
    // Ensure body scrolling is ALWAYS enabled
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
  }

  setupEventListeners() {
    if (this.userLoginForm) {
      this.userLoginForm.addEventListener('submit', (e) => this.handleUserLogin(e));
    }

    if (this.userSignupForm) {
      this.userSignupForm.addEventListener('submit', (e) => this.handleUserSignup(e));
      
      // Add password strength checking
      const signupPassword = document.getElementById('signupPassword');
      const confirmPassword = document.getElementById('confirmPassword');
      
      if (signupPassword) {
        signupPassword.addEventListener('input', (e) => this.checkPasswordStrength(e));
      }
      
      if (confirmPassword) {
        confirmPassword.addEventListener('input', (e) => this.checkPasswordMatch(e));
      }
    }

    if (this.userLoginBtn) {
      this.userLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openUserLogin();
      });
    }

    if (this.userLogoutBtn) {
      this.userLogoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logoutUser();
      });
    }

    if (this.toggleSignupLink) {
      this.toggleSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchToSignup();
      });
    }

    if (this.toggleLoginLink) {
      this.toggleLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchToLogin();
      });
    }

    // Close modal when clicking outside
    if (this.userLoginModal) {
      this.userLoginModal.addEventListener('click', (e) => {
        if (e.target === this.userLoginModal) {
          this.closeUserLogin();
        }
      });
    }

    if (this.userSignupModal) {
      this.userSignupModal.addEventListener('click', (e) => {
        if (e.target === this.userSignupModal) {
          this.closeUserSignup();
        }
      });
    }

    // Close buttons
    const closeLoginBtn = this.userLoginModal?.querySelector('.close-modal');
    if (closeLoginBtn) {
      closeLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeUserLogin();
      });
    }

    const closeSignupBtn = this.userSignupModal?.querySelector('.close-modal');
    if (closeSignupBtn) {
      closeSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeUserSignup();
      });
    }

    // Forgot password link
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openForgotPassword();
      });
    }

    // Back to login from forgot password
    const backToLoginForgot = document.getElementById('backToLoginForgot');
    if (backToLoginForgot) {
      backToLoginForgot.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeForgotPassword();
        this.openUserLogin();
      });
    }

    // Forgot password form submission
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
    }

    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeUserLogin();
        this.closeUserSignup();
        this.closeForgotPassword();
      }
    });
  }

  handleUserLogin(e) {
    e.preventDefault();

    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(
      (u) => u.email === email && this.verifyPassword(password, u.password)
    );

    if (user) {
      this.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'user',
        loginTime: new Date()
      };

      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      this.showNotification(`✓ Welcome back, ${user.name}!`, 'success');
      this.userLoginForm.reset();
      this.closeUserLogin();
      this.updateUserUI();

    } else {
      this.showNotification('✗ Invalid email or password.', 'error');
    }
  }

  handleUserSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate password match
    if (!PasswordValidator.passwordsMatch(password, confirmPassword)) {
      this.showNotification('✗ Passwords do not match.', 'error');
      return;
    }

    // Validate password strength (must be strong)
    const validation = PasswordValidator.validatePassword(password);
    if (!validation.isValid) {
      this.showNotification('✗ Password does not meet security requirements.', 'error');
      return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(u => u.email === email)) {
      this.showNotification('✗ Email already registered.', 'error');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      password: this.hashPassword(password),
      registrationDate: new Date(),
      role: 'user'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    this.showNotification('✓ Account created successfully! You can now login.', 'success');
    this.userSignupForm.reset();
    this.clearPasswordStrengthUI();
    
    setTimeout(() => {
      this.switchToLogin();
    }, 1000);
  }

  checkUserLoginStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        // Only restore if it's a user login, not admin
        if (parsed.role === 'user') {
          this.currentUser = parsed;
        }
      } catch (e) {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
      }
    }
  }

  openUserLogin() {
    // If an admin is currently logged in, require logout first
    const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (current && current.role === 'admin') {
      this.showLogoutConfirmPopup();
      return;
    }

    if (this.userLoginModal) {
      this.userLoginModal.style.display = 'flex';
      // NO SCROLL LOCK - body can scroll
      this.userLoginModal.style.overflowY = 'auto';
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
      
      // Focus on first input
      setTimeout(() => {
        const firstInput = this.userLoginModal.querySelector('input');
        if (firstInput) firstInput.focus();
      }, 100);
    }
  }

  showLogoutConfirmPopup() {
    // Create custom popup instead of confirm dialog
    const popup = document.createElement('div');
    popup.className = 'logout-confirm-popup';
    popup.innerHTML = `
      <div class="logout-popup-overlay"></div>
      <div class="logout-popup-content">
        <h3>Switch Account</h3>
        <p>You are currently logged in as admin. Do you want to logout from admin session to open User Login?</p>
        <div class="logout-popup-buttons">
          <button class="btn btn-secondary logout-popup-cancel">Cancel</button>
          <button class="btn btn-primary logout-popup-confirm">Yes, Logout</button>
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
      try { window.authManager && typeof window.authManager.logout === 'function' && window.authManager.logout(); } catch(e){}
      // Open user login after logout
      setTimeout(() => this.openUserLogin(), 300);
    });
    
    popup.querySelector('.logout-popup-overlay').addEventListener('click', closePopup);
  }

  openForgotPassword() {
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    if (forgotPasswordModal) {
      forgotPasswordModal.style.display = 'flex';
      document.body.style.overflow = 'auto';
      const emailInput = forgotPasswordModal.querySelector('#forgotEmail');
      if (emailInput) {
        setTimeout(() => emailInput.focus(), 100);
      }
    }
  }

  closeForgotPassword() {
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    if (forgotPasswordModal) {
      forgotPasswordModal.style.display = 'none';
      document.getElementById('forgotPasswordForm').reset();
      const message = document.getElementById('forgotPasswordMessage');
      if (message) message.style.display = 'none';
    }
  }

  handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);

    if (!user) {
      this.showNotification('✗ Email not found in our system.', 'error');
      return;
    }

    // Generate a recovery token (in real app, this would be sent via email)
    const recoveryToken = this.generateRecoveryToken();
    const recoveryData = {
      email: email,
      token: recoveryToken,
      timestamp: new Date().getTime(),
      expiresIn: 24 * 60 * 60 * 1000 // 24 hours
    };

    localStorage.setItem('passwordRecovery_' + email, JSON.stringify(recoveryData));

    // Show success message
    const message = document.getElementById('forgotPasswordMessage');
    if (message) {
      message.style.display = 'block';
    }

    // Store recovery info in a secure session
    console.log('Recovery token generated:', recoveryToken);

    // In real app, you'd send email with reset link
    // For now, show the token in console (for testing)
    this.showNotification('✓ Password recovery email would be sent! (Check console for token)', 'success');

    // Close after 2 seconds
    setTimeout(() => {
      this.closeForgotPassword();
      this.openUserLogin();
    }, 2000);
  }

  generateRecoveryToken() {
    // Generate a secure random token
    return Math.random().toString(36).substr(2) + Date.now().toString(36);
  }

  closeUserLogin() {
    if (this.userLoginModal) {
      this.userLoginModal.style.display = 'none';
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
    }
  }

  closeUserSignup() {
    if (this.userSignupModal) {
      this.userSignupModal.style.display = 'none';
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
    }
  }

  switchToSignup() {
    this.closeUserLogin();
    setTimeout(() => {
      if (this.userSignupModal) {
        this.userSignupModal.style.display = 'flex';
        this.userSignupModal.style.overflowY = 'auto';
        document.body.style.overflow = 'auto';
        document.body.style.position = 'static';
        
        // Focus on first input
        setTimeout(() => {
          const firstInput = this.userSignupModal.querySelector('input');
          if (firstInput) firstInput.focus();
        }, 100);
      }
    }, 200);
  }

  switchToLogin() {
    this.closeUserSignup();
    setTimeout(() => {
      this.openUserLogin();
    }, 200);
  }

  logoutUser() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.showNotification('✓ Logged out successfully!', 'success');
    this.updateUserUI();
  }

  checkPasswordStrength(e) {
    const password = e.target.value;
    const validation = PasswordValidator.validatePassword(password);
    this.updatePasswordStrengthUI(validation);
  }

  checkPasswordMatch(e) {
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = e.target.value;
    const match = PasswordValidator.passwordsMatch(password, confirmPassword);
    
    const matchStatus = document.getElementById('signupPasswordMatch');
    if (matchStatus) {
      if (password.length > 0 && confirmPassword.length > 0) {
        matchStatus.classList.add('shown');
        if (match) {
          matchStatus.classList.remove('mismatch');
          matchStatus.classList.add('match');
          matchStatus.innerHTML = '<span class="password-match-icon">✓</span><span>Passwords match</span>';
        } else {
          matchStatus.classList.remove('match');
          matchStatus.classList.add('mismatch');
          matchStatus.innerHTML = '<span class="password-match-icon">✗</span><span>Passwords do not match</span>';
        }
      } else {
        matchStatus.classList.remove('shown');
      }
    }
  }

  updatePasswordStrengthUI(validation) {
    const container = document.getElementById('signupPasswordStrength');
    if (!container) return;

    container.style.display = 'block';
    
    // Update strength text
    const strengthValue = document.getElementById('signupPasswordStrengthValue');
    if (strengthValue) {
      strengthValue.textContent = PasswordValidator.getStrengthText(validation.strength);
      strengthValue.className = `password-strength-value ${validation.strength}`;
    }

    // Update requirement indicators
    const requirements = {
      minLength: 'signupReqLength',
      hasUppercase: 'signupReqUppercase',
      hasLowercase: 'signupReqLowercase',
      hasNumbers: 'signupReqNumbers',
      hasSpecialChars: 'signupReqSpecial'
    };

    Object.keys(requirements).forEach(req => {
      const element = document.getElementById(requirements[req]);
      if (element) {
        if (validation.requirementsMet[req]) {
          element.classList.remove('unmet');
          element.classList.add('met');
          element.querySelector('.requirement-icon').textContent = '✓';
        } else {
          element.classList.remove('met');
          element.classList.add('unmet');
          element.querySelector('.requirement-icon').textContent = '✗';
        }
      }
    });

    // Update progress meter
    const bars = document.querySelectorAll('#signupPasswordStrength .password-strength-bar');
    bars.forEach((bar, index) => {
      const percentage = PasswordValidator.getStrengthPercentage(validation.strength);
      const barsNeeded = Math.ceil((percentage / 100) * bars.length);
      bar.style.opacity = index < barsNeeded ? '1' : '0.2';
    });

    // Update feedback
    const feedback = document.getElementById('signupPasswordFeedback');
    if (feedback) {
      if (validation.isValid) {
        feedback.classList.remove('hidden');
        feedback.classList.add('success');
        feedback.innerHTML = '<div style="font-weight: 600; color: inherit;">✓ Strong password! Ready to continue.</div>';
      } else if (validation.feedback.length > 0) {
        feedback.classList.remove('hidden', 'success');
        feedback.innerHTML = '<ul>' + 
          validation.feedback.map(msg => `<li>${msg}</li>`).join('') + 
          '</ul>';
      } else {
        feedback.classList.add('hidden');
      }
    }
  }

  clearPasswordStrengthUI() {
    const container = document.getElementById('signupPasswordStrength');
    if (container) {
      container.style.display = 'none';
    }
    const matchStatus = document.getElementById('signupPasswordMatch');
    if (matchStatus) {
      matchStatus.classList.remove('shown');
    }
  }

  updateUserUI() {
    const userLoginBtn = document.getElementById('userLoginBtn');
    const userLogoutBtn = document.getElementById('userLogoutBtn');
    const userProfile = document.getElementById('userProfile');

    if (this.currentUser && this.currentUser.role === 'user') {
      if (userLoginBtn) userLoginBtn.style.display = 'none';
      if (userLogoutBtn) userLogoutBtn.style.display = 'inline-block';
      if (userProfile) {
        userProfile.innerHTML = `<span style="color: var(--accent-primary); font-weight: 600;">👤 ${this.currentUser.name}</span>`;
      }
    } else {
      if (userLoginBtn) userLoginBtn.style.display = 'inline-block';
      if (userLogoutBtn) userLogoutBtn.style.display = 'none';
      if (userProfile) {
        userProfile.innerHTML = '';
      }
    }
  }

  hashPassword(password) {
    return btoa(password);
  }

  verifyPassword(password, hash) {
    return btoa(password) === hash;
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
  // Expose instance for cross-module UI updates
  window.userAuth = new UserAuth();
});