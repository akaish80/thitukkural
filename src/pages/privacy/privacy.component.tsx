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
            Thirukkural - Learn Tamil ("we", "our", "the app") is a free, open-source educational
            platform for learning Tamil language and literature. We are committed to protecting
            your privacy. This policy explains what data we collect and how we use it.
          </p>
        </section>

        <section className="privacy-section">
          <h2>💾 Data We Store</h2>
          <p>All data is stored <strong>locally on your device</strong> using browser localStorage. We do not collect, transmit, or store any personal data on external servers.</p>
          <ul>
            <li><strong>Theme preferences</strong> — your selected color scheme and dark/light mode</li>
            <li><strong>Learning progress</strong> — quiz scores, streak counts, and exercise completion</li>
            <li><strong>Bookmarked kurrals</strong> — your favorite Thirukkural couplets</li>
            <li><strong>Spaced repetition data</strong> — which items need more review</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>🌐 External Services</h2>
          <ul>
            <li><strong>Google Fonts</strong> — we load Inter and Noto Sans Tamil fonts from Google Fonts. Google may collect anonymized usage data per their <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">privacy policy</a>.</li>
            <li><strong>Web Speech API</strong> — voice reading uses your browser's built-in text-to-speech engine. No audio data is sent to our servers.</li>
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
            This app is designed to be educational and safe for users of all ages. We do not
            knowingly collect any personal information from anyone, including children.
          </p>
        </section>

        <section className="privacy-section">
          <h2>🔄 Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Any changes will be reflected
            on this page with an updated date.
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
