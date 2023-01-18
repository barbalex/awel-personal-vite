const setAbteilungDeleted = async ({ id, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      `update abteilungen set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
      { id, user: store.username, time: Date.now() },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  store.setAbteilungDeleted(id)
  if (!store.showDeleted) store.navigate(`/Abteilungen`)
}

export default setAbteilungDeleted
