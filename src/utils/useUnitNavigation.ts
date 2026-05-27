import { useMemo } from 'react';
import { CHAPTER_GROUPS } from '../data/constants';

const useUnitNavigation = (chapterId?: string, unitId?: string) => {
  return useMemo(() => {
    const chapter = CHAPTER_GROUPS.find((group) => group.chapterId === chapterId);
    const unitIndex = chapter?.units.findIndex((unit) => unit.id === unitId) ?? -1;
    const unit = chapter?.units[unitIndex];
    const previousUnit = unitIndex > 0 ? chapter?.units[unitIndex - 1] : undefined;
    const nextUnit = unitIndex < (chapter?.units.length ?? 0) - 1 ? chapter?.units[unitIndex + 1] : undefined;

    return { chapter, unit, previousUnit, nextUnit };
  }, [chapterId, unitId]);
};

export default useUnitNavigation;
