import updatePersonsMutation from './updatePersonsMutation.js'

const addFunktion = async ({ funktion, personId, store }) => {
  // 1. create new funktion in db, returning id
  let info
  try {
    info = await window.electronAPI.editWithParam(
      'insert into funktionen (idPerson, funktion, letzteMutationUser, letzteMutationZeit) values (@idPerson, @funktion, @letzteMutationUser, @letzteMutationZeit)',
      {
        idPerson: personId,
        funktion,
        letzteMutationUser: store.userName,
        letzteMutationZeit: Date.now(),
      },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // 2. add to store
  store.addFunktion({
    id: info.lastInsertRowid,
    funktion,
    idPerson: personId,
    letzteMutationUser: store.userName,
    letzteMutationZeit: Date.now(),
  })
  updatePersonsMutation({ personId, store })
}

export default addFunktion
