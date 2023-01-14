const fetchSchluessel = ({ store }) => {
  const { setSchluessel, addError } = store
  let schluessel = []
  try {
    schluessel = window.electronAPI.query('SELECT * from schluessel')
  } catch (error) {
    addError(error)
  }
  setSchluessel(schluessel)
}

export default fetchSchluessel
