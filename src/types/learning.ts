export type ChapterUnit = {
  id: string;
  title: string;
};

export type ChapterGroup = {
  part: string;
  chapterId: string;
  chapterTitle: string;
  units: ChapterUnit[];
};
