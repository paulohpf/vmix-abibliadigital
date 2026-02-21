import { BibleState, Chapter } from './interface';

export default {
  state: (): BibleState => ({
    chapter: [],
    chapterList: [],
  }),
  mutations: {
    setChapter(state: BibleState, chapter: Chapter[]): void {
      state.chapter = chapter;
    },
    addChapterToList(state: BibleState, chapter: Chapter): void {
      const { chapterList } = state;
      chapterList.push(chapter);
      state.chapterList = chapterList;
    },
    updateActiveChapterList(state: BibleState, itemId: number): void {
      const { chapterList } = state;
      state.chapterList = chapterList.map((item: Chapter) => {
        const updatedItem = { ...item };
        updatedItem.active = false;
        return updatedItem;
      });

      state.chapterList[itemId].active = true;
    },
    removeChapterFromList(state: BibleState, itemId: number): void {
      state.chapterList.splice(itemId, 1);
    },
  },
  getters: {
    getChapter(state: BibleState): Chapter[] {
      return state.chapter;
    },
    getChapterList(state: BibleState): Chapter[] {
      return state.chapterList;
    },
  },
};
