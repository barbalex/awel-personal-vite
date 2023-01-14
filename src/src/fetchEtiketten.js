const fetchEtiketten = ({ store }) => {
  const { db, setEtiketten, addError } = store
  let etiketten = []
  try {
    etiketten = db.prepare('SELECT * from etiketten').all()
  } catch (error) {
    addError(error)
  }
  setEtiketten(etiketten)
}

export default fetchEtiketten
