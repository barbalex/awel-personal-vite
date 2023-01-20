const deleteUser = async ({ id, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam('delete from users where id = ?', id)
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  store.deleteUser(id)
  store.navigate(`/Users`)
}

export default deleteUser
