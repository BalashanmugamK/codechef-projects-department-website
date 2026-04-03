/**
 * Get animation delay style for staggered animations
 * @param {number} index - The index of the element
 * @param {number} delay - Base delay in milliseconds (default: 100ms)
 * @returns {Object} CSS-in-JS style object with animation delay
 */
export const getAnimationDelayStyle = (index, delay = 100) => {
    return {
        animationDelay: `${index * delay}ms`
    };
};

/**
 * Get animation delay CSS variable
 * @param {number} index - The index of the element
 * @param {number} delay - Base delay in milliseconds (default: 100ms)
 * @returns {Object} CSS-in-JS style object with CSS variable
 */
export const getAnimationDelayCSSVar = (index, delay = 100) => {
    return {
        '--animation-delay': `${index * delay}ms`
    };
};
