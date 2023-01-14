const fetchAemter = ({ store }) => {
  const { db, setAemter, addError } = store
  let aemter = []
  try {
    aemter = db.prepare('SELECT * from aemter').all()
  } catch (error) {
    addError(error)
  }
  setAemter(aemter)
}

export default fetchAemter
