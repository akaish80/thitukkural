import VowelsLessonContent from './VowelsLessonContent';
import ConsonantsLessonContent from './ConsonantsLessonContent';
import UyirmeiLessonContent from './UyirmeiLessonContent';
import ReadingTamilLessonContent from './ReadingTamilLessonContent';

type UnitContentProps = {
  unitId?: string;
};

const UnitContent = ({ unitId }: UnitContentProps) => {
  if (unitId === '1.1') {
    return <VowelsLessonContent />;
  }

  if (unitId === '1.2') {
    return <ConsonantsLessonContent />;
  }

  if (unitId === '1.3') {
    return <UyirmeiLessonContent />;
  }

  if (unitId === '1.4') {
    return <ReadingTamilLessonContent />;
  }

  return <p>Unit content goes here. (You can add lessons, activities, or resources for this unit.)</p>;
};

export default UnitContent;
