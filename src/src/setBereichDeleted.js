const setBereichDeleted = async ({ id, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      `update bereiche set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
      { id, user: store.username, time: Date.now() },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  store.setBereichDeleted(id)
  if (!store.showDeleted) store.navigate(`/Bereiche`)
}

export default setBereichDeleted
