import type { AnswerState, SessionQuestion } from "../../types";

type AssessmentQuestionCardProps = {
  currentQuestion: SessionQuestion;
  sectionDone: number;
  sectionTotal: number;
  answerState: AnswerState;
  selectedIndex: number | null;
  reorderItems: string[];
  activeReorderItem: string | null;
  selectedVowelSet: string[];
  matchRightItems: string[];
  wordMatches: Record<string, string>;
  activeMatchLeft: string | null;
  canCheckActivity: boolean;
  onPlayAudio: () => void;
  onSelectOption: (index: number) => void;
  onSetActiveReorderItem: (item: string | null) => void;
  onStartReorderDrag: (item: string) => void;
  onReorderDrop: (targetItem: string) => void;
  onSwapReorderItem: (fromItem: string, toItem: string) => void;
  onCheckActivity: () => void;
  onToggleVowelLengthOption: (vowel: string) => void;
  onSelectMatchLeft: (leftItem: string) => void;
  onSelectMatchRight: (rightItem: string) => void;
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
  matchRightItems,
  wordMatches,
  activeMatchLeft,
  canCheckActivity,
  onPlayAudio,
  onSelectOption,
  onSetActiveReorderItem,
  onStartReorderDrag,
  onReorderDrop,
  onSwapReorderItem,
  onCheckActivity,
  onToggleVowelLengthOption,
  onSelectMatchLeft,
  onSelectMatchRight,
}: AssessmentQuestionCardProps) => {
  const isVowelOrder = currentQuestion.activityType === "vowel-order";
  const isVowelLength = currentQuestion.activityType === "vowel-length";
  const isWordMatch = currentQuestion.activityType === "word-match";

  return (
    <div className="duo-eval__card">
      <div className="duo-eval__section-badge">
        <span className="duo-eval__section-icon">
          {currentQuestion.sectionIcon}
        </span>
        <span className="duo-eval__section-label">
          {currentQuestion.sectionLabel}
        </span>
        <span className="duo-eval__section-progress">
          {sectionDone + 1}/{sectionTotal}
        </span>
      </div>

      {currentQuestion.audioText && (
        <div className="duo-eval__audio-wrap">
          <p className="duo-eval__audio-hint">
            Listen and choose the correct option
          </p>
          <p className="duo-eval__audio-text" aria-live="polite">
            Heard text: <span>{currentQuestion.audioText}</span>
          </p>
          <div className="duo-eval__audio-header">
            <h3 className="duo-eval__question">{currentQuestion.prompt}</h3>
            <button
              type="button"
              className="duo-eval__audio-btn"
              onClick={onPlayAudio}
              title="Play audio prompt"
            >
              🔊
            </button>
          </div>
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

      {!currentQuestion.audioText && !currentQuestion.image && (
        <h3 className="duo-eval__question">{currentQuestion.prompt}</h3>
      )}

      {isVowelOrder ? (
        <div className="duo-eval__reorder-wrap">
          <p className="duo-eval__reorder-hint">
            Drag and drop to reorder. On touch devices, tap one tile and then
            another to swap.
          </p>
          <ul className="duo-eval__reorder-list">
            {reorderItems.map((item) => (
              <li
                key={`${currentQuestion.id}-${item}`}
                className={[
                  'duo-eval__reorder-item',
                  activeReorderItem === item ? 'duo-eval__reorder-item--active' : '',
                ].filter(Boolean).join(' ')}
                draggable={answerState === "idle"}
                onDragStart={() => onStartReorderDrag(item)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => onReorderDrop(item)}
                onClick={() => {
                  if (answerState !== "idle") return;
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
          <p className="duo-eval__reorder-hint">
            Select all long vowels (நெடில்).
          </p>
          <div className="duo-eval__vowel-chip-grid">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedVowelSet.includes(option);
              return (
                <button
                  key={`${currentQuestion.id}-${option}`}
                  type="button"
                  className={[
                    'duo-eval__vowel-chip',
                    isSelected ? 'duo-eval__vowel-chip--selected' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => onToggleVowelLengthOption(option)}
                  disabled={answerState !== "idle"}
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
      ) : isWordMatch ? (
        <div className="duo-eval__word-match-wrap">
          <p className="duo-eval__reorder-hint">
            Select one Tamil word on the left, then choose its matching English meaning on the right.
          </p>
          <div className="duo-eval__word-match-grid">
            <div className="duo-eval__word-match-column">
              <h4 className="duo-eval__word-match-title">Tamil</h4>
              <ul className="duo-eval__word-match-list">
                {currentQuestion.options.map((leftItem) => {
                  const matched = wordMatches[leftItem];
                  const isActive = activeMatchLeft === leftItem;
                  return (
                    <li key={`${currentQuestion.id}-left-${leftItem}`}>
                      <button
                        type="button"
                        className={[
                          'duo-eval__word-match-item',
                          isActive ? 'duo-eval__word-match-item--active' : '',
                          matched ? 'duo-eval__word-match-item--matched' : '',
                        ].filter(Boolean).join(' ')}
                        onClick={() => onSelectMatchLeft(leftItem)}
                        disabled={answerState !== "idle"}
                      >
                        <span>{leftItem}</span>
                        {matched && <small>{matched}</small>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="duo-eval__word-match-column">
              <h4 className="duo-eval__word-match-title">English</h4>
              <ul className="duo-eval__word-match-list">
                {matchRightItems.map((rightItem) => {
                  const mappedLeft = Object.keys(wordMatches).find(
                    (leftItem) => wordMatches[leftItem] === rightItem,
                  );
                  return (
                    <li key={`${currentQuestion.id}-right-${rightItem}`}>
                      <button
                        type="button"
                        className={[
                          'duo-eval__word-match-item',
                          mappedLeft ? 'duo-eval__word-match-item--matched' : '',
                        ].filter(Boolean).join(' ')}
                        onClick={() => onSelectMatchRight(rightItem)}
                        disabled={answerState !== "idle"}
                      >
                        <span>{rightItem}</span>
                        {mappedLeft && <small>{mappedLeft}</small>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <button
            type="button"
            className="duo-eval__btn duo-eval__btn--check"
            onClick={onCheckActivity}
            disabled={!canCheckActivity}
          >
            Check Matching
          </button>
        </div>
      ) : (
        <ul
          className={
            currentQuestion.optionImages
              ? "duo-eval__image-options"
              : "duo-eval__options"
          }
        >
          {currentQuestion.options.map((option, idx) => {
            const isCorrect = idx === currentQuestion.correctIndex;
            const isSelected = idx === selectedIndex;
            const stateClass =
              answerState === "idle"
                ? ""
                : isCorrect
                  ? "correct"
                  : isSelected
                    ? "wrong"
                    : "dimmed";
            const optionStateClass = stateClass ? `duo-eval__option--${stateClass}` : '';
            const imageOptionStateClass = stateClass ? `duo-eval__image-option--${stateClass}` : '';

            if (currentQuestion.optionImages) {
              return (
                <li key={`${currentQuestion.id}-${idx}`}>
                  <button
                    type="button"
                    className={[
                      'duo-eval__image-option',
                      imageOptionStateClass,
                    ].filter(Boolean).join(' ')}
                    onClick={() => onSelectOption(idx)}
                    disabled={answerState !== "idle"}
                  >
                    <img
                      src={currentQuestion.optionImages[idx]}
                      alt={option}
                      className="duo-eval__image-option-img"
                    />
                    <span className="duo-eval__image-option-label">
                      {option}
                    </span>
                  </button>
                </li>
              );
            }

            return (
              <li key={`${currentQuestion.id}-${idx}`}>
                <button
                  type="button"
                  className={[
                    'duo-eval__option',
                    optionStateClass,
                  ].filter(Boolean).join(' ')}
                  onClick={() => onSelectOption(idx)}
                  disabled={answerState !== "idle"}
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
