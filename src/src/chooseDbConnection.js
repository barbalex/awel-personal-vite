import chooseDb from './chooseDb'

const chooseDbConnection = async () => {
  const config = await window.electronAPI.getConfig()
  let dbPath
  try {
    dbPath = await chooseDb()
  } catch (chooseError) {
    return console.log('Error after choosing db:', chooseError)
  }
  config.dbPath = dbPath
  await window.electronAPI.saveConfig(config)
  window.electronAPI.reloadMainWindow()
}

export default chooseDbConnection
