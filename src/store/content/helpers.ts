import { ChapterVerse } from '@/providers/interface';
import {
  BibleContent,
  ExportedContentLine,
  OperationalContent,
  QuickTextContent,
  QuickTextField,
  QuickTextTemplate,
} from './interface';

const MAX_LINE_LENGTH = 342;

export function createId(prefix = 'content'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sortFields(fields: QuickTextField[]): QuickTextField[] {
  return [...fields].sort((a, b) => a.order - b.order);
}

export function createModelSlug(value: string): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createDefaultQuickTextTemplate(): QuickTextTemplate {
  return {
    id: 'template-pastor-preletor',
    model: 'pastor-preletor',
    name: 'Pastor/Preletor',
    baseType: 'quickText',
    fields: [
      {
        id: 'field-nome',
        label: 'Nome',
        type: 'text',
        required: true,
        placeholder: 'Ex.: Pr. João Silva',
        role: 'text',
        order: 0,
      },
      {
        id: 'field-igreja',
        label: 'Igreja',
        type: 'text',
        required: false,
        placeholder: 'Ex.: Assembleia de Deus Central',
        role: 'info',
        order: 1,
      },
    ],
  };
}

export function sanitizeTemplate(
  template: QuickTextTemplate,
): QuickTextTemplate {
  return {
    ...template,
    model: createModelSlug(template.model || template.name || template.id),
    name: String(template.name || '').trim(),
    fields: sortFields(template.fields || []).map((field, index) => ({
      ...field,
      label: String(field.label || '').trim(),
      placeholder: String(field.placeholder || ''),
      order: index,
    })),
  };
}

export function buildBibleExportData(
  verses: ChapterVerse[],
  metadata: Pick<BibleContent, 'book' | 'chapter' | 'verses' | 'version'>,
): ExportedContentLine[] {
  const payload: ExportedContentLine[] = [];

  verses.forEach(verse => {
    const line = `${verse.number} ${verse.text}`;
    const lastIndex = payload.length - 1;

    if (
      payload[lastIndex] &&
      payload[lastIndex].text.length + line.length + 1 < MAX_LINE_LENGTH
    ) {
      payload[lastIndex].text += `\n${line}`;
      return;
    }

    payload.push({
      text: line,
      info: `${metadata.book.name} ${metadata.chapter}${
        metadata.verses ? `:${metadata.verses}` : ''
      } (${String(metadata.version).toUpperCase()})`,
    });
  });

  return payload;
}

export function buildQuickTextExportData(
  template: QuickTextTemplate,
  values: Record<string, string>,
): ExportedContentLine[] {
  const orderedFields = sortFields(template.fields || []);
  const textField = orderedFields.find(field => field.role === 'text');
  const infoField = orderedFields.find(field => field.role === 'info');

  return [
    {
      text: textField ? String(values[textField.id] || '').trim() : '',
      info: infoField ? String(values[infoField.id] || '').trim() : undefined,
      model: template.model,
    },
  ];
}

export function buildQuickTextDisplayName(
  template: QuickTextTemplate,
  values: Record<string, string>,
): string {
  const orderedFields = sortFields(template.fields || []);
  const mainParts = orderedFields
    .map(field => String(values[field.id] || '').trim())
    .filter(Boolean);

  if (!mainParts.length) {
    return template.name;
  }

  return `${template.name} - ${mainParts.join(' | ')}`;
}

export function validateQuickTextTemplate(
  template: QuickTextTemplate,
): string | null {
  const normalizedName = String(template.name || '').trim();

  if (!normalizedName) {
    return 'Informe o nome do modelo.';
  }

  if (!createModelSlug(template.model || template.name)) {
    return 'Nao foi possivel gerar o identificador do modelo.';
  }

  if (!template.fields.length) {
    return 'Adicione ao menos um campo.';
  }

  if (!template.fields.some(field => field.role === 'text')) {
    return 'Defina um campo como Texto principal.';
  }

  const hasEmptyLabel = template.fields.some(
    field => !String(field.label || '').trim(),
  );

  if (hasEmptyLabel) {
    return 'Todos os campos precisam de rótulo.';
  }

  return null;
}

export function validateQuickTextValues(
  template: QuickTextTemplate,
  values: Record<string, string>,
): string | null {
  const missingRequired = template.fields.find(field => {
    return field.required && !String(values[field.id] || '').trim();
  });

  if (missingRequired) {
    return `Preencha o campo "${missingRequired.label}".`;
  }

  const exportPayload = buildQuickTextExportData(template, values)[0];

  if (!exportPayload.text.trim()) {
    return 'O conteúdo precisa preencher o Texto principal.';
  }

  return null;
}

export function cloneOperationalContent(
  content: OperationalContent,
): OperationalContent {
  return JSON.parse(JSON.stringify(content)) as OperationalContent;
}

export function syncQuickTextContentWithTemplate(
  content: QuickTextContent,
  template: QuickTextTemplate,
): QuickTextContent {
  const exportData = buildQuickTextExportData(template, content.values);

  return {
    ...content,
    name: buildQuickTextDisplayName(template, content.values),
    exportData,
  };
}

export function normalizeQuickTextTemplates(
  templates: QuickTextTemplate[],
): QuickTextTemplate[] {
  const normalizedTemplates = (templates || [])
    .filter(Boolean)
    .map(template => sanitizeTemplate(template));

  if (!normalizedTemplates.length) {
    return [createDefaultQuickTextTemplate()];
  }

  return normalizedTemplates;
}

export function normalizeQuickTextItems(
  items: QuickTextContent[],
  templates: QuickTextTemplate[],
): QuickTextContent[] {
  return (items || []).filter(Boolean).map(item => {
    const template = templates.find(current => current.id === item.templateId);

    if (!template) {
      return item;
    }

    return syncQuickTextContentWithTemplate(item, template);
  });
}

export function normalizeOperationalContentList(
  contentList: OperationalContent[],
  templates: QuickTextTemplate[],
): OperationalContent[] {
  return (contentList || []).filter(Boolean).map(item => {
    if (item.type !== 'quickText') {
      return item;
    }

    const template = templates.find(current => current.id === item.templateId);

    if (!template) {
      return item;
    }

    return {
      ...syncQuickTextContentWithTemplate(item, template),
      active: item.active,
    };
  });
}

export interface LegacyBibleState {
  chapter?: unknown;
  chapterList?: unknown;
}

interface MergeLegacyBibleStateParams {
  existingContentList: OperationalContent[];
  existingCurrentBibleChapter: ChapterVerse[];
  legacyBibleState?: LegacyBibleState | null;
}

interface MergeLegacyBibleStateResult {
  contentList: OperationalContent[];
  currentBibleChapter: ChapterVerse[];
}

function normalizeLegacyChapterVerses(value: unknown): ChapterVerse[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(item => {
      return (
        item &&
        typeof item === 'object' &&
        Number.isFinite((item as ChapterVerse).number) &&
        typeof (item as ChapterVerse).text === 'string'
      );
    })
    .map(item => ({
      number: Number((item as ChapterVerse).number),
      text: String((item as ChapterVerse).text),
    }));
}

function buildLegacyBibleDedupeKey(content: BibleContent): string {
  return [
    'bible',
    String(content.version || '').toLowerCase(),
    String(content.book?.abbrev || '').toLowerCase(),
    String(content.chapter),
    String(content.verses || ''),
  ].join('|');
}

function mapLegacyBibleListToContent(value: unknown): BibleContent[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(item => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const version = String((item as BibleContent).version || '').trim();
      const rawBook = (item as BibleContent).book;
      const bookName = String(rawBook?.name || '').trim();
      const bookAbbrev = String(rawBook?.abbrev || '').trim();
      const chapter = Number((item as BibleContent).chapter);
      const versesArr = normalizeLegacyChapterVerses(
        (item as BibleContent).versesArr,
      );

      if (
        !version ||
        !bookName ||
        !bookAbbrev ||
        !Number.isFinite(chapter) ||
        chapter <= 0
      ) {
        return null;
      }

      const normalizedVerses =
        (item as BibleContent).verses === null ||
        (item as BibleContent).verses === undefined
          ? null
          : String((item as BibleContent).verses).trim() || null;

      const book = {
        name: bookName,
        abbrev: bookAbbrev,
      };
      const defaultName = `${version.toUpperCase()} - ${book.name} ${chapter}${
        normalizedVerses ? `: ${normalizedVerses}` : ''
      }`;

      return {
        id:
          typeof (item as BibleContent).id === 'string' &&
          (item as BibleContent).id.trim()
            ? (item as BibleContent).id
            : createId('legacy-bible'),
        type: 'bible' as const,
        name: String((item as BibleContent).name || '').trim() || defaultName,
        version,
        book,
        chapter,
        verses: normalizedVerses,
        versesArr,
        active: Boolean((item as BibleContent).active),
        exportData: buildBibleExportData(versesArr, {
          book,
          chapter,
          verses: normalizedVerses,
          version,
        }),
      };
    })
    .filter(Boolean) as BibleContent[];
}

