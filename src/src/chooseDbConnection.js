const chooseDbConnection = async () => {
  const config = await window.electronAPI.getConfig()
  let dbPath
  try {
    dbPath = await window.electronAPI.openDialogGetPath()
  } catch (chooseError) {
    return console.log('Error after choosing db:', chooseError)
  }
  config.dbPath = dbPath
  await window.electronAPI.saveConfig(config)
  window.electronAPI.reloadMainWindow()
}

export default chooseDbConnection
