import updatePersonsMutation from './updatePersonsMutation.js'

const deleteLink = async ({ id, personId, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam('delete from links where id = ?', id)
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  store.deleteLink(id)
  // set persons letzteMutation
  updatePersonsMutation({ personId, store })
}

export default deleteLink
