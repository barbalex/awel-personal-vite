const fetchBereich = async ({ store, id }) => {
  const { addError, setWatchMutations, setBereich } = store

  let result = []
  try {
    result = await window.electronAPI.queryWithParam(
      'SELECT * from bereiche where id = ?',
      id,
    )
  } catch (error) {
    addError(error)
  }

  const bereich = result?.[0]
  if (!bereich) return

  setWatchMutations(false)
  setBereich(bereich)
  setWatchMutations(true)
}

export default fetchBereich
