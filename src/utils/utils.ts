import type { TamilExperienceLevel } from './learningStore';
import { QUESTION_BANK } from '../data/constants';
import { speakText } from '../components/chatbot/speakText';
// import type { AssessmentQuestion } from 'types';
import type { AssessmentQuestion, LessonSection, SessionQuestion, SpeechLang } from 'types';

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

export function buildSessionQuestions(sectionPlan: LessonSection[]): SessionQuestion[] {
  const result: SessionQuestion[] = [];
  const usedIds = new Set<number>();

  sectionPlan.forEach((section, sectionIdx) => {
    const pool = QUESTION_BANK.filter((q) => q.skill === section.skill && !usedIds.has(q.id));
    const requiredQuestions = (section.requiredQuestionIds ?? [])
      .map((id: number) => pool.find((question) => question.id === id))
      .filter((question: AssessmentQuestion | undefined): question is AssessmentQuestion => Boolean(question));

    const remainingPool = pool.filter(
      (question) => !requiredQuestions.some((required) => required.id === question.id),
    );
    const remainingCount = Math.max(section.count - requiredQuestions.length, 0);
    const shuffledRemaining = fisherYates(remainingPool.length).map((i) => remainingPool[i]);
    const selected = [...requiredQuestions, ...shuffledRemaining.slice(0, remainingCount)];

    selected.forEach((question, indexInSection) => {
      usedIds.add(question.id);
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
