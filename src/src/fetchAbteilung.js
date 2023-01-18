const fetchAbteilung = async ({ store, id }) => {
  const { addError, setWatchMutations, setAbteilung } = store

  let result = []
  try {
    result = await window.electronAPI.queryWithParam(
      'SELECT * from abteilungen where id = ?',
      id,
    )
  } catch (error) {
    addError(error)
  }

  const abteilung = result?.[0]
  if (!abteilung) return

  setWatchMutations(false)
  setAbteilung(abteilung)
  setWatchMutations(true)
}

export default fetchAbteilung
