import { contextBridge, ipcRenderer } from 'electron';
import { BibleJSONProvider } from '@/providers/biblejson';

interface MyAPI {
  saveBibleJson: (data: unknown) => void;
  getBibleVersions: (version?: string | null) => unknown;
  filterBook: (version: string, bookAbbrev: string) => unknown;
  getBooks: (version?: string | null) => unknown;
  getChapters: (version: string, bookAbbrev: string) => unknown;
  getChapter: (version: string, bookAbbrev: string, chapter: string | number) => unknown;
}

const myAPI: MyAPI = {
  saveBibleJson: (data) => {
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
};

contextBridge.exposeInMainWorld('myAPI', myAPI);

declare global {
  interface Window {
    myAPI: MyAPI;
  }
}
