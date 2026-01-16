// Helper function to get CSS variable value
export const getCSSVariable = (variable) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

// Helper function to get tooltip style for charts
export const getTooltipStyle = () => {
  return {
    backgroundColor: getCSSVariable('--bg-card'),
    border: `1px solid ${getCSSVariable('--border-color')}`,
    borderRadius: '12px',
    color: getCSSVariable('--text-primary'),
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };
};

// Helper function to get axis stroke color
export const getAxisColor = () => {
  return getCSSVariable('--text-secondary');
};
