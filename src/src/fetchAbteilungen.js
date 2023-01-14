const fetchAbteilungen = ({ store }) => {
  const { db, setAbteilungen, addError } = store
  let abteilungen = []
  try {
    abteilungen = db.prepare('SELECT * from abteilungen').all()
  } catch (error) {
    addError(error)
  }
  setAbteilungen(abteilungen)
}

export default fetchAbteilungen
