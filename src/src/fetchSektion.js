const fetchSektion = async ({ store, id }) => {
  const { addError, setWatchMutations, setSektion } = store

  let sektion = []
  try {
    sektion = await window.electronAPI.queryWithParam(
      'SELECT * from sektionen where id = ?',
      id,
    )
  } catch (error) {
    addError(error)
  }

  setWatchMutations(false)
  setSektion(sektion[0])
  setWatchMutations(true)
}

export default fetchSektion
