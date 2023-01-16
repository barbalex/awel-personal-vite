const fetchPerson = async ({ store, id }) => {
  const { addError, setWatchMutations, setPerson } = store

  let result = []
  try {
    result = await window.electronAPI.queryWithParam(
      'SELECT * from personen where id = ?',
      id,
    )
  } catch (error) {
    addError(error)
  }

  const person = result[0]
  if (!person) return

  setWatchMutations(false)
  setPerson(person)
  setWatchMutations(true)
}

export default fetchPerson
