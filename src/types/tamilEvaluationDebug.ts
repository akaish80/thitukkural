import type { ActivityType } from './evaluation';

export type ForcedQuestionConfig = {
  questionId: number | null;
  forceOnly: boolean;
  activityType: ActivityType | null;
};
