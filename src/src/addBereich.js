const addBereich = async ({ store, navigate }) => {
  // 1. create new Bereich in db, returning id
  let info
  try {
    info = await window.electronAPI.editWithParam(
      `insert into bereiche (letzteMutationUser, letzteMutationZeit) values (@user, @zeit)`,
      { user: store.username, zeit: Date.now() },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // 2. add to store
  store.addBereich({
    id: info.lastInsertRowid,
    letzteMutationUser: store.username,
    letzteMutationZeit: Date.now(),
  })
  navigate(`/Bereiche/${info.lastInsertRowid}`)
}

export default addBereich
