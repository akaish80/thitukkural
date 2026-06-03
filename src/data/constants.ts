import type { TamilExperienceLevel } from '../utils/learningStore';
import type { LessonSection, Skill } from '../types';

export type NavItem = {
  text: string;
  link: string;
  isClicked: boolean;
  children?: NavItem[];
};

export const nav: NavItem[] = [
  {
    text: 'Home',
    link: '/',
    isClicked: true,
  },
  {
    text: 'Learn Tamil',
    link: '/learn-tamil',
    isClicked: false,
  },
  {
    text: 'Learning Path',
    link: '',
    isClicked: false,
    children: [
      { text: 'My Progress', link: '/learn', isClicked: false },
      { text: 'Planner', link: '/planner', isClicked: false },
      { text: 'Tamil Evaluation', link: '/tamil-evaluation', isClicked: false },
    ],
  },
  {
    text: 'Thirukkural',
    link: '',
    isClicked: false,
    children: [
      { text: 'Kurral', link: '/kurral', isClicked: false },
      { text: 'Explore Kurral', link: '/kurral/explore', isClicked: false },
      { text: 'Exercise Kurral', link: '/kurral/exercise', isClicked: false },
    ],
  },
  {
    text: 'Aathichudi',
    link: '/aathichudi',
    isClicked: false,
  },
];

export const STARTING_HEARTS = 3;

export const LESSON_SECTIONS: LessonSection[] = [
  { skill: 'letters' as Skill, label: 'Letters', labelTamil: 'எழுத்துக்கள்', icon: '🔤', count: 4 },
  {
    skill: 'vowel-activities' as Skill,
    label: 'Vowel Activities',
    labelTamil: 'உயிர் பயிற்சி',
    icon: '🎯',
    count: 5,
    requiredQuestionIds: [203, 204, 205],
  },
  { skill: 'audio-letters' as Skill, label: 'Audio Letters', labelTamil: 'ஒலி எழுத்து', icon: '🔊', count: 3 },
  { skill: 'numbers' as Skill, label: 'Numbers', labelTamil: 'எண்கள்', icon: '🔢', count: 3 },
  { skill: 'vocabulary' as Skill, label: 'Vocabulary', labelTamil: 'சொல்லகராதி', icon: '📝', count: 4 },
  { skill: 'reading' as Skill, label: 'Reading', labelTamil: 'வாசிப்பு', icon: '📖', count: 3 },
  { skill: 'image-recognition' as Skill, label: 'Image Recognition', labelTamil: 'படம் அடையாளம்', icon: '🖼️', count: 4 },
  { skill: 'correct-word' as Skill, label: 'Correct Spelling', labelTamil: 'சரியான சொல்', icon: '✍️', count: 4 },
];

export const CHAPTER_EVAL_CONFIG: Record<string, { title: string; skills: Skill[] }> = {
  'chapter-1': {
    title: 'Chapter 1: Tamil Alphabets and Numbers',
    skills: ['letters', 'vowel-activities', 'audio-letters', 'numbers', 'reading'],
  },
  'chapter-2': {
    title: 'Chapter 2: Tamil Conversation',
    skills: ['audio-letters', 'vocabulary', 'reading'],
  },
  'chapter-3': {
    title: 'Chapter 3: Tamil Verbs',
    skills: ['reading', 'vocabulary', 'correct-word'],
  },
  'chapter-4': {
    title: 'Chapter 4: Family and Relationships',
    skills: ['vocabulary', 'reading', 'image-recognition'],
  },
  'chapter-5': {
    title: 'Chapter 5: Likes and Dislikes',
    skills: ['vocabulary', 'reading', 'correct-word'],
  },
  'chapter-6': {
    title: 'Chapter 6: Everyday Schedule and Activities',
    skills: ['numbers', 'vocabulary', 'reading'],
  },
  'chapter-7': {
    title: 'Chapter 7: Describing Things and Places',
    skills: ['vocabulary', 'image-recognition', 'reading'],
  },
};

export const SKILL_LABEL: Record<Skill, string> = {
  letters: 'Letters',
  'vowel-activities': 'Vowel Activities',
  'audio-letters': 'Audio Letters',
  numbers: 'Numbers',
  vocabulary: 'Vocabulary',
  reading: 'Reading',
  'image-recognition': 'Image Recognition',
  'word-to-image': 'Word to Image',
  'correct-word': 'Correct Spelling',
};

export const LEVEL_HINTS: Record<TamilExperienceLevel, string> = {
  Starter: 'Start with Tamil letters and daily 10-minute listening practice.',
  Beginner: 'You have good basics. Build consistency with short reading drills.',
  Intermediate: 'Strong progress. Focus on sentence building and comprehension speed.',
  Advanced: 'Excellent Tamil control. Move to literature and long-form reading.',
};

export {
  ALL_LETTERS,
  AYTHAM,
  CONSONANTS,
  VOWELS,
} from './tamilAlphabet';

export type {
  ConsonantSubType,
  LetterType,
  TamilLetter,
} from './tamilAlphabet';

export {
  layouts,
} from '../components/VirtualKeyboard/keyboardLayouts';

export {
  physicalKeyToIndex,
  transliterationMapping,
} from '../utils/keyboardUtils';

export {
  CHAPTER_GROUPS,
} from './learning';

export {
  LEARNING_STEPS,
  PICTURE_WORD_ITEMS,
  THIRTY_DAY_PLAN,
} from '../pages/learningpath/learningPathData';

export type {
  Lesson,
  LessonItem,
  Step,
  ThirtyDayPlanItem,
} from '../pages/learningpath/learningPathData';

export {
  QUESTION_BANK,
  QUESTION_BANKS,
  getQuestionBankByIndex,
  getRandomQuestionBankIndex,
} from './evaluation';