const fetchSettings = ({ store }) => {
  const { setSettings, addError } = store
  let value = {}
  try {
    value = window.electronAPI.queryWithParam(
      `SELECT * from settings where id=?`,
      1,
    )
  } catch (error) {
    return addError(error)
  }
  setSettings(value)
}

export default fetchSettings
