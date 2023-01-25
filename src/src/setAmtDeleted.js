const setAmtDeleted = async ({ id, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      `update aemter set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
      { id, user: store.userName, time: Date.now() },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  store.setAmtDeleted(id)
  if (!store.showDeleted) store.navigate(`/Aemter`)
}

export default setAmtDeleted
