const deleteBereich = async ({ id, store }) => {
  // write to db
  try {
    await window.electronAPI.editWithParam(
      'delete from bereiche where id = ?',
      id,
    )
  } catch (error) {
    store.addError(error)
    return console.log(error)
  }
  // write to store
  store.deleteBereich(id)
  store.navigate(`/Bereiche`)
}

export default deleteBereich
