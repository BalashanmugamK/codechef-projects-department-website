/**
 * Generate a local SVG placeholder image
 * No external dependencies - works completely offline
 * @param {string} initials - 1-2 character initials
 * @param {string} bgColor - Background color (hex)
 * @param {string} textColor - Text color (hex)
 * @returns {string} Data URI SVG
 */
export const generatePlaceholder = (
  initials = 'U',
  bgColor = 'FF6B35',
  textColor = 'ffffff'
) => {
  const cleanInitials = (initials || 'U').substring(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" width="140" height="140">
    <rect width="140" height="140" fill="#${bgColor}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#${textColor}" text-anchor="middle" dy=".3em">${cleanInitials}</text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Get placeholder for a member
 * @param {object} member - Member object with name property
 * @returns {string} Data URI SVG placeholder
 */
export const getMemberPlaceholder = (member) => {
  const initials = (member?.name || 'U').charAt(0);
  return generatePlaceholder(initials, 'FF6B35', 'ffffff');
};
