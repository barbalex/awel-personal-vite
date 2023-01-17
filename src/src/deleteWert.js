import findIndex from 'lodash/findIndex'

const deleteWert=({ id, table,store })=>{
  // write to db
  try {
    await window.electronAPI.edit(`delete from ${table} where id = ${id}`)
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  store[table].splice(
    findIndex(store[table], (p) => p.id === id),
    1,
  )
  store.navigate(`/Werte/${table}`)}

export default deleteWert