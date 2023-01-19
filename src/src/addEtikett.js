import updatePersonsMutation from './updatePersonsMutation'

const addEtikett = async ({ etikett, personId, store }) => {
  // 1. create new etikett in db, returning id
  let info
  try {
    info = await window.electronAPI.editWithParam(
      'insert into etiketten (idPerson, etikett, letzteMutationUser, letzteMutationZeit) values (@idPerson, @etikett, @letzteMutationUser, @letzteMutationZeit)',
      {
        idPerson: personId,
        etikett,
        letzteMutationUser: store.username,
        letzteMutationZeit: Date.now(),
      },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // 2. add to store
  store.addEtikett({
    id: info.lastInsertRowid,
    etikett,
    idPerson: personId,
    letzteMutationUser: store.username,
    letzteMutationZeit: Date.now(),
  })
  updatePersonsMutation({ personId, store: store })
}

export default addEtikett
