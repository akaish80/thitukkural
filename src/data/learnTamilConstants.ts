import { CONSONANTS } from './constants';

export type UyirmeiRuleRow = {
  consonantPlusVowel: string;
  uyirmei: string;
  changed: string;
};

export const UYIRMEI_RULE_ROWS: UyirmeiRuleRow[] = [
  {
    consonantPlusVowel: 'க் + அ',
    uyirmei: 'க',
    changed: 'The dot on top of the consonant is removed.',
  },
  {
    consonantPlusVowel: 'க் + ஆ',
    uyirmei: 'கா',
    changed: 'The ◌ா sign is added after the consonant.',
  },
  {
    consonantPlusVowel: 'க் + இ',
    uyirmei: 'கி',
    changed: 'The ◌ி sign is added on top of the consonant.',
  },
  {
    consonantPlusVowel: 'க் + ஈ',
    uyirmei: 'கீ',
    changed: 'The ◌ீ sign is added on top of the consonant.',
  },
  {
    consonantPlusVowel: 'க் + உ',
    uyirmei: 'கு',
    changed:
      'When உ is added with the consonant one of the following will happen: it will curve, have an aerial root, or a seat.',
  },
  {
    consonantPlusVowel: 'க் + ஊ',
    uyirmei: 'கூ',
    changed:
      'When ஊ is added one of the following will happen: accession, curled curve, legged seat, or crest.',
  },
  {
    consonantPlusVowel: 'க் + எ',
    uyirmei: 'கெ',
    changed: 'The ெ◌ sign is added in front of the consonant.',
  },
  {
    consonantPlusVowel: 'க் + ஏ',
    uyirmei: 'கே',
    changed: 'The ே◌ sign is added in front of the consonant.',
  },
  {
    consonantPlusVowel: 'க் + ஐ',
    uyirmei: 'கை',
    changed: 'The ை◌ sign is added in front of the consonant.',
  },
  {
    consonantPlusVowel: 'க் + ஒ',
    uyirmei: 'கொ',
    changed: 'The ெ◌ா signs are added in front of and behind the consonant.',
  },
  {
    consonantPlusVowel: 'க் + ஓ',
    uyirmei: 'கோ',
    changed: 'The ே◌ா signs are added in front of and behind the consonant.',
  },
  {
    consonantPlusVowel: 'க் + ஔ',
    uyirmei: 'கௌ',
    changed: 'The ெ◌ௗ signs are added in front of and behind the consonant.',
  },
];

export const UYIRMEI_SHORT_U_EXAMPLES = 'கு, ஙு, சு, ஞு, டு, ணு, து, நு, பு, மு, யு, ரு, லு, வு, ழு, ளு, று, னு';
export const UYIRMEI_LONG_U_EXAMPLES = 'கூ, ஙூ, சூ, ஞூ, டூ, ணூ, தூ, நூ, பூ, மூ, யூ, ரூ, லூ, வூ, ழூ, ளூ, றூ, னூ';

export const UYIRMEI_VOWEL_HEADER = ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ'];
export const UYIRMEI_SUFFIXES = ['', 'ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ'];

export type ConsonantPronunciationRow = {
  consonant: string;
  group: string;
  pronunciationHelp: string;
};

export const LEARNTAMIL_CONSONANT_LETTERS = CONSONANTS.map((letter) => letter.tamil);

