// Centralized localStorage utilities for progress, bookmarks, streaks, and spaced repetition.

const PREFIX = 'thirukurral-';

// ── Generic helpers ──
function getJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setJSON(key: string, value: unknown): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

// ── Progress tracking ──
export interface QuizResult {
  date: string;
  score: number;
  total: number;
  accuracy: number;
  type: string; // e.g. 'quiz', 'fill-in', 'match'
}

export function saveQuizResult(result: QuizResult): void {
  const history = getJSON<QuizResult[]>('quiz-history', []);
  history.push(result);
  // Keep last 100 results
  if (history.length > 100) history.splice(0, history.length - 100);
  setJSON('quiz-history', history);
}

export function getQuizHistory(): QuizResult[] {
  return getJSON<QuizResult[]>('quiz-history', []);
}

export function getProgressStats() {
  const history = getQuizHistory();
  if (history.length === 0) return { totalSessions: 0, avgAccuracy: 0, totalCorrect: 0, totalQuestions: 0 };
  const totalCorrect = history.reduce((s, r) => s + r.score, 0);
  const totalQuestions = history.reduce((s, r) => s + r.total, 0);
  return {
    totalSessions: history.length,
    avgAccuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
    totalCorrect,
    totalQuestions,
  };
}

// ── Bookmarks / Favorites ──
export function getBookmarkedKurrals(): number[] {
  return getJSON<number[]>('bookmarks', []);
}

export function toggleBookmark(kurralId: number): boolean {
  const bookmarks = getBookmarkedKurrals();
  const idx = bookmarks.indexOf(kurralId);
  if (idx >= 0) {
    bookmarks.splice(idx, 1);
    setJSON('bookmarks', bookmarks);
    return false; // removed
  }
  bookmarks.push(kurralId);
  setJSON('bookmarks', bookmarks);
  return true; // added
}

export function isBookmarked(kurralId: number): boolean {
  return getBookmarkedKurrals().includes(kurralId);
}

// ── Streak tracking ──
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalDaysActive: number;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function getStreakData(): StreakData {
  return getJSON<StreakData>('streak', {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    totalDaysActive: 0,
  });
}

export function recordActivity(): StreakData {
  const streak = getStreakData();
  const today = todayStr();
  if (streak.lastActiveDate === today) return streak; // already counted today

  if (streak.lastActiveDate === yesterdayStr()) {
    streak.currentStreak += 1;
  } else if (streak.lastActiveDate !== today) {
    streak.currentStreak = 1;
  }
  streak.lastActiveDate = today;
  streak.totalDaysActive += 1;
  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }
  setJSON('streak', streak);
  return streak;
}

// ── Spaced repetition ──
// Track how many times a kurral was answered wrong; higher = needs more review.
export interface SpacedItem {
  id: number;       // kurral ID
  wrongCount: number;
  rightCount: number;
  lastSeen: string;  // ISO date
}

export function getSpacedItems(): SpacedItem[] {
  return getJSON<SpacedItem[]>('spaced', []);
}

export function recordSpacedResult(kurralId: number, correct: boolean): void {
  const items = getSpacedItems();
  const existing = items.find((i) => i.id === kurralId);
  const today = todayStr();
  if (existing) {
    if (correct) existing.rightCount += 1;
    else existing.wrongCount += 1;
    existing.lastSeen = today;
  } else {
    items.push({
      id: kurralId,
      wrongCount: correct ? 0 : 1,
      rightCount: correct ? 1 : 0,
      lastSeen: today,
    });
  }
  setJSON('spaced', items);
}

// Get IDs that need more practice (sorted by wrong/right ratio, descending)
export function getWeakItems(limit = 20): SpacedItem[] {
  const items = getSpacedItems().filter((i) => i.wrongCount > 0);
  items.sort((a, b) => {
    const ratioA = a.wrongCount / (a.rightCount + 1);
    const ratioB = b.wrongCount / (b.rightCount + 1);
    return ratioB - ratioA;
  });
  return items.slice(0, limit);
}

// ── Daily Kurral ──
// Returns a deterministic kurral index (1-1330) based on the date, so it's the same all day.
export function getDailyKurralIndex(): number {
  const today = todayStr();
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = ((hash << 5) - hash + today.charCodeAt(i)) | 0;
  }
  return (Math.abs(hash) % 1330) + 1;
}

