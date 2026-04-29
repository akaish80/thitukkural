import { useCallback, useMemo, useState } from 'react';
import './TamilExperienceAssessment.scss';
import {
  recordActivity,
  saveQuizResult,
  saveTamilEvaluationResult,
  getLatestTamilEvaluation,
  type TamilExperienceLevel,
} from '../../utils/learningStore';

type Skill = 'letters' | 'numbers' | 'vocabulary' | 'reading' | 'image-recognition';
type Difficulty = 1 | 2 | 3;

type AssessmentQuestion = {
  id: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skill: Skill;
  difficulty: Difficulty;
  image?: string;
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

const TOTAL_QUESTIONS = 12;
const STARTING_HEARTS = 3;

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
  { id: 16, prompt: 'Pick the correct compound: க + ா', options: ['கா', 'கி', 'கு', 'க்'], correctIndex: 0, explanation: 'க plus long-aa marker becomes கா.', skill: 'letters', difficulty: 1 },
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
];

function clampDifficulty(value: number): Difficulty {
  if (value <= 1) return 1;
  if (value >= 3) return 3;
  return value as Difficulty;
}

function pickQuestion(usedIds: number[], targetDifficulty: Difficulty): AssessmentQuestion | null {
  const exactPool = QUESTION_BANK.filter(
    (q) => q.difficulty === targetDifficulty && !usedIds.includes(q.id),
  );

  if (exactPool.length > 0) {
    return exactPool[Math.floor(Math.random() * exactPool.length)];
  }

  const fallbackPool = QUESTION_BANK.filter((q) => !usedIds.includes(q.id));
  if (fallbackPool.length === 0) return null;
  return fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
}

function computeLevel(accuracy: number): TamilExperienceLevel {
  if (accuracy >= 85) return 'Advanced';
  if (accuracy >= 65) return 'Intermediate';
  if (accuracy >= 40) return 'Beginner';
  return 'Starter';
}

const SKILL_LABEL: Record<Skill, string> = {
  letters: 'Letters',
  numbers: 'Numbers',
  vocabulary: 'Vocabulary',
  reading: 'Reading',
  'image-recognition': 'Image Recognition',
};

const LEVEL_HINTS: Record<TamilExperienceLevel, string> = {
  Starter: 'Start with Tamil letters and daily 10-minute listening practice.',
  Beginner: 'You have good basics. Build consistency with short reading drills.',
  Intermediate: 'Strong progress. Focus on sentence building and comprehension speed.',
  Advanced: 'Excellent Tamil control. Move to literature and long-form reading.',
};

