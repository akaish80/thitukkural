import { Link } from 'react-router-dom';
import type { ChapterGroup, ChapterUnit } from '../../types';
import { getIcon } from '../../utils/navUtils';

type UnitHeroProps = {
  chapter: ChapterGroup;
  unit: ChapterUnit;
};

const UnitHero = ({ chapter, unit }: UnitHeroProps) => {
  return (
    <section className="lt-unit-hero">
      <div className="lt-unit-hero__topbar">
        <Link
          to={`/learn-tamil/${chapter.chapterId}`}
          className="lt-unit-hero__home"
          aria-label={`Back to ${chapter.chapterTitle} unit list`}
          title="Back to unit list"
        >
          <span aria-hidden="true" className="lt-unit-hero__home-icon">
            {getIcon('home')}
          </span>
          <span className="lt-unit-hero__home-text">Unit list</span>
        </Link>
      </div>
      <h1>
        Unit {unit.id}: {unit.title}
      </h1>
      <p>
        From <strong>{chapter.chapterTitle}</strong> ({chapter.part})
      </p>
    </section>
  );
};

export default UnitHero;
