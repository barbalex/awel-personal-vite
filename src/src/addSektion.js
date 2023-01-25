const addSektion = async ({ store, navigate }) => {
  // 1. create new Sektion in db, returning id
  let info
  try {
    info = await window.electronAPI.editWithParam(
      `insert into sektionen (letzteMutationUser, letzteMutationZeit) values (@user, @zeit)`,
      { user: store.userName, zeit: Date.now() },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // 2. add to store
  store.addSektion({
    id: info.lastInsertRowid,
    letzteMutationUser: store.userName,
    letzteMutationZeit: Date.now(),
  })
  navigate(`/Sektionen/${info.lastInsertRowid}`)
}

export default addSektion
