const fetchSchluessel = ({ store }) => {
  const { db, setSchluessel, addError } = store
  let schluessel = []
  try {
    schluessel = db.prepare('SELECT * from schluessel').all()
  } catch (error) {
    addError(error)
  }
  setSchluessel(schluessel)
}

export default fetchSchluessel
