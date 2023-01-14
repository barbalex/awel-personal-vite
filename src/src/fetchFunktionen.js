const fetchFunktionen = async ({ store }) => {
  const { setFunktionen, addError } = store
  let funktionen = []
  try {
    funktionen = await window.electronAPI.query('SELECT * from funktionen')
  } catch (error) {
    addError(error)
  }
  setFunktionen(funktionen)
}

export default fetchFunktionen
