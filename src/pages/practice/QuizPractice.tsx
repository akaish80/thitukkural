import React, { useState } from 'react';
import './QuizPractice.scss';
import kurralData from '../../Common/kurral_data.with_adikaram.json';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

function getRandomQuestions(num: number): QuizQuestion[] {
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
  const [questions] = useState<QuizQuestion[]>(getRandomQuestions(5));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

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
