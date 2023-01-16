const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  printToPdf: (dialogOptions) =>
    ipcRenderer.invoke('print-to-pdf', dialogOptions),
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  reloadMainWindow: () => ipcRenderer.invoke('reload-main-window'),
  openDialogGetPath: (options) =>
    ipcRenderer.invoke('open-dialog-get-path', options),
  openUrl: (path) => ipcRenderer.invoke('open-url', path),
  saveFile: (path, data) => ipcRenderer.invoke('save-file', path, data),
  saveDialogGetPath: (options) =>
    ipcRenderer.invoke('save-dialog-get-path', options),
  getUsername: () => ipcRenderer.invoke('get-username'),
  queryWithParam: (sql, param) =>
    ipcRenderer.invoke('query-with-param', sql, param),
  query: (sql) => ipcRenderer.invoke('query', sql),
  editWithParam: (sql, param) =>
    ipcRenderer.invoke('edit-with-param', sql, param),
  edit: (sql) => ipcRenderer.invoke('edit', sql),
})
