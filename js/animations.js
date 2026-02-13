// ============================================
// CURSOR & ANIMATION TRIGGERS
// ============================================

class CursorManager {
  constructor() {
    this.cursor = document.querySelector('.cursor');
    this.cursorDot = document.querySelector('.cursor-dot');
    this.mouseX = 0;
    this.mouseY = 0;
    this.init();
  }

  init() {
    // Move cursor with mouse
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (this.cursor) {
        this.cursor.style.left = this.mouseX - 10 + 'px';
        this.cursor.style.top = this.mouseY - 10 + 'px';
      }

      if (this.cursorDot) {
        this.cursorDot.style.left = this.mouseX - 2 + 'px';
        this.cursorDot.style.top = this.mouseY - 2 + 'px';
      }
    });

    // Cursor effects on clickable elements
    this.addCursorEffects();

    // Hide cursor when leaving viewport
    document.addEventListener('mouseleave', () => {
      if (this.cursor) this.cursor.style.opacity = '0';
      if (this.cursorDot) this.cursorDot.style.opacity = '0';
    });

    // Show cursor when entering viewport
    document.addEventListener('mouseenter', () => {
      if (this.cursor) this.cursor.style.opacity = '1';
      if (this.cursorDot) this.cursorDot.style.opacity = '1';
    });

    // Add click ripple effect
    document.addEventListener('click', (e) => {
      this.createRipple(e);
    });
  }

  addCursorEffects() {
    // Links and buttons
    const interactiveElements = document.querySelectorAll(
      'a, button, input[type="button"], input[type="submit"], .clickable'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (this.cursor) {
          this.cursor.style.width = '30px';
          this.cursor.style.height = '30px';
          this.cursor.style.borderColor = 'var(--accent-primary)';
          this.cursor.style.boxShadow = '0 0 20px rgba(255, 107, 53, 0.8)';
        }
      });

      el.addEventListener('mouseleave', () => {
        if (this.cursor) {
          this.cursor.style.width = '20px';
          this.cursor.style.height = '20px';
          this.cursor.style.borderColor = 'var(--accent-primary)';
          this.cursor.style.boxShadow = '0 0 10px rgba(255, 107, 53, 0.5)';
        }
      });
    });
  }

  createRipple(e) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed;
      pointer-events: none;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 10px;
      height: 10px;
      background: var(--accent-primary);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: ripple 0.6s ease-out forwards;
      z-index: 9998;
    `;
    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

class ScrollAnimationManager {
  constructor() {
    this.observedElements = document.querySelectorAll(
      '.section, .card, .btn, .stat-item'
    );
    this.init();
  }

  init() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.observedElements.forEach((el) => {
      observer.observe(el);
    });
  }
}

// ============================================
// PARALLAX EFFECT
// ============================================

class ParallaxManager {
  constructor() {
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      this.updateParallax();
    });
  }

  updateParallax() {
    const scrolled = window.pageYOffset;
    const blobs = document.querySelectorAll('.gradient-blob');

    blobs.forEach((blob, index) => {
      const yPos = scrolled * (0.5 + index * 0.2);
      blob.style.transform = `translateY(${yPos}px)`;
    });
  }
}

// ============================================
// TEXT ANIMATION ON SCROLL
// ============================================

class TextAnimationManager {
  constructor() {
    this.animateTextOnScroll();
  }

  animateTextOnScroll() {
    const elements = document.querySelectorAll('.section-title, .hero-title');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateTitle(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    elements.forEach((el) => observer.observe(el));
  }

  animateTitle(element) {
    element.style.animation = 'slideInUp 0.8s ease-out forwards';
  }
}

// ============================================
// NAVBAR ANIMATIONS
// ============================================

class NavbarAnimationManager {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.init();
  }

  init() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 50) {
        this.navbar.style.boxShadow = 'var(--shadow-lg)';
        this.navbar.style.backdropFilter = 'blur(15px)';
      } else {
        this.navbar.style.boxShadow = 'var(--shadow-sm)';
        this.navbar.style.backdropFilter = 'blur(10px)';
      }
    });

    // Active link highlighting
    window.addEventListener('scroll', () => {
      this.updateActiveLink();
    });
  }

  updateActiveLink() {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        this.navLinks.forEach((link) => link.classList.remove('active'));
        const activeLink = document.querySelector(
          `.nav-link[href="#${section.id}"]`
        );
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }
}

// ============================================
// CARD HOVER ANIMATIONS
// ============================================

class CardAnimationManager {
  constructor() {
    this.cards = document.querySelectorAll(
      '.member-card, .project-card, .research-card, .achievement-card'
    );
    this.init();
  }

  init() {
    this.cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }
}

// ============================================
// BUTTON ANIMATIONS
// ============================================

class ButtonAnimationManager {
  constructor() {
    this.buttons = document.querySelectorAll('.btn');
    this.init();
  }

  init() {
    this.buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        this.createButtonRipple(e, btn);
      });
    });
  }

  createButtonRipple(e, btn) {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
      animation: ripple 0.6s ease-out forwards;
    `;

    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }
}

// ============================================
// FORM ANIMATIONS
// ============================================

class FormAnimationManager {
  constructor() {
    this.formInputs = document.querySelectorAll('input, textarea, select');
    this.init();
  }

  init() {
    this.formInputs.forEach((input) => {
      input.addEventListener('focus', () => {
        input.style.transform = 'scale(1.02)';
        input.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.2)';
      });

      input.addEventListener('blur', () => {
        input.style.transform = 'scale(1)';
        input.style.boxShadow = 'none';
      });
    });
  }
}

// ============================================
// PAGE LOAD ANIMATION
// ============================================

