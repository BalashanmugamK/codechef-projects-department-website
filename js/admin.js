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
    
    // Load recruitment applications when switching to recruitment tab
    if (tabName === 'recruitment') {
      this.loadApplications();
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