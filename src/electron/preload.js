const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
  saveBibleJson: payload => {
    ipcRenderer.send('save-bible-json', payload);
  },
});
