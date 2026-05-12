// ── Learning Path step & lesson definitions ──
import { VOWELS as ALPHA_VOWELS, CONSONANTS as ALPHA_CONSONANTS } from '../../data/tamilAlphabet';

export interface LessonItem {
  id: string;
  tamil: string;
  romanization: string;
  meaning?: string;
  imageSrc?: string;
  imageEmoji?: string;
  imageHint?: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleTamil: string;
  description: string;
  items: LessonItem[];
  /** mini-quiz: pick the right romanization for a given tamil letter */
  quizType: 'identify' | 'match' | 'write' | 'read' | 'picture';
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

// ── Step 1 — Uyir (Vowels) — derived from canonical tamilAlphabet ──
const uyirLetters: LessonItem[] = ALPHA_VOWELS.map((l) => ({
  id: l.tamil,
  tamil: l.tamil,
  romanization: l.romanization,
  meaning: l.meaning,
}));

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
  {
    id: 'uyir-4',
    title: 'Vowel Picture Recognition',
    titleTamil: 'படம் பார்த்து உயிர் கண்டுபிடி',
    description: 'Identify the Tamil vowel from picture clues',
    items: [
      { id: 'img-அ', tamil: 'அ', romanization: 'a', meaning: 'அம்மா (Mother)', imageEmoji: '👩', imageHint: 'அம்மா — Mother (starts with அ)' },
      { id: 'img-ஆ', tamil: 'ஆ', romanization: 'aa', meaning: 'ஆடு (Goat)', imageEmoji: '🐐', imageHint: 'ஆடு — Goat (starts with ஆ)' },
      { id: 'img-இ', tamil: 'இ', romanization: 'i', meaning: 'இலை (Leaf)', imageEmoji: '🍃', imageHint: 'இலை — Leaf (starts with இ)' },
      { id: 'img-ஈ', tamil: 'ஈ', romanization: 'ii', meaning: 'ஈ (Fly)', imageEmoji: '🪰', imageHint: 'ஈ — Fly (starts with ஈ)' },
      { id: 'img-உ', tamil: 'உ', romanization: 'u', meaning: 'உணவு (Food)', imageEmoji: '🍚', imageHint: 'உணவு — Food (starts with உ)' },
      { id: 'img-ஊ', tamil: 'ஊ', romanization: 'uu', meaning: 'ஊஞ்சல் (Swing)', imageEmoji: '🛝', imageHint: 'ஊஞ்சல் — Swing (starts with ஊ)' },
      { id: 'img-எ', tamil: 'எ', romanization: 'e', meaning: 'எலி (Rat)', imageEmoji: '🐭', imageHint: 'எலி — Rat (starts with எ)' },
      { id: 'img-ஏ', tamil: 'ஏ', romanization: 'ee', meaning: 'ஏணி (Ladder)', imageEmoji: '🪜', imageHint: 'ஏணி — Ladder (starts with ஏ)' },
      { id: 'img-ஐ', tamil: 'ஐ', romanization: 'ai', meaning: 'ஐந்து (Five)', imageEmoji: '✋', imageHint: 'ஐந்து — Five fingers (starts with ஐ)' },
      { id: 'img-ஒ', tamil: 'ஒ', romanization: 'o', meaning: 'ஒட்டகம் (Camel)', imageEmoji: '🐪', imageHint: 'ஒட்டகம் — Camel (starts with ஒ)' },
      { id: 'img-ஓ', tamil: 'ஓ', romanization: 'oo', meaning: 'ஓடம் (Boat)', imageEmoji: '⛵', imageHint: 'ஓடம் — Boat (starts with ஓ)' },
      { id: 'img-ஔ', tamil: 'ஔ', romanization: 'au', meaning: 'ஔடதம் (Medicine)', imageEmoji: '💊', imageHint: 'ஔடதம் — Medicine (starts with ஔ)' },
    ],
    quizType: 'picture',
  },
];

