const fetchSettings = async ({ store }) => {
  const { setSettings, addError } = store
  let value = {}
  try {
    [value] = await window.electronAPI.queryWithParam(
      `SELECT * from settings where id=?`,
      1,
    )
  } catch (error) {
    return addError(error)
  }
  console.log('fetchSettings, value:', value)
  setSettings(value)
}

export default fetchSettings
