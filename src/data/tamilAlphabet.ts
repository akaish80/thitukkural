/**
 * Single canonical source of truth for Tamil alphabet data.
 * Romanization standard: ISO 15919 approximation that is learner-friendly.
 *   ஏ → ee  |  ச் → ch  |  த் → th  |  ழ் → zh
 *
 * Two forms are provided for consonants:
 *   `tamil`  — pulli (மெய்) form: க்  (used in isolation / learningPath)
 *   `base`   — base (உயிர்மெய்) form: க  (used in exercise grids / draw)
 */

export type LetterType = 'vowel' | 'consonant' | 'aytham';
export type ConsonantSubType = 'hard' | 'soft' | 'medium' | null;

export interface TamilLetter {
  /** Pulli / standalone form (க், ச், …) — same as base for vowels */
  tamil: string;
  /** Base form without pulli (க, ச, …) — same as tamil for vowels */
  base: string;
  /** Standardized romanization (lowercase, no inherent vowel for consonants) */
  romanization: string;
  type: LetterType;
  /** Only set for consonants */
  subType: ConsonantSubType;
  /** English category label */
  typeLabelEn: string;
  /** Tamil category label */
  typeLabelTa: string;
  /** Example Tamil word using this letter */
  word: string;
  /** English meaning of the example word */
  meaning: string;
  /** Pronunciation guide in plain English */
  pronunciation: string;
  /** IPA / phonetic description */
  sound: string;
  /** Example sentence in Tamil */
  exampleSentence: string;
  /** English translation of the example sentence */
  exampleTranslation: string;
}

