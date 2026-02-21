import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import path from 'path';
import ElectronProvider from '@/providers/electron';

const isDevelopment = process.env.NODE_ENV !== 'production';

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

let mainWin;

function isAllowedSender(event) {
  const senderFrame = event && event.senderFrame ? event.senderFrame : null;
  const senderUrl = String(senderFrame && senderFrame.url ? senderFrame.url : '');

  return (
    senderUrl.startsWith('app://') ||
    senderUrl.startsWith('http://localhost') ||
    senderUrl.startsWith('http://127.0.0.1')
  );
}

async function createWindow() {
  mainWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await mainWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) mainWin.webContents.openDevTools();
  } else {
    createProtocol('app');
    mainWin.loadURL('app://./index.html');
  }

  ipcMain.on('save-bible-json', (event, payload) => {
    if (!isAllowedSender(event)) {
      return;
    }

    ElectronProvider.handleBibleShowChapter(event, payload);
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
