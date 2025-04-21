import { createContext, useContext, useEffect, useState } from "react";

// Create context
const ThemeContext = createContext(null);

// eslint-disable-next-line react/prop-types
export function ThemeProvider({ children }) {
  // Get initial theme from localStorage or default to light
  const [theme, setTheme] = useState('');
  
  // Initialize theme on component mount
  useEffect(() => {
    // Check for stored theme first
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
      // Apply stored theme
      setTheme(storedTheme);
    } else {
      // No stored preference, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      localStorage.setItem('theme', initialTheme);
    }
  }, []);
  
  // Apply theme changes to document
  useEffect(() => {
    // Early return if theme isn't initialized yet
    if (!theme) return;
    
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Theme toggle function
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };
  
  // Context value
  const value = {
    theme,
    setTheme,
    toggleTheme
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
}