import updatePersonsMutation from './updatePersonsMutation'

const addSchluessel = async ({ personId, store }) => {
  // 1. create new link in db, returning id
  let info
  try {
    info = await window.electronAPI.editWithParam(
      'insert into schluessel (idPerson, letzteMutationUser, letzteMutationZeit) values (@idPerson,@letzteMutationUser,@letzteMutationZeit)',
      {
        idPerson: personId,
        letzteMutationUser: store.userName,
        letzteMutationZeit: Date.now(),
      },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // 2. add to store
  store.addSchluessel({
    id: info.lastInsertRowid,
    idPerson: personId,
    letzteMutationUser: store.userName,
    letzteMutationZeit: Date.now(),
  })
  updatePersonsMutation({ personId, store })
}

export default addSchluessel
