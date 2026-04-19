import React, { useEffect, useState, useCallback, useRef } from 'react';
import './QuizPractice.scss';
import fetchWrapper from '../../utils/fetchWrapper';
import { saveQuizResult, recordActivity, recordSpacedResult } from '../../utils/learningStore';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  id: number;
}

interface QuizDataItem {
  Kurral_id: number;
  Tamil: string;
}

function getRandomQuestions(num: number, kurralData: QuizDataItem[]): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const usedIndexes = new Set<number>();
  while (questions.length < num && usedIndexes.size < kurralData.length) {
    const idx = Math.floor(Math.random() * kurralData.length);
    if (usedIndexes.has(idx)) continue;
    usedIndexes.add(idx);
    const kurral = kurralData[idx];
    const options = [kurral.Tamil];
    while (options.length < 4) {
      const optIdx = Math.floor(Math.random() * kurralData.length);
      if (optIdx !== idx && !options.includes(kurralData[optIdx].Tamil)) {
        options.push(kurralData[optIdx].Tamil);
      }
    }
    questions.push({
      question: `Which is the correct Kurral for ID ${kurral.Kurral_id}?`,
      options: shuffle(options),
      answer: kurral.Tamil,
      id: kurral.Kurral_id,
    });
  }
  return questions;
}

