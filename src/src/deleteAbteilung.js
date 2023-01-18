const deleteAbteilung = async ({ id, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      'delete from abteilungen where id = ?',
      id,
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  store.deleteAbteilung(id)
  store.navigate(`/Abteilungen`)
}

export default deleteAbteilung
