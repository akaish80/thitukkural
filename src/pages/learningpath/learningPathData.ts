// ── Learning Path step & lesson definitions ──

export interface LessonItem {
  id: string;
  tamil: string;
  romanization: string;
  meaning?: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleTamil: string;
  description: string;
  items: LessonItem[];
  /** mini-quiz: pick the right romanization for a given tamil letter */
  quizType: 'identify' | 'match' | 'write' | 'read';
}

export interface Step {
  id: string;
  stepNumber: number;
  title: string;
  titleTamil: string;
  description: string;
  icon: string;
  color: string;
  badgeId: string;            // badge earned on completion
  lessons: Lesson[];
}

// ── Step 1 — Uyir (Vowels) ──
const uyirLetters: LessonItem[] = [
  { id: 'அ', tamil: 'அ', romanization: 'a', meaning: 'Short a' },
  { id: 'ஆ', tamil: 'ஆ', romanization: 'aa', meaning: 'Long a' },
  { id: 'இ', tamil: 'இ', romanization: 'i', meaning: 'Short i' },
  { id: 'ஈ', tamil: 'ஈ', romanization: 'ee', meaning: 'Long i' },
  { id: 'உ', tamil: 'உ', romanization: 'u', meaning: 'Short u' },
  { id: 'ஊ', tamil: 'ஊ', romanization: 'oo', meaning: 'Long u' },
  { id: 'எ', tamil: 'எ', romanization: 'e', meaning: 'Short e' },
  { id: 'ஏ', tamil: 'ஏ', romanization: 'ae', meaning: 'Long e' },
  { id: 'ஐ', tamil: 'ஐ', romanization: 'ai', meaning: 'Diphthong ai' },
  { id: 'ஒ', tamil: 'ஒ', romanization: 'o', meaning: 'Short o' },
  { id: 'ஓ', tamil: 'ஓ', romanization: 'oo', meaning: 'Long o' },
  { id: 'ஔ', tamil: 'ஔ', romanization: 'au', meaning: 'Diphthong au' },
];

const uyirLessons: Lesson[] = [
  {
    id: 'uyir-1',
    title: 'Short Vowels',
    titleTamil: 'குறில்',
    description: 'Learn the 5 short vowels: அ, இ, உ, எ, ஒ',
    items: uyirLetters.filter((l) => ['அ', 'இ', 'உ', 'எ', 'ஒ'].includes(l.id)),
    quizType: 'identify',
  },
  {
    id: 'uyir-2',
    title: 'Long Vowels',
    titleTamil: 'நெடில்',
    description: 'Learn the 5 long vowels: ஆ, ஈ, ஊ, ஏ, ஓ',
    items: uyirLetters.filter((l) => ['ஆ', 'ஈ', 'ஊ', 'ஏ', 'ஓ'].includes(l.id)),
    quizType: 'identify',
  },
  {
    id: 'uyir-3',
    title: 'Diphthongs',
    titleTamil: 'சார்பெழுத்து',
    description: 'Learn the 2 diphthongs: ஐ, ஔ',
    items: uyirLetters.filter((l) => ['ஐ', 'ஔ'].includes(l.id)),
    quizType: 'identify',
  },
];

// ── Step 2 — Mei (Consonants) ──
const meiLetters: LessonItem[] = [
  { id: 'க்', tamil: 'க்', romanization: 'k', meaning: 'ka-class' },
  { id: 'ங்', tamil: 'ங்', romanization: 'ng', meaning: 'ka-class nasal' },
  { id: 'ச்', tamil: 'ச்', romanization: 'ch', meaning: 'cha-class' },
  { id: 'ஞ்', tamil: 'ஞ்', romanization: 'nj', meaning: 'cha-class nasal' },
  { id: 'ட்', tamil: 'ட்', romanization: 'ṭ', meaning: 'ṭa-class' },
  { id: 'ண்', tamil: 'ண்', romanization: 'ṇ', meaning: 'ṭa-class nasal' },
  { id: 'த்', tamil: 'த்', romanization: 'th', meaning: 'tha-class' },
  { id: 'ந்', tamil: 'ந்', romanization: 'n', meaning: 'tha-class nasal' },
  { id: 'ப்', tamil: 'ப்', romanization: 'p', meaning: 'pa-class' },
  { id: 'ம்', tamil: 'ம்', romanization: 'm', meaning: 'pa-class nasal' },
  { id: 'ய்', tamil: 'ய்', romanization: 'y', meaning: 'Semi-vowel' },
  { id: 'ர்', tamil: 'ர்', romanization: 'r', meaning: 'Liquid' },
  { id: 'ல்', tamil: 'ல்', romanization: 'l', meaning: 'Liquid' },
  { id: 'வ்', tamil: 'வ்', romanization: 'v', meaning: 'Semi-vowel' },
  { id: 'ழ்', tamil: 'ழ்', romanization: 'zh', meaning: 'Retroflex approx' },
  { id: 'ள்', tamil: 'ள்', romanization: 'ḷ', meaning: 'Retroflex lateral' },
  { id: 'ற்', tamil: 'ற்', romanization: 'ṟ', meaning: 'Alveolar trill' },
  { id: 'ன்', tamil: 'ன்', romanization: 'ṉ', meaning: 'Alveolar nasal' },
];

