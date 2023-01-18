const deleteWert = async ({ id, table, store }) => {
  // write to db
  try {
    await window.electronAPI.edit(`delete from ${table} where id = ${id}`)
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  store.removeWert({ id, table })
  store.navigate(`/Werte/${table}`)
}

export default deleteWert
