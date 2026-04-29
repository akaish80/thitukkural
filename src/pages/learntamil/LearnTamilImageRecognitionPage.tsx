import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PICTURE_WORD_ITEMS, type LessonItem } from '../learningpath/learningPathData';
import './learntamil-image-recognition.styles.scss';

type Phase = 'study' | 'quiz' | 'result';

interface QuizQuestion {
  item: LessonItem;
  options: string[];
  correct: string;
}

const VOWEL_ITEMS: LessonItem[] = [
  { id: 'vowel-அ', tamil: 'அ', romanization: 'a', meaning: 'அம்மா (Amma)', imageSrc: '/learning-images/png/vowel-a.png', imageHint: 'Tamil vowel அ with Amma' },
  { id: 'vowel-ஆ', tamil: 'ஆ', romanization: 'aa', meaning: 'ஆடு (Aadu)', imageSrc: '/learning-images/png/vowel-aa.png', imageHint: 'Tamil vowel ஆ with Aadu' },
  { id: 'vowel-இ', tamil: 'இ', romanization: 'i', meaning: 'இலை (Ilai)', imageSrc: '/learning-images/png/vowel-i.png', imageHint: 'Tamil vowel இ with Ilai' },
  { id: 'vowel-ஈ', tamil: 'ஈ', romanization: 'ee', meaning: 'ஈ (Ee)', imageSrc: '/learning-images/png/vowel-ii.png', imageHint: 'Tamil vowel ஈ with Ee' },
  { id: 'vowel-உ', tamil: 'உ', romanization: 'u', meaning: 'உணவு (Unavu)', imageSrc: '/learning-images/png/vowel-u.png', imageHint: 'Tamil vowel உ with Unavu' },
  { id: 'vowel-ஊ', tamil: 'ஊ', romanization: 'oo', meaning: 'ஊஞ்சல் (Oonjal)', imageSrc: '/learning-images/png/vowel-uu.png', imageHint: 'Tamil vowel ஊ with Oonjal' },
  { id: 'vowel-எ', tamil: 'எ', romanization: 'e', meaning: 'எலி (Eli)', imageSrc: '/learning-images/png/vowel-e.png', imageHint: 'Tamil vowel எ with Eli' },
  { id: 'vowel-ஏ', tamil: 'ஏ', romanization: 'ae', meaning: 'ஏணி (Aeni)', imageSrc: '/learning-images/png/vowel-ee.png', imageHint: 'Tamil vowel ஏ with Aeni' },
  { id: 'vowel-ஐ', tamil: 'ஐ', romanization: 'ai', meaning: 'ஐந்து (Aindhu)', imageSrc: '/learning-images/png/vowel-ai.png', imageHint: 'Tamil vowel ஐ with Aindhu' },
  { id: 'vowel-ஒ', tamil: 'ஒ', romanization: 'o', meaning: 'ஒட்டகச்சிவிங்கி (Ottagachivingi)', imageSrc: '/learning-images/png/vowel-o.png', imageHint: 'Tamil vowel ஒ with Ottagachivingi' },
  { id: 'vowel-ஓ', tamil: 'ஓ', romanization: 'oo', meaning: 'ஓடம் (Odam)', imageSrc: '/learning-images/png/vowel-oo.png', imageHint: 'Tamil vowel ஓ with Odam' },
  { id: 'vowel-ஔ', tamil: 'ஔ', romanization: 'au', meaning: 'ஔடதம் (Aoudhadham)', imageSrc: '/learning-images/png/vowel-au.png', imageHint: 'Tamil vowel ஔ with Aoudhadham' },
];

const IMAGE_RECOGNITION_ITEMS: LessonItem[] = [...VOWEL_ITEMS, ...PICTURE_WORD_ITEMS];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(size = 12): QuizQuestion[] {
  const vowelCount = Math.min(VOWEL_ITEMS.length, Math.floor(size / 2));
  const ordered = [
    ...VOWEL_ITEMS.slice(0, vowelCount),
    ...shuffle(PICTURE_WORD_ITEMS).slice(0, Math.max(0, size - vowelCount)),
  ];

  const base = ordered.slice(0, size);
  return base.map((item) => {
    const wrong = shuffle(IMAGE_RECOGNITION_ITEMS.filter((x) => x.id !== item.id))
      .slice(0, 3)
      .map((x) => x.tamil);
    const correct = item.tamil;
    const options = shuffle([correct, ...wrong]);
    return { item, options, correct };
  });
}

