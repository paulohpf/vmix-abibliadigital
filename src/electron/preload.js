const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
  saveBibleJson: data => {
    ipcRenderer.send('save-bible-json', data);
  },
});
