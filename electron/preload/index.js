// BEWARE:
// webUtils is available in the renderer process but not in the main process
// thus here, not in index.js
const { contextBridge, ipcRenderer, webUtils } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  printToPdf: (dialogOptions) =>
    ipcRenderer.invoke('print-to-pdf', dialogOptions),
  getConfig: () => ipcRenderer.invoke('get-config'),
  getPathForFile: (file) => webUtils.getPathForFile(file),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  reloadMainWindow: () => ipcRenderer.invoke('reload-main-window'),
  openDialogGetPath: () => ipcRenderer.invoke('open-dialog-get-path'),
  openUrl: (path) => ipcRenderer.invoke('open-url', path),
  saveFile: (path, data) => ipcRenderer.invoke('save-file', path, data),
  saveDialogGetPath: (options) =>
    ipcRenderer.invoke('save-dialog-get-path', options),
  getUser: () => ipcRenderer.invoke('get-user'),
  queryWithParam: (sql, param) =>
    ipcRenderer.invoke('query-with-param', sql, param),
  query: (sql) => ipcRenderer.invoke('query', sql),
  editWithParam: (sql, param) =>
    ipcRenderer.invoke('edit-with-param', sql, param),
  edit: (sql) => ipcRenderer.invoke('edit', sql),
  decryptString: (string) => ipcRenderer.invoke('decrypt-string', string),
  encryptString: (string) => ipcRenderer.invoke('encrypt-string', string),
})
