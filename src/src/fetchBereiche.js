const fetchBereiche = async ({ store }) => {
  const { setBereiche, addError } = store
  let bereiche = []
  try {
    bereiche = await window.electronAPI.query('SELECT * from bereiche')
  } catch (error) {
    addError(error)
  }
  bereiche && setBereiche(bereiche)
}

export default fetchBereiche