const meiLessons: Lesson[] = [
  {
    id: 'mei-1',
    title: 'Vallinam (Hard)',
    titleTamil: 'வல்லினம்',
    description: 'Learn the 6 hard consonants: க், ச், ட், த், ப், ற்',
    items: meiLetters.filter((l) => ['க்', 'ச்', 'ட்', 'த்', 'ப்', 'ற்'].includes(l.id)),
    quizType: 'identify',
  },
  {
    id: 'mei-2',
    title: 'Mellinam (Soft)',
    titleTamil: 'மெல்லினம்',
    description: 'Learn the 6 soft consonants: ங், ஞ், ண், ந், ம், ன்',
    items: meiLetters.filter((l) => ['ங்', 'ஞ்', 'ண்', 'ந்', 'ம்', 'ன்'].includes(l.id)),
    quizType: 'identify',
  },
  {
    id: 'mei-3',
    title: 'Idaiyinam (Medium)',
    titleTamil: 'இடையினம்',
    description: 'Learn the 6 medium consonants: ய், ர், ல், வ், ழ், ள்',
    items: meiLetters.filter((l) => ['ய்', 'ர்', 'ல்', 'வ்', 'ழ்', 'ள்'].includes(l.id)),
    quizType: 'identify',
  },
];

// ── Step 3 — Uyirmei (Combinations) ──
const uyirSuffixes = ['', 'ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ'];
const uyirRomans = ['a', 'aa', 'i', 'ee', 'u', 'oo', 'e', 'ae', 'ai', 'o', 'oa', 'au'];
const sampleBases = [
  { base: 'க', roman: 'k' },
  { base: 'ச', roman: 'ch' },
  { base: 'த', roman: 'th' },
  { base: 'ப', roman: 'p' },
  { base: 'ம', roman: 'm' },
  { base: 'ந', roman: 'n' },
];

const uyirmeiLessons: Lesson[] = sampleBases.map((b, idx) => ({
  id: `uyirmei-${idx + 1}`,
  title: `${b.base} combinations`,
  titleTamil: `${b.base} வரிசை`,
  description: `Learn all 12 forms of ${b.base} (${b.roman}a → ${b.roman}au)`,
  items: uyirSuffixes.map((s, si) => ({
    id: `${b.base}${s}`,
    tamil: `${b.base}${s}`,
    romanization: `${b.roman}${uyirRomans[si]}`,
    meaning: `${b.roman}${uyirRomans[si]} sound`,
  })),
  quizType: 'match' as const,
}));

// ── Step 4 — Simple Words ──
const simpleWords: LessonItem[] = [
  { id: 'w-அம்மா', tamil: 'அம்மா', romanization: 'ammaa', meaning: 'Mother' },
  { id: 'w-அப்பா', tamil: 'அப்பா', romanization: 'appaa', meaning: 'Father' },
  { id: 'w-தமிழ்', tamil: 'தமிழ்', romanization: 'tamizh', meaning: 'Tamil' },
  { id: 'w-நன்றி', tamil: 'நன்றி', romanization: 'nandri', meaning: 'Thank you' },
  { id: 'w-வணக்கம்', tamil: 'வணக்கம்', romanization: 'vanakkam', meaning: 'Hello' },
  { id: 'w-பள்ளி', tamil: 'பள்ளி', romanization: 'paḷḷi', meaning: 'School' },
  { id: 'w-நீர்', tamil: 'நீர்', romanization: 'neer', meaning: 'Water' },
  { id: 'w-மரம்', tamil: 'மரம்', romanization: 'maram', meaning: 'Tree' },
  { id: 'w-பூ', tamil: 'பூ', romanization: 'poo', meaning: 'Flower' },
  { id: 'w-கடல்', tamil: 'கடல்', romanization: 'kadal', meaning: 'Sea' },
  { id: 'w-வீடு', tamil: 'வீடு', romanization: 'veedu', meaning: 'House' },
  { id: 'w-சாப்பாடு', tamil: 'சாப்பாடு', romanization: 'saappaadu', meaning: 'Food' },
];

