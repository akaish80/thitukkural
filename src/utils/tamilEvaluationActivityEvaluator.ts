import type { AnswerState, SessionQuestion } from '../types';

export type ActivityEvaluationResult = {
  isCorrect: boolean;
  selected: string;
  correct: string;
};

export class TamilEvaluationActivityEvaluator {
  static canCheckActivity(
    answerState: AnswerState,
    question: SessionQuestion,
    reorderItems: string[],
    selectedVowelSet: string[],
    wordMatches: Record<string, string>,
  ): boolean {
    if (answerState !== 'idle') return false;

    switch (question.activityType) {
      case 'vowel-order':
        return reorderItems.length > 0;
      case 'vowel-length':
        return selectedVowelSet.length > 0;
      case 'word-match':
        return question.options.length > 0
          && question.options.every((leftItem) => Boolean(wordMatches[leftItem]));
      default:
        return false;
    }
  }

  static evaluateActivity(
    question: SessionQuestion,
    reorderItems: string[],
    selectedVowelSet: string[],
    wordMatches: Record<string, string>,
  ): ActivityEvaluationResult | null {
    switch (question.activityType) {
      case 'vowel-order': {
        const expected = question.correctOrder ?? [];
        if (reorderItems.length !== expected.length) return null;

        return {
          isCorrect: expected.every((item, idx) => reorderItems[idx] === item),
          selected: reorderItems.join('  '),
          correct: expected.join('  '),
        };
      }

      case 'vowel-length': {
        const expected = [...(question.correctOptions ?? [])].sort();
        const selected = [...selectedVowelSet].sort();
        if (selected.length === 0) return null;

        return {
          isCorrect: expected.length === selected.length && expected.every((item, idx) => item === selected[idx]),
          selected: selected.join(', '),
          correct: expected.join(', '),
        };
      }

      case 'word-match': {
        const leftItems = question.options;
        const expectedRight = question.matchRightOptions ?? question.correctOptions ?? [];
        if (!leftItems.length || expectedRight.length !== leftItems.length) return null;

        const allMatched = leftItems.every((left) => Boolean(wordMatches[left]));
        if (!allMatched) return null;

        return {
          isCorrect: leftItems.every((left, idx) => wordMatches[left] === expectedRight[idx]),
          selected: leftItems.map((left) => `${left} - ${wordMatches[left] ?? '-'}`).join(', '),
          correct: leftItems.map((left, idx) => `${left} - ${expectedRight[idx]}`).join(', '),
        };
      }

      default:
        return null;
    }
  }
}
