// ============================================
// PASSWORD VALIDATION & STRENGTH CHECKER
// ============================================

class PasswordValidator {
  // Password strength requirements
  static REQUIREMENTS = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  };

  // Special characters allowed
  static SPECIAL_CHARS = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;

  /**
   * Validate password and return strength details
   * @param {string} password - Password to validate
   * @returns {object} - Validation result with strength, score, and feedback
   */
  static validatePassword(password) {
    const result = {
      isValid: true,
      strength: 'weak',
      score: 0,
      feedback: [],
      requirementsMet: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumbers: false,
        hasSpecialChars: false
      }
    };

    // Check minimum length
    if (password.length >= this.REQUIREMENTS.minLength) {
      result.requirementsMet.minLength = true;
      result.score += 20;
    } else {
      result.isValid = false;
      result.feedback.push(
        `✗ Password must be at least ${this.REQUIREMENTS.minLength} characters long`
      );
    }

    // Check uppercase
    if (/[A-Z]/.test(password)) {
      result.requirementsMet.hasUppercase = true;
      result.score += 20;
    } else {
      result.isValid = false;
      result.feedback.push('✗ Add at least one uppercase letter (A-Z)');
    }

    // Check lowercase
    if (/[a-z]/.test(password)) {
      result.requirementsMet.hasLowercase = true;
      result.score += 20;
    } else {
      result.isValid = false;
      result.feedback.push('✗ Add at least one lowercase letter (a-z)');
    }

    // Check numbers
    if (/[0-9]/.test(password)) {
      result.requirementsMet.hasNumbers = true;
      result.score += 20;
    } else {
      result.isValid = false;
      result.feedback.push('✗ Add at least one number (0-9)');
    }

    // Check special characters
    if (this.SPECIAL_CHARS.test(password)) {
      result.requirementsMet.hasSpecialChars = true;
      result.score += 20;
    } else {
      result.isValid = false;
      result.feedback.push(
        '✗ Add at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)'
      );
    }

    // Determine strength level
    if (result.score >= 100) {
      result.strength = 'strong';
    } else if (result.score >= 80) {
      result.strength = 'good';
    } else if (result.score >= 60) {
      result.strength = 'fair';
    } else {
      result.strength = 'weak';
    }

    // Add length bonus for extra security
    if (password.length >= 12) {
      result.score = Math.min(result.score + 10, 100);
      if (result.strength === 'fair') result.strength = 'good';
      if (result.strength === 'good' && result.score >= 95) result.strength = 'strong';
    }

    if (password.length >= 16) {
      result.score = 100;
      result.strength = 'strong';
    }

    return result;
  }

  /**
   * Check if password matches requirements (for admin use - stricter)
   * @param {string} password - Password to validate
   * @returns {boolean} - True if meets all requirements
   */
  static isStrongPassword(password) {
    const validation = this.validatePassword(password);
    return validation.isValid && validation.strength === 'strong';
  }

  /**
   * Get strength indicator class name
   * @param {string} strength - Strength level ('weak', 'fair', 'good', 'strong')
   * @returns {string} - CSS class name
   */
  static getStrengthClass(strength) {
    return `password-strength-${strength}`;
  }

  /**
   * Get strength indicator color
   * @param {string} strength - Strength level
   * @returns {string} - Hex color code
   */
  static getStrengthColor(strength) {
    const colors = {
      weak: '#ef4444',      // Red
      fair: '#f59e0b',      // Orange/Amber
      good: '#eab308',      // Yellow
      strong: '#10b981'     // Green
    };
    return colors[strength] || '#9ca3af';
  }

  /**
   * Get strength indicator text with emoji
   * @param {string} strength - Strength level
   * @returns {string} - Display text
   */
  static getStrengthText(strength) {
    const texts = {
      weak: '🔴 Weak',
      fair: '🟠 Fair',
      good: '🟡 Good',
      strong: '🟢 Strong'
    };
    return texts[strength] || 'Unknown';
  }

  /**
   * Get strength percentage
   * @param {string} strength - Strength level
   * @returns {number} - Percentage (0-100)
   */
  static getStrengthPercentage(strength) {
    const percentages = {
      weak: 25,
      fair: 50,
      good: 75,
      strong: 100
    };
    return percentages[strength] || 0;
  }

  /**
   * Check if two passwords match
   * @param {string} password - First password
   * @param {string} confirmPassword - Second password
   * @returns {boolean} - True if passwords match
   */
  static passwordsMatch(password, confirmPassword) {
    return password === confirmPassword && password.length > 0;
  }

  /**
   * Generate a strong password (helper function)
   * @returns {string} - Generated strong password
   */
  static generateStrongPassword() {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{};\':"|,.<>/?';

    const getRandomChar = (str) => str[Math.floor(Math.random() * str.length)];

    let password = '';
    password += getRandomChar(uppercase);
    password += getRandomChar(lowercase);
    password += getRandomChar(numbers);
    password += getRandomChar(special);

    // Add more random characters to reach 12 characters
    const allChars = uppercase + lowercase + numbers + special;
    for (let i = 0; i < 8; i++) {
      password += getRandomChar(allChars);
    }

    // Shuffle password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PasswordValidator;
}
