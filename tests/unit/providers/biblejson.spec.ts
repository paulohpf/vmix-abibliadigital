import bibleJsonProvider from '@/providers/biblejson';

describe('providers/biblejson', () => {
  it('retorna versões disponíveis', () => {
    const versions = bibleJsonProvider.getVersions();

    expect(Array.isArray(versions)).toBe(true);
    expect(versions.length).toBeGreaterThan(0);
    expect(versions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ abbrev: 'AA' }),
        expect.objectContaining({ abbrev: 'ACF' }),
        expect.objectContaining({ abbrev: 'NVI' }),
      ]),
    );
  });

  it('retorna livros para versão válida e vazio para inválida', async () => {
    const books = await bibleJsonProvider.getBooks('AA');
    const empty = await bibleJsonProvider.getBooks('');

    expect(books.length).toBeGreaterThan(0);
    expect(books[0]).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        abbrev: expect.any(String),
      }),
    );
    expect(empty).toEqual([]);
  });

  it('retorna capítulos incrementais do livro', async () => {
    const chapters = await bibleJsonProvider.getChapters('AA', 'gn');

    expect(chapters.length).toBeGreaterThan(0);
    expect(chapters[0]).toBe(1);
    expect(chapters[chapters.length - 1]).toBe(chapters.length);
  });

  it('retorna versículos do capítulo e vazio para capítulo inválido', async () => {
    const verses = await bibleJsonProvider.getChapter('AA', 'gn', 1);
    const empty = await bibleJsonProvider.getChapter('AA', 'gn', 0);

    expect(verses.length).toBeGreaterThan(0);
    expect(verses[0]).toEqual(
      expect.objectContaining({ number: 1, text: expect.any(String) }),
    );
    expect(empty).toEqual([]);
  });
});
