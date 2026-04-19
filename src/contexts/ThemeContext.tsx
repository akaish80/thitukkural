import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

interface ThemeContextType {
  themeMode: string;
  colorScheme: string;
  effectiveTheme: string;
  systemPrefersDark: boolean;
  changeThemeMode: (mode: string) => void;
  changeColorScheme: (scheme: string) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
  isAuto: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const THEMES = {
  AUTO: 'auto',
  LIGHT: 'light',
  DARK: 'dark',
};

export const THEME_COLORS = {
  BLUE: 'blue',
  PURPLE: 'purple',
  GREEN: 'green',
  ORANGE: 'orange',
  RED: 'red',
  TEAL: 'teal',
};

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [themeMode, setThemeMode] = useState(THEMES.AUTO);
  const [colorScheme, setColorScheme] = useState(THEME_COLORS.BLUE);
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const savedThemeMode = localStorage.getItem('thirukurral-theme-mode');
    const savedColorScheme = localStorage.getItem('thirukurral-color-scheme');
    if (savedThemeMode && Object.values(THEMES).includes(savedThemeMode)) {
      setThemeMode(savedThemeMode);
    }
    if (savedColorScheme && Object.values(THEME_COLORS).includes(savedColorScheme)) {
      setColorScheme(savedColorScheme);
    }
  }, []);

  const getEffectiveTheme = useCallback(() => {
    if (themeMode === THEMES.AUTO) {
      return systemPrefersDark ? THEMES.DARK : THEMES.LIGHT;
    }
    return themeMode;
  }, [themeMode, systemPrefersDark]);

  useEffect(() => {
    const effectiveTheme = getEffectiveTheme();
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    Object.values(THEME_COLORS).forEach((color) => {
      root.classList.remove(`color-${color}`);
    });
    root.classList.add(`theme-${effectiveTheme}`);
    root.classList.add(`color-${colorScheme}`);
    const themeVars = getThemeVariables(effectiveTheme, colorScheme);
    Object.entries(themeVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [themeMode, colorScheme, systemPrefersDark, getEffectiveTheme]);

  const changeThemeMode = (mode: string) => {
    setThemeMode(mode);
    localStorage.setItem('thirukurral-theme-mode', mode);
  };

  const changeColorScheme = (scheme: string) => {
    setColorScheme(scheme);
    localStorage.setItem('thirukurral-color-scheme', scheme);
  };

  const toggleTheme = () => {
    const effectiveTheme = getEffectiveTheme();
    const newMode = effectiveTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    changeThemeMode(newMode);
  };

  const value = {
    themeMode,
    colorScheme,
    effectiveTheme: getEffectiveTheme(),
    systemPrefersDark,
    changeThemeMode,
    changeColorScheme,
    toggleTheme,
    isDark: getEffectiveTheme() === THEMES.DARK,
    isLight: getEffectiveTheme() === THEMES.LIGHT,
    isAuto: themeMode === THEMES.AUTO,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

const getThemeVariables = (theme: string, colorScheme: string) => {
  const colorPalettes = {
    [THEME_COLORS.BLUE]: {
      primary: theme === THEMES.DARK ? '#4A90E2' : '#3498db',
      primaryDark: theme === THEMES.DARK ? '#357ABD' : '#2980b9',
      primaryLight: theme === THEMES.DARK ? '#6BA3E8' : '#5DADE2',
      accent: theme === THEMES.DARK ? '#FF6B6B' : '#e74c3c',
    },
    [THEME_COLORS.PURPLE]: {
      primary: theme === THEMES.DARK ? '#8E44AD' : '#9b59b6',
      primaryDark: theme === THEMES.DARK ? '#7D3C98' : '#8e44ad',
      primaryLight: theme === THEMES.DARK ? '#A569BD' : '#BB8FCE',
      accent: theme === THEMES.DARK ? '#F39C12' : '#f39c12',
    },
    [THEME_COLORS.GREEN]: {
      primary: theme === THEMES.DARK ? '#2ECC71' : '#27ae60',
      primaryDark: theme === THEMES.DARK ? '#28B463' : '#229954',
      primaryLight: theme === THEMES.DARK ? '#58D68D' : '#52C977',
      accent: theme === THEMES.DARK ? '#E67E22' : '#d35400',
    },
    [THEME_COLORS.ORANGE]: {
      primary: theme === THEMES.DARK ? '#F39C12' : '#e67e22',
      primaryDark: theme === THEMES.DARK ? '#E67E22' : '#d35400',
      primaryLight: theme === THEMES.DARK ? '#F7DC6F' : '#F8C471',
      accent: theme === THEMES.DARK ? '#9B59B6' : '#8e44ad',
    },
    [THEME_COLORS.RED]: {
      primary: theme === THEMES.DARK ? '#E74C3C' : '#c0392b',
      primaryDark: theme === THEMES.DARK ? '#C0392B' : '#a93226',
      primaryLight: theme === THEMES.DARK ? '#EC7063' : '#E74C3C',
      accent: theme === THEMES.DARK ? '#3498DB' : '#2980b9',
    },
    [THEME_COLORS.TEAL]: {
      primary: theme === THEMES.DARK ? '#1ABC9C' : '#16a085',
      primaryDark: theme === THEMES.DARK ? '#17A2B8' : '#138496',
      primaryLight: theme === THEMES.DARK ? '#48C9B0' : '#5DADE2',
      accent: theme === THEMES.DARK ? '#F1C40F' : '#f39c12',
    },
  };
  const colors = colorPalettes[colorScheme];
  if (theme === THEMES.DARK) {
    return {
      '--bg-primary': '#1a1a1a',
      '--bg-secondary': '#2d2d2d',
      '--bg-tertiary': '#3a3a3a',
      '--bg-accent': '#404040',
      '--text-primary': '#ffffff',
      '--text-secondary': '#cccccc',
      '--text-tertiary': '#999999',
      '--text-muted': '#666666',
      '--border-primary': '#404040',
      '--border-secondary': '#555555',
      '--shadow-light': 'rgba(255, 255, 255, 0.1)',
      '--shadow-medium': 'rgba(0, 0, 0, 0.25)',
      '--shadow-dark': 'rgba(0, 0, 0, 0.3)',
      '--color-primary': colors.primary,
      '--color-primary-dark': colors.primaryDark,
      '--color-primary-light': colors.primaryLight,
      '--color-primary-alpha': `${colors.primary}26`,
      '--color-accent': colors.accent,
      '--color-accent-alpha': `${colors.accent}26`,
      '--canvas-bg': '#2d2d2d',
      '--canvas-border': '#555555',
      '--button-hover-bg': '#404040',
      '--focus-ring': `0 0 0 3px ${colors.primary}66`,
    };
  } else {
    return {
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f8f9fa',
      '--bg-tertiary': '#e9ecef',
      '--bg-accent': '#dee2e6',
      '--text-primary': '#2c3e50',
      '--text-secondary': '#34495e',
      '--text-tertiary': '#7f8c8d',
      '--text-muted': '#95a5a6',
      '--border-primary': '#dee2e6',
      '--border-secondary': '#ced4da',
      '--shadow-light': 'rgba(0, 0, 0, 0.1)',
      '--shadow-medium': 'rgba(0, 0, 0, 0.12)',
      '--shadow-dark': 'rgba(0, 0, 0, 0.15)',
      '--color-primary': colors.primary,
      '--color-primary-dark': colors.primaryDark,
      '--color-primary-light': colors.primaryLight,
      '--color-primary-alpha': `${colors.primary}26`,
      '--color-accent': colors.accent,
      '--color-accent-alpha': `${colors.accent}26`,
      '--canvas-bg': '#ffffff',
      '--canvas-border': '#dee2e6',
      '--button-hover-bg': '#f8f9fa',
      '--focus-ring': `0 0 0 3px ${colors.primary}66`,
    };
  }
};

export default ThemeProvider;
