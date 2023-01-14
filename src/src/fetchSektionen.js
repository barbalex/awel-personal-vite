const fetchSektionen = ({ store }) => {
  const { db, setSektionen, addError } = store
  let sektionen = []
  try {
    sektionen = db.prepare('SELECT * from sektionen').all()
  } catch (error) {
    addError(error)
  }
  setSektionen(sektionen)
}

export default fetchSektionen
