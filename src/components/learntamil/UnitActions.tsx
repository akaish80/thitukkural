import { Link } from 'react-router-dom';
import type { ChapterGroup, ChapterUnit } from '../../types';

type UnitActionsProps = {
  chapter: ChapterGroup;
  previousUnit?: ChapterUnit;
  nextUnit?: ChapterUnit;
};

const UnitActions = ({ chapter, previousUnit, nextUnit }: UnitActionsProps) => {
  return (
    <div className="lt-unit-actions">
      {previousUnit ? (
        <Link to={`/learn-tamil/${chapter.chapterId}/${previousUnit.id}`} className="lt-btn theme-btn">
          ← Previous Unit
        </Link>
      ) : (
        <button disabled className="lt-btn lt-btn--disabled theme-btn">
          ← Previous Unit
        </button>
      )}
      {nextUnit ? (
        <Link to={`/learn-tamil/${chapter.chapterId}/${nextUnit.id}`} className="lt-btn lt-btn--primary theme-btn">
          Next Unit →
        </Link>
      ) : (
        <Link to={`/tamil-evaluation?chapter=${chapter.chapterId}`} className="lt-btn lt-btn--primary theme-btn">
          Complete Chapter →
        </Link>
      )}
    </div>
  );
};

export default UnitActions;
