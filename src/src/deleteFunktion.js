import updatePersonsMutation from './updatePersonsMutation.js'

const deleteFunktion = async ({ funktion, personId, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      'delete from funktionen where idPerson = @idPerson and funktion = @funktion',
      { idPerson: personId, funktion },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  store.deleteFunktion({ funktion, personId })
  updatePersonsMutation({ personId, store })
}

export default deleteFunktion
