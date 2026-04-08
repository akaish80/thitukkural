import React, { useEffect, useState } from 'react';
import './QuizPractice.scss';
import fetchWrapper from '../../utils/fetchWrapper';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
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
    });
  }
  return questions;
}

function shuffle(arr: string[]): string[] {
  return arr.sort(() => Math.random() - 0.5);
}

const QuizPractice: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadQuizData = async () => {
      try {
        const data = await fetchWrapper(`${import.meta.env.VITE_API_BASE_URL}/api/kurrals`);
        if (isMounted) {
          const quizData = (Array.isArray(data) ? data : []).map((item: any) => ({
            Kurral_id: Number(item.Kurral_id),
            Tamil: item.Tamil.replace('<br />',''),
          })) as QuizDataItem[];
          setQuestions(getRandomQuestions(5, quizData));
        }
      } catch (error) {
        if (isMounted) {
          setLoadError('Unable to load quiz data. Please refresh and try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadQuizData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelect = (option: string) => setSelected(option);
  const handleNext = () => {
    if (selected === questions[current].answer) setScore(score + 1);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };
  const handleRetry = () => window.location.reload();

  if (isLoading) {
    return (
      <div className="quiz-result">
        <h2>Loading quiz...</h2>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="quiz-result">
        <h2>{loadError}</h2>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-result">
        <h2>No quiz questions available.</h2>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="quiz-result">
        <h2>Quiz Completed!</h2>
        <p>Your Score: {score} / {questions.length}</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="quiz-practice">
      <h3>Question {current + 1} of {questions.length}</h3>
      <p>{q.question}</p>
      <ul>
        {q.options.map((opt) => (
          <li key={opt}>
            <button
              style={{ background: selected === opt ? '#d1e7dd' : undefined }}
              onClick={() => handleSelect(opt)}
              disabled={!!selected}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <button onClick={handleNext}>Next</button>
      )}
    </div>
  );
};

export default QuizPractice;
