const setWertDeleted = async ({ id, table, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      `update ${table} set deleted = 1 where id = ?;`,
      id,
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  const dat = store[table].find((p) => p.id === id)
  dat.deleted = 1
  // navigate to parent
  if (!store.showDeleted) store.navigate(`/Werte/${table}`)
}

export default setWertDeleted
