// ============================================
// MAIN APPLICATION - THEME & CORE FUNCTIONALITY
// ============================================

class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('themeToggle');
    this.init();
  }

  init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);

    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}

// ============================================
// MAIN DEPARTMENT PORTAL
// ============================================

class DepartmentPortal {
  constructor() {
    this.currentTenure = '2025-26';
    this.currentGroup = 'leads';
    this.tenureBtns = document.querySelectorAll('.tenure-btn');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.mobileToggle = document.getElementById('mobileToggle');
    this.navMenu = document.getElementById('navMenu');
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderMemberDisplay('leads');
    this.renderProjects('all');
    this.renderResearch();
    this.renderAchievements('awards');
    this.renderGameDev('members');
    this.renderQuestSystem('leaderboard');
  }

  setupEventListeners() {
    // Tenure buttons
    this.tenureBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleTenureChange(e));
    });

    // Navigation links
    this.navLinks.forEach((link) => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });

    // Mobile menu toggle
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Member category tabs
    document.querySelectorAll('.category-tabs .tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleMemberTab(e));
    });

    // Project filters
    document.querySelectorAll('.project-filters .filter-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleProjectFilter(e));
    });

    // Achievement tabs
    document.querySelectorAll('.achievement-tabs .tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleAchievementTab(e));
    });

    // Game dev tabs
    document.querySelectorAll('.gamedev-tabs .tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleGameDevTab(e));
    });

    // Quest tabs
    document.querySelectorAll('.quest-tabs .tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleQuestTab(e));
    });
  }

