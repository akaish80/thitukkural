import { useCallback, useMemo, useState } from 'react';
import PageTitle from '../../components/PageTitle';
import './TamilExperienceAssessment.scss';
import { speakText } from '../../components/chatbot/speakText';
import {
  recordActivity,
  saveQuizResult,
  saveTamilEvaluationResult,
  getLatestTamilEvaluation,
  type TamilExperienceLevel,
} from '../../utils/learningStore';

type Skill = 'letters' | 'audio-letters' | 'numbers' | 'vocabulary' | 'reading' | 'image-recognition' | 'word-to-image' | 'correct-word';
type Difficulty = 1 | 2 | 3;
type SpeechLang = 'ta-IN' | 'en-US';

type AssessmentQuestion = {
  id: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skill: Skill;
  difficulty: Difficulty;
  audioText?: string;
  audioLang?: SpeechLang;
  image?: string;
  optionImages?: string[];
};

type AnswerState = 'idle' | 'correct' | 'wrong';

type Attempt = {
  questionId: number;
  prompt: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
  difficulty: Difficulty;
  skill: Skill;
};

const STARTING_HEARTS = 3;

// ── Lesson sections — questions are presented in this order ──────────────
const LESSON_SECTIONS = [
  { skill: 'letters'           as Skill, label: 'Letters',           labelTamil: 'எழுத்துக்கள்',  icon: '🔤', count: 3 },
  { skill: 'audio-letters'     as Skill, label: 'Audio Letters',     labelTamil: 'ஒலி எழுத்து',   icon: '🔊', count: 2 },
  { skill: 'numbers'           as Skill, label: 'Numbers',           labelTamil: 'எண்கள்',        icon: '🔢', count: 2 },
  { skill: 'vocabulary'        as Skill, label: 'Vocabulary',        labelTamil: 'சொல்லகராதி',    icon: '📝', count: 3 },
  { skill: 'reading'           as Skill, label: 'Reading',           labelTamil: 'வாசிப்பு',      icon: '📖', count: 2 },
  { skill: 'image-recognition' as Skill, label: 'Image Recognition', labelTamil: 'படம் அடையாளம்', icon: '🖼️', count: 2 },
  { skill: 'correct-word'      as Skill, label: 'Correct Spelling',   labelTamil: 'சரியான சொல்',    icon: '✍️', count: 3 },
] as const;

const TOTAL_QUESTIONS = LESSON_SECTIONS.reduce((s, l) => s + l.count, 0);

type SessionQuestion = AssessmentQuestion & {
  sectionIdx: number;
  sectionLabel: string;
  sectionIcon: string;
  indexInSection: number;
};

