import bibleAA from '../assets/jsonbibles/AA.json';
import bibleACF from '../assets/jsonbibles/ACF.json';
import bibleNVI from '../assets/jsonbibles/NVI.json';

class BibleJSONProvider {
  constructor() {
    this.bibles = [bibleAA, bibleACF, bibleNVI];
  }

  #filterBible(version) {
    return this.bibles.filter(
      bible => bible.abbrev.toUpperCase() === version,
    )[0];
  }

  #filterBook(version, bookAbbrev) {
    return this.#filterBible(version).books.filter(
      book => book.abbrev === bookAbbrev,
    )[0];
  }

  getVersions() {
    return this.bibles.map(version => ({
      name: version.name,
      abbrev: version.abbrev,
    }));
  }

  getBooks(version) {
    return version
      ? this.#filterBible(version).books.map(book => {
          return { name: book.name, abbrev: book.abbrev };
        })
      : [];
  }

  getChapters(version, bookAbbrev) {
    if (bookAbbrev) {
      const chapters = [];
      const book = this.#filterBook(version, bookAbbrev);

      console.log(book.chapters.length);

      for (let i = 1; i <= book.chapters.length; i += 1) {
        chapters.push(i);
      }

      return chapters;
    }

    return [];
  }

  /**
   * Return single chapter from book
   */
  getChapter(version, bookAbbrev, chapter) {
    // const chapter = [];
    return chapter
      ? this.#filterBook(version, bookAbbrev).chapters[chapter - 1].map(
          (text, index) => ({
            number: index + 1,
            text,
          }),
        )
      : [];
  }
}

export default new BibleJSONProvider();
