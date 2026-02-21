export interface SaveBibleJsonPayload {
  data: unknown;
  nodeEnv?: 'development' | 'production' | string;
}

export interface PreloadApi {
  saveBibleJson: (payload: SaveBibleJsonPayload) => void;
}
