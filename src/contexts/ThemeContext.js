import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('mirrorMeTheme');
    return savedTheme ? JSON.parse(savedTheme) : true; // Default to dark mode
  });

  useEffect(() => {
    // Save theme preference
    localStorage.setItem('mirrorMeTheme', JSON.stringify(isDarkMode));
    
    // Update CSS custom properties and data attribute based on theme
    const root = document.documentElement;
    const body = document.body;
    
    // Set data-theme attribute for CSS selectors
    body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    if (isDarkMode) {
      // Dark theme colors (current red/white/black scheme)
      root.style.setProperty('--theme-bg-primary', '#000000');
      root.style.setProperty('--theme-bg-secondary', '#1a1a1a');
      root.style.setProperty('--theme-bg-tertiary', '#2a2a2a');
      root.style.setProperty('--theme-text-primary', '#ffffff');
      root.style.setProperty('--theme-text-secondary', '#e0e0e0');
      root.style.setProperty('--theme-text-muted', '#b0b0b0');
      root.style.setProperty('--theme-border', '#333333');
      root.style.setProperty('--theme-card-bg', 'rgba(0, 0, 0, 0.9)');
      root.style.setProperty('--theme-card-border', 'var(--brand-red)');
      root.style.setProperty('--theme-shadow', '0 8px 32px rgba(220, 20, 60, 0.3)');
      root.style.setProperty('--theme-accent', 'var(--brand-red)');
      root.style.setProperty('--theme-accent-dark', 'var(--brand-dark-red)');
    } else {
      // Light theme colors (adapted red/white/black scheme with proper contrast)
      root.style.setProperty('--theme-bg-primary', '#ffffff');
      root.style.setProperty('--theme-bg-secondary', '#f8f8f8');
      root.style.setProperty('--theme-bg-tertiary', '#f0f0f0');
      root.style.setProperty('--theme-text-primary', '#000000');
      root.style.setProperty('--theme-text-secondary', '#333333');
      root.style.setProperty('--theme-text-muted', '#666666');
      root.style.setProperty('--theme-border', '#d0d0d0');
      root.style.setProperty('--theme-card-bg', 'rgba(255, 255, 255, 0.95)');
      root.style.setProperty('--theme-card-border', 'var(--brand-red)');
      root.style.setProperty('--theme-shadow', '0 8px 32px rgba(220, 20, 60, 0.15)');
      root.style.setProperty('--theme-accent', 'var(--brand-red)');
      root.style.setProperty('--theme-accent-dark', '#b91c3c');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    theme: isDarkMode ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
