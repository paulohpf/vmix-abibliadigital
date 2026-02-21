export interface Chapter {
  name: string;
  active: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface BibleState {
  chapter: Chapter[];
  chapterList: Chapter[];
}
