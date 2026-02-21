import { Module } from 'vuex';
import { RootState } from '@/store/index';

interface Chapter {
  [key: string]: unknown;
}

interface BibleState {
  chapter: Chapter | Chapter[];
  chapterList: Chapter[];
}

const bible: Module<BibleState, RootState> = {
  state: {
    chapter: [],
    chapterList: [],
  },
  mutations: {
    setChapter(state: BibleState, chapter: Chapter | Chapter[]): void {
      state.chapter = chapter;
    },
    addChapterToList(state: BibleState, chapter: Chapter): void {
      const { chapterList } = state;
      chapterList.push(chapter);
      state.chapterList = chapterList;
    },
    updateActiveChapterList(state: BibleState, itemId: number): void {
      const { chapterList } = state;
      state.chapterList = chapterList.map((item) => {
        const updatedItem = item;
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
    getChapter(state: BibleState): Chapter | Chapter[] {
      return state.chapter;
    },
    getChapterList(state: BibleState): Chapter[] {
      return state.chapterList;
    },
  },
};

export default bible;