const TamilExperienceAssessment = () => {
  const [usedIds, setUsedIds] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>(1);
  const [currentQuestion, setCurrentQuestion] = useState<AssessmentQuestion | null>(() =>
    pickQuestion([], 1),
  );
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);
  const [hearts, setHearts] = useState(STARTING_HEARTS);
  const [history, setHistory] = useState<Attempt[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const latestResult = useMemo(() => getLatestTamilEvaluation(), []);

  const beginSession = useCallback(() => {
    const next = pickQuestion([], 1);
    setUsedIds([]);
    setDifficulty(1);
    setCurrentQuestion(next);
    setAnswerState('idle');
    setSelectedIndex(null);
    setAnsweredCount(0);
    setCorrectCount(0);
    setXp(0);
    setHearts(STARTING_HEARTS);
    setHistory([]);
    setIsComplete(false);
  }, []);

  const handleSelect = useCallback(
    (index: number) => {
      if (!currentQuestion || answerState !== 'idle') return;
      setSelectedIndex(index);
      if (index === currentQuestion.correctIndex) {
        setAnswerState('correct');
      } else {
        setAnswerState('wrong');
      }
    },
    [currentQuestion, answerState],
  );

  const handleContinue = useCallback(() => {
    if (!currentQuestion || answerState === 'idle' || selectedIndex === null) return;

    const isCorrect = answerState === 'correct';
    const nextAnswered = answeredCount + 1;
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    const nextXp = xp + (isCorrect ? 10 * currentQuestion.difficulty : 0);
    const nextHearts = hearts - (isCorrect ? 0 : 1);
    const nextDifficulty = clampDifficulty(difficulty + (isCorrect ? 1 : -1));
    const nextUsedIds = [...usedIds, currentQuestion.id];

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

    const shouldFinish = nextAnswered >= TOTAL_QUESTIONS || nextHearts <= 0;

    setAnsweredCount(nextAnswered);
    setCorrectCount(nextCorrect);
    setXp(nextXp);
    setHearts(nextHearts);
    setDifficulty(nextDifficulty);
    setUsedIds(nextUsedIds);

    if (shouldFinish) {
      const accuracy = nextAnswered > 0 ? Math.round((nextCorrect / nextAnswered) * 100) : 0;
      const level = computeLevel(accuracy);

      saveQuizResult({
        date: new Date().toISOString(),
        score: nextCorrect,
        total: nextAnswered,
        accuracy,
        type: 'tamil-evaluation',
      });

      saveTamilEvaluationResult({
        date: new Date().toISOString(),
        score: nextCorrect,
        total: nextAnswered,
        accuracy,
        xp: nextXp,
        level,
      });
      recordActivity();
      setIsComplete(true);
      setAnswerState('idle');
      return;
    }

    const nextQuestion = pickQuestion(nextUsedIds, nextDifficulty);
    setCurrentQuestion(nextQuestion);
    setSelectedIndex(null);
    setAnswerState('idle');
  }, [
    answerState,
    answeredCount,
    correctCount,
    currentQuestion,
    difficulty,
    hearts,
    selectedIndex,
    usedIds,
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
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    const level = computeLevel(accuracy);
    const weakSkills = Object.entries(
      history.reduce<Record<Skill, { total: number; correct: number }>>(
        (acc, item) => {
          if (!acc[item.skill]) {
            acc[item.skill] = { total: 0, correct: 0 };
          }
          acc[item.skill].total += 1;
          if (item.isCorrect) {
            acc[item.skill].correct += 1;
          }
          return acc;
        },
        {
          letters: { total: 0, correct: 0 },
          numbers: { total: 0, correct: 0 },
          vocabulary: { total: 0, correct: 0 },
          reading: { total: 0, correct: 0 },
          'image-recognition': { total: 0, correct: 0 },
        },
      ),
    )
      .map(([skill, stats]) => ({
        skill: skill as Skill,
        accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 2);

    return (
      <div className="duo-eval">
        <div className="duo-eval__result">
          <p className="duo-eval__result-tag">Tamil Experience Evaluation</p>
          <h2 className="duo-eval__result-level">{level}</h2>
          <p className="duo-eval__result-score">
            Score: {correctCount}/{answeredCount} ({accuracy}%)
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

  const progress = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  return (
    <div className="duo-eval">
      <div className="duo-eval__header">
        <div className="duo-eval__progress-track">
          <div className="duo-eval__progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="duo-eval__meta">
          <span>Q {answeredCount + 1}/{TOTAL_QUESTIONS}</span>
          <span>XP {xp}</span>
          <span className="duo-eval__hearts">{'❤'.repeat(hearts)}{'♡'.repeat(STARTING_HEARTS - hearts)}</span>
        </div>
      </div>

      <div className="duo-eval__card">
        <p className="duo-eval__difficulty">Difficulty {currentQuestion?.difficulty}</p>
        {currentQuestion?.image && (
          <div className="duo-eval__image-wrap">
            <img
              src={currentQuestion.image}
              alt="Identify this"
              className="duo-eval__image"
            />
          </div>
        )}
        <h3 className="duo-eval__question">{currentQuestion?.prompt}</h3>
        <ul className="duo-eval__options">
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
