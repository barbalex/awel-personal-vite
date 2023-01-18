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
  store.updatePersonsMutation(personId)
}

export default deleteFunktion
