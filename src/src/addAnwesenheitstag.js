import updatePersonsMutation from './updatePersonsMutation.js'

const addAnwesenheitstag = async ({ tag, personId, store }) => {
  // 1. create new anwesenheitstag in db, returning id
  let info
  try {
    info = await window.electronAPI.editWithParam(
      'insert into anwesenheitstage (idPerson, tag, letzteMutationUser, letzteMutationZeit) values (@idPerson, @tag, @letzteMutationUser, @letzteMutationZeit)',
      {
        idPerson: personId,
        tag,
        letzteMutationUser: store.userName,
        letzteMutationZeit: Date.now(),
      },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // 2. add to store
  store.addAnwesenheitstag({
    id: info.lastInsertRowid,
    tag,
    idPerson: personId,
    letzteMutationUser: store.userName,
    letzteMutationZeit: Date.now(),
  })
  updatePersonsMutation({ personId, store: store })
}

export default addAnwesenheitstag
