import { useState, useEffect } from 'react';
import PageTitle from '../../components/PageTitle';
import { Link } from 'react-router-dom';
import './homepage.component.scss';
import { getDailyKurralIndex, getStreakData, getProgressStats } from '../../utils/learningStore';
import fetchWrapper from '../../utils/fetchWrapper';

const DailyKurral = () => {
  const [kurral, setKurral] = useState<{ id: number; tamil: string; explanation: string } | null>(null);

  useEffect(() => {
    const id = getDailyKurralIndex();
    fetchWrapper(`${import.meta.env.VITE_API_BASE_URL}/api/kurral/${id}`)
      .then((data: any) => {
        if (data) {
          setKurral({
            id: data.Kurral_id ?? data.Index ?? id,
            tamil: (data.Tamil || '').replace(/<br \/>/g, '\n'),
            explanation: data.MuVaUrai || '',
          });
        }
      })
      .catch(() => { /* silent — widget just won't show */ });
  }, []);

  if (!kurral) return (
    <div className="floating-cards-fallback">
      <div className="floating-card delayed-more">
        <div className="card-content"><h3>அ</h3><p>Vowel</p></div>
      </div>
      <div className="floating-card">
        <div className="card-content"><h3>க</h3><p>Consonant</p></div>
      </div>
      <div className="floating-card delayed">
        <div className="card-content"><h3>தமிழ்</h3><p>Tamil</p></div>
      </div>
    </div>
  );

  return (
    <div className="daily-kurral">
      <div className="daily-kurral__badge">📜 இன்றைய குறள் · Daily Kurral #{kurral.id}</div>
      <div className="daily-kurral__verse">
        {kurral.tamil.split('\n').map((line, i) => (
          <span key={i} className="daily-kurral__line">{line}</span>
        ))}
      </div>
      {kurral.explanation && (
        <p className="daily-kurral__meaning">{kurral.explanation}</p>
      )}
      <Link to={`/kurral/${kurral.id}`} className="daily-kurral__link">Read more →</Link>
    </div>
  );
};

const StreakBanner = () => {
  const streak = getStreakData();
  const progress = getProgressStats();

  if (streak.totalDaysActive === 0 && progress.totalSessions === 0) return null;

  return (
    <div className="streak-banner">
      {streak.currentStreak > 0 && (
        <div className="streak-banner__item streak-banner__item--fire">
          <span className="streak-banner__icon">🔥</span>
          <span className="streak-banner__value">{streak.currentStreak}</span>
          <span className="streak-banner__label">Day Streak</span>
        </div>
      )}
      {progress.totalSessions > 0 && (
        <div className="streak-banner__item">
          <span className="streak-banner__icon">📊</span>
          <span className="streak-banner__value">{progress.avgAccuracy}%</span>
          <span className="streak-banner__label">Avg Accuracy</span>
        </div>
      )}
      {progress.totalSessions > 0 && (
        <div className="streak-banner__item">
          <span className="streak-banner__icon">✅</span>
          <span className="streak-banner__value">{progress.totalCorrect}/{progress.totalQuestions}</span>
          <span className="streak-banner__label">Correct</span>
        </div>
      )}
      {streak.longestStreak > 1 && (
        <div className="streak-banner__item">
          <span className="streak-banner__icon">🏆</span>
          <span className="streak-banner__value">{streak.longestStreak}</span>
          <span className="streak-banner__label">Best Streak</span>
        </div>
      )}
    </div>
  );
};

const Homepage = () => {
  const features = [
    {
      icon: '📖',
      title: 'Thirukkural',
      description: 'Read all 1330 Thirukkural couplets with clear explanations and easy navigation.',
      link: '/kurral',
      color: 'blue',
    },
    {
      icon: '✍️',
      title: 'Practice Writing',
      description: 'Practice writing Tamil letters with guided tracing and simple drawing exercises.',
      link: '/free-type',
      color: 'green',
    },
    {
      icon: '🎯',
      title: 'Interactive Exercises',
      description: 'Check your learning with quizzes, matching games, and fill-in-the-blank tasks.',
      link: '/kurral/exercise',
      color: 'purple',
    },
    {
      icon: '🪔',
      title: 'Aathichudi',
      description: 'Learn Avvaiyar\'s Aathichudi with short verses, meaning, and pronunciation support.',
      link: '/aathichudi',
      color: 'orange',
    },
  ];

  const learningRoadmap = [
    {
      title: 'Chapter-Based Tamil Learning Menu',
      description: 'Open the Learn Tamil section and move through chapters from one place.',
      cta: 'Open Learn Tamil Chapters',
      link: '/learn-tamil',
    },
    {
      title: 'Learning Path Practice',
      description: 'Continue unit-by-unit lessons and keep track of your progress as you practice.',
      cta: 'Open Learning Path',
      link: '/learn',
    },
    {
      title: 'Chapter-Wise Evaluation',
      description: 'Take short chapter tests to review speaking, grammar, and practical usage.',
      cta: 'Start Evaluation',
      link: '/tamil-evaluation',
    },
  ];

  return (
    <div className="homepage">
      <PageTitle
        title="Home"
        description="Learn Tamil with lessons, writing practice, quizzes, pronunciation, and Thirukkural."
        path="/"
      />
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">தமிழ் கற்போம்</span>
            <span className="subtitle">Learn Tamil</span>
          </h1>
          <p className="hero-description">
            Learn Tamil step by step with clear lessons, writing practice, pronunciation support,
            and daily reading. Start with letters, move to words and sentences, and build confidence
            through regular practice.
          </p>
          <div className="hero-actions">
            <Link to="/learn" className="btn btn-primary btn-large">
              <span>🛤️</span>
              Start Learning Path
            </Link>
            <Link to="/planner" className="btn btn-primary btn-large">
              <span>🗓️</span>
              Open Planner
            </Link>
            <Link to="/kurral" className="btn btn-secondary btn-large">
              <span>📖</span>
              Thirukkural
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <DailyKurral />
          {/* Fallback decorative cards shown while kurral loads */}
        </div>
      </div>

      <StreakBanner />

      <div className="learning-roadmap-section">
        <div className="container">
          <h2 className="section-title">Learning Tamil Overview</h2>
          <p className="section-subtitle">
            Follow a simple path: learn, practice, and review.
          </p>
          <div className="roadmap-grid">
            {learningRoadmap.map((item) => (
              <article key={item.title} className="roadmap-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link to={item.link} className="roadmap-link">{item.cta} →</Link>
              </article>
            ))}
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
