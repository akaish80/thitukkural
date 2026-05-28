import './privacy.styles.scss';

const Privacy = () => {
  return (
    <div className="privacy-page">
      <section className="privacy-hero">
        <h1 className="privacy-hero__title">
          <span className="privacy-hero__tamil">தனியுரிமைக் கொள்கை</span>
          <span className="privacy-hero__en">Privacy Policy</span>
        </h1>
        <p className="privacy-hero__updated">Last updated: April 2026</p>
      </section>

      <div className="privacy-content">
        <section className="privacy-section">
          <h2>📋 Overview</h2>
          <p>
            Thirukkural - Learn Tamil is built to help you learn without tracking you.
            This page explains what information is stored in your browser and how it is used.
          </p>
        </section>

        <section className="privacy-section">
          <h2>💾 Data We Store</h2>
          <p>We store learning data <strong>only on your device</strong> using localStorage. We do not collect or send your personal data to our servers.</p>
          <ul>
            <li><strong>Theme preferences</strong> — your selected theme and display mode</li>
            <li><strong>Learning progress</strong> — quiz scores, streaks, and completed exercises</li>
            <li><strong>Bookmarked kurrals</strong> — couplets you saved for later</li>
            <li><strong>Review data</strong> — items marked for revision</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>🌐 External Services</h2>
          <ul>
            <li><strong>Google Fonts</strong> — fonts may be loaded from Google. Their service may process technical request data based on their <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">privacy policy</a>.</li>
            <li><strong>Web Speech API</strong> — text-to-speech uses your browser or device voice engine. We do not store your audio.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>🍪 Cookies</h2>
          <p>
            This app does <strong>not</strong> use cookies for tracking or analytics. We only use
            browser localStorage to save your preferences and progress locally.
          </p>
        </section>

        <section className="privacy-section">
          <h2>📊 Analytics</h2>
          <p>
            We do not use any analytics or tracking services. No data about your usage is
            collected, stored, or shared with third parties.
          </p>
        </section>

        <section className="privacy-section">
          <h2>👶 Children's Privacy</h2>
          <p>
            This app is intended for learners of all ages. Since we do not collect personal data,
            there is no child-specific user data stored by us.
          </p>
        </section>

        <section className="privacy-section">
          <h2>🔄 Changes to This Policy</h2>
          <p>
            If we update this policy, the latest version and date will appear on this page.
          </p>
        </section>

        <section className="privacy-section">
          <h2>📬 Contact</h2>
          <p>
            If you have questions about this privacy policy, please visit our{' '}
            <a href="/contact">contact page</a> or email us at{' '}
            <a href="mailto:arun@darunk.com">arun@darunk.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
