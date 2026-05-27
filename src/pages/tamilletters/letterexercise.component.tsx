import { useState, useCallback, useMemo } from 'react';
import PageTitle from '../../components/PageTitle';
import { SpeakButton, SpeedToggle } from '../../components/PronunciationPlayer/PronunciationPlayer';
import { VOWELS as ALPHA_VOWELS, CONSONANTS as ALPHA_CONSONANTS } from '../../data/constants';
import './letterexercise.styles.scss';

// ---------------------------------------------------------------------------
// Data — derived from canonical tamilAlphabet source of truth
// ---------------------------------------------------------------------------
interface LetterInfo {
  tamil: string;
  roman: string;
  type: 'vowel' | 'consonant';
  typeLabel: string;
}

const VOWELS: LetterInfo[] = ALPHA_VOWELS.map((l) => ({
  tamil: l.base,
  roman: l.romanization,
  type: 'vowel' as const,
  typeLabel: l.typeLabelTa,
}));

const CONSONANTS: LetterInfo[] = ALPHA_CONSONANTS.map((l) => ({
  tamil: l.base,
  roman: l.romanization,
  type: 'consonant' as const,
  typeLabel: l.typeLabelTa,
}));

const ALL_LETTERS = [...VOWELS, ...CONSONANTS];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type LetterSet = 'all' | 'vowel' | 'consonant';
type QuestionMode = 'tamil-to-roman' | 'roman-to-tamil' | 'classify';
type AnswerState = 'idle' | 'correct' | 'wrong';

interface Question {
  letter: LetterInfo;
  mode: QuestionMode;
  options: string[];
  answer: string;
}