// ── Step 2 — Mei (Consonants) — derived from canonical tamilAlphabet ──
const meiLetters: LessonItem[] = ALPHA_CONSONANTS.map((l) => ({
  id: l.tamil,
  tamil: l.tamil,
  romanization: l.romanization,
  meaning: l.meaning,
}));

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
  {
    id: 'mei-4',
    title: 'Consonant Picture Recognition',
    titleTamil: 'படம் பார்த்து மெய் கண்டுபிடி',
    description: 'Identify the Tamil consonant from picture clues',
    items: [
      { id: 'img-க்', tamil: 'க்', romanization: 'k', meaning: 'கல் (Stone)', imageEmoji: '🪨', imageHint: 'கல் — Stone (starts with க்)' },
      { id: 'img-ச்', tamil: 'ச்', romanization: 'ch', meaning: 'சட்டி (Pot)', imageEmoji: '🪣', imageHint: 'சட்டி — Pot (starts with ச்)' },
      { id: 'img-ட்', tamil: 'ட்', romanization: 't', meaning: 'வட்டம் (Circle)', imageEmoji: '⭕', imageHint: 'வட்டம் — Circle (starts with ட்)' },
      { id: 'img-த்', tamil: 'த்', romanization: 'th', meaning: 'தமிழ் (Tamil)', imageEmoji: '🪔', imageHint: 'தமிழ் — Tamil (starts with த்)' },
      { id: 'img-ப்', tamil: 'ப்', romanization: 'p', meaning: 'பழம் (Fruit)', imageEmoji: '🍎', imageHint: 'பழம் — Fruit (starts with ப்)' },
      { id: 'img-ம்', tamil: 'ம்', romanization: 'm', meaning: 'மரம் (Tree)', imageEmoji: '🌳', imageHint: 'மரம் — Tree (starts with ம்)' },
      { id: 'img-ய்', tamil: 'ய்', romanization: 'y', meaning: 'யானை (Elephant)', imageEmoji: '🐘', imageHint: 'யானை — Elephant (starts with ய்)' },
      { id: 'img-வ்', tamil: 'வ்', romanization: 'v', meaning: 'வாழை (Banana)', imageEmoji: '🍌', imageHint: 'வாழை — Banana (starts with வ்)' },
      { id: 'img-ந்', tamil: 'ந்', romanization: 'n', meaning: 'நண்டு (Crab)', imageEmoji: '🦀', imageHint: 'நண்டு — Crab (starts with ந்)' },
      { id: 'img-ர்', tamil: 'ர்', romanization: 'r', meaning: 'ரோஜா (Rose)', imageEmoji: '🌹', imageHint: 'ரோஜா — Rose (starts with ர்)' },
    ],
    quizType: 'picture',
  },
];

