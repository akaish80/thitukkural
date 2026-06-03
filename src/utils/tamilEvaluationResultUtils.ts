import type { Attempt, Skill } from '../types';
import {
  recordActivity,
  saveQuizResult,
  saveTamilEvaluationResult,
  type TamilExperienceLevel,
} from './learningStore';
import { computeLevel } from './tamilEvaluationUtils';

export type WeakSkillSummary = {
  skill: Skill;
  accuracy: number;
};

export function persistTamilEvaluationCompletion(
  correctCount: number,
  answered: number,
  xp: number,
): { accuracy: number; level: TamilExperienceLevel } {
  const accuracy = Math.round((correctCount / answered) * 100);
  const level = computeLevel(accuracy);
  const nowIso = new Date().toISOString();

  saveQuizResult({
    date: nowIso,
    score: correctCount,
    total: answered,
    accuracy,
    type: 'tamil-evaluation',
  });

  saveTamilEvaluationResult({
    date: nowIso,
    score: correctCount,
    total: answered,
    accuracy,
    xp,
    level,
  });

  recordActivity();

  return { accuracy, level };
}

export function getWeakSkills(history: Attempt[], limit = 2): WeakSkillSummary[] {
  const bySkill: Partial<Record<Skill, { total: number; correct: number }>> = {};

  history.forEach((item) => {
    if (!bySkill[item.skill]) {
      bySkill[item.skill] = { total: 0, correct: 0 };
    }

    bySkill[item.skill]!.total += 1;
    if (item.isCorrect) {
      bySkill[item.skill]!.correct += 1;
    }
  });

  return Object.entries(bySkill)
    .map(([skill, stats]) => ({
      skill: skill as Skill,
      accuracy: stats && stats.total > 0
        ? Math.round((stats.correct / stats.total) * 100)
        : 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}
