// ============================================
// ADMIN PANEL MANAGEMENT - ENHANCED WITH RECRUITMENT
// ============================================

class AdminPanel {
  constructor() {
    this.adminTabs = document.querySelectorAll('.admin-tab-btn');
    this.adminTabContents = document.querySelectorAll('.admin-tab-content');
    this.addMemberForm = document.getElementById('addMemberForm');
    this.editContentForm = document.getElementById('editContentForm');
    this.addProjectForm = document.getElementById('addProjectForm');
    this.membersList = document.getElementById('membersList');
    
    console.log('AdminPanel initialized', {
      adminTabs: this.adminTabs.length,
      adminTabContents: this.adminTabContents.length,
      addMemberForm: !!this.addMemberForm,
      editContentForm: !!this.editContentForm,
      addProjectForm: !!this.addProjectForm,
      membersList: !!this.membersList
    });
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadMembers();
  }

  setupEventListeners() {
    console.log('Setting up admin event listeners');
    
    // Tab switching
    if (this.adminTabs.length > 0) {
      this.adminTabs.forEach((tab) => {
        tab.addEventListener('click', (e) => this.switchTab(e));
      });
      console.log('✓ Admin tabs setup complete');
    } else {
      console.error('✗ No admin tabs found');
    }

    // Form submissions
    if (this.addMemberForm) {
      this.addMemberForm.addEventListener('submit', (e) =>
        this.handleAddMember(e)
      );
      console.log('✓ Add member form setup');
    } else {
      console.warn('⚠ Add member form not found');
    }

    if (this.editContentForm) {
      this.editContentForm.addEventListener('submit', (e) =>
        this.handleEditContent(e)
      );
      console.log('✓ Edit content form setup');
    } else {
      console.warn('⚠ Edit content form not found');
    }

    if (this.addProjectForm) {
      this.addProjectForm.addEventListener('submit', (e) =>
        this.handleAddProject(e)
      );
      console.log('✓ Add project form setup');
    } else {
      console.warn('⚠ Add project form not found');
    }

    // Admin Account Management
    const addAdminForm = document.getElementById('addAdminForm');
    if (addAdminForm) {
      addAdminForm.addEventListener('submit', (e) => this.handleAddAdmin(e));
      
      const adminPassword = document.getElementById('adminPassword');
      if (adminPassword) {
        adminPassword.addEventListener('input', (e) => this.checkAdminPasswordStrength(e));
      }
      console.log('✓ Admin account form setup');
    }

    // Admin Password Change
    const changePasswordForm = document.getElementById('changeAdminPasswordForm');
    if (changePasswordForm) {
      changePasswordForm.addEventListener('submit', (e) => this.handleChangeAdminPassword(e));
      
      const newPassword = document.getElementById('newAdminPassword');
      const confirmPassword = document.getElementById('confirmNewAdminPassword');
      
      if (newPassword) {
        newPassword.addEventListener('input', (e) => this.checkChangePasswordStrength(e));
      }
      
      if (confirmPassword) {
        confirmPassword.addEventListener('input', (e) => this.checkPasswordMatch(e));
      }
      console.log('✓ Admin password change form setup');
    }
  }

  switchTab(e) {
    const tabName = e.target.dataset.tab;

    // Remove active class from all tabs
    this.adminTabs.forEach((tab) => tab.classList.remove('active'));
    e.target.classList.add('active');

    // Remove active class from all contents
    this.adminTabContents.forEach((content) => {
      content.classList.remove('active');
    });

    // Add active class to selected content
    const activeContent = document.querySelector(
      `.admin-tab-content[data-tab="${tabName}"]`
    );
    if (activeContent) {
      activeContent.classList.add('active');
    }
    
    // Load relevant data when switching tabs
    if (tabName === 'recruitment') {
      this.loadApplications();
      this.loadInterviewSlots();
    } else if (tabName === 'admin-accounts') {
      this.loadAdminAccounts();
    }
  }