// ── Step 3 — Uyirmei (Combinations) ──
const uyirSuffixes = ['', 'ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ'];
const uyirRomans = ['a', 'aa', 'i', 'ee', 'u', 'oo', 'e', 'ae', 'ai', 'o', 'oo', 'au'];
const sampleBases = [
  { base: 'க', roman: 'k' },
  { base: 'ச', roman: 'ch' },
  { base: 'த', roman: 'th' },
  { base: 'ப', roman: 'p' },
  { base: 'ம', roman: 'm' },
  { base: 'ந', roman: 'n' },
  { base: 'ர', roman: 'r' },
  { base: 'வ', roman: 'v' },
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
  { id: 'w-அம்மா', tamil: 'அம்மா', romanization: 'ammaa', meaning: 'Mother', imageEmoji: '👩', imageHint: 'Mother' },
  { id: 'w-அப்பா', tamil: 'அப்பா', romanization: 'appaa', meaning: 'Father', imageEmoji: '👨', imageHint: 'Father' },
  { id: 'w-தமிழ்', tamil: 'தமிழ்', romanization: 'tamizh', meaning: 'Tamil', imageEmoji: '🪔', imageHint: 'Tamil language' },
  { id: 'w-நன்றி', tamil: 'நன்றி', romanization: 'nandri', meaning: 'Thank you', imageEmoji: '🙏', imageHint: 'Thank you gesture' },
  { id: 'w-வணக்கம்', tamil: 'வணக்கம்', romanization: 'vanakkam', meaning: 'Hello', imageEmoji: '👋', imageHint: 'Greeting' },
  { id: 'w-பள்ளி', tamil: 'பள்ளி', romanization: 'palli', meaning: 'School', imageEmoji: '🏫', imageHint: 'School building' },
  { id: 'w-நீர்', tamil: 'நீர்', romanization: 'neer', meaning: 'Water', imageSrc: '/learning-images/png/water.png', imageEmoji: '💧', imageHint: 'Water drop' },
  { id: 'w-மரம்', tamil: 'மரம்', romanization: 'maram', meaning: 'Tree', imageSrc: '/learning-images/png/tree.png', imageEmoji: '🌳', imageHint: 'Tree' },
  { id: 'w-பூ', tamil: 'பூ', romanization: 'poo', meaning: 'Flower', imageSrc: '/learning-images/png/flower.png', imageEmoji: '🌸', imageHint: 'Flower' },
  { id: 'w-கடல்', tamil: 'கடல்', romanization: 'kadal', meaning: 'Sea', imageEmoji: '🌊', imageHint: 'Sea waves' },
  { id: 'w-வீடு', tamil: 'வீடு', romanization: 'veedu', meaning: 'House', imageSrc: '/learning-images/png/house.png', imageEmoji: '🏠', imageHint: 'House' },
  { id: 'w-சாப்பாடு', tamil: 'சாப்பாடு', romanization: 'saappaadu', meaning: 'Food', imageSrc: '/learning-images/png/food.png', imageEmoji: '🍚', imageHint: 'Food plate' },
  { id: 'w-புத்தகம்', tamil: 'புத்தகம்', romanization: 'puthagam', meaning: 'Book', imageSrc: '/learning-images/png/book.png', imageEmoji: '📘', imageHint: 'Book' },
  { id: 'w-நண்பன்', tamil: 'நண்பன்', romanization: 'nanban', meaning: 'Friend', imageEmoji: '🧑‍🤝‍🧑', imageHint: 'Friends' },
  { id: 'w-காலை', tamil: 'காலை', romanization: 'kaalai', meaning: 'Morning', imageEmoji: '🌅', imageHint: 'Morning sunrise' },
  { id: 'w-இன்று', tamil: 'இன்று', romanization: 'indru', meaning: 'Today', imageEmoji: '📅', imageHint: 'Today on calendar' },
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
    items: simpleWords.filter((w) => ['w-தமிழ்', 'w-சாப்பாடு', 'w-புத்தகம்'].includes(w.id)),
    quizType: 'write',
  },
  {
    id: 'words-4',
    title: 'People & Time',
    titleTamil: 'மக்கள் & நேரம்',
    description: 'Useful words about people and everyday time references',
    items: simpleWords.filter((w) => ['w-நண்பன்', 'w-காலை', 'w-இன்று'].includes(w.id)),
    quizType: 'write',
  },
  {
    id: 'words-5',
    title: 'Picture Recognition',
    titleTamil: 'படம் பார்த்து சொல்லு',
    description: 'Identify the correct Tamil word from real picture cards',
    items: [
      { id: 'pic-மரம்', tamil: 'மரம்', romanization: 'maram', meaning: 'Tree', imageSrc: '/learning-images/png/tree.png', imageHint: 'Tree' },
      { id: 'pic-பூ', tamil: 'பூ', romanization: 'poo', meaning: 'Flower', imageSrc: '/learning-images/png/flower.png', imageHint: 'Flower' },
      { id: 'pic-நீர்', tamil: 'நீர்', romanization: 'neer', meaning: 'Water', imageSrc: '/learning-images/png/water.png', imageHint: 'Water' },
      { id: 'pic-வீடு', tamil: 'வீடு', romanization: 'veedu', meaning: 'House', imageSrc: '/learning-images/png/house.png', imageHint: 'House' },
      { id: 'pic-புத்தகம்', tamil: 'புத்தகம்', romanization: 'puthagam', meaning: 'Book', imageSrc: '/learning-images/png/book.png', imageHint: 'Book' },
      { id: 'pic-சாப்பாடு', tamil: 'சாப்பாடு', romanization: 'saappaadu', meaning: 'Food', imageSrc: '/learning-images/png/food.png', imageHint: 'Food' },
      { id: 'pic-பழம்', tamil: 'பழம்', romanization: 'pazham', meaning: 'Fruit', imageSrc: '/learning-images/png/fruit.png', imageHint: 'Fruit' },
      { id: 'pic-பால்', tamil: 'பால்', romanization: 'paal', meaning: 'Milk', imageSrc: '/learning-images/png/milk.png', imageHint: 'Milk' },
      { id: 'pic-மீன்', tamil: 'மீன்', romanization: 'meen', meaning: 'Fish', imageSrc: '/learning-images/png/fish.png', imageHint: 'Fish' },
      { id: 'pic-பறவை', tamil: 'பறவை', romanization: 'paravai', meaning: 'Bird', imageSrc: '/learning-images/png/bird.png', imageHint: 'Bird' },
      { id: 'pic-நாய்', tamil: 'நாய்', romanization: 'naai', meaning: 'Dog', imageSrc: '/learning-images/png/dog.png', imageHint: 'Dog' },
      { id: 'pic-பூனை', tamil: 'பூனை', romanization: 'poonai', meaning: 'Cat', imageSrc: '/learning-images/png/cat.png', imageHint: 'Cat' },
      { id: 'pic-கார்', tamil: 'கார்', romanization: 'kaar', meaning: 'Car', imageSrc: '/learning-images/png/car.png', imageHint: 'Car' },
      { id: 'pic-பேருந்து', tamil: 'பேருந்து', romanization: 'perunthu', meaning: 'Bus', imageSrc: '/learning-images/png/bus.png', imageHint: 'Bus' },
      { id: 'pic-மிதிவண்டி', tamil: 'மிதிவண்டி', romanization: 'mithivandi', meaning: 'Cycle', imageSrc: '/learning-images/png/cycle.png', imageHint: 'Cycle' },
      { id: 'pic-தொலைபேசி', tamil: 'தொலைபேசி', romanization: 'tholaipesi', meaning: 'Phone', imageSrc: '/learning-images/png/phone.png', imageHint: 'Phone' },
      { id: 'pic-கடிகாரம்', tamil: 'கடிகாரம்', romanization: 'kadigaram', meaning: 'Clock', imageSrc: '/learning-images/png/clock.png', imageHint: 'Clock' },
      { id: 'pic-சூரியன்', tamil: 'சூரியன்', romanization: 'sooriyan', meaning: 'Sun', imageSrc: '/learning-images/png/sun.png', imageHint: 'Sun' },
      { id: 'pic-நிலா', tamil: 'நிலா', romanization: 'nilaa', meaning: 'Moon', imageSrc: '/learning-images/png/moon.png', imageHint: 'Moon' },
      { id: 'pic-மழை', tamil: 'மழை', romanization: 'mazhai', meaning: 'Rain', imageSrc: '/learning-images/png/rain.png', imageHint: 'Rain' },
      { id: 'pic-மலை', tamil: 'மலை', romanization: 'malai', meaning: 'Mountain', imageSrc: '/learning-images/png/mountain.png', imageHint: 'Mountain' },
      { id: 'pic-கடல்', tamil: 'கடல்', romanization: 'kadal', meaning: 'Sea', imageSrc: '/learning-images/png/sea.png', imageHint: 'Sea' },
      { id: 'pic-நட்சத்திரம்', tamil: 'நட்சத்திரம்', romanization: 'natchathiram', meaning: 'Star', imageSrc: '/learning-images/png/star.png', imageHint: 'Star' },
      { id: 'pic-பள்ளி', tamil: 'பள்ளி', romanization: 'palli', meaning: 'School', imageSrc: '/learning-images/png/school.png', imageHint: 'School' },
      { id: 'pic-மருத்துவமனை', tamil: 'மருத்துவமனை', romanization: 'maruthuvamanai', meaning: 'Hospital', imageSrc: '/learning-images/png/hospital.png', imageHint: 'Hospital' },
      { id: 'pic-கடை', tamil: 'கடை', romanization: 'kadai', meaning: 'Shop', imageSrc: '/learning-images/png/shop.png', imageHint: 'Shop' },
      { id: 'pic-பந்து', tamil: 'பந்து', romanization: 'pandhu', meaning: 'Ball', imageSrc: '/learning-images/png/ball.png', imageHint: 'Ball' },
      { id: 'pic-நாற்காலி', tamil: 'நாற்காலி', romanization: 'naarkaali', meaning: 'Chair', imageSrc: '/learning-images/png/chair.png', imageHint: 'Chair' },
      { id: 'pic-மேசை', tamil: 'மேசை', romanization: 'mesai', meaning: 'Table', imageSrc: '/learning-images/png/table.png', imageHint: 'Table' },
      { id: 'pic-பை', tamil: 'பை', romanization: 'pai', meaning: 'Bag', imageSrc: '/learning-images/png/bag.png', imageHint: 'Bag' },
    ],
    quizType: 'picture',
  },
];

