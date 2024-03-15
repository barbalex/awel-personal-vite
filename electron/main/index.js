const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  dialog,
  shell,
  protocol,
  Notification,
} = require('electron')
const path = require('path')
const Database = require('better-sqlite3')
const fs = require('fs-extra')
const os = require('os')
// using an old version of username because newer use esm
const username = require('username')
// const exec = require('child_process').exec
const spawn = require('child_process').spawn

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

const dbKeyPath = path.join(process.env.PUBLIC, 'db_key_obfuscated.js')
const dbKey = require(dbKeyPath)

// function execute(command) {
//   return new Promise((resolve) => {
//     exec(command, (error, stdout) => {
//       resolve(stdout)
//     })
//   })
// }

function executePowershell(command) {
  return new Promise((resolve) => {
    const powershell = spawn('powershell.exe', [command])
    powershell.stdout.on('data', (data) => {
      resolve(data.toString())
    })
  })
}

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
    win.webContents.openDevTools()
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
    setTimeout(() => {
      db.close()
      app.quit()
      win.destroy()
    }, 500)
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

// console.log('index.js, dbPath:', dbPath)

const saveConfig = (event, data) => {
  const userPath = app.getPath('userData')
  const dataFilePath = path.join(userPath, 'awelPersonalConfig.json')
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
  return null
}
ipcMain.handle('save-config', saveConfig)

let db
app.whenReady().then(async () => {
  createWindow()
  // dialog cannot be used before app is ready
  let dbPath = getUserPath().dbPath || 'C:/Users/alexa/personal.db'
  console.log('will open db from path:', dbPath)
  try {
    db = Database(dbPath, {
      fileMustExist: true,
    })
  } catch (error) {
    console.log('index.js, Error opening db file:', error)
    // user most probably needs to choose db file
    dbPath = await openDialogGetPath(undefined, chooseDbOptions)
    db = new Database(dbPath, { fileMustExist: true })
    saveConfig(undefined, { dbPath })
  }
  let pragmaRes
  try {
    pragmaRes = db.pragma(`key='${dbKey}'`)
    console.log('index.js, pragmaRes:', { pragmaRes, dbKey })
  } catch (error) {
    console.log('index.js, Error setting db key:', error)
  }
  try {
    // test query to see if db is working
    // Otherwise queries from renderer process will fail with:
    // SqliteError: file is not a database
    db.prepare('select * from aemter').all()
  } catch (error) {
    console.log('index.js, Error test querying db:', error.message)
    if (error.message.includes('file is not a database')) {
      dbPath = await openDialogGetPath(undefined, chooseDbOptions)
      // db = new Database(dbPath, { fileMustExist: true })
      saveConfig(undefined, { dbPath })
      db.close()
      app.quit()
      // app.relaunch()
    }
  }
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

// TODO: queries can error on start if connected db is not encrypted
// Error invoking remote method 'query': SqliteError: file is not a database
// Error invoking remote method 'query-with-param': SqliteError: file is not a database
ipcMain.handle('query-with-param', (event, sql, param) => {
  let res
  try {
    res = db.prepare(sql).all(param)
  } catch (error) {
    console.log('index.js, Error in query-with-param:', error.message)
  }
  return res
})
ipcMain.handle('query', (event, sql) => {
  let res
  try {
    res = db.prepare(sql).all()
  } catch (error) {
    console.log('index.js, Error in query:', error.message)
  }
  return res
})

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
  // PROBLEM:
  // multiple ways to get username
  // but on installed version most return "SYSTEM"
  // Only thing that seems to work is powershell
  // example answer: PC_ALEX\\alexa\r\n
  let usernameFromPS
  if (process.platform === 'darwin') {
    usernameFromPS = await username()
  } else {
    usernameFromPS = await executePowershell(
      '[System.Security.Principal.WindowsIdentity]::GetCurrent().Name',
    )
  }
  const indexOfBackslash = usernameFromPS.indexOf('\\')
  const usernameWithoutDomain = usernameFromPS.slice(indexOfBackslash + 1)
  const usernameFromPsSanitized = usernameWithoutDomain.replace(/\r\n/g, '')
  const userName =
    usernameFromPsSanitized ??
    process.env.username ??
    process.env.user ??
    os?.userInfo?.()?.username
  // const usernameFromCmd = await execute('echo %USERNAME%')
  // const usernameFromUsername = await username()

  // console.log('index.js, get-user, userName:', {
  //   userName,
  //   processEnvUsername: process.env.username,
  //   processEnvUser: process.env.user,
  //   osUserInfoUsername: os?.userInfo?.()?.username,
  //   // usernameFromUsername,
  //   // usernameFromCmd,
  //   usernameFromPowershell: usernameFromPS,
  //   usernameFromPsSanitized,
  // })

  let user
  try {
    user = db.prepare(`select * from users where name = ?`).get(userName)
  } catch (error) {
    const notif20 = new Notification({
      title: 'Personal, error fetching user:',
      body: error.message,
    })
    notif20.show()
  }
  const isAdmin = user?.isAdmin === 1

  return {
    userName,
    isAdmin,
    pwd: user?.pwd ? atob(user.pwd) : undefined,
  }
})

ipcMain.handle('open-url', (event, url) => {
  return shell.openPath(url)
})
ipcMain.handle('encrypt-string', (event, string) => {
  return btoa(string)
})
ipcMain.handle('decrypt-string', (event, string) => {
  // return safeStorage.decryptString(string)
  return atob(string)
})
ipcMain.handle('quit', () => {
  db.close()
  app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
