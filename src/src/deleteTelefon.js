import updatePersonsMutation from './updatePersonsMutation.js'

const deleteTelefon = async ({ id, personId, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      'delete from telefones where id = ?',
      id,
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  store.deleteTelefon(id)
  // set persons letzteMutation
  updatePersonsMutation({ personId, store })
}

export default deleteTelefon