interface AttemptRecord {
  question: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickRandom<T>(arr: T[], count: number, exclude?: T): T[] {
  const filtered = exclude != null ? arr.filter((x) => x !== exclude) : [...arr];
  return shuffle(filtered).slice(0, count);
}

function buildQuestions(pool: LetterInfo[], count: number): Question[] {
  const modes: QuestionMode[] = ['tamil-to-roman', 'roman-to-tamil', 'classify'];
  const picked = shuffle(pool).slice(0, count);

  return picked.map((letter) => {
    const mode = modes[Math.floor(Math.random() * modes.length)];

    if (mode === 'tamil-to-roman') {
      const wrongs = pickRandom(pool, 3, letter).map((l) => l.roman);
      return {
        letter,
        mode,
        options: shuffle([letter.roman, ...wrongs]),
        answer: letter.roman,
      };
    }
    if (mode === 'roman-to-tamil') {
      const wrongs = pickRandom(pool, 3, letter).map((l) => l.tamil);
      return {
        letter,
        mode,
        options: shuffle([letter.tamil, ...wrongs]),
        answer: letter.tamil,
      };
    }
    // classify
    return {
      letter,
      mode,
      options: ['உயிர் எழுத்து (Vowel)', 'மெய் எழுத்து (Consonant)'],
      answer: letter.type === 'vowel' ? 'உயிர் எழுத்து (Vowel)' : 'மெய் எழுத்து (Consonant)',
    };
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const QUESTION_COUNT = 10;

const LetterExercise = () => {
  const [letterSet, setLetterSet] = useState<LetterSet>('all');
  const [started, setStarted] = useState(false);
  const [queue, setQueue] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);

  const pool = useMemo(() => {
    if (letterSet === 'vowel') return VOWELS;
    if (letterSet === 'consonant') return CONSONANTS;
    return ALL_LETTERS;
  }, [letterSet]);

  const startExercise = useCallback(() => {
    const qs = buildQuestions(pool, QUESTION_COUNT);
    setQueue(qs);
    setCurrent(0);
    setSelected(null);
    setAnswerState('idle');
    setScore(0);
    setTotalAnswered(0);
    setShowResult(false);
    setAttempts([]);
    setStarted(true);
  }, [pool]);

  const handleSelect = useCallback((option: string) => {
    if (answerState !== 'idle') return;
    setSelected(option);
    setTotalAnswered((p) => p + 1);
    const q = queue[current];
    const isCorrect = option === q.answer;

    setAttempts((prev) => [
      ...prev,
      {
        question: q.mode === 'roman-to-tamil' ? q.letter.roman : q.letter.tamil,
        selected: option,
        correct: q.answer,
        isCorrect,
      },
    ]);

    if (isCorrect) {
      setAnswerState('correct');
      setScore((p) => p + 1);
    } else {
      setAnswerState('wrong');
      // Re-queue with reshuffled options
      setQueue((prev) => [...prev, { ...q, options: shuffle(q.options) }]);
    }
  }, [answerState, current, queue]);

  const handleContinue = useCallback(() => {
    if (current + 1 < queue.length) {
      setCurrent((p) => p + 1);
    } else {
      setShowResult(true);
    }
    setSelected(null);
    setAnswerState('idle');
  }, [current, queue.length]);

  const getQuestionText = (q: Question) => {
    switch (q.mode) {
      case 'tamil-to-roman':
        return `"${q.letter.tamil}" எழுத்தின் ஆங்கில ஒலிப்பெயர்ப்பு என்ன?`;
      case 'roman-to-tamil':
        return `"${q.letter.roman}" என்பது எந்த தமிழ் எழுத்து?`;
      case 'classify':
        return `"${q.letter.tamil}" எழுத்து எந்த வகை?`;
    }
  };

  const progressPercent = queue.length > 0
    ? Math.round((score / Math.min(QUESTION_COUNT, queue.length)) * 100)
    : 0;

  // ── Setup screen ──
  if (!started) {
    return (
      <div className="letter-exercise">
        <div className="letter-exercise__setup">
          <div className="setup-icon">📝</div>
          <h1>எழுத்து பயிற்சி</h1>
          <p className="setup-subtitle">Tamil Letter Exercise</p>

          <div className="setup-options">
            <h3>எழுத்து வகையை தேர்வு செய்க</h3>
            <div className="setup-chips">
              {([
                { key: 'all' as LetterSet, label: 'அனைத்தும்', sub: 'All (30)', color: '#1cb0f6' },
                { key: 'vowel' as LetterSet, label: 'உயிர்', sub: 'Vowels (12)', color: '#58cc02' },
                { key: 'consonant' as LetterSet, label: 'மெய்', sub: 'Consonants (18)', color: '#ce82ff' },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  className={`setup-chip ${letterSet === opt.key ? 'active' : ''}`}
                  style={{ '--chip-color': opt.color } as React.CSSProperties}
                  onClick={() => setLetterSet(opt.key)}
                >
                  <span className="setup-chip__label">{opt.label}</span>
                  <span className="setup-chip__sub">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="setup-info">
            <p>{QUESTION_COUNT} questions — multiple choice</p>
            <p>Identify letters, transliterations & classify vowel/consonant</p>
            <SpeedToggle />
          </div>

          <button
            type="button"
            className="setup-start-btn"
            onClick={startExercise}
          >
            தொடங்கு →
          </button>
        </div>
      </div>
    );
  }

  // ── Result screen ──
  if (showResult) {
    const failedCount = totalAnswered - score;
    return (
      <div className="letter-exercise">
        <div className="letter-exercise__result">
          <div className="result-icon">🎉</div>
          <h2>பயிற்சி முடிந்தது!</h2>
          <div className="result-score">
            <span className="big">{score}</span>
            <span className="sep">/</span>
            <span className="big">{QUESTION_COUNT}</span>
          </div>
          <p className="result-detail">
            முயற்சிகள்: {totalAnswered} &middot; துல்லியம்: {totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0}%
          </p>

          <div className="result-summary">
            <h3>முயற்சி சுருக்கம்</h3>
            <div className="result-stats">
              <div className="result-stat result-stat--total">
                <span className="result-stat__value">{totalAnswered}</span>
                <span className="result-stat__label">மொத்த முயற்சிகள்</span>
              </div>
              <div className="result-stat result-stat--success">
                <span className="result-stat__value">{score}</span>
                <span className="result-stat__label">சரியான பதில்கள்</span>
              </div>
              <div className="result-stat result-stat--fail">
                <span className="result-stat__value">{failedCount}</span>
                <span className="result-stat__label">தவறான பதில்கள்</span>
              </div>
            </div>
            <table className="result-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>கேள்வி</th>
                  <th>தேர்ந்தெடுத்தது</th>
                  <th>சரியான பதில்</th>
                  <th>முடிவு</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a, i) => (
                  <tr key={i} className={a.isCorrect ? 'row-correct' : 'row-wrong'}>
                    <td>{i + 1}</td>
                    <td>{a.question}</td>
                    <td>{a.selected}</td>
                    <td>{a.correct}</td>
                    <td>{a.isCorrect ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="result-actions">
            <button type="button" className="result-btn result-btn--primary" onClick={startExercise}>
              மீண்டும் விளையாடு
            </button>
            <button type="button" className="result-btn result-btn--secondary" onClick={() => setStarted(false)}>
              அமைப்புகள் மாற்று
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz screen ──
  const q = queue[current];
  const isRetry = current >= QUESTION_COUNT;

  return (
    <div className="letter-exercise">
      <PageTitle
        title="Letter Exercise"
        description="Practice identifying Tamil vowels and consonants with interactive quizzes."
        path="/letter-exercise"
      />
      {/* Progress */}
      <div className="letter-exercise__progress">
        <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
      </div>
      <div className="letter-exercise__meta">
        <span>{score}/{QUESTION_COUNT} சரி</span>
        {isRetry && <span className="retry-badge">மீண்டும்</span>}
      </div>

      {/* Question */}
      <div className="letter-exercise__card">
        {q.mode !== 'roman-to-tamil' && (
          <div className="card-letter">
            {q.letter.tamil}
            <SpeakButton text={q.letter.tamil} size="sm" />
          </div>
        )}
        {q.mode === 'roman-to-tamil' && (
          <div className="card-roman">{q.letter.roman}</div>
        )}
        <p className="card-question">{getQuestionText(q)}</p>

        <ul className="card-options">
          {q.options.map((opt) => {
            let cls = 'card-option';
            if (answerState !== 'idle') {
              if (opt === q.answer) cls += ' correct';
              else if (opt === selected) cls += ' wrong';
              else cls += ' dimmed';
            } else if (opt === selected) {
              cls += ' selected';
            }
            return (
              <li key={opt}>
                <button
                  className={cls}
                  onClick={() => handleSelect(opt)}
                  disabled={answerState !== 'idle'}
                >
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Feedback */}
      {answerState !== 'idle' && (
        <div className={`letter-exercise__feedback letter-exercise__feedback--${answerState}`}>
          {answerState === 'correct' ? (
            <p className="feedback-text">✅ சரியான பதில்!</p>
          ) : (
            <div>
              <p className="feedback-text">❌ தவறான பதில்</p>
              <p className="feedback-answer">சரியான பதில்: {q.answer}</p>
            </div>
          )}
          <button className="feedback-btn" onClick={handleContinue}>
            தொடரவும் →
          </button>
        </div>
      )}
    </div>
  );
};

export default LetterExercise;
