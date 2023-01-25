const addWert = async ({ table, store, navigate }) => {
  // 1. create new value in db, returning id
  let info
  try {
    info = await window.electronAPI.editWithParam(
      `insert into ${table} (letzteMutationUser,letzteMutationZeit) values (@letzteMutationUser,@letzteMutationZeit)`,
      {
        letzteMutationUser: store.userName,
        letzteMutationZeit: Date.now(),
      },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // 2. add to store
  store[table].push({
    id: info.lastInsertRowid,
    letzteMutationUser: store.userName,
    letzteMutationZeit: Date.now(),
  })
  navigate(`/Werte/${table}/${info.lastInsertRowid}`)
}

export default addWert
