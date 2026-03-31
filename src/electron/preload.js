const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
  saveBibleJson: payload => {
    ipcRenderer.send('save-bible-json', payload);
  },
  saveContentJson: payload => {
    ipcRenderer.send('save-content-json', payload);
  },
});
