import type { AnswerState } from '../../types';

type FeedbackPanelProps = {
  answerState: Exclude<AnswerState, 'idle'>;
  explanation: string;
  correctAnswer: string;
  onContinue: () => void;
};

const FeedbackPanel = ({ answerState, explanation, correctAnswer, onContinue }: FeedbackPanelProps) => {
  return (
    <div className={`duo-eval__feedback duo-eval__feedback--${answerState}`}>
      <p>
        {answerState === 'correct'
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
