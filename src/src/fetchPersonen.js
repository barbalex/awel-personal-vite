const fetchPersonen = ({ store }) => {
  const { db, setPersonen, addError } = store
  let personen = []
  try {
    personen = db.prepare('SELECT * from personen').all()
  } catch (error) {
    addError(error)
  }
  setPersonen(personen)
}

export default fetchPersonen
