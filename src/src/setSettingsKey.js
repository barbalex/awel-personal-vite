const setSettingsKey = async ({ key, value, store }) => {
  try {
    await window.electronAPI.editWithParam(
      `update settings set ${key} = ? where id = 1`,
      value,
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  store.setSettingsKey({ key, value })
}

export default setSettingsKey
