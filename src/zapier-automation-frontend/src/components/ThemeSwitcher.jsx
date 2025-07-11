import React, { useState, useEffect } from 'react';

const ThemeSwitcher = () => {
  // State to manage the current theme (e.g., 'dark', 'light', 'system')
  const [theme, setTheme] = useState('dark'); // Default to 'dark' as per our project's current theme

  useEffect(() => {
    // In a real application, you would apply the theme here.
    // For Bootstrap, this might involve:
    // 1. Toggling a class on the <body> tag (e.g., 'theme-light', 'theme-dark')
    // 2. Loading different Bootstrap CSS files (e.g., 'bootstrap.min.css' vs 'bootstrap-dark.min.css')
    // 3. Using CSS variables that are updated based on the theme state.

    // For demonstration, we'll just log the theme.
    console.log(`Current theme set to: ${theme}`);
    // Example: document.body.setAttribute('data-bs-theme', theme); // Bootstrap 5.3+ way
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // You might also save this preference to localStorage here
    // localStorage.setItem('app-theme', newTheme);
  };

  return (
    <div className="card bg-dark text-white p-3 border border-secondary rounded"> {/* Bootstrap card for styling */}
      <h5 className="card-title text-white mb-3">Theme Settings</h5>
      <div className="d-flex flex-column gap-2">
        <button
          className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline-light'} btn-sm`}
          onClick={() => handleThemeChange('light')}
        >
          Light Theme
        </button>
        <button
          className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline-light'} btn-sm`}
          onClick={() => handleThemeChange('dark')}
        >
          Dark Theme
        </button>
        <button
          className={`btn ${theme === 'system' ? 'btn-primary' : 'btn-outline-light'} btn-sm`}
          onClick={() => handleThemeChange('system')}
        >
          System Theme
        </button>
      </div>
      <p className="card-text text-muted small mt-3 mb-0">
        Current theme: <span className="text-info">{theme}</span>
      </p>
    </div>
  );
};

export default ThemeSwitcher;
