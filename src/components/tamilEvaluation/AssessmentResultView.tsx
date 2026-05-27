import type { TamilExperienceLevel, TamilEvaluationResult } from '../../utils/learningStore';
import { LEVEL_HINTS, SKILL_LABEL } from '../../data/constants';
import type { Skill } from '../../types';

type WeakSkillItem = {
  skill: Skill;
  accuracy: number;
};

type AssessmentResultViewProps = {
  chapterTitle?: string;
  level: TamilExperienceLevel;
  correctCount: number;
  answered: number;
  accuracy: number;
  xp: number;
  weakSkills: WeakSkillItem[];
  latestResult: TamilEvaluationResult | null;
  onRetake: () => void;
};

const AssessmentResultView = ({
  chapterTitle,
  level,
  correctCount,
  answered,
  accuracy,
  xp,
  weakSkills,
  latestResult,
  onRetake,
}: AssessmentResultViewProps) => {
  return (
    <div className="duo-eval">
      <div className="duo-eval__result">
        <p className="duo-eval__result-tag">
          {chapterTitle ? `${chapterTitle} Evaluation` : 'Tamil Experience Evaluation'}
        </p>
        {chapterTitle && (
          <p className="duo-eval__result-chapter">Focused chapter result summary</p>
        )}
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

        <button className="duo-eval__btn duo-eval__btn--primary" onClick={onRetake}>
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
};

export default AssessmentResultView;
