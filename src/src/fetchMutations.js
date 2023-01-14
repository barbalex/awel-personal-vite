const fetchMutations = async ({ store }) => {
  const { setMutations, addError } = store
  let mutations = []
  try {
    mutations = await window.electronAPI.query('SELECT * from mutations')
  } catch (error) {
    addError(error)
  }
  setMutations(mutations)
}

export default fetchMutations
