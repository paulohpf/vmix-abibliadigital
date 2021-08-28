export default {
  state: {
    versions: [
      {
        version: 'acf',
        verses: 31106,
      },
      {
        version: 'apee',
        verses: 30975,
      },
      {
        version: 'bbe',
        verses: 31104,
      },
      {
        version: 'kjv',
        verses: 31101,
      },
      {
        version: 'nvi',
        verses: 31105,
      },
      {
        version: 'ra',
        verses: 31104,
      },
      {
        version: 'rvr',
        verses: 31102,
      },
    ],
    books: [],
    chapters: [],
  },
  mutations: {},
  getters: {
    getVersions(state) {
      return state.versions;
    },
    getBooks(state) {
      return state.books;
    },
    getChapters(state) {
      return state.chapters;
    },
  },
};
