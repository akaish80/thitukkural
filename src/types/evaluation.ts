export type Skill =
  | 'letters'
  | 'vowel-activities'
  | 'audio-letters'
  | 'numbers'
  | 'vocabulary'
  | 'reading'
  | 'image-recognition'
  | 'word-to-image'
  | 'correct-word';

export type Difficulty = 1 | 2 | 3;
export type SpeechLang = 'ta-IN' | 'en-US';
export type ActivityType = 'mcq' | 'vowel-order' | 'vowel-length' | 'word-match';

export type AssessmentQuestion = {
  id: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skill: Skill;
  difficulty: Difficulty;
  chapterId?: string;
  unitId?: string;
  audioText?: string;
  audioLang?: SpeechLang;
  image?: string;
  optionImages?: string[];
  activityType?: ActivityType;
  correctOrder?: string[];
  correctOptions?: string[];
  matchRightOptions?: string[];
};

export type AnswerState = 'idle' | 'correct' | 'wrong';

export type Attempt = {
  questionId: number;
  prompt: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
  difficulty: Difficulty;
  skill: Skill;
};

export type LessonSection = {
  skill: Skill;
  label: string;
  labelTamil: string;
  icon: string;
  count: number;
  requiredQuestionIds?: number[];
};

export type SessionQuestion = AssessmentQuestion & {
  sectionIdx: number;
  sectionLabel: string;
  sectionIcon: string;
  indexInSection: number;
};

export type SectionTransition = {
  completedLabel: string;
  completedIcon: string;
  nextLabel: string;
  nextIcon: string;
};
