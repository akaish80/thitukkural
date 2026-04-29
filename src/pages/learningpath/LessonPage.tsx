import { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  markItemCompleted,
  completeLesson,
  advanceStep,
  getLessonProgress,
  saveLessonQuiz,
  earnBadge,
  recordActivity,
} from '../../utils/learningStore';
import { speakTamil, onSpeakingChange } from '../../utils/pronunciationEngine';
import { SpeedToggle, Waveform } from '../../components/PronunciationPlayer/PronunciationPlayer';
import { LEARNING_STEPS, type LessonItem } from './learningPathData';
import './learningpath.styles.scss';

/* ── Shuffle ── */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ── Lesson Page ── */
const LessonPage = () => {
  const { stepId, lessonId } = useParams<{ stepId: string; lessonId: string }>();

  const step = LEARNING_STEPS.find((s) => s.id === stepId);
  const lesson = step?.lessons.find((l) => l.id === lessonId);
  const lessonIdx = step?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  const nextLesson = step?.lessons[lessonIdx + 1];
  const stepIdx = LEARNING_STEPS.findIndex((s) => s.id === stepId);
  const nextStep = LEARNING_STEPS[stepIdx + 1];

  // Phases: learn → quiz → results
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'results'>('learn');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<{ item: LessonItem; options: string[]; correct: string }[]>([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [, setQuizAnswers] = useState<(string | null)[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => onSpeakingChange(setSpeaking), []);

  const items = lesson?.items ?? [];
  const totalItems = items.length;

  // Build quiz questions when entering quiz phase
  const buildQuiz = useCallback(() => {
    if (!lesson) return;
    const allItems = lesson.items;
    const questions = shuffle(allItems).map((item) => {
      // Generate wrong options from other items
      const others = allItems.filter((i) => i.id !== item.id);
      const wrongOptions = shuffle(others).slice(0, 3).map((i) => {
        if (lesson.quizType === 'picture') return i.tamil;
        if (lesson.quizType === 'read' || lesson.quizType === 'write') {
          return i.meaning || i.romanization;
        }
        return i.romanization;
      });
      const correct = lesson.quizType === 'picture'
        ? item.tamil
        : lesson.quizType === 'read' || lesson.quizType === 'write'
          ? item.meaning || item.romanization
          : item.romanization;
      const options = shuffle([correct, ...wrongOptions]);
      return { item, options, correct };
    });
    setQuizQuestions(questions);
    setQuizAnswers(new Array(questions.length).fill(null));
    setQuizIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
  }, [lesson]);

  // Start quiz phase
  const startQuiz = useCallback(() => {
    buildQuiz();
    setPhase('quiz');
  }, [buildQuiz]);

  // Handle quiz answer
  const handleQuizAnswer = useCallback((answer: string) => {
    if (showAnswer) return;
    setSelectedAnswer(answer);
    setShowAnswer(true);
    const isCorrect = answer === quizQuestions[quizIdx].correct;
    if (isCorrect) setScore((s) => s + 1);
    setQuizAnswers((prev) => {
      const copy = [...prev];
      copy[quizIdx] = answer;
      return copy;
    });
  }, [showAnswer, quizIdx, quizQuestions]);

  // Next quiz question or finish
  const nextQuizQuestion = useCallback(() => {
    if (quizIdx + 1 < quizQuestions.length) {
      setQuizIdx((i) => i + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      // Quiz complete — save results
      // Score was already incremented in handleQuizAnswer
      if (lesson) {
        saveLessonQuiz(lesson.id, score, quizQuestions.length);
        const passed = score >= Math.ceil(quizQuestions.length * 0.7);
        if (passed) {
          completeLesson(lesson.id);
          recordActivity();

          // Check for badge earning
          const earned: string[] = [];
          if (earnBadge('first-lesson')) earned.push('🌱 First Step');
          if (step && earnBadge(step.badgeId)) {
            // Check if ALL lessons in this step are done
            const allDone = step.lessons.every((l) => {
              const p = getLessonProgress(l.id);
              return !!p.completedAt || l.id === lesson.id;
            });
            if (!allDone) {
              // Undo step badge — only earn when all lessons done
              // (earnBadge won't re-earn so this is fine)
            }
          }
          if (score === quizQuestions.length && earnBadge('perfect-quiz')) {
            earned.push('💯 Perfect Score');
          }
          // Advance step if all lessons complete
          if (step) {
            const allStepDone = step.lessons.every((l) => {
              const p = getLessonProgress(l.id);
              return !!p.completedAt || l.id === lesson.id;
            });
            if (allStepDone) {
              advanceStep(stepIdx + 1);
              if (earnBadge(step.badgeId)) earned.push(`${step.icon} ${step.title}`);
              // Check if entire path done
              const allPathDone = LEARNING_STEPS.every((s) =>
                s.lessons.every((l) => {
                  const p = getLessonProgress(l.id);
                  return !!p.completedAt || l.id === lesson.id;
                })
              );
              if (allPathDone && earnBadge('all-clear')) earned.push('🏆 Path Complete');
            }
          }
          setNewBadges(earned);
        }
      }
      setPhase('results');
    }
  }, [quizIdx, quizQuestions, score, selectedAnswer, lesson, step, stepIdx]);

  // Card navigation
  const nextCard = useCallback(() => {
    if (currentIdx < totalItems - 1) {
      setFlipped(false);
      setCurrentIdx((i) => i + 1);
    }
  }, [currentIdx, totalItems]);

  const prevCard = useCallback(() => {
    if (currentIdx > 0) {
      setFlipped(false);
      setCurrentIdx((i) => i - 1);
    }
  }, [currentIdx]);

  // Mark learned items
  useEffect(() => {
    if (phase !== 'learn' || !lesson) return;
    if (lesson.quizType === 'picture') {
      items.forEach((item) => markItemCompleted(lesson.id, item.id));
      return;
    }
    if (items[currentIdx]) {
      markItemCompleted(lesson.id, items[currentIdx].id);
    }
  }, [phase, lesson, currentIdx, items]);

  if (!step || !lesson) {
    return (
      <div className="lesson-page lesson-page--empty">
        <h2>Lesson not found</h2>
        <Link to="/learn">← Back to Learning Path</Link>
      </div>
    );
  }

  const currentItem = items[currentIdx];
  const quizPrompt = lesson.quizType === 'picture'
    ? 'Pick the correct Tamil word for this picture'
    : lesson.quizType === 'read' || lesson.quizType === 'write'
      ? 'What does this mean?'
      : 'What is the romanization?';

  return (
    <div className="lesson-page" style={{ '--step-color': step.color } as React.CSSProperties}>
      {/* Top bar */}
      <div className="lesson-topbar">
        <Link to="/learn" className="lesson-topbar__back">← Path</Link>
        <div className="lesson-topbar__info">
          <span className="lesson-topbar__step">{step.icon} Step {step.stepNumber}</span>
          <span className="lesson-topbar__name">{lesson.title}</span>
        </div>
        <div className="lesson-topbar__progress">
          {phase === 'learn' && (lesson.quizType === 'picture' ? `Preview ${totalItems}` : `${currentIdx + 1}/${totalItems}`)}
          {phase === 'quiz' && `Q${quizIdx + 1}/${quizQuestions.length}`}
        </div>
      </div>

      {/* Progress bar */}
      <div className="lesson-progress-bar">
        <div
          className="lesson-progress-bar__fill"
          style={{
            width: phase === 'learn'
              ? `${((currentIdx + 1) / totalItems) * 50}%`  // learn = first 50%
              : phase === 'quiz'
                ? `${50 + ((quizIdx + 1) / quizQuestions.length) * 50}%`  // quiz = last 50%
                : '100%',
          }}
        />
      </div>

      {/* ── LEARN PHASE ── */}
      {phase === 'learn' && lesson.quizType !== 'picture' && currentItem && (
        <div className="lesson-learn">
          <div
            className={`lesson-card ${flipped ? 'lesson-card--flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="lesson-card__front">
              <span className="lesson-card__tamil">{currentItem.tamil}</span>
              <span className="lesson-card__hint">Tap to flip</span>
            </div>
            <div className="lesson-card__back">
              <span className="lesson-card__roman">{currentItem.romanization}</span>
              {currentItem.meaning && (
                <span className="lesson-card__meaning">{currentItem.meaning}</span>
              )}
            </div>
          </div>

          <div className="lesson-audio-controls">
            <button className="lesson-speak-btn" onClick={() => speakTamil(currentItem.tamil)}>
              🔊 Listen
            </button>
            <Waveform active={speaking} bars={5} />
            <SpeedToggle />
          </div>

          <div className="lesson-nav">
            <button
              className="lesson-nav__btn"
              onClick={prevCard}
              disabled={currentIdx === 0}
            >← Previous</button>

            {currentIdx < totalItems - 1 ? (
              <button className="lesson-nav__btn lesson-nav__btn--primary" onClick={nextCard}>
                Next →
              </button>
            ) : (
              <button className="lesson-nav__btn lesson-nav__btn--primary" onClick={startQuiz}>
                Start Quiz 🎯
              </button>
            )}
          </div>

          {/* Item indicators */}
          <div className="lesson-dots">
            {items.map((_, i) => (
              <span
                key={i}
                className={`lesson-dot ${i === currentIdx ? 'lesson-dot--active' : ''} ${i < currentIdx ? 'lesson-dot--done' : ''}`}
              />
            ))}
          </div>
        </div>
      )}

      {phase === 'learn' && lesson.quizType === 'picture' && (
        <div className="lesson-learn lesson-learn--picture">
          <p className="lesson-picture-intro">Study these pictures and their Tamil words, then start the recognition quiz.</p>
          <Link to="/learn/picture-chart" className="lesson-picture-print-link">Open Printable Chart ↗</Link>
          <div className="lesson-picture-grid">
            {items.map((item) => (
              <div key={item.id} className="lesson-picture-card">
                {item.imageSrc ? (
                  <img src={item.imageSrc} alt={item.imageHint || item.meaning || item.tamil} className="lesson-picture-card__img" />
                ) : (
                  <div className="lesson-picture-card__fallback" role="img" aria-label={item.imageHint || item.meaning || item.tamil}>
                    {item.imageEmoji || '🖼️'}
                  </div>
                )}
                <span className="lesson-picture-card__tamil">{item.tamil}</span>
                <span className="lesson-picture-card__meaning">{item.meaning}</span>
              </div>
            ))}
          </div>
          <div className="lesson-nav">
            <button className="lesson-nav__btn lesson-nav__btn--primary" onClick={startQuiz}>
              Start Picture Quiz 🎯
            </button>
          </div>
        </div>
      )}

      {/* ── QUIZ PHASE ── */}
      {phase === 'quiz' && quizQuestions[quizIdx] && (
        <div className="lesson-quiz">
          <h2 className="lesson-quiz__prompt">{quizPrompt}</h2>
          <div className="lesson-quiz__question">
            {lesson.quizType === 'picture' ? (
              <div className="lesson-quiz__picture-wrap">
                {quizQuestions[quizIdx].item.imageSrc ? (
                  <img
                    src={quizQuestions[quizIdx].item.imageSrc}
                    alt={quizQuestions[quizIdx].item.imageHint || quizQuestions[quizIdx].item.meaning || 'Picture clue'}
                    className="lesson-quiz__picture-img"
                  />
                ) : (
                  <span className="lesson-quiz__picture" role="img" aria-label={quizQuestions[quizIdx].item.imageHint || quizQuestions[quizIdx].item.meaning || 'Picture clue'}>
                    {quizQuestions[quizIdx].item.imageEmoji || '🖼️'}
                  </span>
                )}
                <span className="lesson-quiz__picture-hint">{quizQuestions[quizIdx].item.imageHint || quizQuestions[quizIdx].item.meaning || 'Identify the Tamil word'}</span>
              </div>
            ) : (
              <>
                <span className="lesson-quiz__tamil">{quizQuestions[quizIdx].item.tamil}</span>
                <button className="lesson-quiz__listen" onClick={() => speakTamil(quizQuestions[quizIdx].item.tamil)}>
                  🔊
                </button>
              </>
            )}
          </div>

          <div className="lesson-quiz__options">
            {quizQuestions[quizIdx].options.map((opt) => {
              let cls = 'lesson-quiz__option';
              if (showAnswer) {
                if (opt === quizQuestions[quizIdx].correct) cls += ' lesson-quiz__option--correct';
                else if (opt === selectedAnswer) cls += ' lesson-quiz__option--wrong';
              } else if (opt === selectedAnswer) {
                cls += ' lesson-quiz__option--selected';
              }
              return (
                <button key={opt} className={cls} onClick={() => handleQuizAnswer(opt)}>
                  {opt}
                </button>
              );
            })}
          </div>

          {showAnswer && (
            <button className="lesson-quiz__next" onClick={nextQuizQuestion}>
              {quizIdx + 1 < quizQuestions.length ? 'Next Question →' : 'See Results 🎉'}
            </button>
          )}
        </div>
      )}

      {/* ── RESULTS PHASE ── */}
      {phase === 'results' && (
        <div className="lesson-results">
          <div className="lesson-results__circle">
            <span className="lesson-results__score">{score}/{quizQuestions.length}</span>
            <span className="lesson-results__pct">
              {Math.round((score / quizQuestions.length) * 100)}%
            </span>
          </div>

          <h2 className="lesson-results__title">
            {score >= Math.ceil(quizQuestions.length * 0.7) ? '🎉 Lesson Complete!' : '📝 Keep Practicing!'}
          </h2>
          <p className="lesson-results__subtitle">
            {score >= Math.ceil(quizQuestions.length * 0.7)
              ? 'Great job! You passed this lesson.'
              : `You need ${Math.ceil(quizQuestions.length * 0.7)} correct to pass. Try again!`}
          </p>

          {/* New badges */}
          {newBadges.length > 0 && (
            <div className="lesson-results__badges">
              <h3>🏅 New Badges Earned!</h3>
              {newBadges.map((b) => (
                <span key={b} className="lesson-results__badge">{b}</span>
              ))}
            </div>
          )}

          <div className="lesson-results__actions">
            {score < Math.ceil(quizQuestions.length * 0.7) && (
              <button
                className="lesson-results__btn lesson-results__btn--retry"
                onClick={() => { setPhase('learn'); setCurrentIdx(0); setFlipped(false); }}
              >🔄 Try Again</button>
            )}
            {nextLesson && score >= Math.ceil(quizQuestions.length * 0.7) && (
              <Link
                to={`/learn/${step.id}/${nextLesson.id}`}
                className="lesson-results__btn lesson-results__btn--next"
                onClick={() => { setPhase('learn'); setCurrentIdx(0); setFlipped(false); }}
              >Next Lesson →</Link>
            )}
            {!nextLesson && nextStep && score >= Math.ceil(quizQuestions.length * 0.7) && (
              <Link
                to={`/learn/${nextStep.id}/${nextStep.lessons[0].id}`}
                className="lesson-results__btn lesson-results__btn--next"
              >Next Step: {nextStep.title} →</Link>
            )}
            <Link to="/learn" className="lesson-results__btn">← Back to Path</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPage;
