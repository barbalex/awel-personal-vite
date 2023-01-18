const deletePerson = async ({ id, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      'delete from personen where id = ?',
      id,
    )
  } catch (error) {
    store.addError(error)
    // roll back update
    return console.log(error)
  }
  // write to store
  store.removePerson(id)
  store.navigate(`/Personen`)
}

export default deletePerson
