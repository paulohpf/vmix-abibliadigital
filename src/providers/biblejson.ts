import { BibleBook, BibleData, BibleVersion, ChapterVerse } from './interface';

class BibleJSONProvider {
  private bibleCache: Record<string, BibleData>;

  private availableVersions: BibleVersion[];

  private loaders: Record<string, () => Promise<{ default: BibleData }>>;

  constructor() {
    this.bibleCache = {};
    this.availableVersions = [
      { name: 'Almeida Revisada Imprensa Bíblica', abbrev: 'AA' },
      { name: 'Almeida Corrigida Fiel', abbrev: 'ACF' },
      { name: 'Nova Versão Internacional', abbrev: 'NVI' },
    ];

    this.loaders = {
      AA: () => import('../assets/jsonbibles/AA.json'),
      ACF: () => import('../assets/jsonbibles/ACF.json'),
      NVI: () => import('../assets/jsonbibles/NVI.json'),
    };
  }

  async #getBible(version: string): Promise<BibleData | null> {
    const normalizedVersion = String(version || '').toUpperCase();

    if (!normalizedVersion) {
      return null;
    }

    if (this.bibleCache[normalizedVersion]) {
      return this.bibleCache[normalizedVersion];
    }

    const loader = this.loaders[normalizedVersion];

    if (!loader) {
      return null;
    }

    const module = await loader();
    this.bibleCache[normalizedVersion] = module.default as BibleData;

    return this.bibleCache[normalizedVersion];
  }

  async #filterBook(version: string, bookAbbrev: string): Promise<BibleBook | null> {
    const bible = await this.#getBible(version);

    if (!bible || !bookAbbrev) {
      return null;
    }

    return (
      bible.books.filter(
        (book: BibleBook) => book.abbrev === bookAbbrev,
      )[0] || null
    );
  }

  getVersions(): BibleVersion[] {
    return this.availableVersions;
  }

  async getBooks(version: string): Promise<BibleVersion[]> {
    const bible = await this.#getBible(version);

    return bible
      ? bible.books.map((book: BibleBook) => {
          return { name: book.name, abbrev: book.abbrev };
        })
      : [];
  }

  async getChapters(version: string, bookAbbrev: string): Promise<number[]> {
    if (bookAbbrev) {
      const chapters: number[] = [];
      const book = await this.#filterBook(version, bookAbbrev);

      if (!book) {
        return [];
      }

      for (let i = 1; i <= book.chapters.length; i += 1) {
        chapters.push(i);
      }

      return chapters;
    }

    return [];
  }

  async getChapter(version: string, bookAbbrev: string, chapter: number): Promise<ChapterVerse[]> {
    if (!chapter) {
      return [];
    }

    const book = await this.#filterBook(version, bookAbbrev);

    if (!book || !book.chapters[chapter - 1]) {
      return [];
    }

    return book.chapters[chapter - 1].map((text: string, index: number) => ({
      number: index + 1,
      text,
    }));
  }
}

export default new BibleJSONProvider();