export const PICTURE_WORD_ITEMS: LessonItem[] = (
  wordLessons.find((lesson) => lesson.id === 'words-5')?.items || []
).map((item) => ({ ...item }));

// ── Step 5 — Short Sentences ──
const sentences: LessonItem[] = [
  { id: 's-1', tamil: 'நான் தமிழ் படிக்கிறேன்', romanization: 'naan tamizh padikkiren', meaning: 'I am studying Tamil' },
  { id: 's-2', tamil: 'இது என் வீடு', romanization: 'idhu en veedu', meaning: 'This is my house' },
  { id: 's-3', tamil: 'நீ எப்படி இருக்கிறாய்?', romanization: 'nee eppadi irukkiraai?', meaning: 'How are you?' },
  { id: 's-4', tamil: 'எனக்கு தமிழ் பிடிக்கும்', romanization: 'enakku tamizh pidikkum', meaning: 'I like Tamil' },
  { id: 's-5', tamil: 'அவள் பள்ளிக்கு போகிறாள்', romanization: 'aval pallikku pokiraal', meaning: 'She is going to school' },
  { id: 's-6', tamil: 'மழை பெய்கிறது', romanization: 'mazhai peykiRadhu', meaning: 'It is raining' },
  { id: 's-7', tamil: 'நான் சாப்பிட்டேன்', romanization: 'naan saappitten', meaning: 'I ate' },
  { id: 's-8', tamil: 'தமிழ் மிகவும் அழகான மொழி', romanization: 'tamizh mikavum azhagaana mozhi', meaning: 'Tamil is a very beautiful language' },
  { id: 's-9', tamil: 'இன்று காலை நான் பள்ளிக்கு சென்றேன்', romanization: 'indru kaalai naan pallikku senren', meaning: 'This morning I went to school' },
  { id: 's-10', tamil: 'என் நண்பன் ஒரு புத்தகம் படிக்கிறான்', romanization: 'en nanban oru puthagam padikkiraan', meaning: 'My friend is reading a book' },
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
  {
    id: 'sent-4',
    title: 'Daily Life',
    titleTamil: 'அன்றாட வாழ்க்கை',
    description: 'Read practical sentences used in everyday conversations',
    items: sentences.filter((s) => ['s-9', 's-10'].includes(s.id)),
    quizType: 'read',
  },
];

