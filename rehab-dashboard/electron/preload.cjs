const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startSession: (sessionData) => ipcRenderer.invoke('start-session', sessionData),
  runBoatExe: () => ipcRenderer.invoke('run-boat-exe'),
});
