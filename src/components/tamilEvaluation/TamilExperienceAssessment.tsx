import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { speakText } from '../chatbot/speakText';
import {
  getLatestTamilEvaluation,
  recordActivity,
  saveQuizResult,
  saveTamilEvaluationResult,
} from '../../utils/learningStore';
import {
  CHAPTER_EVAL_CONFIG,
  LESSON_SECTIONS,
  STARTING_HEARTS,
} from './index';
import type {
  AnswerState,
  AssessmentQuestion,
  Attempt,
  SectionTransition,
  SessionQuestion,
  Skill,
} from './index';
import { buildSessionQuestions, computeLevel, speakByLang } from '../../utils/tamilEvaluationUtils';
import AssessmentQuestionCard from './AssessmentQuestionCard';
import AssessmentResultView from './AssessmentResultView';
import AssessmentTopBar from './AssessmentTopBar';
import FeedbackPanel from './FeedbackPanel';
import SectionTransitionView from './SectionTransitionView';
import './TamilExperienceAssessment.scss';
const TamilExperienceAssessment = () => {
  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get('chapter') || '';
  const chapterConfig = CHAPTER_EVAL_CONFIG[chapterId] || null;

  const sectionPlan = useMemo(() => {
    if (!chapterConfig) return LESSON_SECTIONS;
    return LESSON_SECTIONS.filter((section) => chapterConfig.skills.includes(section.skill));
  }, [chapterConfig]);

  const totalQuestions = useMemo(
    () => sectionPlan.reduce((sum, section) => sum + section.count, 0),
    [sectionPlan],
  );

  const [questions, setQuestions] = useState<SessionQuestion[]>(() => buildSessionQuestions(sectionPlan, chapterId || undefined));
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
  const [draggedVowel, setDraggedVowel] = useState<string | null>(null);
  const [resolvedAnswer, setResolvedAnswer] = useState<{ selected: string; correct: string } | null>(null);

  const latestResult = useMemo(() => getLatestTamilEvaluation(), []);
  const currentQuestion = questions[questionIndex] ?? null;
  const coveredUnitIds = useMemo(
    () => Array.from(new Set(questions.map((question) => question.unitId).filter((unitId): unitId is string => Boolean(unitId)))).sort(),
    [questions],
  );
  const showCoverageDebug = import.meta.env.DEV && Boolean(chapterId);

  useEffect(() => {
    if (!currentQuestion) return;

    setResolvedAnswer(null);
    setDraggedVowel(null);
    setActiveReorderItem(null);

    if (currentQuestion.activityType === 'vowel-order') {
      setReorderItems(currentQuestion.options);
      setSelectedVowelSet([]);
      return;
    }

    if (currentQuestion.activityType === 'vowel-length') {
      setSelectedVowelSet([]);
      setReorderItems([]);
      return;
    }

    setReorderItems([]);
    setSelectedVowelSet([]);
  }, [currentQuestion]);

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

    if (currentQuestion.activityType === 'vowel-order') {
      const expected = currentQuestion.correctOrder ?? [];
      if (reorderItems.length !== expected.length) return;

      const isCorrect = expected.every((item, idx) => reorderItems[idx] === item);
      setResolvedAnswer({ selected: reorderItems.join('  '), correct: expected.join('  ') });
      setAnswerState(isCorrect ? 'correct' : 'wrong');
      return;
    }

    if (currentQuestion.activityType === 'vowel-length') {
      const expected = [...(currentQuestion.correctOptions ?? [])].sort();
      const selected = [...selectedVowelSet].sort();
      if (selected.length === 0) return;

      const isCorrect = expected.length === selected.length && expected.every((item, idx) => item === selected[idx]);
      setResolvedAnswer({ selected: selected.join(', '), correct: expected.join(', ') });
      setAnswerState(isCorrect ? 'correct' : 'wrong');
    }
  }, [answerState, currentQuestion, reorderItems, selectedVowelSet]);

  const playQuestionAudio = useCallback((question: AssessmentQuestion) => {
    if (question.audioText) {
      speakByLang(question.audioText, question.audioLang ?? 'ta-IN');
      return;
    }
    if (question.options[question.correctIndex]) {
      speakText(question.options[question.correctIndex]);
    }
  }, []);

  const beginSession = useCallback(() => {
    setQuestions(buildSessionQuestions(sectionPlan, chapterId || undefined));
    setQuestionIndex(0);
    setAnswerState('idle');
    setSelectedIndex(null);
    setCorrectCount(0);
    setXp(0);
    setHearts(STARTING_HEARTS);
    setHistory([]);
    setIsComplete(false);
    setSectionTransition(null);
    setReorderItems([]);
    setSelectedVowelSet([]);
    setActiveReorderItem(null);
    setDraggedVowel(null);
    setResolvedAnswer(null);
  }, [chapterId, sectionPlan]);

  const handleSelect = useCallback(
    (index: number) => {
      if (!currentQuestion || answerState !== 'idle' || currentQuestion.activityType === 'vowel-order' || currentQuestion.activityType === 'vowel-length') return;
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
      const accuracy = Math.round((nextCorrect / answered) * 100);
      const level = computeLevel(accuracy);
      saveQuizResult({
        date: new Date().toISOString(),
        score: nextCorrect,
        total: answered,
        accuracy,
        type: 'tamil-evaluation',
      });
      saveTamilEvaluationResult({
        date: new Date().toISOString(),
        score: nextCorrect,
        total: answered,
        accuracy,
        xp: nextXp,
        level,
      });
      recordActivity();
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
    const weakSkills = Object.entries(
      history.reduce<Record<Skill, { total: number; correct: number }>>(
        (acc, item) => {
          if (!acc[item.skill]) acc[item.skill] = { total: 0, correct: 0 };
          acc[item.skill].total += 1;
          if (item.isCorrect) acc[item.skill].correct += 1;
          return acc;
        },
        {
          letters: { total: 0, correct: 0 },
          'vowel-activities': { total: 0, correct: 0 },
          'audio-letters': { total: 0, correct: 0 },
          numbers: { total: 0, correct: 0 },
          vocabulary: { total: 0, correct: 0 },
          reading: { total: 0, correct: 0 },
          'image-recognition': { total: 0, correct: 0 },
          'word-to-image': { total: 0, correct: 0 },
          'correct-word': { total: 0, correct: 0 },
        },
      ),
    )
      .filter(([, stats]) => stats.total > 0)
      .map(([skill, stats]) => ({
        skill: skill as Skill,
        accuracy: Math.round((stats.correct / stats.total) * 100),
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 2);

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
  const canCheckActivity =
    answerState === 'idle' && (
      (currentQuestion.activityType === 'vowel-order' && reorderItems.length > 0) ||
      (currentQuestion.activityType === 'vowel-length' && selectedVowelSet.length > 0)
    );
  const progress = totalQuestions > 0 ? Math.round((questionIndex / totalQuestions) * 100) : 0;
  // Section segment markers (cumulative question counts at section boundaries)
  const sectionBoundaries = sectionPlan.reduce<number[]>((acc, s) => {
    acc.push((acc[acc.length - 1] ?? 0) + s.count);
    return acc;
  }, []).slice(0, -1); // drop the last (100%)

  return (
    <div className="duo-eval">
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

