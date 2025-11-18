const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Add any electron-specific APIs here if needed
  platform: process.platform,
  versions: process.versions,
});
