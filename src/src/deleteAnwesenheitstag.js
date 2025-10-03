import updatePersonsMutation from './updatePersonsMutation.js'

const deleteAnwesenheitstag = async ({ tag, personId, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      'delete from anwesenheitstage where idPerson = @idPerson and tag = @tag',
      { idPerson: personId, tag },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  store.deleteAnwesenheitstag({ tag, personId })
  updatePersonsMutation({ personId, store })
}

export default deleteAnwesenheitstag
