const fetchKaderFunktionen = async ({ store }) => {
  const { setKaderFunktionen, addError } = store
  let funktionen = []
  try {
    funktionen = await window.electronAPI.query('SELECT * from kaderFunktionen')
  } catch (error) {
    addError(error)
  }
  funktionen && setKaderFunktionen(funktionen)
}

export default fetchKaderFunktionen
