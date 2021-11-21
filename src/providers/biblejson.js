/* eslint-disable class-methods-use-this */
import bibleAA from '../assets/jsonbibles/AA.json';
// import bibleACF from '../assets/jsonbibles/ACF.json';
// import bibleNVI from '../assets/jsonbibles/NVI.json';

class BibleJSONProvider {
  getBooks() {
    return bibleAA.map((book, index) => {
      return { index, name: book.name, abbrev: book.abbrev };
    });
  }
}

export default new BibleJSONProvider();