// ---------------------------------------------------------------------------
// உயிர் எழுத்துகள் — Vowels (12)
// ---------------------------------------------------------------------------
export const VOWELS: TamilLetter[] = [
  {
    tamil: 'அ', base: 'அ', romanization: 'a', type: 'vowel', subType: null,
    typeLabelEn: 'Short Vowel', typeLabelTa: 'உயிர்',
    word: 'அம்மா', meaning: 'Mother',
    pronunciation: 'Like "u" in "but"', sound: '/a/ as in "about"',
    exampleSentence: 'அம்மா வீட்டில் இருக்கிறாள்', exampleTranslation: 'Mother is at home',
  },
  {
    tamil: 'ஆ', base: 'ஆ', romanization: 'aa', type: 'vowel', subType: null,
    typeLabelEn: 'Long Vowel', typeLabelTa: 'உயிர்',
    word: 'ஆடு', meaning: 'Goat',
    pronunciation: 'Like "a" in "father"', sound: '/aː/ as in "father" (long)',
    exampleSentence: 'ஆடு புல் தின்கிறது', exampleTranslation: 'The goat eats grass',
  },
  {
    tamil: 'இ', base: 'இ', romanization: 'i', type: 'vowel', subType: null,
    typeLabelEn: 'Short Vowel', typeLabelTa: 'உயிர்',
    word: 'இலை', meaning: 'Leaf',
    pronunciation: 'Like "i" in "sit"', sound: '/i/ as in "bit"',
    exampleSentence: 'இலை மரத்தில் உள்ளது', exampleTranslation: 'The leaf is on the tree',
  },
  {
    tamil: 'ஈ', base: 'ஈ', romanization: 'ii', type: 'vowel', subType: null,
    typeLabelEn: 'Long Vowel', typeLabelTa: 'உயிர்',
    word: 'ஈ', meaning: 'Fly',
    pronunciation: 'Like "ee" in "see"', sound: '/iː/ as in "beet" (long)',
    exampleSentence: 'ஈ பறக்கிறது', exampleTranslation: 'The fly is flying',
  },
  {
    tamil: 'உ', base: 'உ', romanization: 'u', type: 'vowel', subType: null,
    typeLabelEn: 'Short Vowel', typeLabelTa: 'உயிர்',
    word: 'உணவு', meaning: 'Food',
    pronunciation: 'Like "u" in "put"', sound: '/u/ as in "put"',
    exampleSentence: 'உணவு சாப்பிட வேண்டும்', exampleTranslation: 'You should eat food',
  },
  {
    tamil: 'ஊ', base: 'ஊ', romanization: 'uu', type: 'vowel', subType: null,
    typeLabelEn: 'Long Vowel', typeLabelTa: 'உயிர்',
    word: 'ஊஞ்சல்', meaning: 'Swing',
    pronunciation: 'Like "oo" in "moon"', sound: '/uː/ as in "boot" (long)',
    exampleSentence: 'ஊஞ்சல் ஆடு', exampleTranslation: 'Play on the swing',
  },
  {
    tamil: 'எ', base: 'எ', romanization: 'e', type: 'vowel', subType: null,
    typeLabelEn: 'Short Vowel', typeLabelTa: 'உயிர்',
    word: 'எலி', meaning: 'Rat',
    pronunciation: 'Like "e" in "pet"', sound: '/e/ as in "bet"',
    exampleSentence: 'எலி ஓடுகிறது', exampleTranslation: 'The rat is running',
  },
  {
    tamil: 'ஏ', base: 'ஏ', romanization: 'ee', type: 'vowel', subType: null,
    typeLabelEn: 'Long Vowel', typeLabelTa: 'உயிர்',
    word: 'ஏணி', meaning: 'Ladder',
    pronunciation: 'Like "a" in "gate"', sound: '/eː/ as in "bay" (long)',
    exampleSentence: 'ஏணி மேல் ஏறு', exampleTranslation: 'Climb up the ladder',
  },
  {
    tamil: 'ஐ', base: 'ஐ', romanization: 'ai', type: 'vowel', subType: null,
    typeLabelEn: 'Diphthong', typeLabelTa: 'உயிர்',
    word: 'ஐந்து', meaning: 'Five',
    pronunciation: 'Like "ai" in "aisle"', sound: '/aɪ/ as in "eye"',
    exampleSentence: 'ஐந்து விரல்கள் உள்ளன', exampleTranslation: 'There are five fingers',
  },
  {
    tamil: 'ஒ', base: 'ஒ', romanization: 'o', type: 'vowel', subType: null,
    typeLabelEn: 'Short Vowel', typeLabelTa: 'உயிர்',
    word: 'ஒட்டகச்சிவிங்கி', meaning: 'Giraffe',
    pronunciation: 'Like "o" in "go" (short)', sound: '/o/ as in "pot"',
    exampleSentence: 'ஒட்டகச்சிவிங்கி உயரமான விலங்கு', exampleTranslation: 'The giraffe is a tall animal',
  },
  {
    tamil: 'ஓ', base: 'ஓ', romanization: 'oo', type: 'vowel', subType: null,
    typeLabelEn: 'Long Vowel', typeLabelTa: 'உயிர்',
    word: 'ஓடம்', meaning: 'Boat',
    pronunciation: 'Like "o" in "go" (long)', sound: '/oː/ as in "boat" (long)',
    exampleSentence: 'ஓடம் ஆற்றில் செல்கிறது', exampleTranslation: 'The boat goes in the river',
  },
  {
    tamil: 'ஔ', base: 'ஔ', romanization: 'au', type: 'vowel', subType: null,
    typeLabelEn: 'Diphthong', typeLabelTa: 'உயிர்',
    word: 'ஔடதம்', meaning: 'Medicine',
    pronunciation: 'Like "ow" in "cow"', sound: '/aʊ/ as in "how"',
    exampleSentence: 'ஔடதம் நேரத்தில் எடுத்துக்கொள்', exampleTranslation: 'Take medicine on time',
  },
];

// ---------------------------------------------------------------------------
// ஆய்த எழுத்து — Aytham (1)
// ---------------------------------------------------------------------------
export const AYTHAM: TamilLetter = {
  tamil: 'ஃ', base: 'ஃ', romanization: 'kh', type: 'aytham', subType: null,
  typeLabelEn: 'Aytham (Special)', typeLabelTa: 'ஆய்தம்',
  word: 'அஃது', meaning: 'That',
  pronunciation: 'A brief pause or glottal stop', sound: '/ʔ/ glottal stop',
  exampleSentence: 'அஃது நல்லது', exampleTranslation: 'That is good',
};

