const fetchPerson = async ({ store, id }) => {
  const { addError, setWatchMutations, setPerson } = store

  let person = []
  try {
    person = await window.electronAPI.queryWithParam(
      'SELECT * from personen where id = ?',
      id,
    )
  } catch (error) {
    addError(error)
  }

  setWatchMutations(false)
  setPerson(person)
  setWatchMutations(true)
}

export default fetchPerson
