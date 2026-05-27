import { useState, useMemo, useEffect } from 'react';
import PageTitle from '../../components/PageTitle';
import { Link } from 'react-router-dom';
import {
  getLessonProgress,
  getBadges,
  getStreakData,
} from '../../utils/learningStore';
import { LEARNING_STEPS } from '../../data/constants';
import './learningpath.styles.scss';

/* ── Progress helpers ── */
function stepCompletion(stepId: string): { done: number; total: number } {
  const step = LEARNING_STEPS.find((s) => s.id === stepId);
  if (!step) return { done: 0, total: 0 };
  let done = 0;
  const total = step.lessons.length;
  for (const lesson of step.lessons) {
    const p = getLessonProgress(lesson.id);
    if (p.completedAt) done++;
  }
  return { done, total };
}

function overallProgress(): { done: number; total: number } {
  let done = 0;
  let total = 0;
  for (const step of LEARNING_STEPS) {
    const sc = stepCompletion(step.id);
    done += sc.done;
    total += sc.total;
  }
  return { done, total };
}

/* ── Component ── */
const LearningPath = () => {
  const [tab, setTab] = useState<'path' | 'badges'>('path');
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [mobileStepIndex, setMobileStepIndex] = useState(0);
  const badges = useMemo(() => getBadges(), []);
  const streak = useMemo(() => getStreakData(), []);
  const overall = useMemo(() => overallProgress(), []);
  const pct = overall.total > 0 ? Math.round((overall.done / overall.total) * 100) : 0;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const visibleSteps = isMobile ? [LEARNING_STEPS[mobileStepIndex]] : LEARNING_STEPS;

  return (
    <div className="learning-path-page">
      <PageTitle
        title="Learning Path"
        description="Structured Tamil learning from vowels to sentences — with progress tracking, badges and streaks."
        path="/learn"
      />
      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero__text">
          <h1 className="lp-hero__title">
            <span className="lp-hero__tamil">தமிழ் கற்றல் பாதை</span>
            <span className="lp-hero__en">Learning Path</span>
          </h1>
          <p className="lp-hero__subtitle">
            A structured, step-by-step journey from your first vowel to reading full Tamil sentences.
          </p>
        </div>

        {/* Overall progress ring */}
        <div className="lp-hero__progress">
          <svg viewBox="0 0 120 120" className="lp-ring">
            <circle cx="60" cy="60" r="52" className="lp-ring__bg" />
            <circle
              cx="60" cy="60" r="52"
              className="lp-ring__fill"
              strokeDasharray={`${(pct / 100) * 327} 327`}
            />
          </svg>
          <div className="lp-ring__label">
            <span className="lp-ring__pct">{pct}%</span>
            <span className="lp-ring__sub">{overall.done}/{overall.total} lessons</span>
          </div>
        </div>
      </section>

      {/* Streak bar */}
      {streak.currentStreak > 0 && (
        <div className="lp-streak">
          🔥 <strong>{streak.currentStreak}</strong> day streak &nbsp;·&nbsp; Best: {streak.longestStreak}
        </div>
      )}

      {/* Tabs */}
      <div className="lp-tabs">
        <button
          className={`lp-tab ${tab === 'path' ? 'active' : ''}`}
          onClick={() => setTab('path')}
        >📚 Path</button>
        <button
          className={`lp-tab ${tab === 'badges' ? 'active' : ''}`}
          onClick={() => setTab('badges')}
        >🏅 Badges</button>
      </div>

      {/* Path view */}
      {tab === 'path' && (
        <div className="lp-steps">
          <section className="lp-planner-cta">
            <h2 className="lp-planner-cta__title">30-Day Planner</h2>
            <p className="lp-planner-cta__desc">
              Track your daily schedule, challenge date, milestones, and momentum in a dedicated planner page.
            </p>
            <Link to="/planner" className="lp-planner-cta__btn">Open Planner</Link>
          </section>

          {isMobile && (
            <div className="lp-mobile-step-nav">
              <button
                type="button"
                className="lp-mobile-step-nav__btn"
                onClick={() => setMobileStepIndex((i) => Math.max(0, i - 1))}
                disabled={mobileStepIndex === 0}
              >
                ← Prev
              </button>
              <span className="lp-mobile-step-nav__label">
                Step {mobileStepIndex + 1} / {LEARNING_STEPS.length}
              </span>
              <button
                type="button"
                className="lp-mobile-step-nav__btn"
                onClick={() => setMobileStepIndex((i) => Math.min(LEARNING_STEPS.length - 1, i + 1))}
                disabled={mobileStepIndex === LEARNING_STEPS.length - 1}
              >
                Next →
              </button>
            </div>
          )}

          {visibleSteps.map((step) => {
            const idx = LEARNING_STEPS.findIndex((s) => s.id === step.id);
            const sc = stepCompletion(step.id);
            const isUnlocked = idx === 0 || stepCompletion(LEARNING_STEPS[idx - 1].id).done === stepCompletion(LEARNING_STEPS[idx - 1].id).total;
            const isComplete = sc.done === sc.total && sc.total > 0;
            const stepPct = sc.total > 0 ? Math.round((sc.done / sc.total) * 100) : 0;

            return (
              <div
                key={step.id}
                className={`lp-step ${isComplete ? 'lp-step--complete' : ''} ${!isUnlocked ? 'lp-step--locked' : ''}`}
                style={{ '--step-color': step.color } as React.CSSProperties}
              >
                {/* Connector */}
                {idx > 0 && (
                  <div className={`lp-connector ${isUnlocked ? 'lp-connector--active' : ''}`} />
                )}

                <div className="lp-step__header">
                  <span className="lp-step__icon">{isComplete ? '✅' : step.icon}</span>
                  <div>
                    <h2 className="lp-step__title">
                      Step {step.stepNumber}: {step.title}
                    </h2>
                    <p className="lp-step__title-tamil">{step.titleTamil}</p>
                  </div>
                </div>

                <p className="lp-step__desc">{step.description}</p>

                {/* Step progress bar */}
                <div className="lp-step__bar">
                  <div className="lp-step__bar-fill" style={{ width: `${stepPct}%` }} />
                </div>
                <span className="lp-step__stat">{sc.done}/{sc.total} lessons · {stepPct}%</span>

                {/* Lesson list */}
                <ul className="lp-lesson-list">
                  {step.lessons.map((lesson) => {
                    const lp = getLessonProgress(lesson.id);
                    const lessonDone = !!lp.completedAt;
                    return (
                      <li key={lesson.id} className={`lp-lesson-item ${lessonDone ? 'lp-lesson-item--done' : ''}`}>
                        <span className="lp-lesson-item__check">
                          {lessonDone ? '✅' : '○'}
                        </span>
                        <div className="lp-lesson-item__info">
                          <span className="lp-lesson-item__name">{lesson.title}</span>
                          <span className="lp-lesson-item__tamil">{lesson.titleTamil}</span>
                        </div>
                        {isUnlocked && (
                          <Link
                            to={`/learn/${step.id}/${lesson.id}`}
                            className="lp-lesson-item__btn"
                          >
                            {lessonDone ? 'Review' : 'Start'}
                          </Link>
                        )}
                        {!isUnlocked && <span className="lp-lesson-item__lock">🔒</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          {/* Completion card */}
          {pct === 100 && (
            <div className="lp-complete-card">
              <span className="lp-complete-card__icon">🏆</span>
              <h2>பாதை நிறைவு! Path Complete!</h2>
              <p>You've completed the entire learning path. Keep practicing to reinforce your skills!</p>
            </div>
          )}
        </div>
      )}

      {/* Badges view */}
      {tab === 'badges' && (
        <div className="lp-badges">
          {badges.map((b) => (
            <div key={b.id} className={`lp-badge ${b.earnedAt ? 'lp-badge--earned' : ''}`}>
              <span className="lp-badge__icon">{b.icon}</span>
              <div className="lp-badge__info">
                <span className="lp-badge__name">{b.name}</span>
                <span className="lp-badge__tamil">{b.nameTamil}</span>
                <span className="lp-badge__desc">{b.description}</span>
              </div>
              {b.earnedAt && (
                <span className="lp-badge__date">
                  Earned {new Date(b.earnedAt).toLocaleDateString()}
                </span>
              )}
              {!b.earnedAt && <span className="lp-badge__locked">🔒</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPath;