export const CONSONANT_PRONUNCIATION_ROWS: ConsonantPronunciationRow[] = [
  { consonant: 'க்', group: 'vallinam', pronunciationHelp: 'k as in king' },
  { consonant: 'ங்', group: 'mellinam', pronunciationHelp: 'ng as in king' },
  { consonant: 'ச்', group: 'vallinam', pronunciationHelp: 'ch as in match' },
  { consonant: 'ஞ்', group: 'mellinam', pronunciationHelp: 'ng as in plunge' },
  { consonant: 'ட்', group: 'vallinam', pronunciationHelp: 't as in top' },
  { consonant: 'ண்', group: 'mellinam', pronunciationHelp: 'n as in cinder' },
  { consonant: 'த்', group: 'vallinam', pronunciationHelp: 'th as in bath' },
  { consonant: 'ந்', group: 'mellinam', pronunciationHelp: 'n as in pan' },
  { consonant: 'ப்', group: 'vallinam', pronunciationHelp: 'p as in puck' },
  { consonant: 'ம்', group: 'mellinam', pronunciationHelp: 'm as in from' },
  { consonant: 'ய்', group: 'idaiyinam', pronunciationHelp: 'y as in yak' },
  { consonant: 'ர்', group: 'idaiyinam', pronunciationHelp: 'r as in fur' },
  { consonant: 'ல்', group: 'idaiyinam', pronunciationHelp: 'l as in lump' },
  { consonant: 'வ்', group: 'idaiyinam', pronunciationHelp: 'v as in vice' },
  { consonant: 'ழ்', group: 'idaiyinam', pronunciationHelp: 'tongue retracted to produce "zh"' },
  { consonant: 'ள்', group: 'idaiyinam', pronunciationHelp: 'l as in marble' },
  { consonant: 'ற்', group: 'vallinam', pronunciationHelp: 'tr as in trick' },
  { consonant: 'ன்', group: 'mellinam', pronunciationHelp: 'n as in fin' },
];

export type TamilWordRow = {
  tamil: string;
  meaning: string;
};

export type PronunciationExampleGroup = {
  title: string;
  examples: TamilWordRow[];
};

export const READING_SINGLE_LETTER_WORDS: TamilWordRow[] = [
  { tamil: 'வா', meaning: 'Come' },
  { tamil: 'நீ', meaning: 'You' },
  { tamil: 'ஈ', meaning: 'Fly (insect)' },
  { tamil: 'தா', meaning: 'Give' },
  { tamil: 'தை', meaning: 'Tamil month (Jan-Feb)' },
  { tamil: 'வை', meaning: 'Keep' },
  { tamil: 'போ', meaning: 'Go' },
  { tamil: 'தீ', meaning: 'Fire' },
  { tamil: 'பூ', meaning: 'Flower' },
  { tamil: 'கை', meaning: 'Hand' },
];

export const READING_TWO_LETTER_WORDS: TamilWordRow[] = [
  { tamil: 'அது', meaning: 'That' },
  { tamil: 'இது', meaning: 'This' },
  { tamil: 'எது', meaning: 'Which' },
  { tamil: 'ஊது', meaning: 'Blow' },
  { tamil: 'காது', meaning: 'Ear' },
  { tamil: 'பல்', meaning: 'Teeth' },
  { tamil: 'பால்', meaning: 'Milk' },
  { tamil: 'கல்', meaning: 'Stone' },
  { tamil: 'கால்', meaning: 'Leg' },
  { tamil: 'காடு', meaning: 'Forest' },
  { tamil: 'மாடு', meaning: 'Cow' },
  { tamil: 'படு', meaning: 'Lie down' },
  { tamil: 'பாடு', meaning: 'Sing' },
  { tamil: 'கண்', meaning: 'Eye' },
  { tamil: 'என்', meaning: 'My' },
  { tamil: 'எண்', meaning: 'Number' },
  { tamil: 'ஓடு', meaning: 'Run' },
  { tamil: 'ஓது', meaning: 'Recite' },
  { tamil: 'வால்', meaning: 'Tail' },
  { tamil: 'வாள்', meaning: 'Sword' },
  { tamil: 'வாழ்', meaning: 'Live' },
];

export const READING_THREE_LETTER_WORDS: TamilWordRow[] = [
  { tamil: 'பல்லி', meaning: 'Lizard' },
  { tamil: 'பள்ளி', meaning: 'School' },
  { tamil: 'கல்வி', meaning: 'Education' },
  { tamil: 'பாடம்', meaning: 'Lesson' },
  { tamil: 'படம்', meaning: 'Picture' },
  { tamil: 'அம்மா', meaning: 'Mother' },
  { tamil: 'அப்பா', meaning: 'Father' },
  { tamil: 'கிழமை', meaning: 'Weekday' },
  { tamil: 'மாதம்', meaning: 'Month' },
  { tamil: 'ஆண்டு', meaning: 'Year' },
  { tamil: 'கிழவி', meaning: 'Old lady' },
  { tamil: 'குழவி', meaning: 'Infant (old Tamil)' },
  { tamil: 'நன்றி', meaning: 'Thank you' },
  { tamil: 'காற்று', meaning: 'Wind' },
  { tamil: 'அவன்', meaning: 'He' },
];

