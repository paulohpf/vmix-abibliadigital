import bibleVersionAA from '../assets/jsonbibles/AA.json';
import bibleVersionACF from '../assets/jsonbibles/ACF.json';
import bibleVersionNVI from '../assets/jsonbibles/NVI.json';

export class BibleJSONProvider {
  getBibleVersion(version) {
    switch (version) {
      case 'AA':
        return bibleVersionAA;
      case 'ACF':
        return bibleVersionACF;
      case 'NVI':
        return bibleVersionNVI;
      default:
        return [bibleVersionAA, bibleVersionACF, bibleVersionNVI].map(
          bible => ({
            name: bible.name,
            abbrev: bible.abbrev,
          }),
        );
    }
  }

  filterBook(version, bookAbbrev) {
    return this.getBibleVersion(version).books.find(
      book => book.abbrev === bookAbbrev,
    );
  }

  getBooks(version) {
    return version
      ? this.getBibleVersion(version).books.map(book => {
          return { name: book.name, abbrev: book.abbrev };
        })
      : [];
  }

  getChapters(version, bookAbbrev) {
    if (bookAbbrev) {
      const chapters = [];
      const book = this.filterBook(version, bookAbbrev);

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
      ? this.filterBook(version, bookAbbrev).chapters[chapter - 1].map(
          (text, index) => ({
            number: index + 1,
            text,
          }),
        )
      : [];
  }
}

export default new BibleJSONProvider();
