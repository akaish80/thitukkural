import { useTheme } from '../../contexts/ThemeContext';
import ThemeSelector from '../../components/ThemeSelector/ThemeSelector';
import './ThemeDemo.scss';

const ThemeDemo = () => {
  const { isDark, effectiveTheme, colorScheme } = useTheme();

  return (
    <div className="theme-demo">
      <div className="demo-header">
        <h1>🎨 Theme System Demo</h1>
        <p>
          Experience the complete theme system with multiple color schemes and dark/light mode
          support.
        </p>
        <ThemeSelector />
      </div>

      <div className="demo-grid">
        <div className="demo-card">
          <h3>Current Theme</h3>
          <div className="theme-info">
            <span className="theme-badge">{isDark ? '🌙 Dark' : '☀️ Light'} Mode</span>
            <span
              className="color-badge"
              style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
            >
              {colorScheme.charAt(0).toUpperCase() + colorScheme.slice(1)} Scheme
            </span>
          </div>
        </div>

        <div className="demo-card">
          <h3>Typography</h3>
          <p className="text-primary">Primary text - var(--text-primary)</p>
          <p className="text-secondary">Secondary text - var(--text-secondary)</p>
          <p className="text-tertiary">Tertiary text - var(--text-tertiary)</p>
          <p className="text-muted">Muted text - var(--text-muted)</p>
        </div>

        <div className="demo-card">
          <h3>Backgrounds</h3>
          <div className="bg-showcase">
            <div className="bg-sample bg-primary">Primary</div>
            <div className="bg-sample bg-secondary">Secondary</div>
            <div className="bg-sample bg-tertiary">Tertiary</div>
          </div>
        </div>

        <div className="demo-card">
          <h3>Colors</h3>
          <div className="color-showcase">
            <div className="color-sample" style={{ backgroundColor: 'var(--color-primary)' }}>
              Primary
            </div>
            <div className="color-sample" style={{ backgroundColor: 'var(--color-primary-dark)' }}>
              Primary Dark
            </div>
            <div className="color-sample" style={{ backgroundColor: 'var(--color-primary-light)' }}>
              Primary Light
            </div>
            <div className="color-sample" style={{ backgroundColor: 'var(--color-accent)' }}>
              Accent
            </div>
          </div>
        </div>

        <div className="demo-card">
          <h3>Interactive Elements</h3>
          <div className="interactive-showcase">
            <button className="theme-button">Primary Button</button>
            <button className="theme-button secondary">Secondary Button</button>
            <button className="theme-button outline">Outline Button</button>
            <input className="theme-input" placeholder="Theme-aware input" />
          </div>
        </div>

        <div className="demo-card">
          <h3>System Integration</h3>
          <div className="system-info">
            <p>
              <strong>Effective Theme:</strong> {effectiveTheme}
            </p>
            <p>
              <strong>Color Scheme:</strong> {colorScheme}
            </p>
            <p>
              <strong>System Preference:</strong> Auto-detected
            </p>
            <p>
              <strong>Persistence:</strong> LocalStorage
            </p>
            <p>
              <strong>CSS Variables:</strong> Dynamic
            </p>
          </div>
        </div>
      </div>

      <div className="demo-footer">
        <h3>Features</h3>
        <ul>
          <li>🌓 Auto system theme detection</li>
          <li>🎨 6 beautiful color schemes</li>
          <li>💾 Persistent user preferences</li>
          <li>🎯 CSS custom properties</li>
          <li>📱 Responsive design</li>
          <li>♿ Accessibility focused</li>
          <li>⚡ Smooth transitions</li>
          <li>🔧 Easy customization</li>
        </ul>
      </div>
    </div>
  );
};

export default ThemeDemo;
