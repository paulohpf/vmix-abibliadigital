import { contextBridge, ipcRenderer } from 'electron';
import { PreloadApi, SaveBibleJsonPayload } from './interface';

const api: PreloadApi = {
  saveBibleJson: (payload: SaveBibleJsonPayload): void => {
    ipcRenderer.send('save-bible-json', payload);
  },
};

contextBridge.exposeInMainWorld('myAPI', api);
