import { Link, useLocation } from 'react-router-dom';
import { PICTURE_WORD_ITEMS } from '../../data/constants';
import './picture-chart.styles.scss';

const PictureWordChartPage = () => {
  const location = useLocation();
  const handlePrint = () => {
    window.print();
  };
  const backLink = location.pathname.startsWith('/learn-tamil')
    ? '/learn-tamil/image-letter-recognition'
    : '/learn/words/words-5';

  return (
    <div className="picture-chart-page">
      <div className="picture-chart-page__topbar no-print">
        <Link to={backLink} className="picture-chart-page__back">
          ← Back to Picture Lesson
        </Link>
        <button type="button" className="picture-chart-page__print" onClick={handlePrint}>
          Print Chart
        </button>
      </div>

      <header className="picture-chart-page__header">
        <h1>Picture + Tamil Word Chart</h1>
        <p>Visual Tamil vocabulary sheet for recognition practice</p>
      </header>

      <section className="picture-chart-grid">
        {PICTURE_WORD_ITEMS.map((item) => (
          <article className="picture-chart-card" key={item.id}>
            <div className="picture-chart-card__image-wrap">
              {item.imageSrc ? (
                <img
                  className="picture-chart-card__image"
                  src={item.imageSrc}
                  alt={item.imageHint || item.meaning || item.tamil}
                />
              ) : (
                <div className="picture-chart-card__fallback">{item.imageEmoji || '🖼️'}</div>
              )}
            </div>
            <h2 className="picture-chart-card__tamil">{item.tamil}</h2>
            <p className="picture-chart-card__meta">{item.romanization}</p>
            <p className="picture-chart-card__meta">{item.meaning}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default PictureWordChartPage;