// ---------------------------------------------------------------------------
// மெய் எழுத்துகள் — Consonants (18)
// ---------------------------------------------------------------------------
export const CONSONANTS: TamilLetter[] = [
  {
    tamil: 'க்', base: 'க', romanization: 'k', type: 'consonant', subType: 'hard',
    typeLabelEn: 'Hard Consonant', typeLabelTa: 'வல்லினம்',
    word: 'கல்', meaning: 'Stone',
    pronunciation: 'Like "k" in "kite"', sound: '/k/ as in "kite"',
    exampleSentence: 'கல்வி கரை இல', exampleTranslation: 'Education has no shore',
  },
  {
    tamil: 'ங்', base: 'ங', romanization: 'ng', type: 'consonant', subType: 'soft',
    typeLabelEn: 'Soft Consonant', typeLabelTa: 'மெல்லினம்',
    word: 'மாங்காய்', meaning: 'Raw Mango',
    pronunciation: 'Like "ng" in "sing"', sound: '/ŋ/ as in "sing"',
    exampleSentence: 'மாங்காய் புளிக்கும்', exampleTranslation: 'Raw mango is sour',
  },
  {
    tamil: 'ச்', base: 'ச', romanization: 'ch', type: 'consonant', subType: 'hard',
    typeLabelEn: 'Hard Consonant', typeLabelTa: 'வல்லினம்',
    word: 'சட்டி', meaning: 'Pot',
    pronunciation: 'Like "ch" in "chat"', sound: '/tʃ/ as in "chair"',
    exampleSentence: 'சட்டியில் சோறு இருக்கிறது', exampleTranslation: 'There is rice in the pot',
  },
  {
    tamil: 'ஞ்', base: 'ஞ', romanization: 'nj', type: 'consonant', subType: 'soft',
    typeLabelEn: 'Soft Consonant', typeLabelTa: 'மெல்லினம்',
    word: 'ஞாயிறு', meaning: 'Sun / Sunday',
    pronunciation: 'Like "ny" in "canyon"', sound: '/ɲ/ as in "canyon"',
    exampleSentence: 'ஞாயிறு விடுமுறை நாள்', exampleTranslation: 'Sunday is a holiday',
  },
  {
    tamil: 'ட்', base: 'ட', romanization: 't', type: 'consonant', subType: 'hard',
    typeLabelEn: 'Hard Consonant', typeLabelTa: 'வல்லினம்',
    word: 'வட்டம்', meaning: 'Circle',
    pronunciation: 'Like "t" in "top" (retroflex)', sound: '/ʈ/ retroflex T',
    exampleSentence: 'வட்டம் வரையவும்', exampleTranslation: 'Draw a circle',
  },
  {
    tamil: 'ண்', base: 'ண', romanization: 'n', type: 'consonant', subType: 'soft',
    typeLabelEn: 'Soft Consonant', typeLabelTa: 'மெல்லினம்',
    word: 'மண்', meaning: 'Soil',
    pronunciation: 'Like "n" with tongue curled back (retroflex)', sound: '/ɳ/ retroflex N',
    exampleSentence: 'மண் வளமானது', exampleTranslation: 'The soil is fertile',
  },
  {
    tamil: 'த்', base: 'த', romanization: 'th', type: 'consonant', subType: 'hard',
    typeLabelEn: 'Hard Consonant', typeLabelTa: 'வல்லினம்',
    word: 'தமிழ்', meaning: 'Tamil',
    pronunciation: 'Like "th" in "the" (dental)', sound: '/t̪/ dental T',
    exampleSentence: 'தமிழ் இனிய மொழி', exampleTranslation: 'Tamil is a sweet language',
  },
  {
    tamil: 'ந்', base: 'ந', romanization: 'n', type: 'consonant', subType: 'soft',
    typeLabelEn: 'Soft Consonant', typeLabelTa: 'மெல்லினம்',
    word: 'நண்டு', meaning: 'Crab',
    pronunciation: 'Like "n" in "name" (dental)', sound: '/n/ dental N',
    exampleSentence: 'நண்டு கடலில் வாழும்', exampleTranslation: 'Crabs live in the sea',
  },
  {
    tamil: 'ப்', base: 'ப', romanization: 'p', type: 'consonant', subType: 'hard',
    typeLabelEn: 'Hard Consonant', typeLabelTa: 'வல்லினம்',
    word: 'பழம்', meaning: 'Fruit',
    pronunciation: 'Like "p" in "put"', sound: '/p/ as in "pot"',
    exampleSentence: 'பழம் சாப்பிடு', exampleTranslation: 'Eat the fruit',
  },
  {
    tamil: 'ம்', base: 'ம', romanization: 'm', type: 'consonant', subType: 'soft',
    typeLabelEn: 'Soft Consonant', typeLabelTa: 'மெல்லினம்',
    word: 'மரம்', meaning: 'Tree',
    pronunciation: 'Like "m" in "moon"', sound: '/m/ as in "mat"',
    exampleSentence: 'மரம் நிழல் தருகிறது', exampleTranslation: 'The tree gives shade',
  },
  {
    tamil: 'ய்', base: 'ய', romanization: 'y', type: 'consonant', subType: 'medium',
    typeLabelEn: 'Medium Consonant', typeLabelTa: 'இடையினம்',
    word: 'யானை', meaning: 'Elephant',
    pronunciation: 'Like "y" in "yes"', sound: '/j/ as in "yes"',
    exampleSentence: 'யானை பெரிய விலங்கு', exampleTranslation: 'Elephant is a big animal',
  },
  {
    tamil: 'ர்', base: 'ர', romanization: 'r', type: 'consonant', subType: 'medium',
    typeLabelEn: 'Medium Consonant', typeLabelTa: 'இடையினம்',
    word: 'ரோஜா', meaning: 'Rose',
    pronunciation: 'Like "r" in "run" (alveolar tap)', sound: '/r/ rolled R',
    exampleSentence: 'ரோஜா மலர் அழகானது', exampleTranslation: 'The rose flower is beautiful',
  },
  {
    tamil: 'ல்', base: 'ல', romanization: 'l', type: 'consonant', subType: 'medium',
    typeLabelEn: 'Medium Consonant', typeLabelTa: 'இடையினம்',
    word: 'லட்டு', meaning: 'Laddu (sweet)',
    pronunciation: 'Like "l" in "love"', sound: '/l/ as in "love"',
    exampleSentence: 'லட்டு இனிப்பானது', exampleTranslation: 'Laddu is sweet',
  },
  {
    tamil: 'வ்', base: 'வ', romanization: 'v', type: 'consonant', subType: 'medium',
    typeLabelEn: 'Medium Consonant', typeLabelTa: 'இடையினம்',
    word: 'வாழை', meaning: 'Banana',
    pronunciation: 'Like "v" in "vine"', sound: '/ʋ/ as in "water"',
    exampleSentence: 'வாழைப்பழம் நல்லது', exampleTranslation: 'Banana is good',
  },
  {
    tamil: 'ழ்', base: 'ழ', romanization: 'zh', type: 'consonant', subType: 'medium',
    typeLabelEn: 'Medium Consonant', typeLabelTa: 'இடையினம்',
    word: 'தாழ்', meaning: 'Lock',
    pronunciation: 'Unique Tamil retroflex "zh" sound', sound: '/ɻ/ retroflex approximant',
    exampleSentence: 'தாழ் போடு', exampleTranslation: 'Lock it',
  },
  {
    tamil: 'ள்', base: 'ள', romanization: 'l', type: 'consonant', subType: 'medium',
    typeLabelEn: 'Medium Consonant', typeLabelTa: 'இடையினம்',
    word: 'வெள்ளம்', meaning: 'Flood',
    pronunciation: 'Like "l" with tongue curled back (retroflex)', sound: '/ɭ/ retroflex L',
    exampleSentence: 'வெள்ளம் வந்தது', exampleTranslation: 'The flood came',
  },
  {
    tamil: 'ற்', base: 'ற', romanization: 'r', type: 'consonant', subType: 'hard',
    typeLabelEn: 'Hard Consonant', typeLabelTa: 'வல்லினம்',
    word: 'கற்றை', meaning: 'Bundle',
    pronunciation: 'Like rolled "rr" in "parrot"', sound: '/r/ hard R',
    exampleSentence: 'கற்றது கைமண் அளவு', exampleTranslation: 'What is learnt is a handful',
  },
  {
    tamil: 'ன்', base: 'ன', romanization: 'n', type: 'consonant', subType: 'soft',
    typeLabelEn: 'Soft Consonant', typeLabelTa: 'மெல்லினம்',
    word: 'மின்', meaning: 'Electricity',
    pronunciation: 'Like "n" in "fun" (alveolar)', sound: '/n/ alveolar N',
    exampleSentence: 'மின்சாரம் தேவை', exampleTranslation: 'Electricity is needed',
  },
];

/** All letters in canonical order: vowels → aytham → consonants */
export const ALL_LETTERS: TamilLetter[] = [...VOWELS, AYTHAM, ...CONSONANTS];