// ── Step 6 — Tamil Numbers & Counting ──
const tamilNumberItems: LessonItem[] = [
  { id: 'num-1',  tamil: 'ஒன்று',    romanization: 'ondru',    meaning: '1 — One',    imageEmoji: '1️⃣', imageHint: 'Number 1' },
  { id: 'num-2',  tamil: 'இரண்டு',   romanization: 'irandu',   meaning: '2 — Two',    imageEmoji: '2️⃣', imageHint: 'Number 2' },
  { id: 'num-3',  tamil: 'மூன்று',   romanization: 'moondru',  meaning: '3 — Three',  imageEmoji: '3️⃣', imageHint: 'Number 3' },
  { id: 'num-4',  tamil: 'நான்கு',   romanization: 'naangu',   meaning: '4 — Four',   imageEmoji: '4️⃣', imageHint: 'Number 4' },
  { id: 'num-5',  tamil: 'ஐந்து',    romanization: 'aindhu',   meaning: '5 — Five',   imageEmoji: '5️⃣', imageHint: 'Number 5' },
  { id: 'num-6',  tamil: 'ஆறு',      romanization: 'aaru',     meaning: '6 — Six',    imageEmoji: '6️⃣', imageHint: 'Number 6' },
  { id: 'num-7',  tamil: 'ஏழு',      romanization: 'ezhu',     meaning: '7 — Seven',  imageEmoji: '7️⃣', imageHint: 'Number 7' },
  { id: 'num-8',  tamil: 'எட்டு',    romanization: 'ettu',     meaning: '8 — Eight',  imageEmoji: '8️⃣', imageHint: 'Number 8' },
  { id: 'num-9',  tamil: 'ஒன்பது',   romanization: 'onbadhu',  meaning: '9 — Nine',   imageEmoji: '9️⃣', imageHint: 'Number 9' },
  { id: 'num-10', tamil: 'பத்து',    romanization: 'pathu',    meaning: '10 — Ten',   imageEmoji: '🔟', imageHint: 'Number 10' },
  { id: 'num-11', tamil: 'பதினொன்று', romanization: 'pathinondru', meaning: '11 — Eleven',  imageEmoji: '1️⃣1️⃣', imageHint: 'Number 11' },
  { id: 'num-12', tamil: 'பன்னிரண்டு', romanization: 'pannirndu', meaning: '12 — Twelve', imageEmoji: '1️⃣2️⃣', imageHint: 'Number 12' },
  { id: 'num-20', tamil: 'இருபது',   romanization: 'irupadhu', meaning: '20 — Twenty', imageEmoji: '2️⃣0️⃣', imageHint: 'Number 20' },
  { id: 'num-50', tamil: 'ஐம்பது',   romanization: 'aimpadhu', meaning: '50 — Fifty',  imageEmoji: '5️⃣0️⃣', imageHint: 'Number 50' },
  { id: 'num-100',tamil: 'நூறு',     romanization: 'nooru',    meaning: '100 — Hundred', imageEmoji: '💯', imageHint: 'Number 100' },
];