class PageLoadManager {
  constructor() {
    this.init();
  }

  init() {
    window.addEventListener('load', () => {
      document.body.style.opacity = '1';
      this.animateElements();
    });
  }

  animateElements() {
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.animation = 'fadeInUp 0.6s ease-out forwards';
      }, index * 100);
    });
  }
}

// ============================================
// INITIALIZE ALL ANIMATIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  new CursorManager();
  new ScrollAnimationManager();
  new ParallaxManager();
  new TextAnimationManager();
  new NavbarAnimationManager();
  new CardAnimationManager();
  new ButtonAnimationManager();
  new FormAnimationManager();
  new PageLoadManager();
  // Typing animation for hero code card
  try { new TypingManager(); } catch (e) { /* ignore if missing */ }
});

// ============================================
// TYPING MANAGER - types code lines in hero
// ============================================
class TypingManager {
  constructor() {
    this.el = document.querySelector('.code-output');
    this.cursor = document.querySelector('.typing-cursor');
    this.lines = [
      "const Projects = {",
      "  innovation: 'limitless',",
      "  collaboration: 'essential',",
      "  impact: 'global'",
      "};"
    ];
    this.lineDelay = 600; // ms between lines
    this.charDelay = 30; // ms between chars
    this.restartDelay = 2000; // wait after full block
    this._stopped = false;
    if (this.el) this.start();
  }

  // Color mapping for syntax highlighting
  getColorForToken(token) {
    if (/^const|let|var$/.test(token)) return '#ec2395'; // pink for keywords
    if (/^[A-Z]/.test(token)) return '#45d9fa'; // light blue for class/var names
    if (/^[a-z_]/.test(token)) return '#00ff88'; // green for properties
    if (/^['"]/.test(token)) return '#ffa500'; // orange for strings
    return '#ffffff'; // white for default
  }

  tokenizeLine(line) {
    const tokens = [];
    let current = '';
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      // Handle strings
      if ((char === '"' || char === "'") && !inString) {
        if (current) tokens.push({ text: current, color: this.getColorForToken(current) });
        current = '';
        inString = true;
        stringChar = char;
        current += char;
      } else if (char === stringChar && inString && line[i - 1] !== '\\') {
        current += char;
        tokens.push({ text: current, color: '#ffa500' });
        current = '';
        inString = false;
      } else if (inString) {
        current += char;
      } else if (/[\s:{}[\]=,;]/.test(char)) {
        if (current) tokens.push({ text: current, color: this.getColorForToken(current) });
        tokens.push({ text: char, color: '#8c00ff' });
        current = '';
      } else {
        current += char;
      }
    }
    if (current) tokens.push({ text: current, color: this.getColorForToken(current) });
    return tokens;
  }

  async start() {
    while (!this._stopped) {
      await this.typeBlock();
      await this.wait(this.restartDelay);
      await this.clearBlock();
      await this.wait(600);
    }
  }

  async typeBlock() {
    // clear previous content
    this.el.textContent = '';
    // ensure no leftover anchor
    const oldAnchor = this.el.querySelector('.caret-anchor');
    if (oldAnchor) oldAnchor.remove();
    for (let i = 0; i < this.lines.length; i++) {
      await this.typeLine(this.lines[i]);
      // add line break as a text node
      this.el.appendChild(document.createTextNode('\n'));
      await this.wait(this.lineDelay);
    }
  }

  async typeLine(line) {
    const tokens = this.tokenizeLine(line);
    
    for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
      const token = tokens[tokenIndex];
      
      for (let charIndex = 0; charIndex < token.text.length; charIndex++) {
        const char = token.text[charIndex];
        
        // Create span for colored character
        const charSpan = document.createElement('span');
        charSpan.style.color = token.color;
        charSpan.textContent = char;
        this.el.appendChild(charSpan);
        
        // ensure caret anchor exists at end
        let anchor = this.el.querySelector('.caret-anchor');
        if (!anchor) {
          anchor = document.createElement('span');
          anchor.className = 'caret-anchor';
          anchor.style.display = 'inline-block';
          anchor.style.width = '0px';
          anchor.style.height = '1em';
          this.el.appendChild(anchor);
        } else {
          // move it to end
          this.el.appendChild(anchor);
        }
        this.updateCursorPosition();
        await this.wait(this.charDelay + Math.random() * 40);
      }
    }
  }

  async clearBlock() {
    // remove contents and anchor
    const anchor = this.el.querySelector('.caret-anchor');
    if (anchor) anchor.remove();
    this.el.textContent = '';
    this.updateCursorPosition();
  }

  updateCursorPosition() {
    if (!this.cursor || !this.el) return;
    const anchor = this.el.querySelector('.caret-anchor');
    const card = this.el.parentElement || this.el;
    
    if (!anchor) {
      // place cursor at start
      this.cursor.style.left = '12px';
      this.cursor.style.top = '12px';
      return;
    }

    // Use requestAnimationFrame for smooth cursor movement
    requestAnimationFrame(() => {
      const anchorRect = anchor.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      
      // Calculate position with precise offset
      const left = Math.max(8, anchorRect.left - cardRect.left + anchorRect.width);
      const top = Math.max(8, anchorRect.top - cardRect.top);
      
      // Use transform for better performance (GPU accelerated)
      //this.cursor.style.transform = `translate(${left}px, ${top}px)`;
      
      // Keep left/top for compatibility
      this.cursor.style.left = left + 'px';
      this.cursor.style.top = top + 'px';
      
      // Ensure cursor is visible
      if (this.cursor.style.opacity === '0') {
        this.cursor.style.opacity = '1';
      }
    });
  }

  wait(ms) { return new Promise((res) => setTimeout(res, ms)); }
}