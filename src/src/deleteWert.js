import findIndex from 'lodash/findIndex'

const deleteWert = async ({ id, table, store }) => {
  // write to db
  try {
    await window.electronAPI.edit(`delete from ${table} where id = ${id}`)
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  /**
   * Do not use filter! Reason:
   * rebuilds self.personen. Consequence:
   * all other personen are re-added and listet as mutations of op 'add'
   */
  store[table].splice(
    findIndex(store[table], (p) => p.id === id),
    1,
  )
  store.navigate(`/Werte/${table}`)
}

export default deleteWert
