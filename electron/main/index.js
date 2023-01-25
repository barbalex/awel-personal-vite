const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  dialog,
  shell,
  protocol,
  safeStorage,
} = require('electron')
const path = require('path')
const Database = require('better-sqlite3')
const fs = require('fs-extra')

const dbKey = require('../../db_key')

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = path.join(__dirname, '../')
process.env.DIST = path.join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

// TODO: this happens. Why?
// if (!app.requestSingleInstanceLock()) {
//   console.log('5')
//   app.quit()
//   process.exit(0)
// }

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
// Here, you can also use other preload
const preload = path.join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = path.join(process.env.DIST, 'index.html')

const createWindow = () => {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1800,
    height: 1024,
    icon: path.join(process.env.PUBLIC, 'favicon.ico'),
    // only show after it was sized
    show: false,
    webPreferences: {
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // nodeIntegration: true,
      preload,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    // WARNING: this will disable focusing the login input
    // win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
    // only remove application menu in production
    // because need it to open devTools in development
    Menu.setApplicationMenu(null)
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  win.maximize()
  // Menu.setApplicationMenu(null)

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  // save window state on close
  win.on('close', (e) => {
    e.preventDefault()

    // in case user has changed data inside an input and not blured yet,
    // force bluring so data is saved
    win.webContents.executeJavaScript('document.activeElement.blur()')
    setTimeout(() => win.destroy(), 500)
  })
  // creating a secure protocol is necessary to enable loading local files
  // see: https://github.com/electron/electron/issues/23393#issuecomment-623759531
  protocol.registerFileProtocol('secure-protocol', (request, callback) => {
    const url = request.url.replace('secure-protocol://', '')
    try {
      return callback(url)
    } catch (error) {
      console.error(error)
      return callback(404)
    }
  })
}

const getUserPath = () => {
  const userDataPath = app.getPath('userData')
  const dataFilePath = path.join(userDataPath, 'awelPersonalConfig.json')
  if (!fs.existsSync(dataFilePath)) return {}
  const configFile = fs.readFileSync(dataFilePath, 'utf-8') || {}
  if (!configFile) return {}
  // console.log('getUserPath, configFile:', configFile)
  return JSON.parse(configFile)
}

const chooseDbOptions = {
  title: 'Datenbank für AWEL-Personal wählen',
  properties: ['openFile'],
  filters: [{ name: 'sqlite-Datenbanken', extensions: ['db'] }],
}
const openDialogGetPath = async (event, chooseDbOptions) => {
  const { filePaths } = await dialog.showOpenDialog(chooseDbOptions)
  const filePath = filePaths?.[0]
  // console.log('openDialogGetPath, filePath:', filePath)
  return filePath
}

let db
let dbPath = getUserPath().dbPath || 'C:/Users/alexa/personal.db'
try {
  db = Database(dbPath, {
    fileMustExist: true,
  })
} catch (error) {
  console.log('index.js, Error opening db file:', error)
  if (
    (error.code && error.code === 'SQLITE_CANTOPEN') ||
    error.message.includes('directory does not exist')
  ) {
    // user needs to choose db file
    openDialogGetPath(undefined, chooseDbOptions).then((result) => {
      dbPath = result.filePaths[0]
      db = new Database(dbPath, { fileMustExist: true })
      saveConfig(undefined, { dbPath })
    })
  } else {
    // TODO: how to surface this error?
    // store.addError(error)
    return console.log('index.js, Error opening db file:', error)
  }
}

app.whenReady().then(() => {
  // safeStorage cannot be used before app is ready
  const key = safeStorage.decryptString(Buffer.from(dbKey))
  db.pragma(`key='${key}'`)
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    db.close()
    app.quit()
  }
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// exceljs workbook.xlsx.writeFile does not work
// so export in main thread
ipcMain.handle('save-file', (event, path, data) => {
  fs.outputFile(path, data)
    .then(() => event.sender.send('SAVED_FILE'))
    .catch((error) => event.sender.send('ERROR', error.message))
})

ipcMain.handle('get-user-data-path', () => {
  const path = app.getPath('userData')
  return path
})

const saveConfig = (event, data) => {
  const userPath = app.getPath('userData')
  const dataFilePath = path.join(userPath, 'awelPersonalConfig.json')
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
  return null
}
ipcMain.handle('save-config', saveConfig)

ipcMain.handle('query-with-param', (event, sql, param) =>
  db.prepare(sql).all(param),
)
ipcMain.handle('query', (event, sql) => db.prepare(sql).all())
ipcMain.handle('edit-with-param', (event, sql, param) =>
  db.prepare(sql).run(param),
)
ipcMain.handle('edit', (event, sql) => db.prepare(sql).run())

ipcMain.handle('get-config', () => getUserPath())

ipcMain.handle('reload-main-window', () => {
  win.reload()
})

ipcMain.handle(
  'print-to-pdf',
  async (event, printToPDFOptions, dialogOptions) => {
    try {
      const data = await win.webContents.printToPDF(printToPDFOptions)
      const { filePath } = await dialog.showSaveDialog(dialogOptions)
      await fs.outputFile(filePath, data)
      shell.openPath(filePath)
    } catch (error) {
      event.sender.send('ERROR', error.message)
    }
    event.sender.send('PRINTED-TO-PDF')
    return null
  },
)

// 2021.08.27: not in use becaus printed too small
ipcMain.handle('print', async (event, options) => {
  await win.webContents.print(options)
  return null
})
ipcMain.handle('save-dialog-get-path', async (event, dialogOptions) => {
  const { filePath } = await dialog.showSaveDialog(dialogOptions)
  return filePath
})
ipcMain.handle('open-dialog-get-path', openDialogGetPath)
ipcMain.handle('get-user', async () => {
  let userName
  try {
    const { usernameSync } = await import('username')
    userName = usernameSync()
  } catch (error) {
    return null
  }
  const user = db.prepare(`select * from users where name = ?`).get(userName)

  return {
    userName,
    isAdmin: user?.isAdmin === 1,
    pwd: safeStorage.decryptString(user?.pwd),
  }
})
ipcMain.handle('open-url', (event, url) => {
  return shell.openPath(url)
})
ipcMain.handle('encrypt-string', (event, string) => {
  return safeStorage.encryptString(string)
})
ipcMain.handle('decrypt-string', (event, buffer) => {
  return safeStorage.decryptString(buffer)
})
ipcMain.handle('quit', () => {
  app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
