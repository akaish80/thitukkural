import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getLessonProgress,
  getThirtyDayProgress,
  toggleThirtyDayCompletion,
  resetThirtyDayProgress,
  setThirtyDayCompletion,
  consumeThirtyDayMilestone,
  setThirtyDayStartDate,
  getThirtyDayTodayDay,
} from '../../utils/learningStore';
import { LEARNING_STEPS, THIRTY_DAY_PLAN } from './learningPathData';
import './learningpath.styles.scss';

function parseIsoDate(isoDate: string): Date | null {
  if (!isoDate) return null;
  const d = new Date(`${isoDate}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const PlannerPage = () => {
  const [planRefresh, setPlanRefresh] = useState(0);
  const [showCompletedDays, setShowCompletedDays] = useState(true);
  const [milestoneDay, setMilestoneDay] = useState<number | null>(null);
  const [challengeDate, setChallengeDate] = useState(new Date().toISOString().slice(0, 10));
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true, 4: true, 5: true });

  const planWeeks = useMemo(
    () => Array.from({ length: 5 }, (_, i) => ({
      week: i + 1,
      days: THIRTY_DAY_PLAN.filter((item) => item.week === i + 1),
    })),
    []
  );

  const stepMap = useMemo(
    () => new Map(LEARNING_STEPS.map((step) => [step.id, `Step ${step.stepNumber}`])),
    []
  );

  const stepDoneMap = useMemo(
    () => new Map(LEARNING_STEPS.map((step) => {
      const allDone = step.lessons.every((lesson) => !!getLessonProgress(lesson.id).completedAt);
      return [step.id, allDone] as const;
    })),
    [planRefresh]
  );

  const planProgress = useMemo(() => getThirtyDayProgress(), [planRefresh]);
  const completedSet = useMemo(() => new Set(planProgress.completedDays), [planProgress.completedDays]);
  const planPct = Math.round((planProgress.completedDays.length / THIRTY_DAY_PLAN.length) * 100);
  const nextOpenDay = THIRTY_DAY_PLAN.find((item) => !completedSet.has(item.day));
  const calendarDay = useMemo(() => getThirtyDayTodayDay(planProgress.startedAt), [planProgress.startedAt]);

  const calendarDayItem = useMemo(
    () => (calendarDay ? THIRTY_DAY_PLAN.find((item) => item.day === calendarDay) || null : null),
    [calendarDay]
  );

  const activeDayItem = useMemo(
    () => (calendarDayItem && !completedSet.has(calendarDayItem.day) ? calendarDayItem : nextOpenDay || null),
    [calendarDayItem, nextOpenDay, completedSet]
  );

  const plannedFinishDate = useMemo(() => {
    if (!planProgress.startedAt) return null;
    const start = new Date(planProgress.startedAt);
    if (Number.isNaN(start.getTime())) return null;
    start.setDate(start.getDate() + 29);
    return start;
  }, [planProgress.startedAt]);

  const weekStats = useMemo(
    () => planWeeks.map((pw) => {
      const done = pw.days.filter((d) => completedSet.has(d.day)).length;
      return {
        week: pw.week,
        done,
        total: pw.days.length,
        pct: pw.days.length > 0 ? Math.round((done / pw.days.length) * 100) : 0,
      };
    }),
    [planWeeks, completedSet]
  );

  const analytics = useMemo(() => {
    const completionDates = Object.values(planProgress.dayCompletedAt || {}).map(parseIsoDate).filter((d): d is Date => !!d);
    const today = new Date();
    const thisWeekStart = startOfWeek(today);
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const thisWeekDone = completionDates.filter((d) => d >= thisWeekStart).length;
    const lastWeekDone = completionDates.filter((d) => d >= lastWeekStart && d < thisWeekStart).length;
    const weekDelta = thisWeekDone - lastWeekDone;

    const elapsedDays = calendarDay || planProgress.completedDays.length;
    const expectedByNow = Math.max(1, elapsedDays);
    const completedByNow = planProgress.completedDays.filter((d) => d <= expectedByNow).length;
    const paceScore = Math.min(1, completedByNow / expectedByNow);
    const weeklyRhythm = Math.min(1, thisWeekDone / 3);
    const consistencyScore = Math.round((paceScore * 70 + weeklyRhythm * 30) * 100);

    const shouldBeDone = calendarDay ? Math.min(calendarDay, 30) : planProgress.completedDays.length;
    const missedDays = Math.max(0, shouldBeDone - completedByNow);
    let recoveryPlan = 'Great pace. Continue one day at a time.';
    if (missedDays > 0 && missedDays <= 2) {
      recoveryPlan = 'You are slightly behind. Add one extra day this weekend to catch up.';
    }
    if (missedDays >= 3) {
      recoveryPlan = `Recovery mode: complete one current day plus one backlog day for the next ${Math.min(7, missedDays)} days.`;
    }

    return {
      thisWeekDone,
      lastWeekDone,
      weekDelta,
      consistencyScore,
      missedDays,
      recoveryPlan,
    };
  }, [planProgress.dayCompletedAt, planProgress.completedDays, calendarDay]);

  const last7Days = useMemo(() => {
    const countsByDate = Object.values(planProgress.dayCompletedAt || {}).reduce<Record<string, number>>((acc, dateStr) => {
      acc[dateStr] = (acc[dateStr] || 0) + 1;
      return acc;
    }, {});

    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      d.setDate(d.getDate() - (6 - i));
      const key = isoDate(d);
      const label = d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 1);
      return {
        date: key,
        label,
        count: countsByDate[key] || 0,
      };
    });

    const maxCount = Math.max(1, ...days.map((d) => d.count));
    return {
      days,
      maxCount,
    };
  }, [planProgress.dayCompletedAt]);

  const suggestedLesson = useMemo(() => {
    if (!activeDayItem?.stepId) return null;
    const step = LEARNING_STEPS.find((s) => s.id === activeDayItem.stepId);
    if (!step) return null;
    const firstIncomplete = step.lessons.find((lesson) => !getLessonProgress(lesson.id).completedAt);
    const targetLesson = firstIncomplete || step.lessons[0];
    if (!targetLesson) return null;

    return {
      lessonTitle: targetLesson.title,
      link: `/learn/${step.id}/${targetLesson.id}`,
    };
  }, [activeDayItem?.day, planRefresh]);

  const handleToggleDay = (day: number) => {
    toggleThirtyDayCompletion(day);
    setPlanRefresh((v) => v + 1);
  };

  const handleResetPlan = () => {
    resetThirtyDayProgress();
    setMilestoneDay(null);
    setPlanRefresh((v) => v + 1);
  };

  const handleCompleteToday = () => {
    if (!activeDayItem) return;
    setThirtyDayCompletion(activeDayItem.day, true);
    setPlanRefresh((v) => v + 1);
  };

  const handleStartChallenge = () => {
    if (!challengeDate) return;
    setThirtyDayStartDate(challengeDate);
    setPlanRefresh((v) => v + 1);
  };

  const toggleWeek = (week: number) => {
    setExpandedWeeks((prev) => ({ ...prev, [week]: !prev[week] }));
  };

  useEffect(() => {
    let changed = false;
    for (const item of THIRTY_DAY_PLAN) {
      if (!item.stepId) continue;
      const stepDone = stepDoneMap.get(item.stepId);
      if (stepDone && !completedSet.has(item.day)) {
        setThirtyDayCompletion(item.day, true);
        changed = true;
      }
    }
    if (changed) {
      setPlanRefresh((v) => v + 1);
    }
  }, [stepDoneMap, completedSet]);

  useEffect(() => {
    const reached = consumeThirtyDayMilestone();
    if (reached) {
      setMilestoneDay(reached);
    }
  }, [planProgress.completedDays.length]);

  return (
    <div className="learning-path-page planner-page">
      <section className="planner-head">
        <Link to="/learn" className="planner-head__back">← Back to Learning Path</Link>
        <h1 className="planner-head__title">30-Day Planner</h1>
      </section>

      <section className="lp-30day" aria-label="30 day Tamil learning plan">
        <div className="lp-30day__header">
          <h2 className="lp-30day__title">30-Day Student Plan</h2>
          <p className="lp-30day__subtitle">
            Follow this daily schedule for 15 to 30 minutes to build Tamil reading confidence in one month.
          </p>
        </div>

        <div className="lp-30day__summary">
          <span className="lp-30day__summary-stat">Completed: {planProgress.completedDays.length}/30 ({planPct}%)</span>
          <span className="lp-30day__summary-stat">
            {nextOpenDay ? `Current Day: ${nextOpenDay.day}` : 'All 30 days completed'}
          </span>
          {calendarDay && (
            <span className="lp-30day__summary-stat">Today in Plan: Day {calendarDay}</span>
          )}
          {plannedFinishDate && (
            <span className="lp-30day__summary-stat">
              Target Finish: {plannedFinishDate.toLocaleDateString()}
            </span>
          )}
          <button
            type="button"
            className="lp-30day__summary-toggle"
            onClick={() => setShowCompletedDays((v) => !v)}
          >
            {showCompletedDays ? 'Hide Completed' : 'Show Completed'}
          </button>
          <button type="button" className="lp-30day__reset" onClick={handleResetPlan}>Reset Plan</button>
        </div>

        <div className="lp-30day__challenge">
          <label className="lp-30day__challenge-label" htmlFor="lp-start-date">Challenge Start Date</label>
          <input
            id="lp-start-date"
            type="date"
            className="lp-30day__challenge-input"
            value={challengeDate}
            onChange={(e) => setChallengeDate(e.target.value)}
          />
          <button type="button" className="lp-30day__challenge-btn" onClick={handleStartChallenge}>
            Start 30-Day Challenge
          </button>
          {planProgress.startedAt && (
            <span className="lp-30day__challenge-note">Started: {new Date(planProgress.startedAt).toLocaleDateString()}</span>
          )}
        </div>

        {milestoneDay && (
          <div className="lp-30day__milestone">
            <span className="lp-30day__milestone-icon">🎉</span>
            <div className="lp-30day__milestone-text">
              Milestone reached: Day {milestoneDay} completed!
            </div>
            <button type="button" className="lp-30day__milestone-close" onClick={() => setMilestoneDay(null)}>
              Dismiss
            </button>
          </div>
        )}

        <div className="lp-30day__week-progress">
          {weekStats.map((w) => (
            <div key={w.week} className="lp-30day__week-pill">
              <span>W{w.week}</span>
              <span>{w.done}/{w.total}</span>
              <span>{w.pct}%</span>
            </div>
          ))}
        </div>

        <div className="lp-30day__insights">
          <div className="lp-30day__insight-card">
            <span className="lp-30day__insight-label">Weekly Progress</span>
            <span className="lp-30day__insight-value">{analytics.thisWeekDone} days</span>
            <span className="lp-30day__insight-sub">
              Last week: {analytics.lastWeekDone}
              {analytics.weekDelta !== 0 ? ` (${analytics.weekDelta > 0 ? '+' : ''}${analytics.weekDelta})` : ''}
            </span>
          </div>
          <div className="lp-30day__insight-card">
            <span className="lp-30day__insight-label">Consistency Score</span>
            <span className="lp-30day__insight-value">{analytics.consistencyScore}%</span>
            <span className="lp-30day__insight-sub">Based on pace and weekly rhythm</span>
          </div>
          <div className="lp-30day__insight-card">
            <span className="lp-30day__insight-label">Recovery Plan</span>
            <span className="lp-30day__insight-value">Missed: {analytics.missedDays} day(s)</span>
            <span className="lp-30day__insight-sub">{analytics.recoveryPlan}</span>
          </div>
        </div>

        <div className="lp-30day__sparkline" aria-label="Last 7 days momentum">
          <div className="lp-30day__sparkline-head">
            <span className="lp-30day__sparkline-title">7-Day Momentum</span>
            <span className="lp-30day__sparkline-sub">Completions per day</span>
          </div>
          <div className="lp-30day__sparkline-bars">
            {last7Days.days.map((item) => (
              <div key={item.date} className="lp-30day__sparkline-col" title={`${item.date}: ${item.count} completion(s)`}>
                <span
                  className="lp-30day__sparkline-bar"
                  style={{ height: `${Math.max(8, Math.round((item.count / last7Days.maxCount) * 44))}px` }}
                />
                <span className="lp-30day__sparkline-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {activeDayItem && (
          <div className="lp-30day__suggested">
            <div className="lp-30day__suggested-text">
              <span className="lp-30day__suggested-label">Today Suggested Task</span>
              <span className="lp-30day__suggested-title">Day {activeDayItem.day}: {activeDayItem.focus}</span>
              <span className="lp-30day__suggested-goal">{activeDayItem.goal}</span>
            </div>
            {suggestedLesson ? (
              <Link to={suggestedLesson.link} className="lp-30day__suggested-btn">
                Start {suggestedLesson.lessonTitle}
              </Link>
            ) : (
              <span className="lp-30day__suggested-note">Review current lessons</span>
            )}
            <button type="button" className="lp-30day__suggested-check" onClick={handleCompleteToday}>
              Mark Day {activeDayItem.day} Done
            </button>
          </div>
        )}

        <div className="lp-30day__weeks">
          {planWeeks.map((planWeek) => (
            <div key={planWeek.week} className="lp-30day__week-card">
              <button type="button" className="lp-30day__week-head" onClick={() => toggleWeek(planWeek.week)}>
                <h3 className="lp-30day__week-title">Week {planWeek.week}</h3>
                <span className="lp-30day__week-toggle">{expandedWeeks[planWeek.week] ? 'Hide' : 'Show'}</span>
              </button>
              <ul className={`lp-30day__list ${expandedWeeks[planWeek.week] ? '' : 'lp-30day__list--collapsed'}`}>
                {planWeek.days
                  .filter((item) => showCompletedDays || !completedSet.has(item.day))
                  .map((item) => (
                    <li id={`lp-day-${item.day}`} key={item.day} className={`lp-30day__day ${completedSet.has(item.day) ? 'lp-30day__day--done' : ''}`}>
                      <span className="lp-30day__badge">Day {item.day}</span>
                      <div className="lp-30day__content">
                        <span className="lp-30day__focus">{item.focus}</span>
                        <span className="lp-30day__goal">{item.goal}</span>
                        <span className="lp-30day__meta">
                          {item.minutes} min
                          {item.stepId ? ` · ${stepMap.get(item.stepId)}` : ''}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={`lp-30day__toggle ${completedSet.has(item.day) ? 'lp-30day__toggle--done' : ''}`}
                        onClick={() => handleToggleDay(item.day)}
                      >
                        {completedSet.has(item.day) ? 'Undo' : 'Done'}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PlannerPage;