export const READING_PRONUNCIATION_RULES = [
  'க is pronounced as gh when it is between vowels and after ய் and ர்.',
  'ச is pronounced as ja after nasal consonants.',
  'ட is pronounced as da after nasal consonants and between vowels.',
  'த is pronounced as dh after nasal consonants and between vowels.',
  'ப is pronounced as ba after nasal consonants and between vowels.',
];

export const READING_PRONUNCIATION_EXAMPLE_GROUPS: PronunciationExampleGroup[] = [
  {
    title: 'க pronounced as gh between vowels and after ர் / ய்',
    examples: [
      { tamil: 'பகல் (paghal)', meaning: 'day' },
      { tamil: 'மகன் (maghan)', meaning: 'son' },
      { tamil: 'மகள் (maghal)', meaning: 'daughter' },
      { tamil: 'ஊர்கள் (urghal)', meaning: 'towns' },
      { tamil: 'நாய்கள் (naai-ghal)', meaning: 'dogs' },
    ],
  },
  {
    title: 'க pronounced as k in initial position and clusters',
    examples: [
      { tamil: 'கப்பல் (kappal)', meaning: 'ship' },
      { tamil: 'கடல் (kadal)', meaning: 'ocean' },
      { tamil: 'பக்கம் (pakkam)', meaning: 'side' },
      { tamil: 'தூக்கம் (tuukkam)', meaning: 'sleep' },
    ],
  },
  {
    title: 'ச pronounced as j after nasal consonants',
    examples: [
      { tamil: 'பஞ்சு (anjcu)', meaning: 'cotton' },
      { tamil: 'நஞ்சு (nanjcu)', meaning: 'poison' },
      { tamil: 'அஞ்சு (anjcu)', meaning: 'fear' },
    ],
  },
  {
    title: 'ச pronounced as sa between vowels (and optionally initial)',
    examples: [
      { tamil: 'தோசை (toosai)', meaning: 'dosa' },
      { tamil: 'ஆசை (aasai)', meaning: 'desire' },
      { tamil: 'மாசம் (maasam)', meaning: 'month' },
      { tamil: 'சனி (sani)', meaning: 'Saturday' },
      { tamil: 'செவ்வாய் (cevvaay)', meaning: 'Tuesday' },
    ],
  },
  {
    title: 'ச pronounced as ch in initial position and clusters',
    examples: [
      { tamil: 'சக்கரம் (cakkaram)', meaning: 'wheel' },
      { tamil: 'பச்சை (paccai)', meaning: 'green' },
      { tamil: 'எச்சில் (eccil)', meaning: 'saliva' },
    ],
  },
  {
    title: 'ட pronounced as da after nasal consonants and between vowels',
    examples: [
      { tamil: 'துண்டு (tuNdu)', meaning: 'towel' },
      { tamil: 'கரண்டி (karaNDi)', meaning: 'spoon' },
      { tamil: 'நண்டு (naNdu)', meaning: 'crab' },
      { tamil: 'படம் (paDam)', meaning: 'picture' },
      { tamil: 'ஓடம் (ooDam)', meaning: 'boat' },
      { tamil: 'நாடு (naaDu)', meaning: 'country' },
    ],
  },
  {
    title: 'ட pronounced as ta in initial position and clusters',
    examples: [
      { tamil: 'டமாரம் (Tamaaram)', meaning: 'a drum' },
      { tamil: 'டீ (Tii)', meaning: 'tea' },
      { tamil: 'டைம் (Taim)', meaning: 'time' },
      { tamil: 'பட்டு (paTTu)', meaning: 'silk' },
      { tamil: 'பூட்டு (puuTTu)', meaning: 'lock' },
      { tamil: 'காட்டு (kaaTTu)', meaning: 'show' },
    ],
  },
  {
    title: 'த pronounced as dh after nasal consonants and between vowels',
    examples: [
      { tamil: 'பந்து (pandu)', meaning: 'ball' },
      { tamil: 'இந்த (inda)', meaning: 'this (adjective)' },
      { tamil: 'அந்த (anda)', meaning: 'that (adjective)' },
      { tamil: 'அது (adu)', meaning: 'that' },
      { tamil: 'பாதை (paadai)', meaning: 'route/way' },
      { tamil: 'மோது (moodu)', meaning: 'dash/strike' },
    ],
  },
  {
    title: 'த pronounced as th in initial position and clusters',
    examples: [
      { tamil: 'தமிழ் (tamizh)', meaning: 'Tamil' },
      { tamil: 'தண்ணீர் (taNNiir)', meaning: 'water' },
      { tamil: 'திங்கள் (tingaL)', meaning: 'Monday' },
      { tamil: 'பத்து (pattu)', meaning: 'ten' },
      { tamil: 'கத்து (kattu)', meaning: 'scream' },
      { tamil: 'எழுத்து (ezhuttu)', meaning: 'letter/script' },
    ],
  },
  {
    title: 'ப pronounced as ba after nasal consonants and between vowels',
    examples: [
      { tamil: 'தம்பி (tambi)', meaning: 'younger brother' },
      { tamil: 'திரும்பு (tirumbu)', meaning: 'turn' },
      { tamil: 'எண்பது (eNbadu)', meaning: 'eighty' },
      { tamil: 'கோபம் (koobam)', meaning: 'anger' },
      { tamil: 'அபாயம் (abaayam)', meaning: 'danger' },
      { tamil: 'சாபம் (caabam)', meaning: 'curse' },
    ],
  },
  {
    title: 'ப pronounced as pa in initial position and clusters',
    examples: [
      { tamil: 'படி (paDi)', meaning: 'study' },
      { tamil: 'பழம் (pazham)', meaning: 'fruit' },
      { tamil: 'பணம் (paNam)', meaning: 'money' },
      { tamil: 'அப்பா (appaa)', meaning: 'father' },
      { tamil: 'தப்பு (tappu)', meaning: 'mistake' },
      { tamil: 'துப்பு (tuppu)', meaning: 'spit' },
    ],
  },
];

