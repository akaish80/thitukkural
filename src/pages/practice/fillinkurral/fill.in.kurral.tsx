/* eslint-disable array-callback-return */
import React, { createRef, useEffect, useRef, useState, useCallback } from 'react';
import { getRandomList, returnMatchedLine } from '../../../components/utils';
import TextInputComp from '../../../components/TextInputComp';
import './fill.in.kurral.styles.scss';
import fetchWrapper from '../../../utils/fetchWrapper';

type RawKurralData = KurralItem[];

interface KurralItem {
  Index: number;
  Tamil: string;
  line1: string;
  line2: string;
  line1Replace?: boolean;
  line2Replace?: boolean;
  inputWord?: string;
  error?: boolean;
  [key: string]: any;
}

interface PreparedItem extends KurralItem {
  acceptedWord: string;
  origLine1: string;
  origLine2: string;
}

type AnswerState = 'idle' | 'correct' | 'wrong';

const FillInKurral = () => {
  const [queue, setQueue] = useState<PreparedItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [inputWord, setInputWord] = useState('');
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [initialTotal, setInitialTotal] = useState(0);
  const inputRef = useRef<React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>>(
    createRef(),
  );
  const cachedRawData = useRef<RawKurralData>([]);

  const initExercise = useCallback((rawData: RawKurralData) => {
    const raw = getRandomList(rawData, 10);
    const prepared = prepareItems(raw);
    setQueue(prepared);
    setInitialTotal(prepared.length);
    setCurrent(0);
    setScore(0);
    setTotalAnswered(0);
    setInputWord('');
    setAnswerState('idle');
    setShowResult(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadKurralData = async () => {
      try {
        const data = await fetchWrapper(`${import.meta.env.VITE_API_BASE_URL}/api/kurrals`);
        if (isMounted) {
          cachedRawData.current = data as KurralItem[];
          initExercise(cachedRawData.current);
        }
      } catch {
        if (isMounted) setLoadError('Unable to load kurral data. Please refresh and try again.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadKurralData();
    return () => { isMounted = false; };
  }, [initExercise]);

  const prepareItems = (items: KurralItem[]): PreparedItem[] => {
    return items.map((item) => {
      const kurral = item.Tamil.replace('<br />', ' ');
      const spltKurral = kurral.split(' ');
      const randomWord = getRandomList(spltKurral, 1)[0];
      const origLine1 = item.line1;
      const origLine2 = item.line2;
      let line1 = item.line1;
      let line2 = item.line2;
      let line1Replace = false;
      let line2Replace = false;
      const { matchedLine, replacedString } = returnMatchedLine(line1, line2, randomWord);
      if (matchedLine === 'line1') { line1 = replacedString; line1Replace = true; }
      else { line2 = replacedString; line2Replace = true; }
      return { ...item, line1, line2, line1Replace, line2Replace, acceptedWord: randomWord, origLine1, origLine2 };
    });
  };

  const handleCheck = useCallback(() => {
    if (answerState !== 'idle' || !inputWord.trim()) return;
    const q = queue[current];
    setTotalAnswered((p) => p + 1);
    if (inputWord.trim() === q.acceptedWord) {
      setAnswerState('correct');
      setScore((p) => p + 1);
    } else {
      setAnswerState('wrong');
      setQueue((prev) => [...prev, { ...q, inputWord: '' }]);
    }
  }, [answerState, inputWord, current, queue]);

  const handleContinue = useCallback(() => {
    if (current + 1 < queue.length) { setCurrent((p) => p + 1); }
    else { setShowResult(true); }
    setInputWord('');
    setAnswerState('idle');
  }, [current, queue.length]);

  const handleRetry = useCallback(() => {
    if (cachedRawData.current.length > 0) {
      initExercise(cachedRawData.current);
    } else {
      window.location.reload();
    }
  }, [initExercise]);

  const renderLine = (line: string, isBlank: boolean) => {
    if (!isBlank) return <p className="line-text">{line}</p>;
    const parts = line.split(' ');
    return (
      <div className="line wrapcontent">
        {parts.map((word, i) =>
          word === '_' ? (
            <TextInputComp key={i} freeRef={inputRef.current} freeText={inputWord} setFreeText={setInputWord} className="kurral-blank-input" placeholder="சொல்" />
          ) : (
            <p key={i}>{`${word} `}</p>
          ),
        )}
      </div>
    );
  };

  const progressPercent = initialTotal > 0 ? Math.round((score / initialTotal) * 100) : 0;

  if (isLoading) {
    return <div className="duo-fill"><div className="duo-fill__loading">Loading exercise...</div></div>;
  }
  if (loadError) {
    return <div className="duo-fill"><div className="duo-fill__loading">{loadError}</div></div>;
  }
  if (queue.length === 0) {
    return <div className="duo-fill"><div className="duo-fill__loading">No data available.</div></div>;
  }

  if (showResult) {
    return (
      <div className="duo-fill">
        <div className="duo-fill__result">
          <div className="duo-fill__result-icon">🎉</div>
          <h2>பயிற்சி முடிந்தது!</h2>
          <div className="duo-fill__result-score">
            <span className="big">{score}</span>
            <span className="sep">/</span>
            <span className="big">{initialTotal}</span>
          </div>
          <p className="duo-fill__result-detail">
            முயற்சிகள்: {totalAnswered} &middot; துல்லியம்: {totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0}%
          </p>
          <button className="duo-fill__btn duo-fill__btn--primary" onClick={handleRetry}>
            மீண்டும் விளையாடு
          </button>
        </div>
      </div>
    );
  }

  const q = queue[current];
  const isRetry = current >= initialTotal;

  return (
    <div className="duo-fill">
      <div className="duo-fill__progress">
        <div className="duo-fill__progress-bar" style={{ width: `${progressPercent}%` }} />
      </div>
      <div className="duo-fill__meta">
        <span>{score}/{initialTotal} சரி</span>
        {isRetry && <span className="duo-fill__retry-badge">மீண்டும்</span>}
      </div>

      <div className="duo-fill__card">
        <p className="duo-fill__prompt">காணாமல் போன சொல்லை நிரப்புக:</p>
        <div className="duo-fill__kurral">
          {renderLine(q.line1, !!q.line1Replace)}
          {renderLine(q.line2, !!q.line2Replace)}
        </div>

        {answerState === 'idle' && (
          <button
            className="duo-fill__btn duo-fill__btn--submit"
            onClick={handleCheck}
            disabled={!inputWord.trim()}
          >
            சரிபார் →
          </button>
        )}
      </div>

      {answerState !== 'idle' && (
        <div className={`duo-fill__feedback duo-fill__feedback--${answerState}`}>
          {answerState === 'correct' ? (
            <p className="duo-fill__feedback-text">✅ சரியான பதில்!</p>
          ) : (
            <div>
              <p className="duo-fill__feedback-text">❌ தவறான பதில்</p>
              <p className="duo-fill__feedback-answer">சரியான சொல்: <strong>{q.acceptedWord}</strong></p>
              <p className="duo-fill__feedback-full">
                {q.origLine1}<br />{q.origLine2}
              </p>
            </div>
          )}
          <button className="duo-fill__btn duo-fill__btn--continue" onClick={handleContinue}>
            தொடரவும் →
          </button>
        </div>
      )}
    </div>
  );
};

export default FillInKurral;
