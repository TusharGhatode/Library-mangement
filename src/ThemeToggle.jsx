import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // On initial load, check localStorage for dark mode preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('dark-mode');
    if (storedTheme === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle theme and persist it in localStorage
  const handleThemeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dark-mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dark-mode', 'false');
    }
  };

  return (
    <label className="ui-switch">
      <input
        type="checkbox"
        onChange={handleThemeToggle} // Use onChange instead of onClick
        checked={isDarkMode}         // Sync the state with the checkbox
      />
      <div className="slider">
        <div className="circle"></div>
      </div>
    </label>
  );
};

export default ThemeToggle;
