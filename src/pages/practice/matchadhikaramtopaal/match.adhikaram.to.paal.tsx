import { useEffect, useState, useCallback } from 'react';
import { getRandomList } from '../../../utils/componentUtils';
import './match.adhikaram.to.paal.scss';
import fetchWrapper from '../../../utils/fetchWrapper';

interface AdikaramItem {
  Index: number;
  Tamil: string;
  English: string;
  Transliteration: string;
  kurralStart: number;
  kurralEnd: number;
}

interface PaalItem {
  Index: number;
  Tamil: string;
  English: string;
  Transliteration: string;
  adikaramStart: number;
  adikaramEnd: number;
  adikaram: string[];
  count: number;
}

type MatchListType = 'Tamil' | 'English' | 'Transliteration';

interface MatchListOption {
  key: MatchListType;
  label: string;
}

interface QueueItem {
  adhikaram: AdikaramItem;
  correctPaal: PaalItem;
  options: PaalItem[];
}

type AnswerState = 'idle' | 'correct' | 'wrong';

const MATCH_LIST_OPTIONS: MatchListOption[] = [
  { key: 'Tamil', label: 'தமிழ்' },
  { key: 'English', label: 'English' },
  { key: 'Transliteration', label: 'Transliteration' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MatchAdhikaramToPaal = () => {
  const [allPaalList, setAllPaalList] = useState<PaalItem[]>([]);
  const [allAdikaram, setAllAdikaram] = useState<AdikaramItem[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [initialTotal, setInitialTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeListType, setActiveListType] = useState<MatchListType>('Tamil');

  const buildQueue = useCallback(
    (adikarams: AdikaramItem[], paals: PaalItem[]): QueueItem[] => {
      const randomItems = getRandomList(adikarams, 10) as AdikaramItem[];
      return randomItems.map((adh) => {
        const correctPaal = paals.find(
          (p) => adh.Index >= p.adikaramStart && adh.Index <= p.adikaramEnd,
        )!;
        const wrongPaals = shuffle(paals.filter((p) => p.Index !== correctPaal.Index)).slice(0, 2);
        const options = shuffle([correctPaal, ...wrongPaals]);
        return { adhikaram: adh, correctPaal, options };
      });
    },
    [],
  );

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const data = await fetchWrapper(
          `${import.meta.env.VITE_API_BASE_URL}/api/getPaalsAndAdikarams`,
        );
        if (isMounted) {
          setAllPaalList(data.paals);
          setAllAdikaram(data.adikarams);
          const q = buildQueue(data.adikarams, data.paals);
          setQueue(q);
          setInitialTotal(q.length);
        }
      } catch {
        if (isMounted) setLoadError('Unable to load data. Please refresh and try again.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [buildQueue]);

  const handleSelect = useCallback(
    (paal: PaalItem, idx: number) => {
      if (answerState !== 'idle') return;
      setSelectedIdx(idx);
      setTotalAnswered((p) => p + 1);
      const q = queue[current];
      if (paal.Index === q.correctPaal.Index) {
        setAnswerState('correct');
        setScore((p) => p + 1);
      } else {
        setAnswerState('wrong');
        // Re-queue with reshuffled options
        setQueue((prev) => [
          ...prev,
          { ...q, options: shuffle(q.options) },
        ]);
      }
    },
    [answerState, current, queue],
  );

  const handleContinue = useCallback(() => {
    if (current + 1 < queue.length) {
      setCurrent((p) => p + 1);
    } else {
      setShowResult(true);
    }
    setAnswerState('idle');
    setSelectedIdx(null);
  }, [current, queue.length]);

  const handleRetry = useCallback(() => {
    const q = buildQueue(allAdikaram, allPaalList);
    setQueue(q);
    setInitialTotal(q.length);
    setCurrent(0);
    setScore(0);
    setTotalAnswered(0);
    setShowResult(false);
    setAnswerState('idle');
    setSelectedIdx(null);
  }, [allAdikaram, allPaalList, buildQueue]);

  const getDisplayName = (item: AdikaramItem | PaalItem) => item[activeListType];

  const progressPercent = initialTotal > 0 ? Math.round((score / initialTotal) * 100) : 0;

  if (isLoading) {
    return (
      <div className="duo-match">
        <div className="duo-match__loading">Loading exercise...</div>
      </div>
    );
  }
  if (loadError) {
    return (
      <div className="duo-match">
        <div className="duo-match__loading">{loadError}</div>
      </div>
    );
  }
  if (queue.length === 0) {
    return (
      <div className="duo-match">
        <div className="duo-match__loading">No data available.</div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="duo-match">
        <div className="duo-match__result">
          <div className="duo-match__result-icon">🎉</div>
          <h2>பயிற்சி முடிந்தது!</h2>
          <div className="duo-match__result-score">
            <span className="big">{score}</span>
            <span className="sep">/</span>
            <span className="big">{initialTotal}</span>
          </div>
          <p className="duo-match__result-detail">
            முயற்சிகள்: {totalAnswered} &middot; துல்லியம்:{' '}
            {totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0}%
          </p>
          <button className="duo-match__btn duo-match__btn--primary" onClick={handleRetry}>
            மீண்டும் விளையாடு
          </button>
        </div>
      </div>
    );
  }

  const q = queue[current];
  const isRetry = current >= initialTotal;

  return (
    <div className="duo-match">
      {/* Progress bar */}
      <div className="duo-match__progress">
        <div className="duo-match__progress-bar" style={{ width: `${progressPercent}%` }} />
      </div>
      <div className="duo-match__meta">
        <span>
          {score}/{initialTotal} சரி
        </span>
        {isRetry && <span className="duo-match__retry-badge">மீண்டும்</span>}
      </div>

      {/* Language switcher */}
      <div className="duo-match__switcher">
        {MATCH_LIST_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={`duo-match__switch-btn${activeListType === opt.key ? ' active' : ''}`}
            onClick={() => setActiveListType(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Question card */}
      <div className="duo-match__card">
        <p className="duo-match__prompt">இந்த அதிகாரம் எந்தப் பாலைச் சேர்ந்தது?</p>
        <div className="duo-match__adhikaram">{getDisplayName(q.adhikaram)}</div>

        <ul className="duo-match__options">
          {q.options.map((paal, idx) => {
            let cls = 'duo-match__option';
            if (answerState !== 'idle') {
              if (paal.Index === q.correctPaal.Index) cls += ' correct';
              else if (idx === selectedIdx) cls += ' wrong';
              else cls += ' dimmed';
            }
            return (
              <li key={idx}>
                <button
                  className={cls}
                  onClick={() => handleSelect(paal, idx)}
                  disabled={answerState !== 'idle'}
                >
                  {getDisplayName(paal)}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Feedback */}
      {answerState !== 'idle' && (
        <div className={`duo-match__feedback duo-match__feedback--${answerState}`}>
          {answerState === 'correct' ? (
            <p className="duo-match__feedback-text">✅ சரியான பொருத்தம்!</p>
          ) : (
            <div>
              <p className="duo-match__feedback-text">❌ தவறான பொருத்தம்</p>
              <p className="duo-match__feedback-answer">
                சரியான பால்: <strong>{getDisplayName(q.correctPaal)}</strong>
              </p>
            </div>
          )}
          <button className="duo-match__btn duo-match__btn--continue" onClick={handleContinue}>
            தொடரவும் →
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchAdhikaramToPaal;
