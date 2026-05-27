import { Link } from 'react-router-dom';
import PageTitle from '../PageTitle';

type AssessmentTopBarProps = {
  chapterTitle?: string;
  questionIndex: number;
  totalQuestions: number;
  xp: number;
  hearts: number;
  maxHearts: number;
  progress: number;
  sectionBoundaries: number[];
};

const AssessmentTopBar = ({
  chapterTitle,
  questionIndex,
  totalQuestions,
  xp,
  hearts,
  maxHearts,
  progress,
  sectionBoundaries,
}: AssessmentTopBarProps) => {
  return (
    <>
      <PageTitle
        title={chapterTitle ? `${chapterTitle} Assessment` : 'Tamil Skill Assessment'}
        description="Find your Tamil level with interactive activities for letters, vowels, numbers, vocabulary, and reading."
        path="/tamil-evaluation"
      />
      {chapterTitle && (
        <div className="duo-eval__chapter-mode">
          <span>Focused Mode: {chapterTitle}</span>
          <Link to="/learn-tamil" className="duo-eval__chapter-link">Change Chapter</Link>
        </div>
      )}

      <div className="duo-eval__header">
        <div className="duo-eval__progress-track">
          <div className="duo-eval__progress-fill" style={{ width: `${progress}%` }} />
          {sectionBoundaries.map((boundary) => (
            <div
              key={boundary}
              className="duo-eval__progress-marker"
              style={{ left: `${Math.round((boundary / totalQuestions) * 100)}%` }}
            />
          ))}
        </div>
        <div className="duo-eval__meta">
          <span>Q {questionIndex + 1}/{totalQuestions}</span>
          <span>XP {xp}</span>
          <span className="duo-eval__hearts">{'❤'.repeat(hearts)}{'♡'.repeat(maxHearts - hearts)}</span>
        </div>
      </div>
    </>
  );
};

export default AssessmentTopBar;
