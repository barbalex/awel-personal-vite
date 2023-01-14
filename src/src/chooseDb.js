const options = {
  title: 'Datenbank für AWEL-Personal wählen',
  properties: ['openFile'],
  filters: [{ name: 'sqlite-Datenbanken', extensions: ['db'] }],
}

const chooseDb = async () => {
  const path = window.electronAPI.openDialogGetPath(options)
  return path.filePaths[0]
}

export default chooseDb
