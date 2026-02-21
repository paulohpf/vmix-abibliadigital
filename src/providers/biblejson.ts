import bibleVersionAA from '../assets/jsonbibles/AA.json';
import bibleVersionACF from '../assets/jsonbibles/ACF.json';
import bibleVersionNVI from '../assets/jsonbibles/NVI.json';

interface BibleBook {
  name: string;
  abbrev: string;
  chapters: unknown[];
  [key: string]: unknown;
}

interface Bible {
  name: string;
  abbrev: string;
  books: BibleBook[];
}

interface BookInfo {
  name: string;
  abbrev: string;
}

export class BibleJSONProvider {
  getBibleVersion(version?: string | null): Bible | Array<{ name: string; abbrev: string }> {
    switch (version) {
      case 'AA':
        return bibleVersionAA as Bible;
      case 'ACF':
        return bibleVersionACF as Bible;
      case 'NVI':
        return bibleVersionNVI as Bible;
      default:
        return [bibleVersionAA, bibleVersionACF, bibleVersionNVI].map((bible) => ({
          name: (bible as Bible).name,
          abbrev: (bible as Bible).abbrev,
        }));
    }
  }

  filterBook(version: string, bookAbbrev: string): BibleBook | undefined {
    const versionData = this.getBibleVersion(version);
    if (Array.isArray(versionData)) {
      return undefined;
    }
    return (versionData as Bible).books.find((book) => book.abbrev === bookAbbrev);
  }

  getBooks(version?: string | null): BookInfo[] {
    if (version) {
      const versionData = this.getBibleVersion(version);
      if (!Array.isArray(versionData)) {
        return (versionData as Bible).books.map((book) => ({
          name: book.name,
          abbrev: book.abbrev,
        }));
      }
    }
    return [];
  }

  getVersions(): Array<{ name: string; abbrev: string }> {
    const result = this.getBibleVersion();
    if (Array.isArray(result)) {
      return result;
    }
    return [];
  }

  getChapters(version: string, bookAbbrev: string): number[] {
    if (bookAbbrev) {
      const chapters: number[] = [];
      const book = this.filterBook(version, bookAbbrev);

      if (book) {
        for (let i = 1; i <= book.chapters.length; i += 1) {
          chapters.push(i);
        }
      }

      return chapters;
    }

    return [];
  }

  getChapter(version: string, bookAbbrev: string, chapter: string | number): unknown {
    const book = this.filterBook(version, bookAbbrev);

    if (book && Array.isArray(book.chapters)) {
      return (book.chapters as any)[chapter];
    }

    return null;
  }
}