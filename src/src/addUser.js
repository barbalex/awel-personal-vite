const addUser = async ({ store, navigate }) => {
  // 1. create new Amt in db, returning id
  let info
  try {
    info = await window.electronAPI.editWithParam(
      `insert into users (letzteMutationUser, letzteMutationZeit) values (@user, @zeit)`,
      { user: store.userName, zeit: Date.now() },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // 2. add to store
  store.addUser({
    id: info.lastInsertRowid,
    letzteMutationUser: store.userName,
    letzteMutationZeit: Date.now(),
  })
  navigate(`/Users/${info.lastInsertRowid}`)
}

export default addUser