export const PRONUNCIATION_GROUP_DESCRIPTIONS: Record<string, string> = {
  'க pronounced as gh between vowels and after ர் / ய்': 'Examples where க takes a softer gh sound when it appears between vowels or after ர் and ய்.',
  'க pronounced as k in initial position and clusters': 'Examples where க stays a hard k sound at the beginning of words and in consonant clusters.',
  'ச pronounced as j after nasal consonants': 'Examples where ச shifts to a j-like sound after nasal consonants.',
  'ச pronounced as sa between vowels (and optionally initial)': 'Examples showing the sa-like pronunciation of ச between vowels and sometimes in word-initial position.',
  'ச pronounced as ch in initial position and clusters': 'Examples where ச is pronounced as ch at the beginning of words and in clusters.',
  'ட pronounced as da after nasal consonants and between vowels': 'Examples where ட softens to da after nasal sounds and between vowels.',
  'ட pronounced as ta in initial position and clusters': 'Examples where ட remains a hard ta sound in initial position and clusters.',
  'த pronounced as dh after nasal consonants and between vowels': 'Examples where த becomes dh after nasal consonants and between vowels.',
  'த pronounced as th in initial position and clusters': 'Examples where த keeps a th sound in initial position and clusters.',
  'ப pronounced as ba after nasal consonants and between vowels': 'Examples where ப becomes ba after nasal consonants and between vowels.',
  'ப pronounced as pa in initial position and clusters': 'Examples where ப keeps a pa sound in initial position and consonant clusters.',
};