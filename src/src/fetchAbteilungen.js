const fetchAbteilungen = async ({ store }) => {
  const { setAbteilungen, addError } = store
  let abteilungen = []
  try {
    abteilungen = await window.electronAPI.query('SELECT * from abteilungen')
  } catch (error) {
    addError(error)
  }
  setAbteilungen(abteilungen)
}

export default fetchAbteilungen
