const { contextBridge, ipcRenderer } = require('electron');
const { BibleJSONProvider } = require('@/providers/biblejson');

contextBridge.exposeInMainWorld('myAPI', {
  saveBibleJson: data => {
    ipcRenderer.send('save-bible-json', data);
  },
  getBibleVersions: (version = null) =>
    new BibleJSONProvider().getBibleVersion(version),
  filterBook: (version, bookAbbrev) =>
    new BibleJSONProvider().filterBook(version, bookAbbrev),
  getBooks: (version = null) => new BibleJSONProvider().getBooks(version),
  getChapters: (version, bookAbbrev) =>
    new BibleJSONProvider().getChapters(version, bookAbbrev),
  getChapter: (version, bookAbbrev, chapter) =>
    new BibleJSONProvider().getChapter(version, bookAbbrev, chapter),
});
