import Database from 'better-sqlite3'
import chooseDb from './chooseDb'

const getDb = async (store) => {
  const config = window.electronAPI.getConfig()
  let dbPath = config.dbPath || 'C:/Users/alexa/personal.db'

  let db
  try {
    db = new Database(dbPath, { fileMustExist: true })
  } catch (error) {
    if (
      (error.code && error.code === 'SQLITE_CANTOPEN') ||
      error.message.includes('directory does not exist')
    ) {
      // user needs to choose db file
      try {
        dbPath = await chooseDb()
      } catch (chooseError) {
        store.addError(chooseError)
        return console.log('Error after choosing db:', chooseError)
      }
      db = new Database(dbPath, { fileMustExist: true })
      config.dbPath = dbPath
      window.electronAPI.saveConfig(config)
    } else {
      store.addError(error)
      return console.log('index.js, Error opening db file:', error)
    }
  }
  return db
}

export default getDb
