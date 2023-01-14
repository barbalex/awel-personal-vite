const fetchFunktionen = ({ store }) => {
  const { setFunktionen, addError } = store
  let funktionen = []
  try {
    funktionen = window.electronAPI.query('SELECT * from funktionen')
  } catch (error) {
    addError(error)
  }
  setFunktionen(funktionen)
}

export default fetchFunktionen