const QUESTION_BANK: AssessmentQuestion[] = [
  { id: 1, prompt: 'Which Tamil letter is "ka"?', options: ['க', 'ங', 'ச', 'த'], correctIndex: 0, explanation: 'The consonant க is pronounced as ka.', skill: 'letters', difficulty: 1 },
  { id: 2, prompt: 'Which option is the Tamil number for 5?', options: ['௫', '௩', '௮', '௨'], correctIndex: 0, explanation: 'Tamil numeral 5 is written as ௫.', skill: 'numbers', difficulty: 1 },
  { id: 3, prompt: 'Select the meaning of "நன்றி".', options: ['Thank you', 'Water', 'Book', 'Food'], correctIndex: 0, explanation: 'நன்றி means thank you.', skill: 'vocabulary', difficulty: 1 },
  { id: 4, prompt: 'Which word means "mother" in Tamil?', options: ['அம்மா', 'அண்ணன்', 'தம்பி', 'அப்பா'], correctIndex: 0, explanation: 'அம்மா means mother.', skill: 'vocabulary', difficulty: 1 },
  { id: 5, prompt: 'Which Tamil letter represents "zha"?', options: ['ழ', 'ல', 'ள', 'ற'], correctIndex: 0, explanation: 'ழ is the unique Tamil zha sound.', skill: 'letters', difficulty: 2 },
  { id: 6, prompt: 'Tamil number 10 is:', options: ['௰', '௲', '௧௦', '௯'], correctIndex: 0, explanation: 'Traditional Tamil numeral 10 is ௰.', skill: 'numbers', difficulty: 2 },
  { id: 7, prompt: 'Choose the correct reading: "தமிழ்"', options: ['tamil', 'thamizh', 'thamila', 'thamilu'], correctIndex: 1, explanation: 'தமிழ் is typically transliterated as thamizh.', skill: 'reading', difficulty: 2 },
  { id: 8, prompt: 'What does "வாழ்க" mean in common usage?', options: ['Live long', 'Sit down', 'Good night', 'Write now'], correctIndex: 0, explanation: 'வாழ்க is used like "may you live long".', skill: 'vocabulary', difficulty: 2 },
  { id: 9, prompt: 'Pick the correct plural form: "மரம்" (tree)', options: ['மரங்கள்', 'மரம்கள்', 'மரன்', 'மரிங்கள்'], correctIndex: 0, explanation: 'மரம் becomes மரங்கள் in plural.', skill: 'reading', difficulty: 3 },
  { id: 10, prompt: 'Which line has proper Tamil word order?', options: ['நான் புத்தகம் வாசிக்கிறேன்', 'வாசிக்கிறேன் நான் புத்தகம்', 'புத்தகம் நான் வாசிக்கிறேன் இல்லை', 'நான் வாசிக்கிறேன் புத்தகம் ஒரு'], correctIndex: 0, explanation: 'The first sentence follows natural Tamil structure.', skill: 'reading', difficulty: 3 },
  { id: 11, prompt: 'Which Tamil numeral is 100?', options: ['௱', '௲', '௰', '௯௯'], correctIndex: 0, explanation: 'Tamil numeral 100 is ௱.', skill: 'numbers', difficulty: 3 },
  { id: 12, prompt: 'Choose the best translation for "I am learning Tamil every day."', options: ['நான் தினமும் தமிழ் கற்கிறேன்', 'நான் தமிழ் நேற்று கற்றேன்', 'தினமும் நான் இல்லை தமிழ்', 'கற்கிறேன் தமிழ் மட்டும் நேற்று'], correctIndex: 0, explanation: 'It correctly represents present continuous daily learning.', skill: 'reading', difficulty: 3 },
  { id: 13, prompt: 'Which letter is a pure vowel (uyir ezhuthu)?', options: ['உ', 'க்', 'ண்', 'த்'], correctIndex: 0, explanation: 'உ is a uyir (vowel) letter.', skill: 'letters', difficulty: 1 },
  { id: 14, prompt: 'Find the odd one out (not a day of week):', options: ['திங்கள்', 'செவ்வாய்', 'ஆறு', 'வெள்ளி'], correctIndex: 2, explanation: 'ஆறு means six, not a weekday.', skill: 'vocabulary', difficulty: 2 },
  { id: 15, prompt: 'Which is the correct form for respectful "you"?', options: ['நீங்கள்', 'நீ', 'நான்', 'அவன்'], correctIndex: 0, explanation: 'நீங்கள் is the respectful second-person form.', skill: 'vocabulary', difficulty: 2 },
  { id: 16, prompt: 'க + ஆ', options: ['கா', 'கி', 'கு', 'க்'], correctIndex: 0, explanation: 'க plus long-aa marker becomes கா.', skill: 'letters', difficulty: 1 },
  // Audio letter mapping (English -> Tamil, Tamil -> English)
  { id: 126, prompt: 'Play audio and choose the matching Tamil letter.', options: ['க', 'ச', 'த', 'ப'], correctIndex: 0, explanation: 'The audio says "ka", which maps to க.', skill: 'audio-letters', difficulty: 1, audioText: 'ka', audioLang: 'en-US' },
  { id: 127, prompt: 'Play audio and choose the matching Tamil letter.', options: ['ங', 'ஞ', 'ந', 'ம'], correctIndex: 0, explanation: 'The audio says "nga", which maps to ங.', skill: 'audio-letters', difficulty: 1, audioText: 'nga', audioLang: 'en-US' },
  { id: 128, prompt: 'Play audio and choose the English transliteration.', options: ['zha', 'la', 'lla', 'ra'], correctIndex: 0, explanation: 'The Tamil letter ழ் is transliterated as zha.', skill: 'audio-letters', difficulty: 2, audioText: 'ழ்', audioLang: 'ta-IN' },
  { id: 129, prompt: 'Play audio and choose the English transliteration.', options: ['ka', 'ga', 'kha', 'ha'], correctIndex: 0, explanation: 'The Tamil letter க் is commonly transliterated as ka.', skill: 'audio-letters', difficulty: 1, audioText: 'க்', audioLang: 'ta-IN' },
  { id: 130, prompt: 'Play audio and choose the English transliteration.', options: ['nna', 'na', 'n', 'nga'], correctIndex: 0, explanation: 'The retroflex letter ண் is transliterated as nna.', skill: 'audio-letters', difficulty: 2, audioText: 'ண்', audioLang: 'ta-IN' },
  { id: 131, prompt: 'Play audio and choose the matching Tamil vowel.', options: ['ஆ', 'அ', 'ஐ', 'ஈ'], correctIndex: 0, explanation: 'The audio says long "aa", which maps to ஆ.', skill: 'audio-letters', difficulty: 1, audioText: 'aa', audioLang: 'en-US' },
  { id: 132, prompt: 'Play audio and choose the matching Tamil letter.', options: ['ற்', 'ர்', 'ல்', 'ழ்'], correctIndex: 0, explanation: 'The audio says "rra", which maps to ற்.', skill: 'audio-letters', difficulty: 3, audioText: 'rra', audioLang: 'en-US' },
  { id: 133, prompt: 'Play audio and choose the matching Tamil letter.', options: ['ஊ', 'உ', 'ஒ', 'ஓ'], correctIndex: 0, explanation: 'The audio says long "oo", which maps to ஊ.', skill: 'audio-letters', difficulty: 2, audioText: 'oo', audioLang: 'en-US' },
  { id: 17, prompt: 'Which sentence is grammatically stronger?', options: ['அவர் நல்ல தமிழ் பேசுகிறார்', 'அவர் பேசுகிறார் தமிழ் நல்ல', 'தமிழ் பேச நல்ல அவர்', 'நல்ல அவர் பேச தமிழ்'], correctIndex: 0, explanation: 'The first sentence has proper word order and verb agreement.', skill: 'reading', difficulty: 3 },
  { id: 18, prompt: 'Tamil numeral for 1000 is:', options: ['௲', '௱', '௰', '௧௦௦'], correctIndex: 0, explanation: 'Tamil numeral 1000 is ௲.', skill: 'numbers', difficulty: 2 },
  { id: 19, prompt: 'What is the Tamil word for this animal?', options: ['பூனை', 'நாய்', 'பறவை', 'மீன்'], correctIndex: 0, explanation: 'பூனை means cat in Tamil.', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/cat.png' },
  { id: 20, prompt: 'What is the Tamil word for this animal?', options: ['நாய்', 'பூனை', 'பறவை', 'மரம்'], correctIndex: 0, explanation: 'நாய் means dog in Tamil.', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/dog.png' },
  { id: 21, prompt: 'What is the Tamil word for this object?', options: ['சூரியன்', 'நிலா', 'நட்சத்திரம்', 'மழை'], correctIndex: 0, explanation: 'சூரியன் means sun in Tamil.', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/sun.png' },
  { id: 22, prompt: 'What is the Tamil word for this object?', options: ['மரம்', 'மலை', 'கடல்', 'வீடு'], correctIndex: 0, explanation: 'மரம் means tree in Tamil.', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/tree.png' },
  { id: 23, prompt: 'What is the Tamil word for this object?', options: ['புத்தகம்', 'நாற்காலி', 'மேசை', 'பேனா'], correctIndex: 0, explanation: 'புத்தகம் means book in Tamil.', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/book.png' },
  { id: 24, prompt: 'What is the Tamil word for this animal?', options: ['மீன்', 'நாய்', 'பறவை', 'பூனை'], correctIndex: 0, explanation: 'மீன் means fish in Tamil.', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/fish.png' },
  { id: 25, prompt: 'What is the Tamil word for this natural object?', options: ['நிலா', 'சூரியன்', 'நட்சத்திரம்', 'மழை'], correctIndex: 0, explanation: 'நிலா means moon in Tamil.', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/moon.png' },
  { id: 26, prompt: 'What is the Tamil word for this object?', options: ['வீடு', 'பள்ளி', 'மரம்', 'கடல்'], correctIndex: 0, explanation: 'வீடு means house in Tamil.', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/house.png' },
  { id: 27, prompt: 'Identify the Tamil vowel shown in the image.', options: ['அ', 'ஆ', 'இ', 'உ'], correctIndex: 0, explanation: 'அ is the first Tamil vowel, pronounced as "a".', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/vowel-a.png' },
  { id: 28, prompt: 'Identify the Tamil vowel shown in the image.', options: ['ஆ', 'அ', 'இ', 'உ'], correctIndex: 0, explanation: 'ஆ is the second Tamil vowel, a longer "aa" sound.', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/vowel-aa.png' },
  { id: 29, prompt: 'Identify the Tamil vowel shown in the image.', options: ['இ', 'அ', 'ஆ', 'உ'], correctIndex: 0, explanation: 'இ is the Tamil vowel pronounced as "i".', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/vowel-i.png' },
  { id: 30, prompt: 'Identify the Tamil vowel shown in the image.', options: ['உ', 'அ', 'ஆ', 'இ'], correctIndex: 0, explanation: 'உ is the Tamil vowel pronounced as "u".', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/vowel-u.png' },
  { id: 31, prompt: 'What is the Tamil word for this natural phenomenon?', options: ['மழை', 'சூரியன்', 'நிலா', 'நட்சத்திரம்'], correctIndex: 0, explanation: 'மழை means rain in Tamil.', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/rain.png' },
  { id: 32, prompt: 'What is the Tamil word for this natural feature?', options: ['மலை', 'கடல்', 'மரம்', 'வீடு'], correctIndex: 0, explanation: 'மலை means mountain in Tamil.', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/mountain.png' },
  { id: 33, prompt: 'What is the Tamil word for this natural feature?', options: ['கடல்', 'மலை', 'ஆறு', 'ஏரி'], correctIndex: 0, explanation: 'கடல் means sea in Tamil.', skill: 'image-recognition', difficulty: 3, image: '/learning-images/png/sea.png' },
  { id: 34, prompt: 'Identify the Tamil vowel shown in the image.', options: ['ஐ', 'இ', 'ஈ', 'ஏ'], correctIndex: 0, explanation: 'ஐ is the Tamil vowel pronounced as "ai".', skill: 'image-recognition', difficulty: 3, image: '/learning-images/png/vowel-ai.png' },
  { id: 35, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['க்', 'ச்', 'த்', 'ப்'], correctIndex: 0, explanation: 'கொக்கு (stork) contains the consonant க் (ka).', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/consonant-ka.png' },
  { id: 36, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['ப்', 'ம்', 'வ்', 'ந்'], correctIndex: 0, explanation: 'கப்பல் (ship) contains the consonant ப் (pa).', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/consonant-pa.png' },
  { id: 37, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['ம்', 'ய்', 'ந்', 'த்'], correctIndex: 0, explanation: 'மரம் (tree) contains the consonant ம் (ma).', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/consonant-ma.png' },
  { id: 38, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['ய்', 'ர்', 'வ்', 'ல்'], correctIndex: 0, explanation: 'நாய் (dog) ends with the consonant ய் (ya).', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/consonant-ya.png' },
  { id: 39, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['த்', 'ந்', 'ட்', 'வ்'], correctIndex: 0, explanation: 'நத்தை (snail) contains the consonant த் (tha).', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/consonant-tha.png' },
  { id: 40, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['ந்', 'த்', 'ட்', 'ண்'], correctIndex: 0, explanation: 'ஆந்தை (owl) contains the consonant ந் (na).', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/consonant-na.png' },
  { id: 41, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['ர்', 'ல்', 'வ்', 'ந்'], correctIndex: 0, explanation: 'வேர் (root) ends with the consonant ர் (ra).', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/consonant-ra.png' },
  { id: 42, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['ல்', 'ர்', 'ழ்', 'ள்'], correctIndex: 0, explanation: 'பால் (milk) ends with the consonant ல் (la).', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/consonant-la.png' },
  { id: 43, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['வ்', 'ப்', 'ய்', 'ல்'], correctIndex: 0, explanation: 'செவ்வாய் (Mars) contains the consonant வ் (va).', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/consonant-va.png' },
  { id: 44, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['ச்', 'க்', 'த்', 'ப்'], correctIndex: 0, explanation: 'பச்சை (green) contains the consonant ச் (sa/cha).', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/consonant-sa.png' },
  { id: 45, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['ட்', 'த்', 'ந்', 'ண்'], correctIndex: 0, explanation: 'பட்டம் (kite) contains the consonant ட் (ta).', skill: 'image-recognition', difficulty: 3, image: '/learning-images/png/consonant-ta.png' },
  { id: 46, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['ஞ்', 'ந்', 'ண்', 'ன்'], correctIndex: 0, explanation: 'இஞ்சி (ginger) contains the consonant ஞ் (gna/nya).', skill: 'image-recognition', difficulty: 3, image: '/learning-images/png/consonant-gna.png' },
  { id: 47, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['ங்', 'க்', 'ஞ்', 'ண்'], correctIndex: 0, explanation: 'சிங்கம் (lion) contains the consonant ங் (nga).', skill: 'image-recognition', difficulty: 3, image: '/learning-images/png/consonant-nga.png' },
  { id: 48, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['ண்', 'ந்', 'ன்', 'ஞ்'], correctIndex: 0, explanation: 'நண்டு (crab) contains the consonant ண் (nna – retroflex na).', skill: 'image-recognition', difficulty: 3, image: '/learning-images/png/consonant-nna.png' },
  { id: 49, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['ழ்', 'ள்', 'ல்', 'ற்'], correctIndex: 0, explanation: 'யாழ் (veena) ends with the consonant ழ் (zha) — unique to Tamil.', skill: 'image-recognition', difficulty: 3, image: '/learning-images/png/consonant-zha.png' },
  { id: 50, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['ள்', 'ழ்', 'ல்', 'ற்'], correctIndex: 0, explanation: 'வாள் (sword) ends with the consonant ள் (lla – retroflex la).', skill: 'image-recognition', difficulty: 3, image: '/learning-images/png/consonant-lla.png' },
  { id: 51, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['ற்', 'ர்', 'ள்', 'ழ்'], correctIndex: 0, explanation: 'பற்கள் (teeth) contains the consonant ற் (rra).', skill: 'image-recognition', difficulty: 3, image: '/learning-images/png/consonant-rra.png' },
  { id: 52, prompt: 'Which Tamil consonant (மெய்) does this image represent?', options: ['ன்', 'ண்', 'ந்', 'ஞ்'], correctIndex: 0, explanation: 'மீன் (fish) ends with the consonant ன் (nna2 – alveolar na).', skill: 'image-recognition', difficulty: 3, image: '/learning-images/png/consonant-nna2.png' },
  { id: 53, prompt: 'What is the Tamil word for this animal?', options: ['பறவை', 'நாய்', 'பூனை', 'மீன்'], correctIndex: 0, explanation: 'பறவை means bird in Tamil.', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/bird.png' },
  { id: 54, prompt: 'What is the Tamil word for this object?', options: ['பந்து', 'மேசை', 'நாற்காலி', 'புத்தகம்'], correctIndex: 0, explanation: 'பந்து means ball in Tamil.', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/ball.png' },
  { id: 55, prompt: 'What is the Tamil word for this vehicle?', options: ['கார்', 'பேருந்து', 'சைக்கிள்', 'ரயில்'], correctIndex: 0, explanation: 'கார் means car in Tamil.', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/car.png' },
  { id: 56, prompt: 'What is the Tamil word for this plant?', options: ['பூ', 'மரம்', 'இலை', 'வேர்'], correctIndex: 0, explanation: 'பூ means flower in Tamil.', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/flower.png' },
  { id: 57, prompt: 'What is the Tamil word for this object?', options: ['பை', 'புத்தகம்', 'மேசை', 'கடிகாரம்'], correctIndex: 0, explanation: 'பை means bag in Tamil.', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/bag.png' },
  { id: 58, prompt: 'What is the Tamil word for this furniture?', options: ['நாற்காலி', 'மேசை', 'படுக்கை', 'வீடு'], correctIndex: 0, explanation: 'நாற்காலி means chair in Tamil.', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/chair.png' },
  { id: 59, prompt: 'What is the Tamil word for this furniture?', options: ['மேசை', 'நாற்காலி', 'கட்டில்', 'அலமாரி'], correctIndex: 0, explanation: 'மேசை means table in Tamil.', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/table.png' },
  { id: 60, prompt: 'What is the Tamil word for this object?', options: ['கடிகாரம்', 'தொலைபேசி', 'கணினி', 'தொலைக்காட்சி'], correctIndex: 0, explanation: 'கடிகாரம் means clock in Tamil.', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/clock.png' },
  { id: 61, prompt: 'What is the Tamil word for this vehicle?', options: ['பேருந்து', 'கார்', 'ரயில்', 'சைக்கிள்'], correctIndex: 0, explanation: 'பேருந்து means bus in Tamil.', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/bus.png' },
  { id: 62, prompt: 'What is the Tamil word for this vehicle?', options: ['சைக்கிள்', 'கார்', 'பேருந்து', 'மோட்டார்'], correctIndex: 0, explanation: 'சைக்கிள் means cycle / bicycle in Tamil.', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/cycle.png' },
  { id: 63, prompt: 'What is the Tamil word for this drink?', options: ['பால்', 'தண்ணீர்', 'சாறு', 'தேநீர்'], correctIndex: 0, explanation: 'பால் means milk in Tamil.', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/milk.png' },
  { id: 64, prompt: 'What is the Tamil word for this liquid?', options: ['தண்ணீர்', 'பால்', 'சாறு', 'தேநீர்'], correctIndex: 0, explanation: 'தண்ணீர் means water in Tamil.', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/water.png' },
  { id: 65, prompt: 'What is the Tamil word for this?', options: ['உணவு', 'பழம்', 'காய்கறி', 'பால்'], correctIndex: 0, explanation: 'உணவு means food in Tamil.', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/food.png' },
  { id: 66, prompt: 'What is the Tamil word for this?', options: ['பழம்', 'காய்கறி', 'உணவு', 'மரம்'], correctIndex: 0, explanation: 'பழம் means fruit in Tamil.', skill: 'image-recognition', difficulty: 1, image: '/learning-images/png/fruit.png' },
  { id: 67, prompt: 'What is the Tamil word for this celestial object?', options: ['நட்சத்திரம்', 'நிலா', 'சூரியன்', 'மழை'], correctIndex: 0, explanation: 'நட்சத்திரம் means star in Tamil.', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/star.png' },
  { id: 68, prompt: 'What is the Tamil word for this building?', options: ['பள்ளி', 'மருத்துவமனை', 'வீடு', 'கடை'], correctIndex: 0, explanation: 'பள்ளி means school in Tamil.', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/school.png' },
  { id: 69, prompt: 'What is the Tamil word for this building?', options: ['மருத்துவமனை', 'பள்ளி', 'வீடு', 'கடை'], correctIndex: 0, explanation: 'மருத்துவமனை means hospital in Tamil.', skill: 'image-recognition', difficulty: 3, image: '/learning-images/png/hospital.png' },
  { id: 70, prompt: 'What is the Tamil word for this place?', options: ['கடை', 'வீடு', 'பள்ளி', 'மருத்துவமனை'], correctIndex: 0, explanation: 'கடை means shop in Tamil.', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/shop.png' },
  { id: 71, prompt: 'What is the Tamil word for this device?', options: ['தொலைபேசி', 'கடிகாரம்', 'கணினி', 'தொலைக்காட்சி'], correctIndex: 0, explanation: 'தொலைபேசி means telephone / phone in Tamil.', skill: 'image-recognition', difficulty: 3, image: '/learning-images/png/phone.png' },
  { id: 72, prompt: 'Identify the Tamil vowel shown in the image.', options: ['ஈ', 'இ', 'உ', 'அ'], correctIndex: 0, explanation: 'ஈ is the Tamil long vowel pronounced as "ii".', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/vowel-ii.png' },
  { id: 73, prompt: 'Identify the Tamil vowel shown in the image.', options: ['எ', 'ஏ', 'அ', 'இ'], correctIndex: 0, explanation: 'எ is the Tamil vowel pronounced as a short "e" sound.', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/vowel-e.png' },
  { id: 74, prompt: 'Identify the Tamil vowel shown in the image.', options: ['ஏ', 'எ', 'ஐ', 'ஒ'], correctIndex: 0, explanation: 'ஏ is the Tamil vowel pronounced as a long "ee" sound.', skill: 'image-recognition', difficulty: 2, image: '/learning-images/png/vowel-ee.png' },
  { id: 75, prompt: 'Identify the Tamil vowel shown in the image.', options: ['ஒ', 'ஓ', 'ஔ', 'உ'], correctIndex: 0, explanation: 'ஒ is the Tamil vowel pronounced as a short "o" sound.', skill: 'image-recognition', difficulty: 3, image: '/learning-images/png/vowel-o.png' },
  { id: 76, prompt: 'Identify the Tamil vowel shown in the image.', options: ['ஓ', 'ஒ', 'ஔ', 'உ'], correctIndex: 0, explanation: 'ஓ is the Tamil vowel pronounced as a long "oo" sound.', skill: 'image-recognition', difficulty: 3, image: '/learning-images/png/vowel-oo.png' },
  { id: 77, prompt: 'Identify the Tamil vowel shown in the image.', options: ['ஊ', 'உ', 'ஓ', 'ஒ'], correctIndex: 0, explanation: 'ஊ is the Tamil vowel pronounced as a long "uu" sound.', skill: 'image-recognition', difficulty: 3, image: '/learning-images/png/vowel-uu.png' },
  { id: 78, prompt: 'Identify the Tamil vowel shown in the image.', options: ['ஔ', 'ஒ', 'ஓ', 'அ'], correctIndex: 0, explanation: 'ஔ is the Tamil vowel pronounced as "au".', skill: 'image-recognition', difficulty: 3, image: '/learning-images/png/vowel-au.png' },
  // Word → Image questions
  { id: 79, prompt: 'Tap the image that shows "பூனை" (cat)', options: ['பூனை', 'நாய்', 'பறவை', 'மீன்'], correctIndex: 0, explanation: 'பூனை means cat — the fluffy four-legged pet.', skill: 'word-to-image', difficulty: 1, optionImages: ['/learning-images/png/cat.png', '/learning-images/png/dog.png', '/learning-images/png/bird.png', '/learning-images/png/fish.png'] },
  { id: 80, prompt: 'Tap the image that shows "நாய்" (dog)', options: ['நாய்', 'பூனை', 'மீன்', 'பறவை'], correctIndex: 0, explanation: 'நாய் means dog — a loyal domestic animal.', skill: 'word-to-image', difficulty: 1, optionImages: ['/learning-images/png/dog.png', '/learning-images/png/cat.png', '/learning-images/png/fish.png', '/learning-images/png/bird.png'] },
  { id: 81, prompt: 'Tap the image that shows "சூரியன்" (sun)', options: ['சூரியன்', 'நிலா', 'நட்சத்திரம்', 'மழை'], correctIndex: 0, explanation: 'சூரியன் means sun — the star at the centre of our solar system.', skill: 'word-to-image', difficulty: 1, optionImages: ['/learning-images/png/sun.png', '/learning-images/png/moon.png', '/learning-images/png/star.png', '/learning-images/png/rain.png'] },
  { id: 82, prompt: 'Tap the image that shows "மரம்" (tree)', options: ['மரம்', 'மலை', 'கடல்', 'பூ'], correctIndex: 0, explanation: 'மரம் means tree — a tall woody plant.', skill: 'word-to-image', difficulty: 1, optionImages: ['/learning-images/png/tree.png', '/learning-images/png/mountain.png', '/learning-images/png/sea.png', '/learning-images/png/flower.png'] },
  { id: 83, prompt: 'Tap the image that shows "புத்தகம்" (book)', options: ['புத்தகம்', 'பை', 'கடிகாரம்', 'தொலைபேசி'], correctIndex: 0, explanation: 'புத்தகம் means book — used for reading and learning.', skill: 'word-to-image', difficulty: 1, optionImages: ['/learning-images/png/book.png', '/learning-images/png/bag.png', '/learning-images/png/clock.png', '/learning-images/png/phone.png'] },
  { id: 84, prompt: 'Tap the image that shows "பேருந்து" (bus)', options: ['பேருந்து', 'கார்', 'சைக்கிள்', 'பந்து'], correctIndex: 0, explanation: 'பேருந்து means bus — a large public transport vehicle.', skill: 'word-to-image', difficulty: 2, optionImages: ['/learning-images/png/bus.png', '/learning-images/png/car.png', '/learning-images/png/cycle.png', '/learning-images/png/ball.png'] },
  { id: 85, prompt: 'Tap the image that shows "மருத்துவமனை" (hospital)', options: ['மருத்துவமனை', 'பள்ளி', 'வீடு', 'கடை'], correctIndex: 0, explanation: 'மருத்துவமனை means hospital — where patients receive medical care.', skill: 'word-to-image', difficulty: 2, optionImages: ['/learning-images/png/hospital.png', '/learning-images/png/school.png', '/learning-images/png/house.png', '/learning-images/png/shop.png'] },
  { id: 86, prompt: 'Tap the image that shows "பால்" (milk)', options: ['பால்', 'தண்ணீர்', 'உணவு', 'பழம்'], correctIndex: 0, explanation: 'பால் means milk — a white nutritious drink.', skill: 'word-to-image', difficulty: 1, optionImages: ['/learning-images/png/milk.png', '/learning-images/png/water.png', '/learning-images/png/food.png', '/learning-images/png/fruit.png'] },
  { id: 87, prompt: 'Tap the image that shows "நிலா" (moon)', options: ['நிலா', 'சூரியன்', 'நட்சத்திரம்', 'மழை'], correctIndex: 0, explanation: 'நிலா means moon — the natural satellite of Earth.', skill: 'word-to-image', difficulty: 2, optionImages: ['/learning-images/png/moon.png', '/learning-images/png/sun.png', '/learning-images/png/star.png', '/learning-images/png/rain.png'] },
  { id: 88, prompt: 'Tap the image that shows "மேசை" (table)', options: ['மேசை', 'நாற்காலி', 'புத்தகம்', 'பை'], correctIndex: 0, explanation: 'மேசை means table — furniture with a flat surface.', skill: 'word-to-image', difficulty: 2, optionImages: ['/learning-images/png/table.png', '/learning-images/png/chair.png', '/learning-images/png/book.png', '/learning-images/png/bag.png'] },
  { id: 89, prompt: 'Tap the image that shows "பறவை" (bird)', options: ['பறவை', 'பூனை', 'நாய்', 'மீன்'], correctIndex: 0, explanation: 'பறவை means bird — a feathered animal that can fly.', skill: 'word-to-image', difficulty: 1, optionImages: ['/learning-images/png/bird.png', '/learning-images/png/cat.png', '/learning-images/png/dog.png', '/learning-images/png/fish.png'] },
  { id: 90, prompt: 'Tap the image that shows "கடல்" (sea)', options: ['கடல்', 'மலை', 'மரம்', 'மழை'], correctIndex: 0, explanation: 'கடல் means sea — a large body of salt water.', skill: 'word-to-image', difficulty: 2, optionImages: ['/learning-images/png/sea.png', '/learning-images/png/mountain.png', '/learning-images/png/tree.png', '/learning-images/png/rain.png'] },
  { id: 91, prompt: 'Tap the image that shows "பள்ளி" (school)', options: ['பள்ளி', 'மருத்துவமனை', 'கடை', 'வீடு'], correctIndex: 0, explanation: 'பள்ளி means school — where children go to learn.', skill: 'word-to-image', difficulty: 2, optionImages: ['/learning-images/png/school.png', '/learning-images/png/hospital.png', '/learning-images/png/shop.png', '/learning-images/png/house.png'] },
  { id: 92, prompt: 'Tap the image that shows "கடிகாரம்" (clock)', options: ['கடிகாரம்', 'தொலைபேசி', 'புத்தகம்', 'கார்'], correctIndex: 0, explanation: 'கடிகாரம் means clock — a device that shows the time.', skill: 'word-to-image', difficulty: 3, optionImages: ['/learning-images/png/clock.png', '/learning-images/png/phone.png', '/learning-images/png/book.png', '/learning-images/png/car.png'] },
  // ── Correct Spelling — ன/ண/ந, ர/ற, ல/ள/ழ distinctions ──────────────────
  { id: 101, prompt: 'சூரியன் இருக்கும் இடம் என்ன?', options: ['வானம்', 'வாணம்', 'கடல்', 'மலை'], correctIndex: 0, explanation: 'வானம் — ன (னகரம்) உள்ள சொல் சரியானது. வாணம் வேறு பொருள் தரும்.', skill: 'correct-word', difficulty: 1 },
  { id: 102, prompt: 'பார்க்க உதவும் உறுப்பு எது?', options: ['கண்', 'கன்', 'காது', 'மூக்கு'], correctIndex: 0, explanation: 'கண் — ண் (ணகரம்) உள்ள சொல் சரியானது.', skill: 'correct-word', difficulty: 1 },
  { id: 103, prompt: 'மருத்துவ குணம் கொண்ட இனிப்பான திரவம்', options: ['தேன்', 'தேண்', 'பால்', 'நீர்'], correctIndex: 0, explanation: 'தேன் — ன் (னகரம்) உள்ள சொல் சரியானது. Honey.', skill: 'correct-word', difficulty: 1 },
  { id: 104, prompt: 'நுங்கு கிடைக்கும் மரம் எது?', options: ['பனை', 'பணை', 'மாமரம்', 'வேப்பமரம்'], correctIndex: 0, explanation: 'பனை — ன (னகரம்) உள்ள சொல் சரியானது. பனை மரத்தில் நுங்கு கிடைக்கும்.', skill: 'correct-word', difficulty: 1 },
  { id: 105, prompt: 'எதுவும் வாங்குவதற்கு அவசியமானது', options: ['பணம்', 'பனம்', 'தங்கம்', 'வெள்ளி'], correctIndex: 0, explanation: 'பணம் — ண (ணகரம்) உள்ள சொல் சரியானது. Money.', skill: 'correct-word', difficulty: 1 },
  { id: 106, prompt: 'உயரமான இடத்தில் ஏற உதவுவது', options: ['ஏணி', 'ஏனி', 'கயிறு', 'கம்பி'], correctIndex: 0, explanation: 'ஏணி — ண (ணகரம்) உள்ள சொல் சரியானது. Ladder.', skill: 'correct-word', difficulty: 1 },
  { id: 107, prompt: 'சுவரில் அடிக்கப்படும் உலோகத் துண்டு', options: ['ஆணி', 'ஆனி', 'திருகு', 'கம்பி'], correctIndex: 0, explanation: 'ஆணி — ண (ணகரம்) உள்ள சொல் சரியானது. Nail.', skill: 'correct-word', difficulty: 1 },
  { id: 108, prompt: 'மார்கழி மாதத்தில் பெய்வது', options: ['பனி', 'பணி', 'மழை', 'வெயில்'], correctIndex: 0, explanation: 'பனி — ன (னகரம்) உள்ள சொல் சரியானது. பணி என்பது வேலை என்று பொருள்படும்.', skill: 'correct-word', difficulty: 1 },
  { id: 109, prompt: 'கடலில் வாழும் ஓடு உடைய உயிரினம்', options: ['நண்டு', 'நன்டு', 'மீன்', 'ஆமை'], correctIndex: 0, explanation: 'நண்டு — ண் (ணகரம்) உள்ள சொல் சரியானது. Crab.', skill: 'correct-word', difficulty: 2 },
  { id: 110, prompt: 'களைப்பாக இருக்கும் போது குடிப்பது', options: ['தேனீர்', 'தேணீர்', 'பழச்சாறு', 'பால்'], correctIndex: 0, explanation: 'தேனீர் — ன (னகரம்) உள்ள சொல் சரியானது. Tea.', skill: 'correct-word', difficulty: 2 },
  { id: 111, prompt: 'மிகப்பெரிய காட்டு விலங்கு', options: ['யானை', 'யாணை', 'சிங்கம்', 'புலி'], correctIndex: 0, explanation: 'யானை — ன (னகரம்) உள்ள சொல் சரியானது. Elephant.', skill: 'correct-word', difficulty: 1 },
  { id: 112, prompt: 'வேகமாக ஓடும் நாற்கால் விலங்கு', options: ['குதிரை', 'குதிறை', 'யானை', 'ஒட்டகம்'], correctIndex: 0, explanation: 'குதிரை — ர (ரகரம்) உள்ள சொல் சரியானது. Horse.', skill: 'correct-word', difficulty: 2 },
  { id: 113, prompt: 'வாழைப்பழம் விரும்பி சாப்பிடும் விலங்கு', options: ['குரங்கு', 'குறங்கு', 'கரடி', 'ஓநாய்'], correctIndex: 0, explanation: 'குரங்கு — ர (ரகரம்) உள்ள சொல் சரியானது. Monkey.', skill: 'correct-word', difficulty: 2 },
  { id: 114, prompt: 'நிழல் தரும் தாவரம்', options: ['மரம்', 'மறம்', 'புல்', 'செடி'], correctIndex: 0, explanation: 'மரம் — ர (ரகரம்) உள்ள சொல் சரியானது. மறம் என்பது வீரம் என்று பொருள்படும்.', skill: 'correct-word', difficulty: 2 },
  { id: 115, prompt: 'நீரைத் தேக்கி வைக்க கட்டப்பட்டது', options: ['அணை', 'அனை', 'கால்வாய்', 'ஏரி'], correctIndex: 0, explanation: 'அணை — ண (ணகரம்) உள்ள சொல் சரியானது. Dam.', skill: 'correct-word', difficulty: 2 },
  { id: 116, prompt: 'பூமியை வேறொரு சொல்லில் கூறலாம்', options: ['உலகம்', 'உளகம்', 'நிலம்', 'ஆகாயம்'], correctIndex: 0, explanation: 'உலகம் — ல (லகரம்) உள்ள சொல் சரியானது. World.', skill: 'correct-word', difficulty: 2 },
  { id: 117, prompt: 'கருப்பாக இருக்கும், பால் தரும் விலங்கு', options: ['எருமை', 'எறுமை', 'பசு', 'ஆடு'], correctIndex: 0, explanation: 'எருமை — ர (ரகரம்) உள்ள சொல் சரியானது. Buffalo.', skill: 'correct-word', difficulty: 2 },
  { id: 118, prompt: 'குளத்தில் பூக்கும் அழகான பூ', options: ['தாமரை', 'தாமறை', 'மல்லிகை', 'ரோஜா'], correctIndex: 0, explanation: 'தாமரை — ர (ரகரம்) உள்ள சொல் சரியானது. Lotus.', skill: 'correct-word', difficulty: 2 },
  { id: 119, prompt: 'மீன் பிடிப்பவர்', options: ['மீனவர்', 'மீணவர்', 'உழவர்', 'வேட்டையாடுபவர்'], correctIndex: 0, explanation: 'மீனவர் — ன (னகரம்) உள்ள சொல் சரியானது. Fisherman.', skill: 'correct-word', difficulty: 2 },
  { id: 120, prompt: 'நதியில் வேகமாக பாயும் நீர்', options: ['ஆறு', 'ஆரு', 'கடல்', 'ஏரி'], correctIndex: 0, explanation: 'ஆறு — ற (றகரம்) உள்ள சொல் சரியானது. River.', skill: 'correct-word', difficulty: 1 },
  { id: 121, prompt: 'நாட்டை ஆட்சி செய்து காக்கும் தலைவர்', options: ['அரசன்', 'அறசன்', 'மந்திரி', 'படைத்தலைவர்'], correctIndex: 0, explanation: 'அரசன் — ர (ரகரம்) உள்ள சொல் சரியானது. King.', skill: 'correct-word', difficulty: 2 },
  { id: 122, prompt: 'துணி தயாரிக்க பயன்படும் வெண்மையான தாவரம்', options: ['பருத்தி', 'பறுத்தி', 'நெல்', 'கரும்பு'], correctIndex: 0, explanation: 'பருத்தி — ர (ரகரம்) உள்ள சொல் சரியானது. Cotton.', skill: 'correct-word', difficulty: 3 },
  { id: 123, prompt: 'சமையலில் பயன்படும் காய் வகைகள்', options: ['காய்கறி', 'காய்கரி', 'பழம்', 'தானியம்'], correctIndex: 0, explanation: 'காய்கறி — ற (றகரம்) உள்ள சொல் சரியானது. Vegetables.', skill: 'correct-word', difficulty: 2 },
  { id: 124, prompt: 'கூட்டமாக வாழும், கழிவுகளை உண்ணும் விலங்கு', options: ['பன்றி', 'பண்றி', 'எருமை', 'ஆடு'], correctIndex: 0, explanation: 'பன்றி — ன் (னகரம்) உள்ள சொல் சரியானது. Pig.', skill: 'correct-word', difficulty: 2 },
  { id: 125, prompt: 'எறும்பு வாழும் மண்மேடு', options: ['புற்று', 'புரு', 'குகை', 'கூடு'], correctIndex: 0, explanation: 'புற்று — ற் (றகரம்) உள்ள சொல் சரியானது. Anthill.', skill: 'correct-word', difficulty: 3 },
];

function fisherYates(length: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

function shuffleOptions(question: AssessmentQuestion): AssessmentQuestion {
  const correctAnswer = question.options[question.correctIndex];
  const indices = fisherYates(question.options.length);
  const shuffledOptions = indices.map((i) => question.options[i]);
  const shuffledImages = question.optionImages
    ? indices.map((i) => question.optionImages![i])
    : undefined;
  const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
  return {
    ...question,
    options: shuffledOptions,
    correctIndex: newCorrectIndex,
    ...(shuffledImages ? { optionImages: shuffledImages } : {}),
  };
}

function buildSessionQuestions(): SessionQuestion[] {
  const result: SessionQuestion[] = [];
  const usedIds = new Set<number>();

  LESSON_SECTIONS.forEach((section, sectionIdx) => {
    const pool = QUESTION_BANK.filter((q) => q.skill === section.skill && !usedIds.has(q.id));
    const shuffled = fisherYates(pool.length).map((i) => pool[i]);
    const selected = shuffled.slice(0, section.count);
    selected.forEach((q, indexInSection) => {
      usedIds.add(q.id);
      result.push({
        ...shuffleOptions(q),
        sectionIdx,
        sectionLabel: section.label,
        sectionIcon: section.icon,
        indexInSection,
      });
    });
  });

  return result;
}

function computeLevel(accuracy: number): TamilExperienceLevel {
  if (accuracy >= 85) return 'Advanced';
  if (accuracy >= 65) return 'Intermediate';
  if (accuracy >= 40) return 'Beginner';
  return 'Starter';
}

function speakByLang(text: string, lang: SpeechLang) {
  if (!('speechSynthesis' in window)) return;
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
}

const SKILL_LABEL: Record<Skill, string> = {
  letters: 'Letters',
  'audio-letters': 'Audio Letters',
  numbers: 'Numbers',
  vocabulary: 'Vocabulary',
  reading: 'Reading',
  'image-recognition': 'Image Recognition',
  'word-to-image': 'Word to Image',
  'correct-word': 'Correct Spelling',
};

const LEVEL_HINTS: Record<TamilExperienceLevel, string> = {
  Starter: 'Start with Tamil letters and daily 10-minute listening practice.',
  Beginner: 'You have good basics. Build consistency with short reading drills.',
  Intermediate: 'Strong progress. Focus on sentence building and comprehension speed.',
  Advanced: 'Excellent Tamil control. Move to literature and long-form reading.',
};

type SectionTransition = {
  completedLabel: string;
  completedIcon: string;
  nextLabel: string;
  nextIcon: string;
};

const TamilExperienceAssessment = () => {
  const [questions, setQuestions] = useState<SessionQuestion[]>(() => buildSessionQuestions());
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);
  const [hearts, setHearts] = useState(STARTING_HEARTS);
  const [history, setHistory] = useState<Attempt[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [sectionTransition, setSectionTransition] = useState<SectionTransition | null>(null);

  const latestResult = useMemo(() => getLatestTamilEvaluation(), []);
  const currentQuestion = questions[questionIndex] ?? null;

  const playQuestionAudio = useCallback((question: AssessmentQuestion) => {
    if (question.audioText) {
      speakByLang(question.audioText, question.audioLang ?? 'ta-IN');
      return;
    }
    if (question.options[question.correctIndex]) {
      speakText(question.options[question.correctIndex]);
    }
  }, []);

  const beginSession = useCallback(() => {
    setQuestions(buildSessionQuestions());
    setQuestionIndex(0);
    setAnswerState('idle');
    setSelectedIndex(null);
    setCorrectCount(0);
    setXp(0);
    setHearts(STARTING_HEARTS);
    setHistory([]);
    setIsComplete(false);
    setSectionTransition(null);
  }, []);

  const handleSelect = useCallback(
    (index: number) => {
      if (!currentQuestion || answerState !== 'idle') return;
      setSelectedIndex(index);
      setAnswerState(index === currentQuestion.correctIndex ? 'correct' : 'wrong');
    },
    [currentQuestion, answerState],
  );

  const dismissTransition = useCallback(() => setSectionTransition(null), []);

  const handleContinue = useCallback(() => {
    if (!currentQuestion || answerState === 'idle' || selectedIndex === null) return;

    const isCorrect = answerState === 'correct';
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    const nextXp = xp + (isCorrect ? 10 * currentQuestion.difficulty : 0);
    const nextHearts = hearts - (isCorrect ? 0 : 1);
    const nextIndex = questionIndex + 1;

    setHistory((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        prompt: currentQuestion.prompt,
        selected: currentQuestion.options[selectedIndex],
        correct: currentQuestion.options[currentQuestion.correctIndex],
        isCorrect,
        difficulty: currentQuestion.difficulty,
        skill: currentQuestion.skill,
      },
    ]);
    setCorrectCount(nextCorrect);
    setXp(nextXp);
    setHearts(nextHearts);
    setAnswerState('idle');
    setSelectedIndex(null);

    const shouldFinish = nextHearts <= 0 || nextIndex >= questions.length;

    if (shouldFinish) {
      const answered = questionIndex + 1;
      const accuracy = Math.round((nextCorrect / answered) * 100);
      const level = computeLevel(accuracy);
      saveQuizResult({
        date: new Date().toISOString(),
        score: nextCorrect,
        total: answered,
        accuracy,
        type: 'tamil-evaluation',
      });
      saveTamilEvaluationResult({
        date: new Date().toISOString(),
        score: nextCorrect,
        total: answered,
        accuracy,
        xp: nextXp,
        level,
      });
      recordActivity();
      setIsComplete(true);
      return;
    }

    const nextQ = questions[nextIndex];
    if (nextQ.sectionIdx !== currentQuestion.sectionIdx) {
      const completedSection = LESSON_SECTIONS[currentQuestion.sectionIdx];
      const nextSection = LESSON_SECTIONS[nextQ.sectionIdx];
      setSectionTransition({
        completedLabel: completedSection.label,
        completedIcon: completedSection.icon,
        nextLabel: nextSection.label,
        nextIcon: nextSection.icon,
      });
    }

    setQuestionIndex(nextIndex);
  }, [
    answerState,
    correctCount,
    currentQuestion,
    hearts,
    questionIndex,
    questions,
    selectedIndex,
    xp,
  ]);

  if (!currentQuestion && !isComplete) {
    return (
      <div className="duo-eval">
        <div className="duo-eval__loading">Assessment questions are unavailable right now.</div>
      </div>
    );
  }

  if (isComplete) {
    const answered = history.length;
    const accuracy = answered > 0 ? Math.round((correctCount / answered) * 100) : 0;
    const level = computeLevel(accuracy);
    const weakSkills = Object.entries(
      history.reduce<Record<Skill, { total: number; correct: number }>>(
        (acc, item) => {
          if (!acc[item.skill]) acc[item.skill] = { total: 0, correct: 0 };
          acc[item.skill].total += 1;
          if (item.isCorrect) acc[item.skill].correct += 1;
          return acc;
        },
        {
          letters: { total: 0, correct: 0 },
          'audio-letters': { total: 0, correct: 0 },
          numbers: { total: 0, correct: 0 },
          vocabulary: { total: 0, correct: 0 },
          reading: { total: 0, correct: 0 },
          'image-recognition': { total: 0, correct: 0 },
          'word-to-image': { total: 0, correct: 0 },
          'correct-word': { total: 0, correct: 0 },
        },
      ),
    )
      .filter(([, stats]) => stats.total > 0)
      .map(([skill, stats]) => ({
        skill: skill as Skill,
        accuracy: Math.round((stats.correct / stats.total) * 100),
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 2);

    return (
      <div className="duo-eval">
        <div className="duo-eval__result">
          <p className="duo-eval__result-tag">Tamil Experience Evaluation</p>
          <h2 className="duo-eval__result-level">{level}</h2>
          <p className="duo-eval__result-score">
            Score: {correctCount}/{answered} ({accuracy}%)
          </p>
          <p className="duo-eval__result-xp">XP Earned: {xp}</p>
          <p className="duo-eval__result-hint">{LEVEL_HINTS[level]}</p>

          {weakSkills.length > 0 && (
            <div className="duo-eval__weak">
              <h3>Focus Areas</h3>
              <ul>
                {weakSkills.map((item) => (
                  <li key={item.skill}>
                    {SKILL_LABEL[item.skill]}: {item.accuracy}%
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button className="duo-eval__btn duo-eval__btn--primary" onClick={beginSession}>
            Retake Assessment
          </button>

          {latestResult && (
            <p className="duo-eval__last-result">
              Previous best level: {latestResult.level} ({latestResult.accuracy}%)
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Section transition screen ──────────────────────────────────────────────
  if (sectionTransition) {
    return (
      <div className="duo-eval">
        <div className="duo-eval__transition">
          <div className="duo-eval__transition-completed">
            <span className="duo-eval__transition-big-icon">{sectionTransition.completedIcon}</span>
            <span className="duo-eval__transition-check">✓</span>
            <h3>{sectionTransition.completedLabel} complete!</h3>
          </div>
          <div className="duo-eval__transition-next">
            <p className="duo-eval__transition-next-label">Next up</p>
            <div className="duo-eval__transition-next-pill">
              <span>{sectionTransition.nextIcon}</span>
              <span>{sectionTransition.nextLabel}</span>
            </div>
          </div>
          <button type="button" className="duo-eval__btn duo-eval__btn--primary" onClick={dismissTransition}>
            Continue →
          </button>
        </div>
      </div>
    );
  }

  const currentSection = LESSON_SECTIONS[currentQuestion!.sectionIdx];
  const sectionTotal = currentSection.count;
  const sectionDone = currentQuestion!.indexInSection;
  const progress = Math.round((questionIndex / TOTAL_QUESTIONS) * 100);
  // Section segment markers (cumulative question counts at section boundaries)
  const sectionBoundaries = LESSON_SECTIONS.reduce<number[]>((acc, s) => {
    acc.push((acc[acc.length - 1] ?? 0) + s.count);
    return acc;
  }, []).slice(0, -1); // drop the last (100%)

  return (
    <div className="duo-eval">
      <PageTitle
        title="Tamil Skill Assessment"
        description="Find your Tamil level with a 12-question adaptive assessment covering letters, numbers and vocabulary."
        path="/tamil-evaluation"
      />
      <div className="duo-eval__header">
        <div className="duo-eval__progress-track">
          <div className="duo-eval__progress-fill" style={{ width: `${progress}%` }} />
          {sectionBoundaries.map((boundary) => (
            <div
              key={boundary}
              className="duo-eval__progress-marker"
              style={{ left: `${Math.round((boundary / TOTAL_QUESTIONS) * 100)}%` }}
            />
          ))}
        </div>
        <div className="duo-eval__meta">
          <span>Q {questionIndex + 1}/{TOTAL_QUESTIONS}</span>
          <span>XP {xp}</span>
          <span className="duo-eval__hearts">{'❤'.repeat(hearts)}{'♡'.repeat(STARTING_HEARTS - hearts)}</span>
        </div>
      </div>

      <div className="duo-eval__card">
        <div className="duo-eval__section-badge">
          <span className="duo-eval__section-icon">{currentQuestion!.sectionIcon}</span>
          <span className="duo-eval__section-label">{currentQuestion!.sectionLabel}</span>
          <span className="duo-eval__section-progress">{sectionDone + 1}/{sectionTotal}</span>
        </div>
        {currentQuestion?.audioText && (
          <div className="duo-eval__audio-wrap">
            <p className="duo-eval__audio-hint">Listen and choose the correct option</p>
            <button
              type="button"
              className="duo-eval__audio-btn"
              onClick={() => playQuestionAudio(currentQuestion)}
              title="Play audio prompt"
            >
              🔊 Play Audio
            </button>
          </div>
        )}
        {currentQuestion?.image && (
          <div className="duo-eval__image-wrap">
            <img
              src={currentQuestion.image}
              alt="Identify this"
              className="duo-eval__image"
            />
            <button
              type="button"
              className="duo-eval__speak-btn"
              title="Hear the Tamil word"
              onClick={() => playQuestionAudio(currentQuestion)}
            >
              🔊
            </button>
          </div>
        )}
        <h3 className="duo-eval__question">{currentQuestion?.prompt}</h3>
        <ul className={currentQuestion?.optionImages ? 'duo-eval__image-options' : 'duo-eval__options'}>
          {currentQuestion?.options.map((option, idx) => {
            const isCorrect = idx === currentQuestion.correctIndex;
            const isSelected = idx === selectedIndex;
            const stateClass =
              answerState === 'idle'
                ? ''
                : isCorrect
                  ? 'correct'
                  : isSelected
                    ? 'wrong'
                    : 'dimmed';

            if (currentQuestion.optionImages) {
              return (
                <li key={`${currentQuestion.id}-${idx}`}>
                  <button
                    type="button"
                    className={`duo-eval__image-option ${stateClass}`.trim()}
                    onClick={() => handleSelect(idx)}
                    disabled={answerState !== 'idle'}
                  >
                    <img
                      src={currentQuestion.optionImages![idx]}
                      alt={option}
                      className="duo-eval__image-option-img"
                    />
                    <span className="duo-eval__image-option-label">{option}</span>
                  </button>
                </li>
              );
            }

            return (
              <li key={`${currentQuestion.id}-${idx}`}>
                <button
                  type="button"
                  className={`duo-eval__option ${stateClass}`.trim()}
                  onClick={() => handleSelect(idx)}
                  disabled={answerState !== 'idle'}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {answerState !== 'idle' && (
        <div className={`duo-eval__feedback duo-eval__feedback--${answerState}`}>
          <p>
            {answerState === 'correct'
              ? 'Correct answer. Great work!'
              : `Not quite. Correct answer: ${currentQuestion?.options[currentQuestion.correctIndex]}`}
          </p>
          <p className="duo-eval__feedback-explainer">{currentQuestion?.explanation}</p>
          <button type="button" className="duo-eval__btn duo-eval__btn--continue" onClick={handleContinue}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default TamilExperienceAssessment;