const tamilSymbolItems: LessonItem[] = [
  { id: 'sym-1',  tamil: '௧', romanization: '1',   meaning: 'Tamil numeral 1' },
  { id: 'sym-2',  tamil: '௨', romanization: '2',   meaning: 'Tamil numeral 2' },
  { id: 'sym-3',  tamil: '௩', romanization: '3',   meaning: 'Tamil numeral 3' },
  { id: 'sym-4',  tamil: '௪', romanization: '4',   meaning: 'Tamil numeral 4' },
  { id: 'sym-5',  tamil: '௫', romanization: '5',   meaning: 'Tamil numeral 5' },
  { id: 'sym-6',  tamil: '௬', romanization: '6',   meaning: 'Tamil numeral 6' },
  { id: 'sym-7',  tamil: '௭', romanization: '7',   meaning: 'Tamil numeral 7' },
  { id: 'sym-8',  tamil: '௮', romanization: '8',   meaning: 'Tamil numeral 8' },
  { id: 'sym-9',  tamil: '௯', romanization: '9',   meaning: 'Tamil numeral 9' },
  { id: 'sym-10', tamil: '௰', romanization: '10',  meaning: 'Tamil numeral 10' },
  { id: 'sym-100',tamil: '௱', romanization: '100', meaning: 'Tamil numeral 100' },
  { id: 'sym-1000',tamil: '௲', romanization: '1000', meaning: 'Tamil numeral 1000' },
];

