const updatePersonsMutation = async ({ idPerson, store }) => {
  // in db
  try {
    await window.electronAPI.editWithParam(
      `update personen set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
      {
        user: store.username,
        time: Date.now(),
        id: idPerson,
      },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // in store
  store.updatePersonsMutation(idPerson)
}

export default updatePersonsMutation
