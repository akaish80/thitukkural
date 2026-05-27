import VowelsLessonContent from './VowelsLessonContent';
import ConsonantsLessonContent from './ConsonantsLessonContent';
import UyirmeiLessonContent from './UyirmeiLessonContent';

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

  return <p>Unit content goes here. (You can add lessons, activities, or resources for this unit.)</p>;
};

export default UnitContent;
