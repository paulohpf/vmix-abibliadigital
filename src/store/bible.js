export default {
  state: {
    chapter: [],
    chapterList: [],
  },
  mutations: {
    setChapter(state, chapter) {
      state.chapter = chapter;
    },
    addChapterToList(state, chapter) {
      const { chapterList } = state;

      chapterList.push(chapter);
      state.chapterList = chapterList;
    },
    updateActiveChapterList(state, itemId) {
      const { chapterList } = state;
      state.chapterList = chapterList.map(item => {
        const updatedItem = item;

        updatedItem.active = false;
        return updatedItem;
      });

      state.chapterList[itemId].active = true;
    },
    removeChapterFromList(state, itemId) {
      state.chapterList.splice(itemId, 1);
    },
  },
  getters: {
    getChapter(state) {
      return state.chapter;
    },
    getChapterList(state) {
      return state.chapterList;
    },
  },
};
