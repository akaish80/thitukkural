import { useState } from 'react';
import './contact.styles.scss';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show a success message. Wire up a backend/email service later.
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <h1 className="contact-hero__title">
          <span className="contact-hero__tamil">தொடர்பு கொள்ளுங்கள்</span>
          <span className="contact-hero__en">Contact Us</span>
        </h1>
        <p className="contact-hero__subtitle">
          Have a question, suggestion, or feedback? We'd love to hear from you.
        </p>
      </section>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-card">
            <span className="info-card__icon">📧</span>
            <h3>Email</h3>
            <p>arun@darunk.com</p>
          </div>
          <div className="info-card">
            <span className="info-card__icon">🌐</span>
            <h3>Website</h3>
            <a href="http://www.darunk.com" target="_blank" rel="noreferrer">www.darunk.com</a>
          </div>
          <div className="info-card">
            <span className="info-card__icon">📍</span>
            <h3>Location</h3>
            <p>Tamil Nadu, India</p>
          </div>
        </div>

        <div className="contact-form-wrapper">
          {submitted ? (
            <div className="contact-success">
              <span className="contact-success__icon">✅</span>
              <h2>Thank you!</h2>
              <p>Your message has been received. We'll get back to you soon.</p>
              <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                Send another message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>Send us a message</h2>

              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject" value={form.subject} onChange={handleChange} required>
                  <option value="">Select a topic</option>
                  <option value="feedback">Feedback</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="content">Content Correction</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  rows={5}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-submit">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
