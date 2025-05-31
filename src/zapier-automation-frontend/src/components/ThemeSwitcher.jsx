// src/zapier-automation-frontend/src/components/ThemeSwitcher.jsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  // Basic styling for the button, can be enhanced with Tailwind or custom CSS later
  const buttonStyle = {
    padding: '8px 16px',
    cursor: 'pointer',
    border: '1px solid var(--border-color)', // Use CSS variable
    backgroundColor: 'var(--button-bg)', // Use CSS variable
    color: 'var(--button-text)', // Use CSS variable
    borderRadius: '4px',
  };

  return (
    <button
      onClick={toggleTheme}
      style={buttonStyle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
};

export default ThemeSwitcher;
