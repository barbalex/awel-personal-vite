const fetchSettings = async ({ store }) => {
  const { setSettings, addError } = store
  let value = {}
  try {
    value = await window.electronAPI.queryWithParam(
      `SELECT * from settings where id=?`,
      1,
    )
  } catch (error) {
    return addError(error)
  }
  setSettings(value)
}

export default fetchSettings
