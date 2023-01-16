const fetchBereich = async ({ store, id }) => {
  const { addError, setWatchMutations, setBereich } = store

  let bereich = []
  try {
    bereich = await window.electronAPI.queryWithParam(
      'SELECT * from bereiche where id = ?',
      id,
    )
  } catch (error) {
    addError(error)
  }

  setWatchMutations(false)
  setBereich(bereich[0])
  setWatchMutations(true)
}

export default fetchBereich
