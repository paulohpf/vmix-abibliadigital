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
