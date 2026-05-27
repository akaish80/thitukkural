import type { AnswerState, SessionQuestion } from '../../types';

type AssessmentQuestionCardProps = {
  currentQuestion: SessionQuestion;
  sectionDone: number;
  sectionTotal: number;
  answerState: AnswerState;
  selectedIndex: number | null;
  reorderItems: string[];
  activeReorderItem: string | null;
  selectedVowelSet: string[];
  canCheckActivity: boolean;
  onPlayAudio: () => void;
  onSelectOption: (index: number) => void;
  onSetActiveReorderItem: (item: string | null) => void;
  onStartReorderDrag: (item: string) => void;
  onReorderDrop: (targetItem: string) => void;
  onSwapReorderItem: (fromItem: string, toItem: string) => void;
  onCheckActivity: () => void;
  onToggleVowelLengthOption: (vowel: string) => void;
};

const AssessmentQuestionCard = ({
  currentQuestion,
  sectionDone,
  sectionTotal,
  answerState,
  selectedIndex,
  reorderItems,
  activeReorderItem,
  selectedVowelSet,
  canCheckActivity,
  onPlayAudio,
  onSelectOption,
  onSetActiveReorderItem,
  onStartReorderDrag,
  onReorderDrop,
  onSwapReorderItem,
  onCheckActivity,
  onToggleVowelLengthOption,
}: AssessmentQuestionCardProps) => {
  const isVowelOrder = currentQuestion.activityType === 'vowel-order';
  const isVowelLength = currentQuestion.activityType === 'vowel-length';

  return (
    <div className="duo-eval__card">
      <div className="duo-eval__section-badge">
        <span className="duo-eval__section-icon">{currentQuestion.sectionIcon}</span>
        <span className="duo-eval__section-label">{currentQuestion.sectionLabel}</span>
        <span className="duo-eval__section-progress">{sectionDone + 1}/{sectionTotal}</span>
      </div>

      {currentQuestion.audioText && (
        <div className="duo-eval__audio-wrap">
          <p className="duo-eval__audio-hint">Listen and choose the correct option</p>
          <button
            type="button"
            className="duo-eval__audio-btn"
            onClick={onPlayAudio}
            title="Play audio prompt"
          >
            🔊 Play Audio
          </button>
        </div>
      )}

      {currentQuestion.image && (
        <div className="duo-eval__image-wrap">
          <img
            src={currentQuestion.image}
            alt="Identify this"
            className="duo-eval__image"
          />
          <button
            type="button"
            className="duo-eval__speak-btn"
            title="Hear the Tamil word"
            onClick={onPlayAudio}
          >
            🔊
          </button>
        </div>
      )}

      <h3 className="duo-eval__question">{currentQuestion.prompt}</h3>

      {isVowelOrder ? (
        <div className="duo-eval__reorder-wrap">
          <p className="duo-eval__reorder-hint">Drag and drop to reorder. On touch devices, tap one tile and then another to swap.</p>
          <ul className="duo-eval__reorder-list">
            {reorderItems.map((item) => (
              <li
                key={`${currentQuestion.id}-${item}`}
                className={`duo-eval__reorder-item ${activeReorderItem === item ? 'active' : ''}`.trim()}
                draggable={answerState === 'idle'}
                onDragStart={() => onStartReorderDrag(item)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => onReorderDrop(item)}
                onClick={() => {
                  if (answerState !== 'idle') return;
                  if (!activeReorderItem) {
                    onSetActiveReorderItem(item);
                    return;
                  }
                  if (activeReorderItem === item) {
                    onSetActiveReorderItem(null);
                    return;
                  }
                  onSwapReorderItem(activeReorderItem, item);
                  onSetActiveReorderItem(null);
                }}
              >
                <span className="duo-eval__reorder-handle">⋮⋮</span>
                <span className="duo-eval__reorder-value">{item}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="duo-eval__btn duo-eval__btn--check"
            onClick={onCheckActivity}
            disabled={!canCheckActivity}
          >
            Check Order
          </button>
        </div>
      ) : isVowelLength ? (
        <div className="duo-eval__vowel-length-wrap">
          <p className="duo-eval__reorder-hint">Select all long vowels (நெடில்).</p>
          <div className="duo-eval__vowel-chip-grid">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedVowelSet.includes(option);
              return (
                <button
                  key={`${currentQuestion.id}-${option}`}
                  type="button"
                  className={`duo-eval__vowel-chip ${isSelected ? 'selected' : ''}`.trim()}
                  onClick={() => onToggleVowelLengthOption(option)}
                  disabled={answerState !== 'idle'}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="duo-eval__btn duo-eval__btn--check"
            onClick={onCheckActivity}
            disabled={!canCheckActivity}
          >
            Check Selection
          </button>
        </div>
      ) : (
        <ul className={currentQuestion.optionImages ? 'duo-eval__image-options' : 'duo-eval__options'}>
          {currentQuestion.options.map((option, idx) => {
            const isCorrect = idx === currentQuestion.correctIndex;
            const isSelected = idx === selectedIndex;
            const stateClass =
              answerState === 'idle'
                ? ''
                : isCorrect
                  ? 'correct'
                  : isSelected
                    ? 'wrong'
                    : 'dimmed';

            if (currentQuestion.optionImages) {
              return (
                <li key={`${currentQuestion.id}-${idx}`}>
                  <button
                    type="button"
                    className={`duo-eval__image-option ${stateClass}`.trim()}
                    onClick={() => onSelectOption(idx)}
                    disabled={answerState !== 'idle'}
                  >
                    <img
                      src={currentQuestion.optionImages[idx]}
                      alt={option}
                      className="duo-eval__image-option-img"
                    />
                    <span className="duo-eval__image-option-label">{option}</span>
                  </button>
                </li>
              );
            }

            return (
              <li key={`${currentQuestion.id}-${idx}`}>
                <button
                  type="button"
                  className={`duo-eval__option ${stateClass}`.trim()}
                  onClick={() => onSelectOption(idx)}
                  disabled={answerState !== 'idle'}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AssessmentQuestionCard;
