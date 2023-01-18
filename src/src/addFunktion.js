const addFunktion = async ({ funktion, personId, store }) => {
  // 1. create new funktion in db, returning id
  let info
  try {
    info = await window.electronAPI.editWithParam(
      'insert into funktionen (idPerson, funktion, letzteMutationUser, letzteMutationZeit) values (@idPerson, @funktion, @letzteMutationUser, @letzteMutationZeit)',
      {
        idPerson: personId,
        funktion,
        letzteMutationUser: store.username,
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
    letzteMutationUser: store.username,
    letzteMutationZeit: Date.now(),
  })
  store.updatePersonsMutation(personId)
}

export default addFunktion
