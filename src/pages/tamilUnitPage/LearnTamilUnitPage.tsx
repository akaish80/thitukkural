import { useParams } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';
import UnitActions from '../../components/learntamil/UnitActions';
import UnitContent from '../../components/learntamil/UnitContent';
import UnitHero from '../../components/learntamil/UnitHero';
import UnitNotFound from '../../components/learntamil/UnitNotFound';
import useUnitNavigation from '../../utils/useUnitNavigation';
import './LearnTamilUnitPage.styles.scss';

const LearnTamilUnitPage = () => {
  const { chapterId, unitId } = useParams<{ chapterId: string; unitId: string }>();
  const { chapter, unit, previousUnit, nextUnit } = useUnitNavigation(chapterId, unitId);

  if (!chapter || !unit) {
    return <UnitNotFound />;
  }

  return (
    <div className="learn-tamil-unit-page">
      <PageTitle
        title={`Unit ${unit.id}: ${unit.title}`}
        description={`Part: ${chapter.part} | Chapter: ${chapter.chapterTitle}`}
        path={`/learn-tamil/${chapter.chapterId}/${unit.id}`}
      />
      <UnitHero chapter={chapter} unit={unit} />
      <section className="lt-unit-content">
        <UnitContent unitId={unitId} />
      </section>
      <UnitActions chapter={chapter} previousUnit={previousUnit} nextUnit={nextUnit} />
    </div>
  );
};

export default LearnTamilUnitPage;
