const fetchBereiche = ({ store }) => {
  const { db, setBereiche, addError } = store
  let bereiche = []
  try {
    bereiche = db.prepare('SELECT * from bereiche').all()
  } catch (error) {
    addError(error)
  }
  setBereiche(bereiche)
}

export default fetchBereiche
