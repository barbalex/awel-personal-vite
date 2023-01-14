const fetchSektionen = ({ store }) => {
  const { setSektionen, addError } = store
  let sektionen = []
  try {
    sektionen = window.electronAPI.query('SELECT * from sektionen')
  } catch (error) {
    addError(error)
  }
  setSektionen(sektionen)
}

export default fetchSektionen
