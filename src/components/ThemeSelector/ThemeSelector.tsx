import React, { useState } from 'react';
// import { useTheme, THEMES, THEME_COLORS } from '../../contexts/ThemeContext';
import './ThemeSelector.scss';
import { THEME_COLORS, THEMES, useTheme } from '../../contexts/ThemeContext';

const ThemeSelector = ({ isCompact = false }) => {
  const {
    themeMode,
    colorScheme,
    effectiveTheme,
    systemPrefersDark,
    changeThemeMode,
    changeColorScheme,
    toggleTheme,
    isDark,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);

  const themeModeOptions = [
    {
      value: THEMES.AUTO,
      label: 'Auto',
      icon: '🌓',
      description: `Follows system (${systemPrefersDark ? 'Dark' : 'Light'})`,
    },
    {
      value: THEMES.LIGHT,
      label: 'Light',
      icon: '☀️',
      description: 'Always light mode',
    },
    {
      value: THEMES.DARK,
      label: 'Dark',
      icon: '🌙',
      description: 'Always dark mode',
    },
  ];

  const colorOptions = [
    { value: THEME_COLORS.BLUE, label: 'Blue', color: '#3498db' },
    { value: THEME_COLORS.PURPLE, label: 'Purple', color: '#9b59b6' },
    { value: THEME_COLORS.GREEN, label: 'Green', color: '#27ae60' },
    { value: THEME_COLORS.ORANGE, label: 'Orange', color: '#e67e22' },
    { value: THEME_COLORS.RED, label: 'Red', color: '#e74c3c' },
    { value: THEME_COLORS.TEAL, label: 'Teal', color: '#16a085' },
  ];

  if (isCompact) {
    return (
      <div className="theme-selector-compact">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    );
  }

  return (
    <div className="theme-selector">
      <button
        className="theme-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="current-theme-icon">
          {themeModeOptions.find((option) => option.value === themeMode)?.icon}
        </span>
        <span className="current-theme-label">Theme</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <>
          <div className="theme-selector-overlay" onClick={() => setIsOpen(false)} />
          <div className="theme-selector-dropdown">
            <div className="theme-section">
              <h4>Theme Mode</h4>
              <div className="theme-mode-options">
                {themeModeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`theme-option ${themeMode === option.value ? 'active' : ''}`}
                    onClick={() => {
                      changeThemeMode(option.value);
                      setIsOpen(false);
                    }}
                  >
                    <span className="theme-icon">{option.icon}</span>
                    <div className="theme-text">
                      <span className="theme-label">{option.label}</span>
                      <span className="theme-description">{option.description}</span>
                    </div>
                    {themeMode === option.value && <span className="active-indicator">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="theme-section">
              <h4>Color Scheme</h4>
              <div className="color-scheme-options">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    className={`color-option ${colorScheme === color.value ? 'active' : ''}`}
                    onClick={() => {
                      changeColorScheme(color.value);
                    }}
                    style={{ '--preview-color': color.color } as React.CSSProperties}
                    title={color.label}
                  >
                    <div className="color-preview" />
                    <span className="color-label">{color.label}</span>
                    {colorScheme === color.value && <span className="active-indicator">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="theme-section">
              <div className="current-theme-info">
                <span className="info-label">Current:</span>
                <span className="info-value">
                  {effectiveTheme === THEMES.DARK ? 'Dark' : 'Light'} •
                  {colorOptions.find((c) => c.value === colorScheme)?.label}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
