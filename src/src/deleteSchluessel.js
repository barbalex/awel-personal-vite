import updatePersonsMutation from './updatePersonsMutation.js'

const deleteSchluessel = async ({ id, personId, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      'delete from schluessel where id = ?',
      id,
    )
  } catch (error) {
    self.addError(error)
    return console.log(error)
  }
  // write to store
  store.deleteSchluessel(id)
  // set persons letzteMutation
  updatePersonsMutation({ personId, store })
}

export default deleteSchluessel
