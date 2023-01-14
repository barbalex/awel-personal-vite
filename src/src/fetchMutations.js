const fetchMutations = ({ store }) => {
  const { setMutations, addError } = store
  let mutations = []
  try {
    mutations = window.electronAPI.query('SELECT * from mutations')
  } catch (error) {
    addError(error)
  }
  setMutations(mutations)
}

export default fetchMutations
