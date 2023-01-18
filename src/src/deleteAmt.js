const deleteAmt = async ({ id, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      'delete from aemter where id = ?',
      id,
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  store.deleteAmt(id)
  store.navigate(`/Aemter`)
}

export default deleteAmt
