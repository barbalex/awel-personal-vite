const fetchAbteilung = async ({ store, id }) => {
  const { addError, setWatchMutations, setAbteilung } = store

  let abteilung = []
  try {
    abteilung = await window.electronAPI.queryWithParam(
      'SELECT * from abteilungen where id = ?',
      id,
    )
  } catch (error) {
    addError(error)
  }

  setWatchMutations(false)
  setAbteilung(abteilung)
  setWatchMutations(true)
}

export default fetchAbteilung
