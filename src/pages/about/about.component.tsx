import { Link } from 'react-router-dom';
import './about.styles.scss';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1 className="about-hero__title">
          <span className="about-hero__tamil">எங்களைப் பற்றி</span>
          <span className="about-hero__en">About Us</span>
        </h1>
        <p className="about-hero__subtitle">
          Preserving and sharing the beauty of the Tamil language through modern technology
        </p>
      </section>

      <section className="about-mission">
        <div className="about-card">
          <div className="about-card__icon">🎯</div>
          <h2>Our Mission</h2>
          <p>
            To make learning Tamil accessible, interactive, and enjoyable for everyone — whether
            you're a native speaker reconnecting with your roots, or a curious learner exploring
            one of the world's oldest living languages.
          </p>
        </div>
        <div className="about-card">
          <div className="about-card__icon">🌏</div>
          <h2>Why Tamil?</h2>
          <p>
            Tamil is a classical language with over 2,000 years of literary tradition. It is spoken
            by over 80 million people worldwide and is recognized as one of the longest-surviving
            classical languages in the world.
          </p>
        </div>
        <div className="about-card">
          <div className="about-card__icon">💡</div>
          <h2>Our Approach</h2>
          <p>
            We combine ancient wisdom with modern technology — interactive exercises, voice
            synthesis, visual learning, and gamified challenges to make Tamil learning effective
            and fun.
          </p>
        </div>
      </section>

      <section className="about-features">
        <h2 className="about-features__title">What You Can Learn</h2>
        <div className="about-features__grid">
          <div className="feature-item">
            <span className="feature-item__icon">📖</span>
            <h3>Thirukkural</h3>
            <p>Explore all 1,330 couplets of Thiruvalluvar's masterpiece with meanings, explanations, and search.</p>
          </div>
          <div className="feature-item">
            <span className="feature-item__icon">✍️</span>
            <h3>Tamil Letters</h3>
            <p>Learn all 247 Tamil letters — vowels, consonants, and combined letters with pronunciation guides.</p>
          </div>
          <div className="feature-item">
            <span className="feature-item__icon">🎨</span>
            <h3>Drawing Practice</h3>
            <p>Practice writing Tamil letters on an interactive canvas with stroke guides.</p>
          </div>
          <div className="feature-item">
            <span className="feature-item__icon">🎯</span>
            <h3>Quizzes & Exercises</h3>
            <p>Test your knowledge with fill-in-the-blank, matching, and multiple-choice exercises.</p>
          </div>
          <div className="feature-item">
            <span className="feature-item__icon">🪔</span>
            <h3>Aathichudi</h3>
            <p>Learn Avvaiyar's 109 moral verses — timeless wisdom in simple Tamil couplets.</p>
          </div>
          <div className="feature-item">
            <span className="feature-item__icon">🔊</span>
            <h3>Voice Reading</h3>
            <p>Hear Tamil letters, words, and sentences spoken aloud with text-to-speech.</p>
          </div>
        </div>
      </section>

      <section className="about-tech">
        <h2>Built With</h2>
        <div className="tech-badges">
          <span className="tech-badge">React</span>
          <span className="tech-badge">TypeScript</span>
          <span className="tech-badge">Vite</span>
          <span className="tech-badge">Redux Toolkit</span>
          <span className="tech-badge">React Router</span>
          <span className="tech-badge">SCSS</span>
          <span className="tech-badge">Web Speech API</span>
        </div>
      </section>

      <section className="about-cta">
        <h2>Ready to start learning?</h2>
        <p>Jump right in and explore the beauty of Tamil language and literature.</p>
        <div className="about-cta__buttons">
          <Link to="/kurral" className="btn btn-primary">📖 Explore Thirukkural</Link>
          <Link to="/tamil-letters" className="btn btn-secondary">✍️ Learn Tamil Letters</Link>
        </div>
      </section>
    </div>
  );
};

export default About;
