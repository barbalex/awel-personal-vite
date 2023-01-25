const setPersonDeleted = async ({ id, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      `update personen set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
      { id, user: store.userName, time: Date.now() },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  const person = store.personen.find((p) => p.id === id)
  if (!person)
    return store.addError(new Error(`Person with id ${id} not found`))

  store.setPerson({
    ...person,
    deleted: 1,
    letzteMutationUser: store.userName,
    letzteMutationZeit: Date.now(),
  })
  if (!store.showDeleted) store.navigate(`/Personen`)
}

export default setPersonDeleted
