const setAmtDeleted = async ({ id, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      `update aemter set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
      { id, user: self.username, time: Date.now() },
    )
  } catch (error) {
    self.addError(error)
    return console.log(error)
  }
  // write to store
  store.setAmtDeleted(id)
  if (!self.showDeleted) self.navigate(`/Aemter`)
}

export default setAmtDeleted
