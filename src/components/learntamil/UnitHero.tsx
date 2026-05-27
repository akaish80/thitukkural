import type { ChapterGroup, ChapterUnit } from '../../types';

type UnitHeroProps = {
  chapter: ChapterGroup;
  unit: ChapterUnit;
};

const UnitHero = ({ chapter, unit }: UnitHeroProps) => {
  return (
    <section className="lt-unit-hero">
      <h1>Unit {unit.id}: {unit.title}</h1>
      <p>
        From <strong>{chapter.chapterTitle}</strong> ({chapter.part})
      </p>
    </section>
  );
};

export default UnitHero;