// ── Learning Path ──
export interface LessonProgress {
  lessonId: string;
  completedItems: string[];  // letter/word IDs completed within the lesson
  quizScore: number | null;  // null = not attempted
  quizTotal: number | null;
  completedAt: string | null; // ISO date when fully completed
}

export interface LearningPathData {
  currentStep: number;       // 0-based index into the steps array
  lessons: Record<string, LessonProgress>;
}

export interface ThirtyDayProgressData {
  completedDays: number[];
  dayCompletedAt: Record<string, string>;
  updatedAt: string;
  startedAt: string;
  seenMilestones: number[];
}

export function getLearningPath(): LearningPathData {
  return getJSON<LearningPathData>('learning-path', {
    currentStep: 0,
    lessons: {},
  });
}

export function getLessonProgress(lessonId: string): LessonProgress {
  const path = getLearningPath();
  return path.lessons[lessonId] || {
    lessonId,
    completedItems: [],
    quizScore: null,
    quizTotal: null,
    completedAt: null,
  };
}

export function markItemCompleted(lessonId: string, itemId: string): void {
  const path = getLearningPath();
  if (!path.lessons[lessonId]) {
    path.lessons[lessonId] = { lessonId, completedItems: [], quizScore: null, quizTotal: null, completedAt: null };
  }
  const lesson = path.lessons[lessonId];
  if (!lesson.completedItems.includes(itemId)) {
    lesson.completedItems.push(itemId);
  }
  setJSON('learning-path', path);
}

export function saveLessonQuiz(lessonId: string, score: number, total: number): void {
  const path = getLearningPath();
  if (!path.lessons[lessonId]) {
    path.lessons[lessonId] = { lessonId, completedItems: [], quizScore: null, quizTotal: null, completedAt: null };
  }
  path.lessons[lessonId].quizScore = score;
  path.lessons[lessonId].quizTotal = total;
  setJSON('learning-path', path);
}

export function completeLesson(lessonId: string): void {
  const path = getLearningPath();
  if (!path.lessons[lessonId]) {
    path.lessons[lessonId] = { lessonId, completedItems: [], quizScore: null, quizTotal: null, completedAt: null };
  }
  path.lessons[lessonId].completedAt = todayStr();
  setJSON('learning-path', path);
}

export function advanceStep(step: number): void {
  const path = getLearningPath();
  if (step > path.currentStep) {
    path.currentStep = step;
  }
  setJSON('learning-path', path);
}

export function getThirtyDayProgress(): ThirtyDayProgressData {
  return getJSON<ThirtyDayProgressData>('thirty-day-plan', {
    completedDays: [],
    dayCompletedAt: {},
    updatedAt: '',
    startedAt: '',
    seenMilestones: [],
  });
}

export function isThirtyDayCompleted(day: number): boolean {
  const data = getThirtyDayProgress();
  return data.completedDays.includes(day);
}

export function toggleThirtyDayCompletion(day: number): ThirtyDayProgressData {
  const data = getThirtyDayProgress();
  if (!data.dayCompletedAt) data.dayCompletedAt = {};
  const idx = data.completedDays.indexOf(day);
  if (idx >= 0) {
    data.completedDays.splice(idx, 1);
    delete data.dayCompletedAt[String(day)];
  } else {
    data.completedDays.push(day);
    data.completedDays.sort((a, b) => a - b);
    data.dayCompletedAt[String(day)] = todayStr();
    if (!data.startedAt) {
      data.startedAt = todayStr();
    }
  }
  data.updatedAt = todayStr();
  setJSON('thirty-day-plan', data);
  return data;
}

export function setThirtyDayCompletion(day: number, completed: boolean): ThirtyDayProgressData {
  const data = getThirtyDayProgress();
  if (!data.dayCompletedAt) data.dayCompletedAt = {};
  const exists = data.completedDays.includes(day);

  if (completed && !exists) {
    data.completedDays.push(day);
    data.completedDays.sort((a, b) => a - b);
    data.dayCompletedAt[String(day)] = todayStr();
    if (!data.startedAt) {
      data.startedAt = todayStr();
    }
  }

  if (!completed && exists) {
    data.completedDays = data.completedDays.filter((d) => d !== day);
    delete data.dayCompletedAt[String(day)];
  }

  data.updatedAt = todayStr();
  setJSON('thirty-day-plan', data);
  return data;
}

