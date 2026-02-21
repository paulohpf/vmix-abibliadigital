import bibleModule from '@/store/bible';
import { BibleState, Chapter } from '@/store/bible/interface';

describe('store/bible', () => {
  const createState = (): BibleState => bibleModule.state();

  it('inicia com chapter e chapterList vazios', () => {
    const state = createState();

    expect(state.chapter).toEqual([]);
    expect(state.chapterList).toEqual([]);
  });

  it('setChapter atualiza chapter', () => {
    const state = createState();
    const chapter: Chapter[] = [{ name: 'Capítulo 1', active: true }];

    bibleModule.mutations.setChapter(state, chapter);

    expect(state.chapter).toEqual(chapter);
  });

  it('addChapterToList adiciona item na lista', () => {
    const state = createState();
    const item: Chapter = { name: 'Capítulo 1', active: false };

    bibleModule.mutations.addChapterToList(state, item);

    expect(state.chapterList).toHaveLength(1);
    expect(state.chapterList[0]).toEqual(item);
  });

  it('updateActiveChapterList marca somente o item informado como ativo', () => {
    const state = createState();
    state.chapterList = [
      { name: '1', active: false },
      { name: '2', active: true },
      { name: '3', active: false },
    ];

    bibleModule.mutations.updateActiveChapterList(state, 0);

    expect(state.chapterList[0].active).toBe(true);
    expect(state.chapterList[1].active).toBe(false);
    expect(state.chapterList[2].active).toBe(false);
  });

  it('removeChapterFromList remove item pelo índice', () => {
    const state = createState();
    state.chapterList = [
      { name: '1', active: false },
      { name: '2', active: true },
    ];

    bibleModule.mutations.removeChapterFromList(state, 0);

    expect(state.chapterList).toEqual([{ name: '2', active: true }]);
  });

  it('getters retornam valores corretos do estado', () => {
    const state = createState();
    state.chapter = [{ name: 'A', active: true }];
    state.chapterList = [{ name: 'B', active: false }];

    expect(bibleModule.getters.getChapter(state)).toEqual(state.chapter);
    expect(bibleModule.getters.getChapterList(state)).toEqual(
      state.chapterList,
    );
  });
});
