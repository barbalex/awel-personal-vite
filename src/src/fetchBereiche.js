const fetchBereiche = ({ store }) => {
  const { setBereiche, addError } = store
  let bereiche = []
  try {
    bereiche = window.electronAPI.query('SELECT * from bereiche')
  } catch (error) {
    addError(error)
  }
  setBereiche(bereiche)
}

export default fetchBereiche
