import updatePersonsMutation from './updatePersonsMutation.js'

const deleteEtikett = async ({ etikett, personId, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      'delete from etiketten where idPerson = @idPerson and etikett = @etikett',
      { idPerson: personId, etikett },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  store.deleteEtikett({ etikett, personId })
  updatePersonsMutation({ personId, store })
}

export default deleteEtikett
