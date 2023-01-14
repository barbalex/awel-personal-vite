const fetchAnwesenheitstage = ({ store }) => {
  const { db, setAnwesenheitstage, addError } = store
  let anwesenheitstage = []
  try {
    anwesenheitstage = db.prepare('SELECT * from anwesenheitstage').all()
  } catch (error) {
    addError(error)
  }
  setAnwesenheitstage(anwesenheitstage)
}

export default fetchAnwesenheitstage
