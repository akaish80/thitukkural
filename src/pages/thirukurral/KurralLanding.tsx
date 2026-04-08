import { Link } from 'react-router-dom';
import './kurralLanding.scss';

const KurralLanding = () => {
  const features = [
    {
      icon: '📖',
      title: 'Explore Kurrals',
      description: 'Browse all 1330 Thirukkural couplets organized by Paal and Adikaram.',
      link: '/kurral/explore',
      color: 'blue',
    },
    {
      icon: '🎯',
      title: 'Exercise Kurral',
      description: 'Test your knowledge with engaging Thirukkural-based exercises.',
      link: '/excercise',
      color: 'purple',
    },
    {
      icon: '🎨',
      title: 'Themes',
      description: 'Customize your reading experience with beautiful themes.',
      link: '/',
      color: 'orange',
    },
  ];

  return (
    <div className="kurral-landing">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">திருக்குறள்</span>
            <span className="subtitle">Thirukkural Explorer</span>
          </h1>
          <p className="hero-description">
            Discover the eternal wisdom of Thiruvalluvar through interactive learning. Master Tamil
            literature with modern teaching methods.
          </p>
          <div className="hero-actions">
            <Link to="/kurral/explore" className="btn btn-primary btn-large">
              <span>🚀</span>
              Start Exploring
            </Link>
            <Link to="/excercise" className="btn btn-secondary btn-large">
              <span>✨</span>
              Practice Now
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card delayed-more">
            <div className="card-content">
              <h3>அறம்</h3>
              <p>Virtue</p>
            </div>
          </div>
          <div className="floating-card ">
            <div className="card-content">
              <h3>பொருள்</h3>
              <p>Wealth</p>
            </div>
          </div>
          <div className="floating-card delayed">
            <div className="card-content">
              <h3>இன்பம்</h3>
              <p>Pleasure</p>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Explore Thirukkural</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} className={`feature-card ${feature.color}`}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">1330</div>
              <div className="stat-label">திருக்குறள்கள்</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">133</div>
              <div className="stat-label">அதிகாரங்கள்</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">3</div>
              <div className="stat-label">பால்கள்</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KurralLanding;