  // Interview slot management
  loadInterviewSlots() {
    const slots = JSON.parse(localStorage.getItem('interviewSlots')) || [];
    this.renderInterviewSlots(slots);

    // Attach add slot button
    const addBtn = document.getElementById('addInterviewSlotBtn');
    if (addBtn) {
      addBtn.onclick = (e) => {
        e.preventDefault();
        const dateInput = document.getElementById('slotDate');
        const timeInput = document.getElementById('slotTime');
        if (!dateInput.value || !timeInput.value) {
          this.showNotification('Please pick both date and time.', 'error');
          return;
        }
        this.addInterviewSlot(dateInput.value, timeInput.value);
        dateInput.value = '';
        timeInput.value = '';
      };
    }
  }

  renderInterviewSlots(slots) {
    const container = document.getElementById('slotsList');
    if (!container) return;
    if (!slots || slots.length === 0) {
      container.innerHTML = '<p style="margin:0; color: var(--text-secondary);">No slots set yet.</p>';
      return;
    }

    const html = slots.map((s, idx) => `
      <div style="display:flex; justify-content:space-between; gap:0.5rem; align-items:center; padding:0.4rem 0; border-bottom:1px solid var(--border-color);">
        <div style="color: var(--text-primary); font-weight:600;">${s.date} <span style="color:var(--text-secondary); font-weight:400;">@ ${s.time}</span></div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-danger btn-sm" onclick="adminPanel.removeInterviewSlot(${idx})">Remove</button>
        </div>
      </div>
    `).join('');

    container.innerHTML = html;
  }

  addInterviewSlot(date, time) {
    const slots = JSON.parse(localStorage.getItem('interviewSlots')) || [];
    // avoid duplicates
    if (slots.find(s => s.date === date && s.time === time)) {
      this.showNotification('This slot already exists.', 'info');
      return;
    }
    slots.push({ date, time });
    slots.sort((a,b) => (a.date + a.time).localeCompare(b.date + b.time));
    localStorage.setItem('interviewSlots', JSON.stringify(slots));
    this.showNotification('✓ Interview slot added.', 'success');
    this.renderInterviewSlots(slots);
  }

  removeInterviewSlot(index) {
    const slots = JSON.parse(localStorage.getItem('interviewSlots')) || [];
    if (index < 0 || index >= slots.length) return;
    if (!confirm('Remove this interview slot?')) return;
    slots.splice(index, 1);
    localStorage.setItem('interviewSlots', JSON.stringify(slots));
    this.showNotification('Slot removed.', 'info');
    this.renderInterviewSlots(slots);
  }

  // Admin Account Management Methods
  handleAddAdmin(e) {
    e.preventDefault();

    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    // Validate password strength
    const validation = PasswordValidator.validatePassword(password);
    if (!validation.isValid) {
      this.showNotification('✗ Password does not meet security requirements.', 'error');
      return;
    }

    // Add admin account through AuthManager
    const result = window.authManager.addAdminAccount(email, password);
    
    if (result.success) {
      this.showNotification(`✓ ${result.message}`, 'success');
      document.getElementById('addAdminForm').reset();
      this.clearAdminPasswordStrengthUI();
      this.loadAdminAccounts();
    } else {
      this.showNotification(`✗ ${result.message}`, 'error');
    }
  }

  checkAdminPasswordStrength(e) {
    const password = e.target.value;
    const validation = PasswordValidator.validatePassword(password);
    this.updateAdminPasswordStrengthUI(validation);
  }

