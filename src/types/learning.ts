export type ChapterUnit = {
  id: string;
  title: string;
  page: number;
};

export type ChapterGroup = {
  part: string;
  chapterId: string;
  chapterTitle: string;
  units: ChapterUnit[];
};
