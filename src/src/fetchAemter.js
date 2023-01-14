const fetchAemter = ({ store }) => {
  const { setAemter, addError } = store
  let aemter = []
  try {
    aemter = window.electronAPI.query('SELECT * from aemter')
  } catch (error) {
    addError(error)
  }
  setAemter(aemter)
}

export default fetchAemter