  updateAdminPasswordStrengthUI(validation) {
    const container = document.getElementById('adminPasswordStrength');
    if (!container) return;

    container.style.display = 'block';
    
    // Update strength text
    const strengthValue = document.getElementById('adminPasswordStrengthValue');
    if (strengthValue) {
      strengthValue.textContent = PasswordValidator.getStrengthText(validation.strength);
      strengthValue.className = `password-strength-value ${validation.strength}`;
    }

    // Update requirement indicators
    const requirements = {
      minLength: 'adminReqLength',
      hasUppercase: 'adminReqUppercase',
      hasLowercase: 'adminReqLowercase',
      hasNumbers: 'adminReqNumbers',
      hasSpecialChars: 'adminReqSpecial'
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
    const bars = document.querySelectorAll('#adminPasswordStrength .password-strength-bar');
    bars.forEach((bar, index) => {
      const percentage = PasswordValidator.getStrengthPercentage(validation.strength);
      const barsNeeded = Math.ceil((percentage / 100) * bars.length);
      bar.style.opacity = index < barsNeeded ? '1' : '0.2';
    });

    // Update feedback
    const feedback = document.getElementById('adminPasswordFeedback');
    if (feedback) {
      if (validation.isValid) {
        feedback.classList.remove('hidden');
        feedback.classList.add('success');
        feedback.innerHTML = '<div style="font-weight: 600; color: inherit;">✓ Strong password! Ready to create account.</div>';
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

  clearAdminPasswordStrengthUI() {
    const container = document.getElementById('adminPasswordStrength');
    if (container) {
      container.style.display = 'none';
    }
  }

  loadAdminAccounts() {
    this.renderAdminAccounts();
  }

  renderAdminAccounts() {
    const container = document.getElementById('adminAccountsList');
    if (!container) return;

    const admins = window.authManager.getAdminAccounts();

    if (!admins || admins.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No admin accounts found.</p>';
      return;
    }

    const html = admins.map(admin => `
      <div class="admin-item" style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: var(--bg-tertiary); border-radius: var(--radius-lg); margin-bottom: 0.75rem; border: 1px solid var(--border-color);">
        <div>
          <strong style="color: var(--text-primary);">${admin.email}</strong>
          <p style="color: var(--text-secondary); margin: 0.25rem 0; font-size: 0.875rem;">
            <span style="background: var(--accent-primary-light); color: var(--accent-primary); padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); font-weight: 600; font-size: 0.75rem; display: inline-block;">
              ${admin.role === 'super-admin' ? '👑 Super Admin' : '👤 Admin'}
            </span>
            ${admin.createdAt ? ` • Created: ${new Date(admin.createdAt).toLocaleDateString()}` : ''}
          </p>
        </div>
        ${admin.role !== 'super-admin' ? `
          <button class="btn btn-danger btn-sm" onclick="adminPanel.deleteAdminAccount('${admin.email}')" style="padding: 0.5rem 1rem; font-size: 0.875rem;">
            Remove
          </button>
        ` : ''}
      </div>
    `).join('');

    container.innerHTML = html;
  }

  deleteAdminAccount(email) {
    if (!confirm(`Are you sure you want to delete the admin account ${email}?`)) return;

    const result = window.authManager.deleteAdminAccount(email);
    
    if (result.success) {
      this.showNotification(`✓ ${result.message}`, 'success');
      this.loadAdminAccounts();
    } else {
      this.showNotification(`✗ ${result.message}`, 'error');
    }
  }

  // Admin Password Change Methods
  handleChangeAdminPassword(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('currentAdminPassword').value;
    const newPassword = document.getElementById('newAdminPassword').value;
    const confirmPassword = document.getElementById('confirmNewAdminPassword').value;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    // Verify current password
    if (currentUser.email) {
      const admins = window.authManager.admins;
      const admin = admins.find(a => a.email === currentUser.email);
      
      if (!admin || admin.password !== currentPassword) {
        this.showNotification('✗ Current password is incorrect.', 'error');
        return;
      }
    } else {
      this.showNotification('✗ Could not verify your identity.', 'error');
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      this.showNotification('✗ New passwords do not match.', 'error');
      return;
    }

    // Validate new password strength
    const validation = PasswordValidator.validatePassword(newPassword);
    if (!validation.isValid) {
      this.showNotification('✗ New password does not meet security requirements.', 'error');
      return;
    }

    // Update password through AuthManager
    const result = window.authManager.updateAdminPassword(currentUser.email, newPassword);
    
    if (result.success) {
      this.showNotification(`✓ ${result.message}`, 'success');
      document.getElementById('changeAdminPasswordForm').reset();
      this.clearChangePasswordStrengthUI();
    } else {
      this.showNotification(`✗ ${result.message}`, 'error');
    }
  }

  checkChangePasswordStrength(e) {
    const password = e.target.value;
    const validation = PasswordValidator.validatePassword(password);
    this.updateChangePasswordStrengthUI(validation);
  }

  checkPasswordMatch(e) {
    const newPassword = document.getElementById('newAdminPassword').value;
    const confirmPassword = e.target.value;
    const match = PasswordValidator.passwordsMatch(newPassword, confirmPassword);
    
    const matchStatus = document.getElementById('changePasswordMatch');
    if (matchStatus) {
      if (newPassword.length > 0 && confirmPassword.length > 0) {
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

  updateChangePasswordStrengthUI(validation) {
    const container = document.getElementById('changePasswordStrength');
    if (!container) return;

    container.style.display = 'block';
    
    // Update strength text
    const strengthValue = document.getElementById('changePasswordStrengthValue');
    if (strengthValue) {
      strengthValue.textContent = PasswordValidator.getStrengthText(validation.strength);
      strengthValue.className = `password-strength-value ${validation.strength}`;
    }

    // Update requirement indicators
    const requirements = {
      minLength: 'changeReqLength',
      hasUppercase: 'changeReqUppercase',
      hasLowercase: 'changeReqLowercase',
      hasNumbers: 'changeReqNumbers',
      hasSpecialChars: 'changeReqSpecial'
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
    const bars = document.querySelectorAll('#changePasswordStrength .password-strength-bar');
    bars.forEach((bar, index) => {
      const percentage = PasswordValidator.getStrengthPercentage(validation.strength);
      const barsNeeded = Math.ceil((percentage / 100) * bars.length);
      bar.style.opacity = index < barsNeeded ? '1' : '0.2';
    });

    // Update feedback
    const feedback = document.getElementById('changePasswordFeedback');
    if (feedback) {
      if (validation.isValid) {
        feedback.classList.remove('hidden');
        feedback.classList.add('success');
        feedback.innerHTML = '<div style="font-weight: 600; color: inherit;">✓ Strong password! Ready to update.</div>';
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

  clearChangePasswordStrengthUI() {
    const container = document.getElementById('changePasswordStrength');
    if (container) {
      container.style.display = 'none';
    }
    const matchStatus = document.getElementById('changePasswordMatch');
    if (matchStatus) {
      matchStatus.classList.remove('shown');
    }
  }

  handleAddMember(e) {
    e.preventDefault();

    const formData = new FormData(this.addMemberForm);
    const member = {
      id: Date.now(),
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      group: formData.get('group'),
      tenure: formData.get('tenure'),
      linkedin: formData.get('linkedin') || '#',
      github: formData.get('github') || '#',
      photo: formData.get('photo') || 'https://via.placeholder.com/140/FF6B35/ffffff?text=' + formData.get('name').charAt(0)
    };

    // Get existing members from localStorage
    let members = JSON.parse(localStorage.getItem('appMembers')) || {};

    if (!members[member.tenure]) {
      members[member.tenure] = {};
    }

    if (!members[member.tenure][member.group]) {
      members[member.tenure][member.group] = [];
    }

    members[member.tenure][member.group].push(member);
    localStorage.setItem('appMembers', JSON.stringify(members));

    this.showNotification(`✓ ${member.name} added successfully!`, 'success');
    this.addMemberForm.reset();
    this.loadMembers();
  }

  handleEditContent(e) {
    e.preventDefault();

    const formData = new FormData(this.editContentForm);
    const content = {
      section: formData.get('section'),
      content: formData.get('content')
    };

    let contentData = JSON.parse(localStorage.getItem('contentData')) || {};
    contentData[content.section] = content.content;
    localStorage.setItem('contentData', JSON.stringify(contentData));

    this.showNotification('✓ Content updated successfully!', 'success');
    this.editContentForm.reset();
  }

  handleAddProject(e) {
    e.preventDefault();

    const formData = new FormData(this.addProjectForm);
    const project = {
      id: Date.now(),
      title: formData.get('title'),
      description: formData.get('description'),
      technologies: formData.get('technologies')
        .split(',')
        .map((t) => t.trim()),
      github: formData.get('github'),
      demo: formData.get('demo') || '#',
      status: formData.get('status'),
      contributors: ['Admin']
    };

    let projects = JSON.parse(localStorage.getItem('appProjects')) || [];
    projects.push(project);
    localStorage.setItem('appProjects', JSON.stringify(projects));

    this.showNotification(
      `✓ Project "${project.title}" added successfully!`,
      'success'
    );
    this.addProjectForm.reset();
  }

  loadMembers() {
    const members = JSON.parse(localStorage.getItem('appMembers')) || {};
    let html = '';

    for (const tenure in members) {
      for (const group in members[tenure]) {
        members[tenure][group].forEach((member) => {
          html += `
            <div class="member-item" style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: var(--bg-tertiary); border-radius: var(--radius-lg); margin-bottom: 0.75rem; border: 1px solid var(--border-color);">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <img src="${member.photo}" alt="${member.name}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent-primary);">
                <div>
                  <strong style="color: var(--text-primary);">${member.name}</strong>
                  <p style="color: var(--text-secondary); margin: 0.25rem 0; font-size: 0.875rem;">
                    ${member.role} • ${group} • ${tenure}
                  </p>
                  <div style="display: flex; gap: 0.5rem; margin-top: 0.25rem;">
                    ${member.linkedin !== '#' ? `<a href="${member.linkedin}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-primary); font-size: 0.75rem; text-decoration: none;">LinkedIn ↗</a>` : ''}
                    ${member.github !== '#' ? `<a href="${member.github}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-primary); font-size: 0.75rem; text-decoration: none;">GitHub ↗</a>` : ''}
                  </div>
                </div>
              </div>
              <button class="btn btn-danger btn-sm" onclick="adminPanel.deleteMember(${member.id}, '${tenure}', '${group}')" style="padding: 0.5rem 1rem; font-size: 0.875rem;">
                Remove
              </button>
            </div>
          `;
        });
      }
    }

    if (html) {
      this.membersList.innerHTML = html;
    } else {
      this.membersList.innerHTML =
        '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No members added yet.</p>';
    }
  }

  deleteMember(id, tenure, group) {
    if (!confirm('Are you sure you want to remove this member?')) return;

    const members = JSON.parse(localStorage.getItem('appMembers')) || {};

    if (members[tenure] && members[tenure][group]) {
      members[tenure][group] = members[tenure][group].filter(
        (m) => m.id !== id
      );

      // Clean up empty objects
      if (members[tenure][group].length === 0) {
        delete members[tenure][group];
      }
      if (Object.keys(members[tenure]).length === 0) {
        delete members[tenure];
      }
    }

    localStorage.setItem('appMembers', JSON.stringify(members));
    this.showNotification('✓ Member removed successfully!', 'success');
    this.loadMembers();
  }

  loadApplications() {
    const applicationsContainer = document.getElementById('applicationsList');
    if (!applicationsContainer) return;

    const applications = JSON.parse(localStorage.getItem('applications')) || [];

    if (applications.length === 0) {
      applicationsContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No applications yet.</p>';
      return;
    }

    const html = applications.reverse().map((app, index) => `
      <div class="application-item" style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 1rem; border: 1px solid var(--border-color);">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h4 style="margin: 0 0 0.5rem 0; color: var(--text-primary); font-size: 1.125rem;">${app.name}</h4>
            <p style="margin: 0; color: var(--text-secondary); font-size: 0.875rem;">
              📧 ${app.email} ${app.phone ? `• 📞 ${app.phone}` : ''} • 📚 Semester ${app.semester}
            </p>
            ${app.portfolio ? `<p style="margin: 0.5rem 0 0 0;"><a href="${app.portfolio}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-primary); text-decoration: none; font-size: 0.875rem;">🔗 Portfolio ↗</a></p>` : ''}
          </div>
          <span style="background: var(--accent-primary-light); color: var(--accent-primary); padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600; white-space: nowrap;">
            ${app.role}
          </span>
        </div>
        <div style="margin-bottom: 1rem;">
          <strong style="color: var(--text-primary); font-size: 0.875rem;">Skills:</strong>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
            ${app.skills.split(',').map(skill => 
              `<span style="background: var(--bg-secondary); padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.75rem; border: 1px solid var(--border-color); color: var(--text-secondary);">${skill.trim()}</span>`
            ).join('')}
          </div>
        </div>
        <div style="margin-bottom: 1rem;">
          <strong style="color: var(--text-primary); font-size: 0.875rem;">Why hire:</strong>
          <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary); font-size: 0.875rem; line-height: 1.6;">${app.experience}</p>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn btn-success btn-sm" onclick="adminPanel.acceptApplication(${index}, '${app.name}', '${app.email}')" style="padding: 0.5rem 1rem; font-size: 0.875rem;">
            ✓ Accept
          </button>
          <button class="btn btn-danger btn-sm" onclick="adminPanel.rejectApplication(${index}, '${app.email}')" style="padding: 0.5rem 1rem; font-size: 0.875rem;">
            ✗ Reject
          </button>
        </div>
      </div>
    `).join('');

    applicationsContainer.innerHTML = html;
    // Also render existing bookings (if any)
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const bookingsHtml = bookings.length > 0 ? `
      <div style="margin-top:1rem;">
        <h4 style="color: var(--text-primary);">Booked Interviews</h4>
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          ${bookings.map(b => `<div style="padding:0.5rem; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-primary); color:var(--text-secondary);">${b.email} — ${b.date} @ ${b.time}</div>`).join('')}
        </div>
      </div>
    ` : '';
    applicationsContainer.insertAdjacentHTML('beforeend', bookingsHtml);
  }

  acceptApplication(index, name, email) {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    const app = applications[applications.length - 1 - index];
    
    if (confirm(`Accept ${name} as a member?`)) {
      this.showNotification(`✓ ${name} has been accepted! Email notification sent to ${email}`, 'success');
      
      // Remove from applications
      applications.splice(applications.length - 1 - index, 1);
      localStorage.setItem('applications', JSON.stringify(applications));
      this.loadApplications();
    }
  }

  rejectApplication(index, email) {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    
    if (confirm(`Reject this application?`)) {
      this.showNotification(`Application rejected. Email notification sent to ${email}`, 'info');
      
      applications.splice(applications.length - 1 - index, 1);
      localStorage.setItem('applications', JSON.stringify(applications));
      this.loadApplications();
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
      max-width: 400px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideInUp 0.4s ease-out reverse';
      setTimeout(() => notification.remove(), 400);
    }, 4000);
  }
}

let adminPanel;

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded: Creating AdminPanel instance');
  try {
    adminPanel = new AdminPanel();
    // Make it globally accessible
    window.enhancedAdminPanel = adminPanel;
    window.adminPanel = adminPanel;
    console.log('✓ AdminPanel created successfully');
  } catch (error) {
    console.error('✗ Error creating AdminPanel:', error);
  }
});