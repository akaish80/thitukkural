import { useState } from 'react';
import { Container } from '../../../Common/common.styles';
import './practice.letter.scss';

// ---------------------------------------------------------------------------
// Data — structure mirrors Lexilogos Tamil keyboard
// ---------------------------------------------------------------------------
type Key = { roman: string; tamil: string };

const CONSONANTS: Key[] = [
  { roman: 'ka', tamil: 'க' }, { roman: 'nga', tamil: 'ங' },
  { roman: 'ca', tamil: 'ச' }, { roman: 'nja', tamil: 'ஞ' },
  { roman: 'ta', tamil: 'ட' }, { roman: 'na', tamil: 'ண' },
  { roman: 'ta', tamil: 'த' }, { roman: 'na', tamil: 'ந' },
  { roman: 'pa', tamil: 'ப' }, { roman: 'ma', tamil: 'ம' },
  { roman: 'ya', tamil: 'ய' }, { roman: 'ra', tamil: 'ர' },
  { roman: 'la', tamil: 'ல' }, { roman: 'va', tamil: 'வ' },
  { roman: 'zha', tamil: 'ழ' }, { roman: 'la', tamil: 'ள' },
  { roman: 'ra', tamil: 'ற' }, { roman: 'na', tamil: 'ன' },
];

const VOWELS: Key[] = [
  { roman: 'a', tamil: 'அ' }, { roman: 'aa', tamil: 'ஆ' },
  { roman: 'i', tamil: 'இ' }, { roman: 'ii', tamil: 'ஈ' },
  { roman: 'u', tamil: 'உ' }, { roman: 'uu', tamil: 'ஊ' },
  { roman: 'e', tamil: 'எ' }, { roman: 'ee', tamil: 'ஏ' },
  { roman: 'ai', tamil: 'ஐ' }, { roman: 'o', tamil: 'ஒ' },
  { roman: 'oo', tamil: 'ஓ' }, { roman: 'au', tamil: 'ஔ' },
];

// ---------------------------------------------------------------------------
// Practice mode uses standalone base letters only
// ---------------------------------------------------------------------------
const PRACTICE_LETTERS: Key[] = [...CONSONANTS, ...VOWELS];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const PracticeLetter = () => {
  // — Practice mode state —
  const [target, setTarget] = useState<Key>(PRACTICE_LETTERS[0]);
  const [lastPressed, setLastPressed] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);



  // ---------------------------------------------------------------------------
  // Practice helpers
  // ---------------------------------------------------------------------------
  const setTargetAndClear = (key: Key) => {
    setTarget(key);
    setLastPressed(null);
    setFeedback('');
  };

  const nextTarget = (from: Key = target) => {
    const idx = PRACTICE_LETTERS.findIndex((k) => k.tamil === from.tamil);
    setTargetAndClear(PRACTICE_LETTERS[(idx + 1) % PRACTICE_LETTERS.length]);
  };

  const randomTarget = () => {
    let idx = Math.floor(Math.random() * PRACTICE_LETTERS.length);
    while (PRACTICE_LETTERS[idx].tamil === target.tamil) {
      idx = Math.floor(Math.random() * PRACTICE_LETTERS.length);
    }
    setTargetAndClear(PRACTICE_LETTERS[idx]);
  };

  const handlePracticeKey = (key: Key) => {
    if (lastPressed !== null) return;        // wait for timeout to clear
    setLastPressed(key.tamil);

    if (key.tamil === target.tamil) {
      setFeedback('சரியானது! (Correct!)');
      setScore((p) => p + 1);
      setAttempts((p) => p + 1);
      setTimeout(() => {
        setLastPressed(null);
        setFeedback('');
        nextTarget();
      }, 1000);
    } else {
      setFeedback('தவறானது! மீண்டும் முயற்சி செய்யுங்கள் (Incorrect! Try again)');
      setAttempts((p) => p + 1);
      setTimeout(() => setLastPressed(null), 700);
    }
  };

  const resetPractice = () => {
    setLastPressed(null);
    setFeedback('');
    setAttempts(0);
    setScore(0);
    setTargetAndClear(PRACTICE_LETTERS[0]);
  };

  const successRate = attempts === 0 ? 0 : Math.round((score / attempts) * 100);

  const keyClass = (tamil: string) => {
    const base = 'kb-key';
    if (lastPressed !== tamil) return base;
    return `${base} ${tamil === target.tamil ? 'key-correct' : 'key-incorrect'}`;
  };



  // ---------------------------------------------------------------------------
  // Keyboard renderer
  // ---------------------------------------------------------------------------
  // In practice mode we re-use keyClass for highlighting
  const renderPracticeKey = (key: Key) => (
    <button
      key={key.tamil}
      type="button"
      className={keyClass(key.tamil)}
      onClick={() => handlePracticeKey(key)}
      title={`${key.roman}  ${key.tamil}`}
    >
      <span className="kb-roman">{key.roman}</span>
      <span className="kb-tamil">{key.tamil}</span>
    </button>
  );

  
    
 

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <Container>
      <div className="practice-letter-container">
        <div className="header-section">
          <h2>தமிழ் எழுத்து பயிற்சி — Tamil Letter Practice</h2>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* PRACTICE MODE                                                       */}
        {/* ------------------------------------------------------------------ */}
        {
          <div className="practice-section">
            {/* Target letter card */}
            <div className="letter-display">
              <div className="large-letter">{target.tamil}</div>
              <div className="letter-info">
                <p className="roman-name">{target.roman}</p>
                <p>
                  {VOWELS.some((v) => v.tamil === target.tamil)
                    ? 'Vowel (உயிர் எழுத்து)'
                    : 'Consonant (மெய் எழுத்து)'}
                </p>
              </div>
            </div>

            {/* Instruction + feedback */}
            <div className="input-section">
              <label>Find and click the letter shown above:</label>
              {feedback && (
                <div className={`feedback ${feedback.includes('சரியானது') ? 'success' : 'error'}`}>
                  {feedback}
                </div>
              )}
            </div>

            {/* Virtual keyboard — practice-aware */}
            <div className="virtual-keyboard">
              <div className="keyboard-group">
                <span className="kb-group-label">Consonants (மெய் எழுத்து)</span>
                <div className="kb-row">{CONSONANTS.map(renderPracticeKey)}</div>
              </div>
              <div className="keyboard-group">
                <span className="kb-group-label">Vowels (உயிர் எழுத்து)</span>
                <div className="kb-row">{VOWELS.map(renderPracticeKey)}</div>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-section">
              <div className="stat-item">
                <span className="stat-label">Attempts</span>
                <span className="stat-value">{attempts}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Correct</span>
                <span className="stat-value">{score}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Success Rate</span>
                <span className="stat-value">{successRate}%</span>
              </div>
            </div>

            {/* Actions */}
            <div className="actions-section">
              <button onClick={resetPractice} className="action-btn" type="button">Reset</button>
              <button onClick={() => nextTarget()} className="action-btn" type="button">Next</button>
              <button onClick={randomTarget} className="action-btn" type="button">Random</button>
            </div>
          </div>
        }

        {/* Tips */}
        <div className="tips-section">
          <h4>Tips</h4>
          <ul>
            <li>A target letter is shown — find and click it on the keyboard.</li>
            <li>Hover a key to see its romanisation.</li>
            <li>Use <em>Next</em> or <em>Random</em> to switch target letters any time.</li>
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default PracticeLetter;