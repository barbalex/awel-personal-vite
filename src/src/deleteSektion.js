const deleteSektion = async ({ id, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      'delete from sektionen where id = ?',
      id,
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  store.deleteSektion(id)
  store.navigate(`/Sektionen`)
}

export default deleteSektion
