const addAmt = async ({ store, navigate }) => {
  // 1. create new Amt in db, returning id
  let info
  try {
    info = await window.electronAPI.editWithParam(
      `insert into aemter (letzteMutationUser, letzteMutationZeit) values (@user, @zeit)`,
      { user: store.username, zeit: Date.now() },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // 2. add to store
  store.addAmt({
    id: info.lastInsertRowid,
    letzteMutationUser: store.username,
    letzteMutationZeit: Date.now(),
  })
  navigate(`/Aemter/${info.lastInsertRowid}`)
}

export default addAmt