handleNavClick(e) {
  const link = e.target.closest('.nav-link');
  if (!link) return;
  
  e.preventDefault();
  
  const href = link.getAttribute('href');
  if (href && href.startsWith('#')) {
    const target = document.querySelector(href);
    if (target) {
      const navbar = document.getElementById('navbar');
      const offset = navbar ? navbar.offsetHeight : 80;
      const targetPosition = target.offsetTop - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
  
  this.navLinks.forEach((l) => l.classList.remove('active'));
  link.classList.add('active');
  
  if (this.navMenu) this.navMenu.classList.remove('active');
}

  toggleMobileMenu() {
    if (this.navMenu) {
      this.navMenu.classList.toggle('active');
    }
  }

  handleTenureChange(e) {
    this.tenureBtns.forEach((btn) => btn.classList.remove('active'));
    e.target.classList.add('active');
    this.currentTenure = e.target.dataset.tenure;
    this.renderMemberDisplay(this.currentGroup);
  }

  handleMemberTab(e) {
    const group = e.target.dataset.group;
    document.querySelectorAll('.category-tabs .tab-btn').forEach((b) => b.classList.remove('active'));
    e.target.classList.add('active');
    this.currentGroup = group;
    this.renderMemberDisplay(group);
  }

  renderMemberDisplay(group) {
    const container = document.getElementById('memberDisplay');
    
    // Get members from localStorage first
    const storedMembers = JSON.parse(localStorage.getItem('appMembers')) || {};
    let members = [];

    // Get from stored data
    if (storedMembers[this.currentTenure] && storedMembers[this.currentTenure][group]) {
      members = storedMembers[this.currentTenure][group];
    } else if (appData.members[group]) {
      // Fallback to default data
      members = appData.members[group].filter((m) => m.tenure === this.currentTenure);
    }

    container.innerHTML = members.map((member) => this.createMemberCard(member)).join('');

    // Reapply animations
    const cards = container.querySelectorAll('.member-card');
    cards.forEach((card, index) => {
      card.style.animation = `fadeInUp 0.6s ease-out forwards`;
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }

  createMemberCard(person) {
    return `
      <div class="card member-card">
        <img src="${person.photo}" alt="${person.name}" class="pfp" loading="lazy" onerror="this.src='https://via.placeholder.com/140/FF6B35/ffffff?text=${person.name.charAt(0)}'">
        <h3>${person.name}</h3>
        <p>${person.role || 'Member'}</p>
        <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
          <a href="${person.linkedin}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="flex: 1; padding: 0.5rem; font-size: 0.75rem;">LinkedIn</a>
          <a href="${person.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="flex: 1; padding: 0.5rem; font-size: 0.75rem;">GitHub</a>
        </div>
      </div>
    `;
  }

  handleProjectFilter(e) {
    const filter = e.target.dataset.filter;
    document.querySelectorAll('.project-filters .filter-btn').forEach((b) => b.classList.remove('active'));
    e.target.classList.add('active');
    this.renderProjects(filter);
  }

  renderProjects(filter) {
    const container = document.getElementById('projectDisplay');
    
    // Get projects from localStorage first
    const storedProjects = JSON.parse(localStorage.getItem('appProjects')) || [];
    let projects = storedProjects.length > 0 ? storedProjects : appData.projects;

    if (filter !== 'all') {
      projects = projects.filter((p) => p.status === filter);
    }

    container.innerHTML = projects.map((project) => this.createProjectCard(project)).join('');

    const cards = container.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
      card.style.animation = `fadeInUp 0.6s ease-out forwards`;
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }

  createProjectCard(project) {
    return `
      <div class="card project-card">
        <h3>${project.title}</h3>
        <span class="project-status status-${project.status}" style="
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 1rem;
          ${project.status === 'ongoing' ? 'background: rgba(16, 185, 129, 0.15); color: #10b981;' : 'background: rgba(99, 102, 241, 0.15); color: #6366f1;'}
        ">
          ${project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
        <p>${project.description}</p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
          ${project.technologies.map((tech) => `<span style="display: inline-block; padding: 0.25rem 0.75rem; background: var(--bg-tertiary); color: var(--text-secondary); border-radius: 9999px; font-size: 0.75rem; border: 1px solid var(--border-color);">${tech}</span>`).join('')}
        </div>
        <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">
          <strong>Contributors:</strong> ${project.contributors.join(', ')}
        </p>
        <div style="display: flex; gap: 0.5rem;">
          <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="flex: 1;">GitHub</a>
          <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="flex: 1;">Demo</a>
        </div>
      </div>
    `;
  }

  renderResearch() {
    const container = document.getElementById('researchDisplay');
    const research = appData.research || [];
    
    container.innerHTML = research.map((paper) => this.createResearchCard(paper)).join('');

    const cards = container.querySelectorAll('.research-card');
    cards.forEach((card, index) => {
      card.style.animation = `fadeInUp 0.6s ease-out forwards`;
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }

  createResearchCard(paper) {
    return `
      <div class="card research-card">
        <h3>${paper.title}</h3>
        <p><strong>Authors:</strong> ${paper.authors}</p>
        <p><strong>Publication:</strong> ${paper.publication} (${paper.year})</p>
        <div style="display: flex; gap: 0.5rem;">
          <a href="${paper.pdf}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">📄 PDF</a>
          <a href="${paper.arxiv}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">📖 arXiv</a>
          <a href="https://doi.org/${paper.doi}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">🔗 DOI</a>
        </div>
      </div>
    `;
  }

  handleAchievementTab(e) {
    const type = e.target.dataset.type;
    document.querySelectorAll('.achievement-tabs .tab-btn').forEach((b) => b.classList.remove('active'));
    e.target.classList.add('active');
    this.renderAchievements(type);
  }

  renderAchievements(type) {
    const container = document.getElementById('achievementDisplay');
    const achievements = appData.achievements[type] || [];

    container.innerHTML = achievements.map((achievement) => this.createAchievementCard(achievement)).join('');

    const cards = container.querySelectorAll('.achievement-card');
    cards.forEach((card, index) => {
      card.style.animation = `fadeInUp 0.6s ease-out forwards`;
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }

  createAchievementCard(achievement) {
    return `
      <div class="card achievement-card">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">${achievement.icon}</div>
        <h3>${achievement.title}</h3>
        <p style="color: var(--accent-primary); font-weight: 600; margin-bottom: 0.5rem;">${achievement.year}</p>
        <p>${achievement.description}</p>
      </div>
    `;
  }

  handleGameDevTab(e) {
    const type = e.target.dataset.type;
    document.querySelectorAll('.gamedev-tabs .tab-btn').forEach((b) => b.classList.remove('active'));
    e.target.classList.add('active');
    this.renderGameDev(type);
  }

  renderGameDev(type) {
    const container = document.getElementById('gamedevDisplay');
    const data = appData.gameDev[type] || [];
    let html = '';

    if (type === 'members') {
      html = data.map((member, idx) => `
        <div class="gamedev-card gamedev-member-card" style="animation-delay: ${idx * 0.1}s;">
          <div class="gamedev-card-inner">
            <div class="gamedev-card-avatar">
              <img src="${member.photo}" alt="${member.name}" class="pfp" loading="lazy" onerror="this.src='https://via.placeholder.com/140/FF6B35/ffffff?text=${member.name.charAt(0)}'">
              <div class="gamedev-card-overlay">
                <span class="gamedev-badge">Developer</span>
              </div>
            </div>
            <div class="gamedev-card-content">
              <h3 class="gamedev-card-title">${member.name}</h3>
              <p class="gamedev-card-role">Game Development</p>
              <div class="gamedev-card-footer">
                <span class="gamedev-card-stat">🎮 Active</span>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    } else if (type === 'projects') {
      html = data.map((proj, idx) => `
        <div class="gamedev-card gamedev-project-card" style="animation-delay: ${idx * 0.1}s;">
          <div class="gamedev-card-header">
            <span class="gamedev-project-icon">🎮</span>
            <span class="gamedev-project-badge">Live</span>
          </div>
          <div class="gamedev-card-content">
            <h3 class="gamedev-card-title">${proj.title}</h3>
            <p class="gamedev-card-desc">Innovative game development project</p>
            <div class="gamedev-card-actions">
              <a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="gamedev-btn gamedev-btn-primary">
                <span>View on GitHub</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      `).join('');
    } else if (type === 'tools') {
      const toolIcons = {
        'Unity': '🎮',
        'Godot': '🦆',
        'Unreal Engine': '🚀',
        'Custom C++ Engine': '⚙️'
      };
      html = data.map((tool, idx) => `
        <div class="gamedev-card gamedev-tool-card gamedev-card-interactive" style="animation-delay: ${idx * 0.1}s;">
          <div class="gamedev-tool-icon">${toolIcons[tool] || '🔧'}</div>
          <h3 class="gamedev-card-title">${tool}</h3>
          <div class="gamedev-card-hover-info">
            <p style="font-size: 0.875rem; color: var(--text-secondary);">Professional development tool</p>
          </div>
        </div>
      `).join('');
    } else if (type === 'events') {
      html = data.map((event, idx) => `
        <div class="gamedev-card gamedev-event-card" style="animation-delay: ${idx * 0.1}s;">
          <div class="gamedev-event-header">
            <span class="gamedev-event-badge">Upcoming</span>
          </div>
          <div class="gamedev-card-content">
            <h3 class="gamedev-card-title">${event.title}</h3>
            <div class="gamedev-event-meta">
              <span class="gamedev-event-date">📅 ${event.date}</span>
            </div>
            <div class="gamedev-event-footer">
              <button class="gamedev-btn gamedev-btn-sm gamedev-btn-outline">Learn More</button>
            </div>
          </div>
        </div>
      `).join('');
    }

    container.innerHTML = html;

    const cards = container.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.style.animation = `fadeInUp 0.6s ease-out forwards`;
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }

  handleQuestTab(e) {
    const type = e.target.dataset.type;
    document.querySelectorAll('.quest-tabs .tab-btn').forEach((b) => b.classList.remove('active'));
    e.target.classList.add('active');
    this.renderQuestSystem(type);
  }

  renderQuestSystem(type) {
    const container = document.getElementById('questDisplay');
    const data = appData.questSystem[type] || [];
    let html = '';

    if (type === 'leaderboard') {
      html = `
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-color);">
                <th style="padding: 1rem; text-align: left; font-weight: 600; color: var(--text-primary);">Rank</th>
                <th style="padding: 1rem; text-align: left; font-weight: 600; color: var(--text-primary);">Name</th>
                <th style="padding: 1rem; text-align: left; font-weight: 600; color: var(--text-primary);">Points</th>
                <th style="padding: 1rem; text-align: left; font-weight: 600; color: var(--text-primary);">Contributions</th>
              </tr>
            </thead>
            <tbody>
              ${data.map((entry) => `
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 1rem; color: var(--text-secondary);">#${entry.rank}</td>
                  <td style="padding: 1rem; color: var(--text-primary);">${entry.name}</td>
                  <td style="padding: 1rem;"><strong style="color: var(--accent-success);">${entry.points}</strong></td>
                  <td style="padding: 1rem; color: var(--text-secondary);">${entry.contributions}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (type === 'contributions') {
      html = data.map((contrib) => `
        <div class="card">
          <h3>${contrib.user}</h3>
          <p style="color: var(--text-secondary); margin-bottom: 0.625rem;">${contrib.contribution}</p>
          <p style="color: var(--text-tertiary); font-size: 0.875rem; margin-bottom: 0.5rem;">📅 ${contrib.date}</p>
          <p style="color: var(--accent-success); font-weight: 600;">+${contrib.points} points</p>
        </div>
      `).join('');
    } else if (type === 'winners') {
      html = data.map((winner) => `
        <div class="card" style="text-align: center;">
          <h3>🏆 ${winner.month}</h3>
          <p style="color: var(--accent-success); font-size: 1.125rem; margin: 0.625rem 0;">${winner.winner}</p>
          <p style="color: var(--text-secondary);">${winner.reward}</p>
        </div>
      `).join('');
    }

    container.innerHTML = html;
  }
}

// ============================================
// INITIALIZE APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new DepartmentPortal();
});