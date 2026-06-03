import { useCallback, useMemo, useState } from 'react';
import {
  getQuestionBankByIndex,
  getRandomQuestionBankIndex,
  LESSON_SECTIONS,
} from './index';
import type {
  AssessmentQuestion,
  ForcedQuestionConfig,
  LessonSection,
  SessionQuestion,
  Skill,
} from './index';
import { buildSessionQuestions } from '../../utils/tamilEvaluationUtils';

type ChapterEvalConfig = { title: string; skills: Skill[] } | null;

type UseTamilEvaluationSessionParams = {
  chapterId: string;
  chapterConfig: ChapterEvalConfig;
  forcedConfig: ForcedQuestionConfig;
};

export function useTamilEvaluationSession({
  chapterId,
  chapterConfig,
  forcedConfig,
}: UseTamilEvaluationSessionParams) {
  const sectionPlan = useMemo<LessonSection[]>(() => {
    if (!chapterConfig) return LESSON_SECTIONS;
    return LESSON_SECTIONS.filter((section) => chapterConfig.skills.includes(section.skill));
  }, [chapterConfig]);

  const totalQuestions = useMemo(
    () => sectionPlan.reduce((sum, section) => sum + section.count, 0),
    [sectionPlan],
  );

  const [activeBankIndex, setActiveBankIndex] = useState(() => getRandomQuestionBankIndex());
  const activeQuestionBank = useMemo(() => getQuestionBankByIndex(activeBankIndex), [activeBankIndex]);

  const buildDebugSessionQuestions = useCallback((questionBank: AssessmentQuestion[]): SessionQuestion[] => {
    const baseSession = buildSessionQuestions(sectionPlan, chapterId || undefined, questionBank);

    const forcedQuestion = forcedConfig.questionId !== null
      ? questionBank.find((question) => question.id === forcedConfig.questionId)
      : undefined;
    const activityForcedQuestion = !forcedQuestion && forcedConfig.activityType
      ? questionBank.find((question) => question.activityType === forcedConfig.activityType)
      : undefined;
    const targetQuestion = forcedQuestion ?? activityForcedQuestion;

    if (!targetQuestion) {
      return baseSession;
    }

    const forcedSectionIdx = sectionPlan.findIndex((section) => section.skill === targetQuestion.skill);
    const safeSectionIdx = forcedSectionIdx >= 0 ? forcedSectionIdx : 0;
    const forcedSection = sectionPlan[safeSectionIdx];
    const forcedSessionQuestion: SessionQuestion = {
      ...targetQuestion,
      sectionIdx: safeSectionIdx,
      sectionLabel: forcedSection?.label ?? 'Practice',
      sectionIcon: forcedSection?.icon ?? '🎯',
      indexInSection: 0,
    };

    if (forcedConfig.forceOnly) {
      return [forcedSessionQuestion];
    }

    const withoutTarget = baseSession.filter((question) => question.id !== targetQuestion.id);
    return [forcedSessionQuestion, ...withoutTarget];
  }, [chapterId, forcedConfig, sectionPlan]);

  const [questions, setQuestions] = useState<SessionQuestion[]>(() =>
    buildDebugSessionQuestions(activeQuestionBank)
  );

  const regenerateSessionQuestions = useCallback(() => {
    const nextBankIndex = getRandomQuestionBankIndex();
    const nextQuestionBank = getQuestionBankByIndex(nextBankIndex);
    setActiveBankIndex(nextBankIndex);
    setQuestions(buildDebugSessionQuestions(nextQuestionBank));
  }, [buildDebugSessionQuestions]);

  const coveredUnitIds = useMemo(
    () => Array.from(new Set(questions.map((question) => question.unitId).filter((unitId): unitId is string => Boolean(unitId)))).sort(),
    [questions],
  );

  const showCoverageDebug = import.meta.env.DEV && Boolean(chapterId);

  return {
    sectionPlan,
    totalQuestions,
    questions,
    coveredUnitIds,
    showCoverageDebug,
    regenerateSessionQuestions,
  };
}
