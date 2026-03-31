export interface CredentialsParams {
  email: string;
  password: string;
}

export interface BibleVersion {
  name: string;
  abbrev: string;
}

export interface BibleBook {
  name: string;
  abbrev: string;
  chapters: string[][];
}

export interface BibleData {
  name: string;
  abbrev: string;
  books: BibleBook[];
}

export interface ChapterVerse {
  number: number;
  text: string;
}

export interface SaveBibleJsonPayload {
  data: unknown;
  nodeEnv?: 'development' | 'production' | string;
  target?: 'bible' | 'quickText';
}
