import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { speakText } from '../chatbot/speakText';
import {
  getLatestTamilEvaluation,
} from '../../utils/learningStore';
import {
  CHAPTER_EVAL_CONFIG,
  STARTING_HEARTS,
} from './index';
import type {
  AnswerState,
  AssessmentQuestion,
  Attempt,
  ForcedQuestionConfig,
  SectionTransition,
} from './index';
import { computeLevel, speakByLang } from '../../utils/tamilEvaluationUtils';
import { TamilEvaluationActivityEvaluator } from '../../utils/tamilEvaluationActivityEvaluator';
import { TamilEvaluationComponentUtils } from '../../utils/tamilEvaluationComponentUtils';
import { getWeakSkills, persistTamilEvaluationCompletion } from '../../utils/tamilEvaluationResultUtils';
import { useTamilEvaluationSession } from './useTamilEvaluationSession';
import AssessmentQuestionCard from './AssessmentQuestionCard';
import AssessmentResultView from './AssessmentResultView';
import AssessmentTopBar from './AssessmentTopBar';
import FeedbackPanel from './FeedbackPanel';
import SectionTransitionView from './SectionTransitionView';
import './TamilExperienceAssessment.scss';

const TamilExperienceAssessment = () => {
  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get('chapter') || '';
  const forcedConfig = useMemo<ForcedQuestionConfig>(
    () => TamilEvaluationComponentUtils.buildForcedQuestionConfig(searchParams),
    [searchParams],
  );
  const chapterConfig = CHAPTER_EVAL_CONFIG[chapterId] || null;

  const {
    sectionPlan,
    totalQuestions,
    questions,
    coveredUnitIds,
    showCoverageDebug,
    regenerateSessionQuestions,
  } = useTamilEvaluationSession({
    chapterId,
    chapterConfig,
    forcedConfig,
  });

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);
  const [hearts, setHearts] = useState(STARTING_HEARTS);
  const [history, setHistory] = useState<Attempt[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [sectionTransition, setSectionTransition] = useState<SectionTransition | null>(null);
  const [reorderItems, setReorderItems] = useState<string[]>([]);
  const [activeReorderItem, setActiveReorderItem] = useState<string | null>(null);
  const [selectedVowelSet, setSelectedVowelSet] = useState<string[]>([]);
  const [matchRightItems, setMatchRightItems] = useState<string[]>([]);
  const [wordMatches, setWordMatches] = useState<Record<string, string>>({});
  const [activeMatchLeft, setActiveMatchLeft] = useState<string | null>(null);
  const [draggedVowel, setDraggedVowel] = useState<string | null>(null);
  const [resolvedAnswer, setResolvedAnswer] = useState<{ selected: string; correct: string } | null>(null);
  const lastAutoPlayedQuestionIdRef = useRef<number | null>(null);

  const clearActivityInteractionState = useCallback(() => {
    setResolvedAnswer(null);
    setDraggedVowel(null);
    setActiveReorderItem(null);
    setSelectedVowelSet([]);
    setReorderItems([]);
    setMatchRightItems([]);
    setWordMatches({});
    setActiveMatchLeft(null);
  }, []);

  const latestResult = useMemo(() => getLatestTamilEvaluation(), []);
  const currentQuestion = questions[questionIndex] ?? null;

  useEffect(() => {
    if (!currentQuestion) return;

    clearActivityInteractionState();

    if (currentQuestion.activityType === 'vowel-order') {
      setReorderItems(currentQuestion.options);
      return;
    }

    if (currentQuestion.activityType === 'vowel-length') {
      return;
    }

    if (currentQuestion.activityType === 'word-match') {
      const rightItems = currentQuestion.matchRightOptions ?? currentQuestion.correctOptions ?? [];
      setMatchRightItems(TamilEvaluationComponentUtils.shuffleItems(rightItems));
      return;
    }
  }, [clearActivityInteractionState, currentQuestion]);

  const moveReorderItem = useCallback((fromItem: string, toItem: string) => {
    setReorderItems((prev) => {
      const fromIndex = prev.indexOf(fromItem);
      const toIndex = prev.indexOf(toItem);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return prev;

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const toggleVowelLengthOption = useCallback((vowel: string) => {
    setSelectedVowelSet((prev) => (
      prev.includes(vowel) ? prev.filter((item) => item !== vowel) : [...prev, vowel]
    ));
  }, []);

  const checkActivity = useCallback(() => {
    if (!currentQuestion || answerState !== 'idle') return;
    const evaluation = TamilEvaluationActivityEvaluator.evaluateActivity(
      currentQuestion,
      reorderItems,
      selectedVowelSet,
      wordMatches,
    );
    if (!evaluation) return;

    setResolvedAnswer({ selected: evaluation.selected, correct: evaluation.correct });
    setAnswerState(evaluation.isCorrect ? 'correct' : 'wrong');
  }, [answerState, currentQuestion, reorderItems, selectedVowelSet, wordMatches]);

  const handleMatchLeftSelect = useCallback((leftItem: string) => {
    if (answerState !== 'idle') return;
    setActiveMatchLeft(leftItem);
  }, [answerState]);

  const handleMatchRightSelect = useCallback((rightItem: string) => {
    if (answerState !== 'idle' || !activeMatchLeft) return;

    setWordMatches((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((left) => {
        if (next[left] === rightItem) {
          delete next[left];
        }
      });
      next[activeMatchLeft] = rightItem;
      return next;
    });
    setActiveMatchLeft(null);
  }, [activeMatchLeft, answerState]);

  const playQuestionAudio = useCallback((question: AssessmentQuestion) => {
    if (question.audioText) {
      speakByLang(question.audioText, question.audioLang ?? 'ta-IN');
      return;
    }
    if (question.options[question.correctIndex]) {
      speakText(question.options[question.correctIndex]);
    }
  }, []);

  useEffect(() => {
    if (!currentQuestion) return;
    if (currentQuestion.skill !== 'audio-letters' || !currentQuestion.audioText) return;
    if (lastAutoPlayedQuestionIdRef.current === currentQuestion.id) return;

    lastAutoPlayedQuestionIdRef.current = currentQuestion.id;
    playQuestionAudio(currentQuestion);
  }, [currentQuestion, playQuestionAudio]);

  const beginSession = useCallback(() => {
    regenerateSessionQuestions();
    setQuestionIndex(0);
    setAnswerState('idle');
    setSelectedIndex(null);
    setCorrectCount(0);
    setXp(0);
    setHearts(STARTING_HEARTS);
    setHistory([]);
    setIsComplete(false);
    setSectionTransition(null);
    clearActivityInteractionState();
    lastAutoPlayedQuestionIdRef.current = null;
  }, [clearActivityInteractionState, regenerateSessionQuestions]);

  const handleSelect = useCallback(
    (index: number) => {
      if (!currentQuestion || answerState !== 'idle') return;
      if (currentQuestion.activityType && currentQuestion.activityType !== 'mcq') return;

      setSelectedIndex(index);
      const isCorrect = index === currentQuestion.correctIndex;
      setResolvedAnswer({
        selected: currentQuestion.options[index],
        correct: currentQuestion.options[currentQuestion.correctIndex],
      });
      setAnswerState(isCorrect ? 'correct' : 'wrong');
    },
    [currentQuestion, answerState],
  );

  const dismissTransition = useCallback(() => setSectionTransition(null), []);

  const handleContinue = useCallback(() => {
    if (!currentQuestion || answerState === 'idle' || !resolvedAnswer) return;

    const isCorrect = answerState === 'correct';
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    const nextXp = xp + (isCorrect ? 10 * currentQuestion.difficulty : 0);
    const nextHearts = hearts - (isCorrect ? 0 : 1);
    const nextIndex = questionIndex + 1;

    setHistory((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        prompt: currentQuestion.prompt,
        selected: resolvedAnswer.selected,
        correct: resolvedAnswer.correct,
        isCorrect,
        difficulty: currentQuestion.difficulty,
        skill: currentQuestion.skill,
      },
    ]);
    setCorrectCount(nextCorrect);
    setXp(nextXp);
    setHearts(nextHearts);
    setAnswerState('idle');
    setSelectedIndex(null);
    setResolvedAnswer(null);

    const shouldFinish = nextHearts <= 0 || nextIndex >= questions.length;

    if (shouldFinish) {
      const answered = questionIndex + 1;
      persistTamilEvaluationCompletion(nextCorrect, answered, nextXp);
      setIsComplete(true);
      return;
    }

    const nextQ = questions[nextIndex];
    if (nextQ.sectionIdx !== currentQuestion.sectionIdx) {
      const completedSection = sectionPlan[currentQuestion.sectionIdx];
      const nextSection = sectionPlan[nextQ.sectionIdx];
      setSectionTransition({
        completedLabel: completedSection.label,
        completedIcon: completedSection.icon,
        nextLabel: nextSection.label,
        nextIcon: nextSection.icon,
      });
    }

    setQuestionIndex(nextIndex);
  }, [
    answerState,
    correctCount,
    currentQuestion,
    hearts,
    questionIndex,
    questions,
    sectionPlan,
    resolvedAnswer,
    xp,
  ]);

  if (!currentQuestion && !isComplete) {
    return (
      <div className="duo-eval">
        <div className="duo-eval__loading">Assessment questions are unavailable right now.</div>
      </div>
    );
  }

  if (isComplete) {
    const answered = history.length;
    const accuracy = answered > 0 ? Math.round((correctCount / answered) * 100) : 0;
    const level = computeLevel(accuracy);
    const weakSkills = getWeakSkills(history, 2);

    return (
      <AssessmentResultView
        chapterTitle={chapterConfig?.title}
        level={level}
        correctCount={correctCount}
        answered={answered}
        accuracy={accuracy}
        xp={xp}
        weakSkills={weakSkills}
        latestResult={latestResult}
        onRetake={beginSession}
      />
    );
  }

  // ── Section transition screen ──────────────────────────────────────────────
  if (sectionTransition) {
    return <SectionTransitionView sectionTransition={sectionTransition} onContinue={dismissTransition} />;
  }

  const currentSection = sectionPlan[currentQuestion!.sectionIdx];
  const sectionTotal = currentSection.count;
  const sectionDone = currentQuestion!.indexInSection;
  const canCheckActivity = useMemo(() => {
    return TamilEvaluationActivityEvaluator.canCheckActivity(
      answerState,
      currentQuestion,
      reorderItems,
      selectedVowelSet,
      wordMatches,
    );
  }, [answerState, currentQuestion.activityType, currentQuestion.options, reorderItems.length, selectedVowelSet.length, wordMatches]);
  const progress = totalQuestions > 0 ? Math.round((questionIndex / totalQuestions) * 100) : 0;
  // Section segment markers (cumulative question counts at section boundaries)
  const sectionBoundaries = sectionPlan.reduce<number[]>((acc, s) => {
    acc.push((acc[acc.length - 1] ?? 0) + s.count);
    return acc;
  }, []).slice(0, -1); // drop the last (100%)

  return (
    <div className="duo-eval">
      {answerState === 'correct' && (
        <div className="duo-eval__success-overlay" aria-hidden="true">
          <span className="duo-eval__success-burst duo-eval__success-burst--1">✨</span>
          <span className="duo-eval__success-burst duo-eval__success-burst--2">🎉</span>
          <span className="duo-eval__success-burst duo-eval__success-burst--3">✨</span>
          <span className="duo-eval__success-burst duo-eval__success-burst--4">🎊</span>
          <span className="duo-eval__success-burst duo-eval__success-burst--5">✨</span>
          <span className="duo-eval__success-ring" />
        </div>
      )}

      <AssessmentTopBar
        chapterTitle={chapterConfig?.title}
        questionIndex={questionIndex}
        totalQuestions={totalQuestions}
        xp={xp}
        hearts={hearts}
        maxHearts={STARTING_HEARTS}
        progress={progress}
        sectionBoundaries={sectionBoundaries}
      />

      {showCoverageDebug && (
        <div className="duo-eval__coverage-debug" role="status" aria-live="polite">
          Unit coverage: {coveredUnitIds.length > 0 ? coveredUnitIds.join(', ') : 'No chapter-tagged units in this session'}
        </div>
      )}

      <AssessmentQuestionCard
        currentQuestion={currentQuestion}
        sectionDone={sectionDone}
        sectionTotal={sectionTotal}
        answerState={answerState}
        selectedIndex={selectedIndex}
        reorderItems={reorderItems}
        activeReorderItem={activeReorderItem}
        selectedVowelSet={selectedVowelSet}
        matchRightItems={matchRightItems}
        wordMatches={wordMatches}
        activeMatchLeft={activeMatchLeft}
        canCheckActivity={canCheckActivity}
        onPlayAudio={() => playQuestionAudio(currentQuestion)}
        onSelectOption={handleSelect}
        onSetActiveReorderItem={setActiveReorderItem}
        onStartReorderDrag={setDraggedVowel}
        onReorderDrop={(targetItem) => {
          if (draggedVowel) moveReorderItem(draggedVowel, targetItem);
          setDraggedVowel(null);
        }}
        onSwapReorderItem={moveReorderItem}
        onCheckActivity={checkActivity}
        onToggleVowelLengthOption={toggleVowelLengthOption}
        onSelectMatchLeft={handleMatchLeftSelect}
        onSelectMatchRight={handleMatchRightSelect}
      />

      {answerState !== 'idle' && (
        <FeedbackPanel
          answerState={answerState}
          explanation={currentQuestion.explanation}
          correctAnswer={resolvedAnswer?.correct ?? currentQuestion.options[currentQuestion.correctIndex]}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};

export default TamilExperienceAssessment;

