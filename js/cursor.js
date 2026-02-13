// ============================================
// RAINBOW GRADIENT CURSOR - COMPLETE
// ============================================

class RainbowCursor {
  constructor() {
    this.cursor = null;
    this.cursorDot = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.dotX = 0;
    this.dotY = 0;
    this.speed = 0.2;
    this.dotSpeed = 0.2;
    
    this.init();
  }

  init() {
    // Only initialize on desktop
    if (window.innerWidth <= 1024) {
      return;
    }

    this.cursor = document.querySelector('.cursor');
    this.cursorDot = document.querySelector('.cursor-dot');
    
    if (!this.cursor || !this.cursorDot) {
      console.warn('Cursor elements not found');
      return;
    }

    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      // Sync dot position immediately for perfect cursor synchronization
      this.dotX = this.mouseX;
      this.dotY = this.mouseY;
    });

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

    // Click effect
    document.addEventListener('mousedown', () => {
      if (this.cursor) this.cursor.classList.add('clicking');
      if (this.cursorDot) this.cursorDot.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
      if (this.cursor) this.cursor.classList.remove('clicking');
      if (this.cursorDot) this.cursorDot.classList.remove('clicking');
    });

    // Hover effects for interactive elements
    this.addHoverEffects();
  }

  addHoverEffects() {
    const interactiveElements = 'a, button, input[type="button"], input[type="submit"], .btn, [role="button"], .clickable';
    
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveElements)) {
        if (this.cursor) this.cursor.classList.add('hover');
        if (this.cursorDot) this.cursorDot.classList.add('hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveElements)) {
        if (this.cursor) this.cursor.classList.remove('hover');
        if (this.cursorDot) this.cursorDot.classList.remove('hover');
      }
    });
  }

  animate() {
    // Smooth follow animation using easing
    this.cursorX += (this.mouseX - this.cursorX) * this.speed;
    this.cursorY += (this.mouseY - this.cursorY) * this.speed;
    
    this.dotX += (this.mouseX - this.dotX) * this.dotSpeed;
    this.dotY += (this.mouseY - this.dotY) * this.dotSpeed;

    // Update cursor position
    if (this.cursor) {
      this.cursor.style.left = this.cursorX + 'px';
      this.cursor.style.top = this.cursorY + 'px';
    }

    if (this.cursorDot) {
      this.cursorDot.style.left = this.dotX + 'px';
      this.cursorDot.style.top = this.dotY + 'px';
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize rainbow cursor when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new RainbowCursor();
  });
} else {
  new RainbowCursor();
}