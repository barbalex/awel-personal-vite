const fetchMutations = ({ store }) => {
  const { db, setMutations, addError } = store
  let mutations = []
  try {
    mutations = db.prepare('SELECT * from mutations').all()
  } catch (error) {
    addError(error)
  }
  setMutations(mutations)
}

export default fetchMutations