const LearnTamilImageRecognitionPage = () => {
  const [phase, setPhase] = useState<Phase>('study');
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => buildQuestions());
  const [studyIndex, setStudyIndex] = useState(0);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const current = questions[idx];
  const studyItem = IMAGE_RECOGNITION_ITEMS[studyIndex];
  const progress = useMemo(() => {
    if (questions.length === 0) return 0;
    return Math.round((idx / questions.length) * 100);
  }, [idx, questions.length]);

  const startQuiz = () => {
    setQuestions(buildQuestions());
    setIdx(0);
    setSelected(null);
    setShowAnswer(false);
    setScore(0);
    setPhase('quiz');
  };

  const prevStudy = () => {
    setStudyIndex((n) => Math.max(0, n - 1));
  };

  const nextStudy = () => {
    setStudyIndex((n) => Math.min(IMAGE_RECOGNITION_ITEMS.length - 1, n + 1));
  };

  const onAnswer = (option: string) => {
    if (showAnswer) return;
    setSelected(option);
    setShowAnswer(true);
    if (option === current.correct) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (idx + 1 < questions.length) {
      setIdx((n) => n + 1);
      setSelected(null);
      setShowAnswer(false);
      return;
    }
    setPhase('result');
  };

  return (
    <div className="lt-recognition-page">
      <header className="lt-recognition-page__header">
        <h1>Learn Tamil: Image Recognition</h1>
        <p>One image at a time. Starts with Tamil vowels (Uyir Ezhuthukkal).</p>
      </header>

      {phase === 'study' && (
        <section className="lt-study">
          <div className="lt-study__actions">
            <button type="button" className="lt-btn lt-btn--primary" onClick={startQuiz}>
              Start Recognition Quiz
            </button>
            <Link to="/learn-tamil/picture-chart" className="lt-btn">
              Open Printable Chart
            </Link>
          </div>

          <div className="lt-study__meta">
            <span>
              Card {studyIndex + 1}/{IMAGE_RECOGNITION_ITEMS.length}
            </span>
            <span className="lt-study__stage">
              {studyIndex < VOWEL_ITEMS.length ? 'Vowels' : 'Word Images'}
            </span>
          </div>

          <article className="lt-card lt-card--single">
            {studyItem?.imageSrc ? (
              <img src={studyItem.imageSrc} alt={studyItem.imageHint || studyItem.meaning || studyItem.tamil} className="lt-card__img" />
            ) : (
              <div className="lt-card__fallback">{studyItem?.imageEmoji || '🖼️'}</div>
            )}
            <h2>{studyItem?.tamil}</h2>
            <p>{studyItem?.meaning}</p>
          </article>

          <div className="lt-study__actions">
            <button type="button" className="lt-btn" onClick={prevStudy} disabled={studyIndex === 0}>
              ← Previous
            </button>
            <button
              type="button"
              className="lt-btn"
              onClick={nextStudy}
              disabled={studyIndex === IMAGE_RECOGNITION_ITEMS.length - 1}
            >
              Next →
            </button>
          </div>
        </section>
      )}

      {phase === 'quiz' && current && (
        <section className="lt-quiz">
          <div className="lt-quiz__progress">
            <div className="lt-quiz__bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="lt-quiz__meta">Q{idx + 1}/{questions.length}</p>

          <div className="lt-quiz__image-wrap">
            {current.item.imageSrc ? (
              <img src={current.item.imageSrc} alt={current.item.imageHint || current.item.meaning || current.item.tamil} className="lt-quiz__img" />
            ) : (
              <div className="lt-quiz__fallback">{current.item.imageEmoji || '🖼️'}</div>
            )}
          </div>

          <div className="lt-quiz__options">
            {current.options.map((opt) => {
              let cls = 'lt-option';
              if (showAnswer) {
                if (opt === current.correct) cls += ' lt-option--correct';
                else if (opt === selected) cls += ' lt-option--wrong';
              }
              return (
                <button key={opt} type="button" className={cls} onClick={() => onAnswer(opt)}>
                  {opt}
                </button>
              );
            })}
          </div>

          {showAnswer && (
            <button type="button" className="lt-btn lt-btn--primary" onClick={nextQuestion}>
              {idx + 1 < questions.length ? 'Next' : 'See Results'}
            </button>
          )}
        </section>
      )}

      {phase === 'result' && (
        <section className="lt-result">
          <h2>Quiz Complete</h2>
          <p>
            Score: {score}/{questions.length}
          </p>
          <div className="lt-study__actions">
            <button type="button" className="lt-btn lt-btn--primary" onClick={startQuiz}>
              Retry Quiz
            </button>
            <button type="button" className="lt-btn" onClick={() => setPhase('study')}>
              Back to Study Cards
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default LearnTamilImageRecognitionPage;
