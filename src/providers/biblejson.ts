import bibleAA from '../assets/jsonbibles/AA.json';
import bibleACF from '../assets/jsonbibles/ACF.json';
import bibleNVI from '../assets/jsonbibles/NVI.json';
import { BibleBook, BibleData, BibleVersion, ChapterVerse } from './interface';

class BibleJSONProvider {
  private bibles: BibleData[];

  constructor() {
    this.bibles = [bibleAA as BibleData, bibleACF as BibleData, bibleNVI as BibleData];
  }

  #filterBible(version: string): BibleData {
    return this.bibles.filter(
      (bible: BibleData) => bible.abbrev.toUpperCase() === version,
    )[0];
  }

  #filterBook(version: string, bookAbbrev: string): BibleBook {
    return this.#filterBible(version).books.filter(
      (book: BibleBook) => book.abbrev === bookAbbrev,
    )[0];
  }

  getVersions(): BibleVersion[] {
    return this.bibles.map((version: BibleData) => ({
      name: version.name,
      abbrev: version.abbrev,
    }));
  }

  getBooks(version: string): BibleVersion[] {
    return version
      ? this.#filterBible(version).books.map((book: BibleBook) => {
          return { name: book.name, abbrev: book.abbrev };
        })
      : [];
  }

  getChapters(version: string, bookAbbrev: string): number[] {
    if (bookAbbrev) {
      const chapters: number[] = [];
      const book = this.#filterBook(version, bookAbbrev);

      for (let i = 1; i <= book.chapters.length; i += 1) {
        chapters.push(i);
      }

      return chapters;
    }

    return [];
  }

  getChapter(version: string, bookAbbrev: string, chapter: number): ChapterVerse[] {
    return chapter
      ? this.#filterBook(version, bookAbbrev).chapters[chapter - 1].map(
          (text: string, index: number) => ({
            number: index + 1,
            text,
          }),
        )
      : [];
  }
}

export default new BibleJSONProvider();
