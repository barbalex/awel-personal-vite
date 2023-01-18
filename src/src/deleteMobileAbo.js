import updatePersonsMutation from './updatePersonsMutation.js'

const deleteMobileAbo = async ({ id, personId, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      'delete from mobileAbos where id = ?',
      id,
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  store.deleteMobileAbo(id)
  // set persons letzteMutation
  updatePersonsMutation({ personId, store })
}

export default deleteMobileAbo