const countingContextItems: LessonItem[] = [
  { id: 'ctx-1', tamil: 'ஒரு மரம்',    romanization: 'oru maram',    meaning: 'One tree',    imageEmoji: '🌳', imageHint: 'One tree' },
  { id: 'ctx-2', tamil: 'இரண்டு பூக்கள்', romanization: 'irandu pookkal', meaning: 'Two flowers', imageEmoji: '🌸', imageHint: 'Two flowers' },
  { id: 'ctx-3', tamil: 'மூன்று பறவைகள்', romanization: 'moondru paravaikal', meaning: 'Three birds', imageEmoji: '🐦', imageHint: 'Three birds' },
  { id: 'ctx-4', tamil: 'நான்கு புத்தகங்கள்', romanization: 'naangu puthagangal', meaning: 'Four books', imageEmoji: '📚', imageHint: 'Four books' },
  { id: 'ctx-5', tamil: 'ஐந்து நட்சத்திரங்கள்', romanization: 'aindhu natchathirangal', meaning: 'Five stars', imageEmoji: '⭐', imageHint: 'Five stars' },
  { id: 'ctx-6', tamil: 'பத்து நிமிடங்கள்', romanization: 'pathu nimitangal', meaning: 'Ten minutes', imageEmoji: '⏱️', imageHint: 'Ten minutes' },
];

const numberLessons: Lesson[] = [
  {
    id: 'num-1to5',
    title: 'Numbers 1–5',
    titleTamil: 'எண்கள் ௧-௫',
    description: 'Learn to say and recognise ஒன்று through ஐந்து',
    items: tamilNumberItems.filter((n) => ['num-1','num-2','num-3','num-4','num-5'].includes(n.id)),
    quizType: 'identify',
  },
  {
    id: 'num-6to10',
    title: 'Numbers 6–10',
    titleTamil: 'எண்கள் ௬-௰',
    description: 'Learn to say and recognise ஆறு through பத்து',
    items: tamilNumberItems.filter((n) => ['num-6','num-7','num-8','num-9','num-10'].includes(n.id)),
    quizType: 'identify',
  },
  {
    id: 'num-beyond',
    title: 'Beyond 10',
    titleTamil: 'பத்துக்கு மேல்',
    description: 'Learn eleven, twelve, twenty, fifty and hundred',
    items: tamilNumberItems.filter((n) => ['num-11','num-12','num-20','num-50','num-100'].includes(n.id)),
    quizType: 'identify',
  },
  {
    id: 'num-symbols',
    title: 'Tamil Numeral Symbols',
    titleTamil: 'தமிழ் இலக்க குறியீடுகள்',
    description: 'Recognise the traditional Tamil numeral symbols ௧–௲',
    items: tamilSymbolItems,
    quizType: 'match',
  },
  {
    id: 'num-picture',
    title: 'Count the Pictures',
    titleTamil: 'படம் பார்த்து எண்ணு',
    description: 'Match picture clues to the correct counting phrase',
    items: countingContextItems,
    quizType: 'picture',
  },
];

export interface ThirtyDayPlanItem {  day: number;
  week: number;
  focus: string;
  goal: string;
  stepId?: Step['id'];
  minutes: number;
}

