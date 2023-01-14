const fetchSektionen = async ({ store }) => {
  const { setSektionen, addError } = store
  let sektionen = []
  try {
    sektionen = await window.electronAPI.query('SELECT * from sektionen')
  } catch (error) {
    addError(error)
  }
  setSektionen(sektionen)
}

export default fetchSektionen
