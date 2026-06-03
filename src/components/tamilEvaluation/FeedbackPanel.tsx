import type { AnswerState } from '../../types';

type FeedbackPanelProps = {
  answerState: Exclude<AnswerState, 'idle'>;
  explanation: string;
  correctAnswer: string;
  onContinue: () => void;
};

const FeedbackPanel = ({ answerState, explanation, correctAnswer, onContinue }: FeedbackPanelProps) => {
  const isCorrect = answerState === 'correct';

  return (
    <div className={`duo-eval__feedback duo-eval__feedback--${answerState}`}>
      {isCorrect && (
        <div className="duo-eval__feedback-celebration" aria-hidden="true">
          <span className="duo-eval__feedback-spark duo-eval__feedback-spark--1">✨</span>
          <span className="duo-eval__feedback-spark duo-eval__feedback-spark--2">🎉</span>
          <span className="duo-eval__feedback-spark duo-eval__feedback-spark--3">✨</span>
          <span className="duo-eval__feedback-spark duo-eval__feedback-spark--4">🎊</span>
        </div>
      )}
      <p className={isCorrect ? 'duo-eval__feedback-title duo-eval__feedback-title--correct' : 'duo-eval__feedback-title'}>
        {isCorrect
          ? 'Correct answer. Great work!'
          : `Not quite. Correct answer: ${correctAnswer}`}
      </p>
      <p className="duo-eval__feedback-explainer">{explanation}</p>
      <button type="button" className="duo-eval__btn duo-eval__btn--continue" onClick={onContinue}>
        Continue
      </button>
    </div>
  );
};

export default FeedbackPanel;