const wordLessons: Lesson[] = [
  {
    id: 'words-1',
    title: 'Family & Greetings',
    titleTamil: 'குடும்பம் & வாழ்த்து',
    description: 'Learn common family words and greetings',
    items: simpleWords.filter((w) => ['w-அம்மா', 'w-அப்பா', 'w-நன்றி', 'w-வணக்கம்'].includes(w.id)),
    quizType: 'write',
  },
  {
    id: 'words-2',
    title: 'Nature & Places',
    titleTamil: 'இயற்கை & இடங்கள்',
    description: 'Learn words for nature and everyday places',
    items: simpleWords.filter((w) => ['w-நீர்', 'w-மரம்', 'w-பூ', 'w-கடல்', 'w-வீடு', 'w-பள்ளி'].includes(w.id)),
    quizType: 'write',
  },
  {
    id: 'words-3',
    title: 'Everyday Words',
    titleTamil: 'அன்றாட சொற்கள்',
    description: 'Essential Tamil words for daily use',
    items: simpleWords.filter((w) => ['w-தமிழ்', 'w-சாப்பாடு'].includes(w.id)),
    quizType: 'write',
  },
];

// ── Step 5 — Short Sentences ──
const sentences: LessonItem[] = [
  { id: 's-1', tamil: 'நான் தமிழ் படிக்கிறேன்', romanization: 'naan tamizh padikkiren', meaning: 'I am studying Tamil' },
  { id: 's-2', tamil: 'இது என் வீடு', romanization: 'idhu en veedu', meaning: 'This is my house' },
  { id: 's-3', tamil: 'நீ எப்படி இருக்கிறாய்?', romanization: 'nee eppadi irukkiraai?', meaning: 'How are you?' },
  { id: 's-4', tamil: 'எனக்கு தமிழ் பிடிக்கும்', romanization: 'enakku tamizh pidikkum', meaning: 'I like Tamil' },
  { id: 's-5', tamil: 'அவள் பள்ளிக்கு போகிறாள்', romanization: 'avaḷ paḷḷikku pokiraaḷ', meaning: 'She is going to school' },
  { id: 's-6', tamil: 'மழை பெய்கிறது', romanization: 'mazhai peykiRadhu', meaning: 'It is raining' },
  { id: 's-7', tamil: 'நான் சாப்பிட்டேன்', romanization: 'naan saappitten', meaning: 'I ate' },
  { id: 's-8', tamil: 'தமிழ் மிகவும் அழகான மொழி', romanization: 'tamizh mikavum azhagaana mozhi', meaning: 'Tamil is a very beautiful language' },
];

const sentenceLessons: Lesson[] = [
  {
    id: 'sent-1',
    title: 'Self & Identity',
    titleTamil: 'நான் & அடையாளம்',
    description: 'Read and understand sentences about yourself',
    items: sentences.filter((s) => ['s-1', 's-2', 's-4'].includes(s.id)),
    quizType: 'read',
  },
  {
    id: 'sent-2',
    title: 'Questions & Actions',
    titleTamil: 'கேள்வி & செயல்',
    description: 'Read questions and action sentences',
    items: sentences.filter((s) => ['s-3', 's-5', 's-7'].includes(s.id)),
    quizType: 'read',
  },
  {
    id: 'sent-3',
    title: 'World Around Us',
    titleTamil: 'நம்மைச் சுற்றி',
    description: 'Read sentences about the world',
    items: sentences.filter((s) => ['s-6', 's-8'].includes(s.id)),
    quizType: 'read',
  },
];

// ── All Steps ──
export const LEARNING_STEPS: Step[] = [
  {
    id: 'uyir',
    stepNumber: 1,
    title: 'Uyir Letters (Vowels)',
    titleTamil: 'உயிர் எழுத்துக்கள்',
    description: 'Master the 12 Tamil vowels — the soul sounds of the language.',
    icon: '🔤',
    color: '#58cc02',
    badgeId: 'uyir-master',
    lessons: uyirLessons,
  },
  {
    id: 'mei',
    stepNumber: 2,
    title: 'Mei Letters (Consonants)',
    titleTamil: 'மெய் எழுத்துக்கள்',
    description: 'Learn the 18 Tamil consonants — the body sounds.',
    icon: '📝',
    color: '#ce82ff',
    badgeId: 'mei-master',
  lessons: meiLessons,
  },
  {
    id: 'uyirmei',
    stepNumber: 3,
    title: 'Uyirmei Combinations',
    titleTamil: 'உயிர்மெய் எழுத்துக்கள்',
    description: 'Combine vowels with consonants to create 216 Uyirmei letters.',
    icon: '🧩',
    color: '#1cb0f6',
    badgeId: 'uyirmei-master',
    lessons: uyirmeiLessons,
  },
  {
    id: 'words',
    stepNumber: 4,
    title: 'Write Simple Words',
    titleTamil: 'எளிய சொற்கள்',
    description: 'Put your letters together to read and write common Tamil words.',
    icon: '✍️',
    color: '#ff9600',
    badgeId: 'word-builder',
    lessons: wordLessons,
  },
  {
    id: 'sentences',
    stepNumber: 5,
    title: 'Read Short Sentences',
    titleTamil: 'சிறு வாக்கியங்கள்',
    description: 'Read and understand short Tamil sentences using what you learned.',
    icon: '📖',
    color: '#ff4b4b',
    badgeId: 'reader',
    lessons: sentenceLessons,
  },
];