function shuffle(arr: string[]): string[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface AttemptRecord {
  questionId: number;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

type AnswerState = 'idle' | 'correct' | 'wrong';

const QuizPractice: React.FC = () => {
  const [queue, setQueue] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [initialTotal, setInitialTotal] = useState(0);
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const cachedQuizData = useRef<QuizDataItem[]>([]);

  const initQuiz = useCallback((quizData: QuizDataItem[]) => {
    const qs = getRandomQuestions(5, quizData);
    setQueue(qs);
    setInitialTotal(qs.length);
    setCurrent(0);
    setScore(0);
    setTotalAnswered(0);
    setSelected(null);
    setAnswerState('idle');
    setShowResult(false);
    setAttempts([]);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadQuizData = async () => {
      try {
        const data = await fetchWrapper(`${import.meta.env.VITE_API_BASE_URL}/api/kurrals`);
        if (isMounted) {
          const quizData = (Array.isArray(data) ? data : []).map((item: any) => ({
            Kurral_id: Number(item.Kurral_id),
            Tamil: item.Tamil.replace('<br />', ''),
          })) as QuizDataItem[];
          cachedQuizData.current = quizData;
          initQuiz(quizData);
        }
      } catch {
        if (isMounted) setLoadError('Unable to load quiz data. Please refresh and try again.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadQuizData();
    return () => { isMounted = false; };
  }, [initQuiz]);

  const handleSelect = useCallback((option: string) => {
    if (answerState !== 'idle') return;
    setSelected(option);
    setTotalAnswered((p) => p + 1);
    const q = queue[current];
    const isCorrect = option === q.answer;
    setAttempts((prev) => [
      ...prev,
      {
        questionId: q.id,
        question: q.question,
        selectedAnswer: option,
        correctAnswer: q.answer,
        isCorrect,
      },
    ]);
    if (isCorrect) {
      setAnswerState('correct');
      setScore((p) => p + 1);
    } else {
      setAnswerState('wrong');
      // Re-queue this question with reshuffled options
      setQueue((prev) => [
        ...prev,
        { ...q, options: shuffle(q.options) },
      ]);
    }
    // Track spaced repetition
    recordSpacedResult(q.id, isCorrect);
  }, [answerState, current, queue]);

  const handleContinue = useCallback(() => {
    if (current + 1 < queue.length) {
      setCurrent((p) => p + 1);
    } else {
      setShowResult(true);
      // Save progress
      const acc = (totalAnswered + 1) > 0 ? Math.round((score / (totalAnswered)) * 100) : 0;
      saveQuizResult({ date: new Date().toISOString(), score, total: initialTotal, accuracy: acc, type: 'quiz' });
      recordActivity();
    }
    setSelected(null);
    setAnswerState('idle');
  }, [current, queue.length]);

  const handleRetry = useCallback(() => {
    if (cachedQuizData.current.length > 0) {
      initQuiz(cachedQuizData.current);
    } else {
      window.location.reload();
    }
  }, [initQuiz]);

  // Progress: how many unique questions answered correctly out of initial total
  const progressPercent = initialTotal > 0 ? Math.round((score / initialTotal) * 100) : 0;

  if (isLoading) {
    return <div className="duo-quiz"><div className="duo-quiz__loading">Loading quiz...</div></div>;
  }
  if (loadError) {
    return <div className="duo-quiz"><div className="duo-quiz__loading">{loadError}</div></div>;
  }
  if (queue.length === 0) {
    return <div className="duo-quiz"><div className="duo-quiz__loading">No quiz questions available.</div></div>;
  }

  if (showResult) {
    const failedCount = totalAnswered - score;
    return (
      <div className="duo-quiz">
        <div className="duo-quiz__result">
          <div className="duo-quiz__result-icon">🎉</div>
          <h2>பயிற்சி முடிந்தது!</h2>
          <div className="duo-quiz__result-score">
            <span className="big">{score}</span>
            <span className="sep">/</span>
            <span className="big">{initialTotal}</span>
          </div>
          <p className="duo-quiz__result-detail">
            முயற்சிகள்: {totalAnswered} &middot; துல்லியம்: {totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0}%
          </p>

          <div className="duo-quiz__summary">
            <h3>முயற்சி சுருக்கம்</h3>
            <div className="duo-quiz__summary-stats">
              <div className="duo-quiz__stat duo-quiz__stat--total">
                <span className="duo-quiz__stat-value">{totalAnswered}</span>
                <span className="duo-quiz__stat-label">மொத்த முயற்சிகள்</span>
              </div>
              <div className="duo-quiz__stat duo-quiz__stat--success">
                <span className="duo-quiz__stat-value">{score}</span>
                <span className="duo-quiz__stat-label">சரியான பதில்கள்</span>
              </div>
              <div className="duo-quiz__stat duo-quiz__stat--fail">
                <span className="duo-quiz__stat-value">{failedCount}</span>
                <span className="duo-quiz__stat-label">தவறான பதில்கள்</span>
              </div>
            </div>
            <table className="duo-quiz__summary-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>கேள்வி</th>
                  <th>தேர்ந்தெடுத்தது</th>
                  <th>முடிவு</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a, i) => (
                  <tr key={i} className={a.isCorrect ? 'row-correct' : 'row-wrong'}>
                    <td>{i + 1}</td>
                    <td>குறள் #{a.questionId}</td>
                    <td className="duo-quiz__summary-answer">{a.selectedAnswer}</td>
                    <td>{a.isCorrect ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="duo-quiz__btn duo-quiz__btn--primary" onClick={handleRetry}>
            மீண்டும் விளையாடு
          </button>
        </div>
      </div>
    );
  }

  const q = queue[current];
  const isRetry = current >= initialTotal;

  return (
    <div className="duo-quiz">
      {/* Progress bar */}
      <div className="duo-quiz__progress">
        <div className="duo-quiz__progress-bar" style={{ width: `${progressPercent}%` }} />
      </div>
      <div className="duo-quiz__meta">
        <span>{score}/{initialTotal} சரி</span>
        {isRetry && <span className="duo-quiz__retry-badge">மீண்டும்</span>}
      </div>

      {/* Question card */}
      <div className="duo-quiz__card">
        <p className="duo-quiz__question">{q.question}</p>
        <ul className="duo-quiz__options">
          {q.options.map((opt) => {
            let cls = 'duo-quiz__option';
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

      {/* Feedback bar */}
      {answerState !== 'idle' && (
        <div className={`duo-quiz__feedback duo-quiz__feedback--${answerState}`}>
          {answerState === 'correct' ? (
            <p className="duo-quiz__feedback-text">✅ சரியான பதில்!</p>
          ) : (
            <div>
              <p className="duo-quiz__feedback-text">❌ தவறான பதில்</p>
              <p className="duo-quiz__feedback-answer">சரியான பதில்: {q.answer}</p>
            </div>
          )}
          <button className="duo-quiz__btn duo-quiz__btn--continue" onClick={handleContinue}>
            தொடரவும் →
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPractice;
