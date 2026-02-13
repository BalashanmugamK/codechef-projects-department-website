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
    this.renderEvents('upcoming');
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

    // Events tabs
    document.querySelectorAll('[id="events"] .tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleEventTab(e));
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

    // Apply carousel mode for regular members with more than 10 members
    if (group === 'members' && members.length > 10) {
      container.classList.add('carousel-mode');
    } else {
      container.classList.remove('carousel-mode');
    }

    // Apply larger cards for leads
    if (group === 'leads') {
      container.classList.add('leads-grid');
    } else {
      container.classList.remove('leads-grid');
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
            <a href="${person.linkedin}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="flex: 1; padding: 0.5rem; font-size: 0.75rem; display:flex; align-items:center; gap:0.5rem; justify-content:center;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM21 19h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              <span>LinkedIn</span>
            </a>
            <a href="${person.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="flex: 1; padding: 0.5rem; font-size: 0.75rem; display:flex; align-items:center; gap:0.5rem; justify-content:center;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <span>GitHub</span>
            </a>
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

    // Reset carousel setup flag to allow reinitialization with same speed
    container.dataset.carouselSetup = '';

    // Apply carousel mode if more than 3 projects
    if (projects.length > 3) {
      container.classList.add('carousel-mode');
      // Triple the cards for infinite carousel loop
      const cardsHTML = projects.map((project) => this.createProjectCard(project)).join('');
      container.innerHTML = cardsHTML + cardsHTML + cardsHTML;
    } else {
      container.classList.remove('carousel-mode');
      container.innerHTML = projects.map((project) => this.createProjectCard(project)).join('');
    }

    const cards = container.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
      card.style.animation = `fadeInUp 0.6s ease-out forwards`;
      card.style.animationDelay = `${index * 0.05}s`;
    });

    // Setup carousel animation if needed - will use constant speed
    if (projects.length > 3) {
      this.setupCarouselAutoScroll(container);
    }
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
          <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="flex: 1; display:flex; align-items:center; gap:0.5rem; justify-content:center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            <span>GitHub</span>
          </a>
          <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="flex: 1; display:flex; align-items:center; gap:0.5rem; justify-content:center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 17L17 7M17 7H7M17 7V17"></path></svg>
            <span>Demo</span>
          </a>
        </div>
      </div>
    `;
  }

  renderResearch() {
    const container = document.getElementById('researchDisplay');
    const research = appData.research || [];
    
    // Reset carousel setup flag to allow reinitialization with same speed
    container.dataset.carouselSetup = '';
    
    // Apply carousel mode if more than 3 research items
    if (research.length > 3) {
      container.classList.add('carousel-mode');
      // Triple the cards for infinite carousel loop
      const cardsHTML = research.map((paper) => this.createResearchCard(paper)).join('');
      container.innerHTML = cardsHTML + cardsHTML + cardsHTML;
    } else {
      container.classList.remove('carousel-mode');
      container.innerHTML = research.map((paper) => this.createResearchCard(paper)).join('');
    }

    const cards = container.querySelectorAll('.research-card');
    cards.forEach((card, index) => {
      card.style.animation = `fadeInUp 0.6s ease-out forwards`;
      card.style.animationDelay = `${index * 0.05}s`;
    });

    // Setup carousel animation if needed
    if (research.length > 3) {
      this.setupCarouselAutoScroll(container);
    }
  }

  createResearchCard(paper) {
    return `
      <div class="card research-card" style="display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: start; gap: 1rem; margin-bottom: 1rem;">
          <div style="flex: 1;">
            <h3 style="margin: 0 0 0.5rem 0; color: var(--text-primary);">${paper.title}</h3>
            <p style="margin: 0; color: var(--text-secondary); font-size: 0.875rem;"><strong>Authors:</strong> ${paper.authors}</p>
            <p style="margin: 0.25rem 0 0 0; color: var(--text-secondary); font-size: 0.875rem;"><strong>Publication:</strong> ${paper.publication} (${paper.year})</p>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-direction: column; flex-shrink: 0;">
            <a href="${paper.pdf}" target="_blank" rel="noopener noreferrer" title="View PDF" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); background: rgba(255, 107, 53, 0.15); color: var(--accent-primary); font-size: 1.2rem; text-decoration: none; transition: all 0.3s;">
              📄
            </a>
            <a href="${paper.arxiv}" target="_blank" rel="noopener noreferrer" title="View arXiv" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); background: rgba(255, 107, 53, 0.15); color: var(--accent-primary); font-size: 1.2rem; text-decoration: none; transition: all 0.3s;">
              📖
            </a>
            <a href="https://doi.org/${paper.doi}" target="_blank" rel="noopener noreferrer" title="View DOI" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); background: rgba(255, 107, 53, 0.15); color: var(--accent-primary); font-size: 1.2rem; text-decoration: none; transition: all 0.3s;">
              🔗
            </a>
          </div>
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
      html = `
        <div style="background: linear-gradient(135deg, var(--accent-primary-light), rgba(102, 126, 234, 0.1)); padding: 1.5rem; border-radius: 1rem; margin-bottom: 1.5rem; border-left: 4px solid var(--accent-primary);">
          <h3 style="margin-top: 0; color: var(--text-primary);">Game Development Team</h3>
          <p style="color: var(--text-secondary); margin: 0;">Passionate developers creating innovative interactive experiences using cutting-edge game engines and technologies.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;">
          ${data.map((member, idx) => `
            <div class="card" style="animation-delay: ${idx * 0.1}s; text-align: center;">
              <img src="${member.photo}" alt="${member.name}" class="pfp" style="margin-bottom: 1rem;" loading="lazy" onerror="this.src='https://via.placeholder.com/140/FF6B35/ffffff?text=${member.name.charAt(0)}'">
              <h4 style="margin: 0 0 0.5rem 0; color: var(--text-primary);">${member.name}</h4>
              <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0;">Game Developer</p>
            </div>
          `).join('')}
        </div>
      `;
    } else if (type === 'projects') {
      html = `
        <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(102, 126, 234, 0.1)); padding: 1.5rem; border-radius: 1rem; margin-bottom: 1.5rem; border-left: 4px solid var(--accent-info);">
          <h3 style="margin-top: 0; color: var(--text-primary);">Featured Game Projects</h3>
          <p style="color: var(--text-secondary); margin: 0;">Showcase of games and interactive experiences developed by the Game Development Wing.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          ${data.map((proj, idx) => `
            <div class="card" style="animation-delay: ${idx * 0.1}s;">
              <div style="background: linear-gradient(135deg, var(--accent-info), var(--accent-primary)); padding: 2rem; border-radius: 0.75rem; text-align: center; margin-bottom: 1rem;">
                <span style="font-size: 2.5rem; display: block;">🎮</span>
              </div>
              <h4 style="margin: 0 0 0.75rem 0; color: var(--text-primary);">${proj.title}</h4>
              <a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width: 100%;">
                View on GitHub ↗
              </a>
            </div>
          `).join('')}
        </div>
      `;
    } else if (type === 'tools') {
      const toolIcons = {
        'Unity': '🎮',
        'Godot': '🦆',
        'Unreal Engine': '🚀',
        'Custom C++ Engine': '⚙️'
      };
      html = `
        <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(255, 107, 53, 0.1)); padding: 1.5rem; border-radius: 1rem; margin-bottom: 1.5rem; border-left: 4px solid var(--accent-warning);">
          <h3 style="margin-top: 0; color: var(--text-primary);">Development Tools & Engines</h3>
          <p style="color: var(--text-secondary); margin: 0;">Professional-grade tools and engines used by our game development team.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
          ${data.map((tool, idx) => `
            <div class="card" style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 180px; animation-delay: ${idx * 0.1}s;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">${toolIcons[tool] || '🔧'}</div>
              <h4 style="margin: 0; color: var(--text-primary);">${tool}</h4>
              <p style="color: var(--text-secondary); font-size: 0.825rem; margin: 0.5rem 0 0 0;">Professional Tool</p>
            </div>
          `).join('')}
        </div>
      `;
    } else if (type === 'events') {
      html = `
        <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(102, 126, 234, 0.1)); padding: 1.5rem; border-radius: 1rem; margin-bottom: 1.5rem; border-left: 4px solid var(--accent-success);">
          <h3 style="margin-top: 0; color: var(--text-primary);">Game Dev Events & Workshops</h3>
          <p style="color: var(--text-secondary); margin: 0;">Upcoming and recent events organized by the Game Development Wing.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
          ${data.map((event, idx) => `
            <div class="card" style="border-left: 4px solid var(--accent-success); animation-delay: ${idx * 0.1}s;">
              <div style="background: linear-gradient(135deg, var(--accent-success), var(--accent-tertiary)); color: white; padding: 0.75rem 1rem; border-radius: 0.5rem; display: inline-block; margin-bottom: 1rem; font-size: 0.8rem; font-weight: 600;">
                UPCOMING
              </div>
              <h4 style="margin: 0 0 0.5rem 0; color: var(--text-primary);">${event.title}</h4>
              <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0;">
                <span style="display: flex; align-items: center; gap: 0.5rem;">📅 ${event.date}</span>
              </p>
              <button class="btn btn-secondary" style="width: 100%; margin-top: 1rem;">Learn More</button>
            </div>
          `).join('')}
        </div>
      `;
    }

    container.innerHTML = html;

    const cards = container.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.style.animation = `fadeInUp 0.6s ease-out forwards`;
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }

  setupCarouselAutoScroll(container) {
    // Cancel any existing animation on this container
    if (container._autoScrollAnimationId) {
      cancelAnimationFrame(container._autoScrollAnimationId);
    }

    // Prevent multiple initializations - allow re-init by resetting flag
    container.dataset.carouselSetup = 'true';

    let isHovering = false;
    const scrollSpeed = 1; // pixels per frame - constant speed

    const performAutoScroll = () => {
      if (!isHovering && container.scrollWidth > container.clientWidth) {
        // Smoothly increment scroll position
        container.scrollLeft += scrollSpeed;

        // Check if we've reached the end
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 2) {
          // Reached end, smoothly reset without pause
          container.scrollLeft = 0;
        }
      }
      // Always continue animation loop for constant speed
      container._autoScrollAnimationId = requestAnimationFrame(performAutoScroll);
    };

    const stopAutoScroll = () => {
      isHovering = true;
    };

    const startAutoScroll = () => {
      isHovering = false;
    };

    // Add hover listeners
    container.addEventListener('mouseenter', stopAutoScroll, { passive: true });
    container.addEventListener('mouseleave', startAutoScroll, { passive: true });

    // Pause when hovering individual cards (magnify effect)
    const cards = container.querySelectorAll('.card');
    cards.forEach((card) => {
      card.addEventListener('mouseenter', stopAutoScroll, { passive: true });
      card.addEventListener('mouseleave', startAutoScroll, { passive: true });
    });

    // Start carousel immediately - no delay for constant animation
    container._autoScrollAnimationId = requestAnimationFrame(performAutoScroll);
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
        <div class="leaderboard-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team Name</th>
                <th>Votes (0-50)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${data.map((entry) => `
                <tr style="border-bottom: 1px solid var(--border-color); transition: all 0.2s; cursor: pointer;" onmouseover="this.style.background='var(--bg-tertiary)'" onmouseout="this.style.background='transparent'">
                  <td style="text-align: center;">#${entry.rank}</td>
                  <td>${entry.teamName}</td>
                  <td style="text-align: center;">
                    <div style="display: inline-block; background: linear-gradient(90deg, var(--accent-success), var(--accent-primary)); color: white; padding: 0.5rem 1rem; border-radius: 9999px; font-weight: 700; font-size: 1rem;">
                      ${entry.votes}/50
                    </div>
                  </td>
                  <td style="text-align: center;">
                    <button class="btn btn-secondary" style="padding: 0.5rem 1.2rem; font-size: 0.95rem;" onclick="window.showTeamMembers('${entry.teamName}', ${JSON.stringify(entry.members)})">View Members</button>
                  </td>
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

  handleEventTab(e) {
    const type = e.target.dataset.type;
    document.querySelectorAll('[id="events"] .tab-btn').forEach((b) => b.classList.remove('active'));
    e.target.classList.add('active');
    this.renderEvents(type);
  }

  renderEvents(type) {
    const container = document.getElementById('eventsDisplay');
    const events = appData.events || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filteredEvents = [];
    if (type === 'all') {
      filteredEvents = [...events];
    } else if (type === 'upcoming') {
      filteredEvents = events.filter(e => new Date(e.date) >= today);
    } else {
      filteredEvents = events.filter(e => new Date(e.date) < today);
    }

    // Sort events: upcoming asc, past desc, all asc
    filteredEvents.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return type === 'past' ? bDate - aDate : aDate - bDate;
    });

    // Reset carousel setup flag to allow reinitialization
    container.dataset.carouselSetup = '';

    if (filteredEvents.length === 0) {
      container.classList.remove('carousel-mode');
      container.innerHTML = `<div class="card" style="text-align: center; padding: 3rem; grid-column: 1 / -1;">No ${type} events</div>`;
      return;
    }

    const cardsHTML = filteredEvents.map((event) => {
      const eventDate = new Date(event.date);
      const isUpcoming = eventDate >= today;
      const daysDiff = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
      const soonLabel = isUpcoming && daysDiff <= 14 ? 'Happening Soon' : '';
      const typeLabel = event.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) : 'Event';

      return `
      <div class="card event-card ${isUpcoming ? 'event-upcoming' : 'event-past'}">
        <div class="event-header">
          <span class="event-chip">${typeLabel}</span>
          ${soonLabel ? `<span class="event-pill">${soonLabel}</span>` : ''}
        </div>
        <h3 class="event-title">${event.title}</h3>
        <div class="event-meta">
          <span>📅 ${eventDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</span>
          <span>🕐 ${event.time}</span>
        </div>
        <p class="event-description">${event.description}</p>
        <div class="event-footer">
          <span class="event-location">📍 ${event.location}</span>
          ${event.link ? `<a href="${event.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary event-cta">Learn More ↗</a>` : ''}
        </div>
      </div>`;
    }).join('');

    // Apply carousel mode if more than 3 events
    if (filteredEvents.length > 3) {
      container.classList.add('carousel-mode');
      container.innerHTML = cardsHTML + cardsHTML + cardsHTML;
      this.setupCarouselAutoScroll(container);
    } else {
      container.classList.remove('carousel-mode');
      container.innerHTML = cardsHTML;
    }
  }
}

// ============================================
// INITIALIZE APPLICATION
// ============================================

// Dialog box helper function
function showDialog(title, message, onConfirm = null) {
  const overlay = document.createElement('div');
  overlay.className = 'dialog-overlay active';
  overlay.innerHTML = `
    <div class="dialog-box">
      <h2>${title}</h2>
      <p>${message}</p>
      <div class="dialog-box-buttons">
        <button class="btn btn-secondary" onclick="this.closest('.dialog-overlay').remove();">Cancel</button>
        <button class="btn btn-primary" id="dialogConfirm">OK</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  
  overlay.querySelector('#dialogConfirm').addEventListener('click', () => {
    overlay.remove();
    if (onConfirm) onConfirm();
  });
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

// Show team members in dialog
function showTeamMembers(teamName) {
  const members = ['Member 1', 'Member 2', 'Member 3']; // Placeholder
  let memberHTML = members.map(m => `<li style="margin: 0.5rem 0; color: var(--text-secondary);">✓ ${m}</li>`).join('');
  
  const overlay = document.createElement('div');
  overlay.className = 'dialog-overlay active';
  overlay.innerHTML = `
    <div class="dialog-box" style="max-width: 600px;">
      <h2>${teamName} - Members</h2>
      <ul style="list-style: none; padding: 0; margin: 1rem 0;">${memberHTML}</ul>
      <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 1rem 0 0 0;"><strong>Contributions:</strong> Code reviews, Feature development, Bug fixes</p>
      <div class="dialog-box-buttons" style="margin-top: 1.5rem;">
        <button class="btn btn-primary" onclick="this.closest('.dialog-overlay').remove();">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new DepartmentPortal();
  // Ensure admin-aware navigation: prevent user actions while admin logged in
  try {
    const joinBtn = document.getElementById('joinTeamBtn');
    if (joinBtn) {
      joinBtn.addEventListener('click', (e) => {
        const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (current && current.role === 'admin') {
          showDialog('Admin Session Active', 'You are currently logged in as admin. Admins are already team members. Logout admin to apply as a user?', () => {
            try { window.authManager && window.authManager.logout(); } catch(e){}
          });
          e.preventDefault();
        }
      }, { capture: true });
    }

    const userLoginBtn = document.getElementById('userLoginBtn');
    if (userLoginBtn) {
      userLoginBtn.addEventListener('click', (e) => {
        const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (current && current.role === 'admin') {
          showDialog('Admin Session Active', 'You are logged in as admin. Logout admin session to open User Login?', () => {
            try { window.authManager && window.authManager.logout(); } catch(e){}
          });
          e.preventDefault();
        }
      }, { capture: true });
    }
  } catch (e) {
    console.warn('Admin-aware nav initialization failed', e);
  }
});