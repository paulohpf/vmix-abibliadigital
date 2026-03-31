import { BibleBook, ChapterVerse } from '@/providers/interface';

export interface ExportedContentLine {
  text: string;
  info?: string;
  model?: string;
}

export type ContentType = 'bible' | 'quickText';
export type QuickTextFieldType = 'text';
export type QuickTextFieldRole = 'text' | 'info' | 'none';

export interface OperationalContentBase {
  id: string;
  type: ContentType;
  name: string;
  active: boolean;
  exportData: ExportedContentLine[];
}

export interface BibleContent extends OperationalContentBase {
  type: 'bible';
  version: string;
  book: Pick<BibleBook, 'name' | 'abbrev'>;
  chapter: number;
  verses: string | null;
  versesArr: ChapterVerse[];
}

export interface QuickTextField {
  id: string;
  label: string;
  type: QuickTextFieldType;
  required: boolean;
  placeholder: string;
  role: QuickTextFieldRole;
  order: number;
}

export interface QuickTextTemplate {
  id: string;
  model: string;
  name: string;
  baseType: 'quickText';
  fields: QuickTextField[];
}

export interface QuickTextContent extends OperationalContentBase {
  type: 'quickText';
  templateId: string;
  values: Record<string, string>;
}

export type OperationalContent = BibleContent | QuickTextContent;

export interface ContentState {
  currentBibleChapter: ChapterVerse[];
  contentList: OperationalContent[];
  quickTextTemplates: QuickTextTemplate[];
  quickTextItems: QuickTextContent[];
}
