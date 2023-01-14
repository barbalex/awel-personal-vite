const fetchSchluessel = async ({ store }) => {
  const { setSchluessel, addError } = store
  let schluessel = []
  try {
    schluessel = await window.electronAPI.query('SELECT * from schluessel')
  } catch (error) {
    addError(error)
  }
  setSchluessel(schluessel)
}

export default fetchSchluessel