export function setThirtyDayStartDate(startedAt: string): ThirtyDayProgressData {
  const data = getThirtyDayProgress();
  data.startedAt = startedAt;
  data.updatedAt = todayStr();
  setJSON('thirty-day-plan', data);
  return data;
}

export function getThirtyDayTodayDay(startedAt: string): number | null {
  if (!startedAt) return null;
  const start = new Date(`${startedAt}T00:00:00`);
  if (Number.isNaN(start.getTime())) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  const dayNumber = diffDays + 1;

  if (dayNumber < 1) return 1;
  if (dayNumber > 30) return 30;
  return dayNumber;
}

export function resetThirtyDayProgress(): void {
  setJSON('thirty-day-plan', {
    completedDays: [],
    dayCompletedAt: {},
    updatedAt: todayStr(),
    startedAt: '',
    seenMilestones: [],
  } as ThirtyDayProgressData);
}

const THIRTY_DAY_MILESTONES = [7, 14, 21, 30] as const;

export function consumeThirtyDayMilestone(): number | null {
  const data = getThirtyDayProgress();
  const completed = data.completedDays.length;
  const reached = THIRTY_DAY_MILESTONES.filter((m) => completed >= m);
  if (reached.length === 0) return null;

  const newest = reached[reached.length - 1];
  if (data.seenMilestones.includes(newest)) return null;

  data.seenMilestones.push(newest);
  data.seenMilestones.sort((a, b) => a - b);
  data.updatedAt = todayStr();
  setJSON('thirty-day-plan', data);
  return newest;
}

// ── Badges ──
export interface Badge {
  id: string;
  name: string;
  nameTamil: string;
  description: string;
  icon: string;
  earnedAt: string | null; // ISO date
}

const BADGE_DEFS: Omit<Badge, 'earnedAt'>[] = [
  { id: 'first-lesson', name: 'First Step', nameTamil: 'முதல் அடி', description: 'Complete your first lesson', icon: '🌱' },
  { id: 'uyir-master', name: 'Vowel Master', nameTamil: 'உயிர் மாஸ்டர்', description: 'Complete all Uyir letters', icon: '🔤' },
  { id: 'mei-master', name: 'Consonant Master', nameTamil: 'மெய் மாஸ்டர்', description: 'Complete all Mei letters', icon: '📝' },
  { id: 'uyirmei-master', name: 'Combination Master', nameTamil: 'உயிர்மெய் மாஸ்டர்', description: 'Complete Uyirmei combinations', icon: '🧩' },
  { id: 'word-builder', name: 'Word Builder', nameTamil: 'சொல் கட்டுநர்', description: 'Write your first Tamil words', icon: '✍️' },
  { id: 'reader', name: 'Tamil Reader', nameTamil: 'தமிழ் வாசகர்', description: 'Read Tamil sentences', icon: '📖' },
  { id: 'all-clear', name: 'Path Complete', nameTamil: 'பாதை நிறைவு', description: 'Complete the entire learning path', icon: '🏆' },
  { id: 'streak-3', name: '3-Day Streak', nameTamil: '3 நாள் தொடர்', description: 'Learn for 3 days in a row', icon: '🔥' },
  { id: 'streak-7', name: 'Week Warrior', nameTamil: 'வாரப் போராளி', description: 'Learn for 7 days in a row', icon: '⚡' },
  { id: 'perfect-quiz', name: 'Perfect Score', nameTamil: 'சரியான மதிப்பெண்', description: 'Score 100% on any lesson quiz', icon: '💯' },
];

export function getBadges(): Badge[] {
  const earned = getJSON<Record<string, string>>('badges', {});
  return BADGE_DEFS.map((b) => ({ ...b, earnedAt: earned[b.id] || null }));
}

export function earnBadge(badgeId: string): boolean {
  const earned = getJSON<Record<string, string>>('badges', {});
  if (earned[badgeId]) return false; // already earned
  earned[badgeId] = todayStr();
  setJSON('badges', earned);
  return true; // newly earned
}

export function hasBadge(badgeId: string): boolean {
  const earned = getJSON<Record<string, string>>('badges', {});
  return !!earned[badgeId];
}
