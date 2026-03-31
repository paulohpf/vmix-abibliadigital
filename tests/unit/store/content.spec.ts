import contentModule from '@/store/content';
import {
  buildBibleExportData,
  createDefaultQuickTextTemplate,
  normalizeOperationalContentList,
  normalizeQuickTextItems,
  normalizeQuickTextTemplates,
} from '@/store/content/helpers';
import {
  BibleContent,
  ContentState,
  QuickTextContent,
  QuickTextTemplate,
} from '@/store/content/interface';

describe('store/content', () => {
  const createState = (): ContentState => contentModule.state();

  const createBibleContent = (): BibleContent => ({
    id: 'bible-1',
    type: 'bible',
    name: 'NVI - João 3 : 16',
    version: 'NVI',
    book: { name: 'João', abbrev: 'jo' },
    chapter: 3,
    verses: '16',
    versesArr: [{ number: 16, text: 'Porque Deus amou o mundo...' }],
    active: false,
    exportData: buildBibleExportData(
      [{ number: 16, text: 'Porque Deus amou o mundo...' }],
      {
        book: { name: 'João', abbrev: 'jo' },
        chapter: 3,
        verses: '16',
        version: 'NVI',
      },
    ),
  });

  const createTemplate = (): QuickTextTemplate =>
    createDefaultQuickTextTemplate();

  const createQuickTextContent = (): QuickTextContent => ({
    id: 'quick-1',
    type: 'quickText',
    templateId: 'template-pastor-preletor',
    name: 'Pastor/Preletor - Pr. Paulo | Igreja Central',
    values: {
      'field-nome': 'Pr. Paulo',
      'field-igreja': 'Igreja Central',
    },
    active: false,
    exportData: [
      {
        text: 'Pr. Paulo',
        info: 'Igreja Central',
        model: 'pastor-preletor',
      },
    ],
  });

  it('inicia com capítulo atual vazio, fila vazia e template padrão', () => {
    const state = createState();

    expect(state.currentBibleChapter).toEqual([]);
    expect(state.contentList).toEqual([]);
    expect(state.quickTextItems).toEqual([]);
    expect(state.quickTextTemplates).toHaveLength(1);
    expect(state.quickTextTemplates[0].name).toBe('Pastor/Preletor');
    expect(state.quickTextTemplates[0].model).toBe('pastor-preletor');
  });

  it('setCurrentBibleChapter atualiza os versículos carregados', () => {
    const state = createState();
    const verses = [{ number: 1, text: 'No princípio...' }];

    contentModule.mutations.setCurrentBibleChapter(state, verses);

    expect(state.currentBibleChapter).toEqual(verses);
    expect(contentModule.getters.getCurrentBibleChapter(state)).toEqual(verses);
  });

  it('addContentToList adiciona passagem bíblica na fila', () => {
    const state = createState();
    const content = createBibleContent();

    contentModule.mutations.addContentToList(state, content);

    expect(state.contentList).toHaveLength(1);
    expect(state.contentList[0]).toEqual(content);
  });

  it('updateActiveContent mantém apenas um item ativo na fila', () => {
    const state = createState();
    const bible = createBibleContent();
    const quick = createQuickTextContent();

    state.contentList = [bible, quick];

    contentModule.mutations.updateActiveContent(state, quick.id);

    expect(state.contentList[0].active).toBe(false);
    expect(state.contentList[1].active).toBe(true);
  });

  it('saveQuickTextTemplate cria e atualiza template, sincronizando itens dependentes', () => {
    const state = createState();
    const quick = createQuickTextContent();

    state.quickTextItems = [quick];
    state.contentList = [quick];

    const updatedTemplate: QuickTextTemplate = {
      ...createTemplate(),
      fields: [
        {
          id: 'field-nome',
          label: 'Preletor',
          type: 'text',
          required: true,
          placeholder: 'Nome do preletor',
          role: 'text',
          order: 0,
        },
        {
          id: 'field-igreja',
          label: 'Congregação',
          type: 'text',
          required: false,
          placeholder: 'Nome da igreja',
          role: 'info',
          order: 1,
        },
      ],
    };

    contentModule.mutations.saveQuickTextTemplate(state, updatedTemplate);

    expect(
      state.quickTextTemplates.find(
        template => template.id === updatedTemplate.id,
      )?.fields[0].label,
    ).toBe('Preletor');
    expect(state.quickTextItems[0].name).toContain('Pr. Paulo');
    expect(state.contentList[0].exportData[0]).toEqual({
      text: 'Pr. Paulo',
      info: 'Igreja Central',
      model: 'pastor-preletor',
    });
  });

  it('saveQuickTextItem persiste conteúdo rápido e sincroniza a fila quando já existe', () => {
    const state = createState();
    const item = createQuickTextContent();

    state.contentList = [item];

    contentModule.mutations.saveQuickTextItem(state, item);

    expect(state.quickTextItems).toHaveLength(1);
    expect(state.quickTextItems[0]).toEqual(item);
    expect(state.contentList[0].name).toEqual(item.name);
  });

  it('normaliza estado legado sem model no template e no exportData', () => {
    const legacyTemplate = {
      id: 'template-pastor-preletor',
      name: 'Pastor/Preletor',
      baseType: 'quickText' as const,
      fields: createTemplate().fields,
    } as QuickTextTemplate;
    const legacyItem = {
      ...createQuickTextContent(),
      exportData: [{ text: 'Pr. Paulo', info: 'Igreja Central' }],
    };

    const normalizedTemplates = normalizeQuickTextTemplates([legacyTemplate]);
    const normalizedItems = normalizeQuickTextItems(
      [legacyItem],
      normalizedTemplates,
    );
    const normalizedList = normalizeOperationalContentList(
      [legacyItem],
      normalizedTemplates,
    );

    expect(normalizedTemplates[0].model).toBe('pastor-preletor');
    expect(normalizedItems[0].exportData[0].model).toBe('pastor-preletor');
    expect(normalizedList[0].exportData[0].model).toBe('pastor-preletor');
  });

  it('hydrateLegacyContentState corrige templates e fila persistidos', () => {
    const state = createState();

    state.quickTextTemplates = [
      {
        id: 'template-pastor-preletor',
        name: 'Pastor/Preletor',
        baseType: 'quickText',
        fields: createTemplate().fields,
      } as QuickTextTemplate,
    ];
    state.quickTextItems = [
      {
        ...createQuickTextContent(),
        exportData: [{ text: 'Pr. Paulo', info: 'Igreja Central' }],
      },
    ];
    state.contentList = [
      {
        ...createQuickTextContent(),
        exportData: [{ text: 'Pr. Paulo', info: 'Igreja Central' }],
      },
    ];

    contentModule.mutations.hydrateLegacyContentState(state);

    expect(state.quickTextTemplates[0].model).toBe('pastor-preletor');
    expect(state.quickTextItems[0].exportData[0].model).toBe(
      'pastor-preletor',
    );
    expect(state.contentList[0].exportData[0].model).toBe(
      'pastor-preletor',
    );
  });

  it('upsertQuickTextItemInList adiciona e atualiza item rápido na fila', () => {
    const state = createState();
    const item = createQuickTextContent();

    contentModule.mutations.upsertQuickTextItemInList(state, item);
    expect(state.contentList).toHaveLength(1);

    contentModule.mutations.upsertQuickTextItemInList(state, {
      ...item,
      name: 'Pastor/Preletor - Pr. Pedro | Igreja Central',
    });

    expect(state.contentList).toHaveLength(1);
    expect(state.contentList[0].name).toContain('Pr. Pedro');
  });

  it('removeQuickTextItem e removeContentFromList limpam dados corretamente', () => {
    const state = createState();
    const bible = createBibleContent();
    const quick = createQuickTextContent();

    state.quickTextItems = [quick];
    state.contentList = [bible, quick];

    contentModule.mutations.removeQuickTextItem(state, quick.id);
    contentModule.mutations.removeContentFromList(state, 0);

    expect(state.quickTextItems).toEqual([]);
    expect(state.contentList).toEqual([]);
  });

  it('removeQuickTextTemplate remove template e conteúdos relacionados', () => {
    const state = createState();
    const quick = createQuickTextContent();

    state.quickTextItems = [quick];
    state.contentList = [quick];
    state.quickTextTemplates = [createTemplate()];

    contentModule.mutations.removeQuickTextTemplate(
      state,
      'template-pastor-preletor',
    );

    expect(state.quickTextTemplates).toEqual([]);
    expect(state.quickTextItems).toEqual([]);
    expect(state.contentList).toEqual([]);
  });

  it('getters retornam a estrutura operacional atual', () => {
    const state = createState();
    const quick = createQuickTextContent();

    state.quickTextItems = [quick];
    state.contentList = [quick];

    expect(contentModule.getters.getContentList(state)).toEqual(
      state.contentList,
    );
    expect(contentModule.getters.getQuickTextItems(state)).toEqual(
      state.quickTextItems,
    );
    expect(contentModule.getters.getQuickTextTemplates(state)).toEqual(
      state.quickTextTemplates,
    );
  });
});
