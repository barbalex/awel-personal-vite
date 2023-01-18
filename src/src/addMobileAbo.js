const addMobileAbo = async ({ personId, store }) => {
  // 1. create new link in db, returning id
  let info
  try {
    info = await window.electronAPI.editWithParam(
      'insert into mobileAbos (idPerson,letzteMutationUser, letzteMutationZeit) values (@idPerson,@letzteMutationUser,@letzteMutationZeit)',
      {
        idPerson: personId,
        letzteMutationUser: store.username,
        letzteMutationZeit: Date.now(),
      },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // 2. add to store
  store.addMobileAbo({
    id: info.lastInsertRowid,
    idPerson: personId,
    letzteMutationUser: store.username,
    letzteMutationZeit: Date.now(),
  })
  store.updatePersonsMutation(personId)
}

export default addMobileAbo
