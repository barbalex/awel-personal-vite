const fetchSektion = async ({ store, id }) => {
  const { addError, setWatchMutations, setSektion } = store

  let result = []
  try {
    result = await window.electronAPI.queryWithParam(
      'SELECT * from sektionen where id = ?',
      id,
    )
  } catch (error) {
    addError(error)
  }

  const sektion = result?.[0]
  if (!sektion) return

  setWatchMutations(false)
  setSektion(sektion)
  setWatchMutations(true)
}

export default fetchSektion