export const THIRTY_DAY_PLAN: ThirtyDayPlanItem[] = [
  { day: 1, week: 1, focus: 'Tamil sounds and script intro', goal: 'Understand how Uyir, Mei, and Uyirmei are formed', minutes: 20 },
  { day: 2, week: 1, focus: 'Short vowels', goal: 'Memorize அ, இ, உ, எ, ஒ with pronunciation', stepId: 'uyir', minutes: 20 },
  { day: 3, week: 1, focus: 'Long vowels', goal: 'Practice ஆ, ஈ, ஊ, ஏ, ஓ and sound contrast', stepId: 'uyir', minutes: 20 },
  { day: 4, week: 1, focus: 'Diphthongs', goal: 'Learn ஐ and ஔ with examples', stepId: 'uyir', minutes: 20 },
  { day: 5, week: 1, focus: 'Vowel picture recognition', goal: 'Identify vowels from image clues (uyir-4)', stepId: 'uyir', minutes: 20 },
  { day: 6, week: 1, focus: 'Listening and speaking', goal: 'Repeat vowels aloud with audio support', stepId: 'uyir', minutes: 15 },
  { day: 7, week: 1, focus: 'Weekly checkpoint', goal: 'Complete all Uyir quizzes with at least 70%', stepId: 'uyir', minutes: 25 },

  { day: 8,  week: 2, focus: 'Vallinam consonants', goal: 'Learn க், ச், ட், த், ப், ற்', stepId: 'mei', minutes: 20 },
  { day: 9,  week: 2, focus: 'Mellinam consonants', goal: 'Learn ங், ஞ், ண், ந், ம், ன்', stepId: 'mei', minutes: 20 },
  { day: 10, week: 2, focus: 'Idaiyinam consonants', goal: 'Learn ய், ர், ல், வ், ழ், ள்', stepId: 'mei', minutes: 20 },
  { day: 11, week: 2, focus: 'Consonant recall', goal: 'Identify all 18 Mei letters quickly', stepId: 'mei', minutes: 20 },
  { day: 12, week: 2, focus: 'Consonant picture recognition', goal: 'Match picture clues to consonants (mei-4)', stepId: 'mei', minutes: 20 },
  { day: 13, week: 2, focus: 'Mixed letter reading', goal: 'Read random Uyir and Mei combinations', stepId: 'mei', minutes: 20 },
  { day: 14, week: 2, focus: 'Weekly checkpoint', goal: 'Complete all Mei quizzes with at least 70%', stepId: 'mei', minutes: 25 },

  { day: 15, week: 3, focus: 'Uyirmei concept', goal: 'Understand how vowel markers change consonants', stepId: 'uyirmei', minutes: 20 },
  { day: 16, week: 3, focus: 'க and ச rows', goal: 'Read all 12 forms for க and ச', stepId: 'uyirmei', minutes: 20 },
  { day: 17, week: 3, focus: 'த and ப rows', goal: 'Read all 12 forms for த and ப', stepId: 'uyirmei', minutes: 20 },
  { day: 18, week: 3, focus: 'ம and ந rows', goal: 'Read all 12 forms for ம and ந', stepId: 'uyirmei', minutes: 20 },
  { day: 19, week: 3, focus: 'ர and வ rows', goal: 'Read all 12 forms for ர and வ', stepId: 'uyirmei', minutes: 20 },
  { day: 20, week: 3, focus: 'Pattern spotting', goal: 'Recognize repeating vowel marker patterns', stepId: 'uyirmei', minutes: 20 },
  { day: 21, week: 3, focus: 'Weekly checkpoint', goal: 'Complete all Uyirmei lessons and quiz', stepId: 'uyirmei', minutes: 25 },

  { day: 22, week: 4, focus: 'Core word set', goal: 'Practice family and greeting words', stepId: 'words', minutes: 20 },
  { day: 23, week: 4, focus: 'Nature vocabulary', goal: 'Learn water, tree, flower, sea, and house words', stepId: 'words', minutes: 20 },
  { day: 24, week: 4, focus: 'Daily words & picture quiz', goal: 'Complete picture recognition word lesson', stepId: 'words', minutes: 20 },
  { day: 25, week: 4, focus: 'Numbers 1–10', goal: 'Learn to say and write ஒன்று through பத்து', stepId: 'numbers', minutes: 20 },
  { day: 26, week: 4, focus: 'Numbers beyond 10 & Tamil symbols', goal: 'Learn ௧–௲ Tamil numeral symbols', stepId: 'numbers', minutes: 20 },
  { day: 27, week: 4, focus: 'Counting in context', goal: 'Use counting phrases like இரண்டு பூக்கள்', stepId: 'numbers', minutes: 20 },
  { day: 28, week: 4, focus: 'Weekly checkpoint', goal: 'Finish word and number lessons', stepId: 'numbers', minutes: 25 },

  { day: 29, week: 5, focus: 'Self & identity sentences', goal: 'Read sentences: நான் தமிழ் படிக்கிறேன்', stepId: 'sentences', minutes: 20 },
  { day: 30, week: 5, focus: 'Final review', goal: 'Complete all pending quizzes and celebrate progress 🎉', stepId: 'sentences', minutes: 30 },
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
  {
    id: 'numbers',
    stepNumber: 6,
    title: 'Tamil Numbers & Counting',
    titleTamil: 'தமிழ் எண்கள் & கணக்கிடல்',
    description: 'Learn Tamil number words, traditional numeral symbols, and counting in context.',
    icon: '🔢',
    color: '#20c997',
    badgeId: 'number-master',
    lessons: numberLessons,
  },
];
