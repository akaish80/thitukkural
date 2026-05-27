import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';
import { CHAPTER_GROUPS } from '../../data/constants';
import './learnTamilChapters.styles.scss';

const LearnTamilChaptersPage = () => {
  const { chapterId } = useParams<{ chapterId?: string }>();
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const activeChapter = useMemo(() => {
    if (!chapterId) return CHAPTER_GROUPS[0];
    return CHAPTER_GROUPS.find((g) => g.chapterId === chapterId) || CHAPTER_GROUPS[0];
  }, [chapterId]);

  const activeChapterIndex = useMemo(() => {
    return CHAPTER_GROUPS.findIndex((g) => g.chapterId === activeChapter.chapterId);
  }, [activeChapter.chapterId]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart !== null) {
      handleSwipe(touchStart, e.changedTouches[0].clientX);
    }
  };

  const handleSwipe = (startX: number, endX: number) => {
    const distance = startX - endX;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0 && activeChapterIndex < CHAPTER_GROUPS.length - 1) {
        // Swiped left, go to next chapter
        navigate(`/learn-tamil/${CHAPTER_GROUPS[activeChapterIndex + 1].chapterId}`);
      } else if (distance < 0 && activeChapterIndex > 0) {
        // Swiped right, go to previous chapter
        navigate(`/learn-tamil/${CHAPTER_GROUPS[activeChapterIndex - 1].chapterId}`);
      }
    }
  };

  const goToPreviousChapter = () => {
    if (activeChapterIndex > 0) {
      navigate(`/learn-tamil/${CHAPTER_GROUPS[activeChapterIndex - 1].chapterId}`);
    }
  };

  const goToNextChapter = () => {
    if (activeChapterIndex < CHAPTER_GROUPS.length - 1) {
      navigate(`/learn-tamil/${CHAPTER_GROUPS[activeChapterIndex + 1].chapterId}`);
    }
  };

  return (
    <div className="learn-tamil-chapters-page">
      <PageTitle
        title="Learn Tamil Chapters"
        description="Choose a chapter group and view all chapter units in one place."
        path="/learn-tamil"
      />

      <section className="lt-chapters-hero">
        <h1>Learn Tamil: Chapter Groups</h1>
        <p>Select a chapter to see all unit content, then continue to evaluation.</p>
      </section>

      <section className="lt-chapters-layout">
        <aside className="lt-chapter-list" aria-label="Chapter groups">
          {CHAPTER_GROUPS.map((group) => {
            const isActive = group.chapterId === activeChapter.chapterId;
            return (
              <button
                key={group.chapterId}
                type="button"
                className={`lt-chapter-list__item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(`/learn-tamil/${group.chapterId}`)}
              >
                <span className="lt-chapter-list__part">{group.part}</span>
                <span className="lt-chapter-list__title">{group.chapterTitle}</span>
                <span className="lt-chapter-list__meta">{group.units.length} units</span>
              </button>
            );
          })}
        </aside>

        <article 
          className="lt-chapter-content"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-label={`Chapter content: ${activeChapter.chapterTitle}`}
        >
          <header className="lt-chapter-content__header">
            <p>{activeChapter.part}</p>
            <h2>{activeChapter.chapterTitle}</h2>
          </header>

          <div className="lt-duo-flow" aria-label="Chapter unit flow">
            {activeChapter.units.map((unit, index) => (
              <Link
                key={unit.id}
                to={`/learn-tamil/${activeChapter.chapterId}/${unit.id}`}
                className={`lt-duo-flow__unit ${index % 2 === 0 ? 'left' : 'right'}`}
                aria-label={`Go to Unit ${unit.id}: ${unit.title}`}
              >
                <span className="lt-duo-flow__badge lt-unit-badge">Unit {unit.id}</span>
                <div className="lt-duo-flow__card">
                  <h3 className="lt-unit-title">{unit.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="lt-mobile-nav">
            <button
              className="lt-mobile-nav__btn lt-mobile-nav__prev"
              onClick={goToPreviousChapter}
              disabled={activeChapterIndex === 0}
              aria-label="Go to previous chapter"
            >
              ← Previous
            </button>
            <span className="lt-mobile-nav__indicator" aria-live="polite">
              {activeChapterIndex + 1} / {CHAPTER_GROUPS.length}
            </span>
            <button
              className="lt-mobile-nav__btn lt-mobile-nav__next"
              onClick={goToNextChapter}
              disabled={activeChapterIndex === CHAPTER_GROUPS.length - 1}
              aria-label="Go to next chapter"
            >
              Next →
            </button>
          </div>
        </article>
      </section>
    </div>
  );
};

export default LearnTamilChaptersPage;
