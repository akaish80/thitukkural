import type { TamilExperienceLevel } from './learningStore';
import { QUESTION_BANK } from '../data/constants';
import { speakText } from '../components/chatbot/speakText';
import type { AssessmentQuestion, LessonSection, SessionQuestion, SpeechLang } from '../types';

function fisherYates(length: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

function shuffleOptions(question: AssessmentQuestion): AssessmentQuestion {
  const correctAnswer = question.options[question.correctIndex];
  const indices = fisherYates(question.options.length);
  const shuffledOptions = indices.map((i) => question.options[i]);
  const shuffledImages = question.optionImages
    ? indices.map((i) => question.optionImages![i])
    : undefined;
  const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);

  return {
    ...question,
    options: shuffledOptions,
    correctIndex: newCorrectIndex,
    ...(shuffledImages ? { optionImages: shuffledImages } : {}),
  };
}

export function buildSessionQuestions(sectionPlan: LessonSection[], chapterId?: string): SessionQuestion[] {
  const result: SessionQuestion[] = [];
  const usedIds = new Set<number>();
  const sectionSkills = new Set(sectionPlan.map((section) => section.skill));
  const uncoveredUnitIds = new Set<string>(
    chapterId
      ? QUESTION_BANK
        .filter((question) => question.chapterId === chapterId && question.unitId && sectionSkills.has(question.skill))
        .map((question) => question.unitId as string)
      : [],
  );

  sectionPlan.forEach((section, sectionIdx) => {
    const pool = QUESTION_BANK.filter((q) => q.skill === section.skill && !usedIds.has(q.id));
    const chapterSpecificPool = chapterId
      ? pool.filter((question) => question.chapterId === chapterId)
      : [];
    const genericPool = chapterId
      ? pool.filter((question) => !question.chapterId)
      : pool;
    const prioritizedPool = chapterId
      ? [...chapterSpecificPool, ...genericPool]
      : pool;

    const requiredQuestions = (section.requiredQuestionIds ?? [])
      .map((id) => prioritizedPool.find((question) => question.id === id))
      .filter((question): question is AssessmentQuestion => Boolean(question));

    const remainingPool = prioritizedPool.filter(
      (question) => !requiredQuestions.some((required) => required.id === question.id),
    );
    const remainingCount = Math.max(section.count - requiredQuestions.length, 0);

    let selectedRemaining: AssessmentQuestion[];
    if (chapterId) {
      const chapterRemaining = remainingPool.filter((question) => question.chapterId === chapterId);
      const genericRemaining = remainingPool.filter((question) => !question.chapterId);
      const shuffledChapter = fisherYates(chapterRemaining.length).map((i) => chapterRemaining[i]);

      const pickedChapterForCoverage: AssessmentQuestion[] = [];
      const pickedChapterIds = new Set<number>();

      shuffledChapter.forEach((question) => {
        if (pickedChapterForCoverage.length >= remainingCount) return;
        if (!question.unitId || !uncoveredUnitIds.has(question.unitId)) return;
        pickedChapterForCoverage.push(question);
        pickedChapterIds.add(question.id);
      });

      const pickedChapterRest = shuffledChapter
        .filter((question) => !pickedChapterIds.has(question.id))
        .slice(0, Math.max(remainingCount - pickedChapterForCoverage.length, 0));

      const pickedChapter = [...pickedChapterForCoverage, ...pickedChapterRest];
      const remainingSlots = Math.max(remainingCount - pickedChapter.length, 0);
      const shuffledGeneric = fisherYates(genericRemaining.length).map((i) => genericRemaining[i]);
      selectedRemaining = [...pickedChapter, ...shuffledGeneric.slice(0, remainingSlots)];
    } else {
      const shuffledRemaining = fisherYates(remainingPool.length).map((i) => remainingPool[i]);
      selectedRemaining = shuffledRemaining.slice(0, remainingCount);
    }

    const selected = [...requiredQuestions, ...selectedRemaining];

    selected.forEach((question, indexInSection) => {
      usedIds.add(question.id);
      if (chapterId && question.unitId) {
        uncoveredUnitIds.delete(question.unitId);
      }
      result.push({
        ...shuffleOptions(question),
        sectionIdx,
        sectionLabel: section.label,
        sectionIcon: section.icon,
        indexInSection,
      });
    });
  });

  return result;
}

export function computeLevel(accuracy: number): TamilExperienceLevel {
  if (accuracy >= 85) return 'Advanced';
  if (accuracy >= 65) return 'Intermediate';
  if (accuracy >= 40) return 'Beginner';
  return 'Starter';
}

export function speakByLang(text: string, lang: SpeechLang) {
  speakText(text, { lang });
}
