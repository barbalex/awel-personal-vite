const fetchMobileAbos = ({ store }) => {
  const { db, setMobileAbos, addError } = store
  let mobileAbos = []
  try {
    mobileAbos = db.prepare('SELECT * from mobileAbos').all()
  } catch (error) {
    addError(error)
  }
  setMobileAbos(mobileAbos)
}

export default fetchMobileAbos
