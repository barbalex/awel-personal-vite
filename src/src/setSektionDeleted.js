const setSektionDeleted = async ({ id, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      `update sektionen set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
      { id, user: store.userName, time: Date.now() },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  store.setSektionDeleted(id)
  if (!store.showDeleted) store.navigate(`/Sektionen`)
}

export default setSektionDeleted
