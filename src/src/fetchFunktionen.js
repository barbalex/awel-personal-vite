const fetchFunktionen = ({ store }) => {
  const { db, setFunktionen, addError } = store
  let funktionen = []
  try {
    funktionen = db.prepare('SELECT * from funktionen').all()
  } catch (error) {
    addError(error)
  }
  setFunktionen(funktionen)
}

export default fetchFunktionen
