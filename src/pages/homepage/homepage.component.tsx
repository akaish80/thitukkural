import { Link } from 'react-router-dom';
import './homepage.component.scss';

const Homepage = () => {
  const features = [
    {
      icon: '📖',
      title: 'Thirukkural',
      description: 'Explore the timeless wisdom of Thiruvalluvar — 1330 couplets on virtue, wealth, and love.',
      link: '/kurral',
      color: 'blue',
    },
    {
      icon: '✍️',
      title: 'Practice Writing',
      description: 'Learn to write Tamil letters with interactive drawing and tracing exercises.',
      link: '/practice',
      color: 'green',
    },
    {
      icon: '🎯',
      title: 'Interactive Exercises',
      description: 'Test your Tamil knowledge with quizzes, matching games, and fill-in-the-blank challenges.',
      link: '/kurral/exercise',
      color: 'purple',
    },
    {
      icon: '🪔',
      title: 'Aathichudi',
      description: 'Learn Avvaiyar\'s Aathichudi — moral verses that teach Tamil values and alphabet.',
      link: '/aathichudi',
      color: 'orange',
    },
  ];

  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">தமிழ் கற்போம்</span>
            <span className="subtitle">Learn Tamil</span>
          </h1>
          <p className="hero-description">
            Your interactive platform for learning Tamil — from writing letters to mastering
            classical literature. Explore Thirukkural, Aathichudi, and more with modern tools.
          </p>
          <div className="hero-actions">
            <Link to="/kurral" className="btn btn-primary btn-large">
              <span>📖</span>
              Thirukkural
            </Link>
            <Link to="/practice" className="btn btn-secondary btn-large">
              <span>✍️</span>
              Practice Writing
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card delayed-more">
            <div className="card-content">
              <h3>அ</h3>
              <p>Vowel</p>
            </div>
          </div>
          <div className="floating-card ">
            <div className="card-content">
              <h3>க</h3>
              <p>Consonant</p>
            </div>
          </div>
          <div className="floating-card delayed">
            <div className="card-content">
              <h3>தமிழ்</h3>
              <p>Tamil</p>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Explore Learning Features</h2>
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
              <div className="stat-number">247</div>
              <div className="stat-label">எழுத்துக்கள் (Letters)</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">12</div>
              <div className="stat-label">உயிர் (Vowels)</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">18</div>
              <div className="stat-label">மெய் (Consonants)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
