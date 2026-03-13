import './footer.styles.scss';
import { useSelector } from 'react-redux';

interface Section {
  title: string;
  links: Link[];
}

interface Link {
  href: string;
  label: string;
}

const Footer = () => {
  const content = useSelector((state: any) => state.content.data?.footer);
  const currentYear = new Date().getFullYear();

  if (!content) return null; // or a loader

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">{content.title}</h3>
            <p className="footer-description">{content.description}</p>
          </div>
          {content.sections.map((section: Section, idx: number) => (
            <div className="footer-section" key={idx}>
              <h4 className="section-title">{section.title}</h4>
              <div className="footer-links">
                {section.links.map((link: Link, lidx: number) => (
                  <a href={link.href} className="footer-link" key={lidx}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="footer-divider"></div>
        <div className="footer-bottom">
          <div className="copyright">
            <p>{content.copyright.replace('{year}', currentYear)}</p>
          </div>
          <div className="footer-social">
            <span className="social-text">{content.developedBy}</span>
            <span className="developer-name">
              <a href={content.developerUrl} target="_blank" rel="noreferrer">
                {content.developerName}
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
