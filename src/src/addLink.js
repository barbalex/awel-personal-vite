import updatePersonsMutation from './updatePersonsMutation.js'

const addLink = async ({ url, personId, store }) => {
  // 1. create new link in db, returning id
  let info
  try {
    await window.electronAPI.editWithParam(
      'insert into links (idPerson, url, letzteMutationUser, letzteMutationZeit) values (@idPerson, @url, @letzteMutationUser, @letzteMutationZeit)',
      {
        idPerson: personId,
        url,
        letzteMutationUser: store.userName,
        letzteMutationZeit: Date.now(),
      },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // 2. add to store
  store.addLink({
    id: info.lastInsertRowid,
    url,
    idPerson: personId,
    letzteMutationUser: store.userName,
    letzteMutationZeit: Date.now(),
  })
  updatePersonsMutation({ personId, store: store })
}

export default addLink