export function mergeLegacyBibleState({
  existingContentList,
  existingCurrentBibleChapter,
  legacyBibleState,
}: MergeLegacyBibleStateParams): MergeLegacyBibleStateResult {
  const currentContentList = (existingContentList || []).filter(Boolean);
  const existingIds = new Set(
    currentContentList
      .map(item => item.id)
      .filter(id => typeof id === 'string' && id),
  );
  const existingBibleKeys = new Set(
    currentContentList
      .filter(item => item.type === 'bible')
      .map(item => buildLegacyBibleDedupeKey(item as BibleContent)),
  );

  const legacyMapped = mapLegacyBibleListToContent(
    legacyBibleState?.chapterList,
  );
  const hasActiveInCurrentList = currentContentList.some(item => item.active);
  let activeAlreadyAssigned = hasActiveInCurrentList;

  const mergedLegacyItems = legacyMapped.reduce((acc, item) => {
    const dedupeKey = buildLegacyBibleDedupeKey(item);

    if (existingBibleKeys.has(dedupeKey)) {
      return acc;
    }

    existingBibleKeys.add(dedupeKey);

    if (existingIds.has(item.id)) {
      item = {
        ...item,
        id: createId('legacy-bible'),
      };
    }

    existingIds.add(item.id);

    if (activeAlreadyAssigned || !item.active) {
      acc.push({
        ...item,
        active: false,
      });
      return acc;
    }

    activeAlreadyAssigned = true;
    acc.push(item);
    return acc;
  }, [] as BibleContent[]);

  const currentBibleChapter =
    (existingCurrentBibleChapter || []).length > 0
      ? existingCurrentBibleChapter
      : normalizeLegacyChapterVerses(legacyBibleState?.chapter);

  return {
    contentList: [...currentContentList, ...mergedLegacyItems],
    currentBibleChapter,
  };
}
