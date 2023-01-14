const fetchAnwesenheitstage = async ({ store }) => {
  const { setAnwesenheitstage, addError } = store
  let anwesenheitstage = []
  try {
    anwesenheitstage = await window.electronAPI.query(
      'SELECT * from anwesenheitstage',
    )
  } catch (error) {
    addError(error)
  }
  setAnwesenheitstage(anwesenheitstage)
}

export default fetchAnwesenheitstage
