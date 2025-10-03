const updatePersonsMutation = async ({ personId, store }) => {
  // in db
  try {
    await window.electronAPI.editWithParam(
      `update personen set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
      {
        user: store.userName,
        time: Date.now(),
        id: personId,
      },
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // in store
  store.updatePersonsMutation(personId)
}

export default updatePersonsMutation
