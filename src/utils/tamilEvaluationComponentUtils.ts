import type { ActivityType } from '../types';
import type { ForcedQuestionConfig } from '../types';

export class TamilEvaluationComponentUtils {
  static isActivityType(value: string | null): value is ActivityType {
    return (
      value === 'mcq' ||
      value === 'vowel-order' ||
      value === 'vowel-length' ||
      value === 'word-match'
    );
  }

  static buildForcedQuestionConfig(searchParams: URLSearchParams): ForcedQuestionConfig {
    const parsedId = Number.parseInt(searchParams.get('forceQuestionId') || '', 10);
    const questionId = Number.isFinite(parsedId) ? parsedId : null;
    const activityTypeParam = searchParams.get('forceActivityType');

    return {
      questionId,
      forceOnly: searchParams.get('forceOnly') === '1',
      activityType: this.isActivityType(activityTypeParam) ? activityTypeParam : null,
    };
  }

  static shuffleItems(items: string[]): string[] {
    const next = [...items];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    return next;
  }
}
