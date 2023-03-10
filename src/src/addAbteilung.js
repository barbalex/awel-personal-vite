const addAbteilung = async ({ store, navigate }) => {
  // 1. create new Abteilung in db, returning id
  let info
  try {
    info = await window.electronAPI.editWithParam(
      `insert into abteilungen (letzteMutationUser, letzteMutationZeit, amt) values (@user, @zeit, @amt)`,
      { user: store.userName, zeit: Date.now(), amt: 1 },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // 2. add to store
  store.addAbteilung({
    id: info.lastInsertRowid,
    letzteMutationUser: store.userName,
    letzteMutationZeit: Date.now(),
  })
  navigate(`/Abteilungen/${info.lastInsertRowid}`)
}

export default addAbteilung
