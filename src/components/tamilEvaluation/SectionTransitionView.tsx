import type { SectionTransition } from '../../types';

type SectionTransitionViewProps = {
  sectionTransition: SectionTransition;
  onContinue: () => void;
};

const SectionTransitionView = ({ sectionTransition, onContinue }: SectionTransitionViewProps) => {
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
        <button type="button" className="duo-eval__btn duo-eval__btn--primary" onClick={onContinue}>
          Continue →
        </button>
      </div>
    </div>
  );
};

export default SectionTransitionView;
