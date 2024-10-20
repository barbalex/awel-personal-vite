const fetchPersonen = async ({ store }) => {
  const { setPersonen, addError } = store
  let personen = []
  try {
    personen = await window.electronAPI.query('SELECT * from personen')
  } catch (error) {
    addError(error)
  }
  personen && setPersonen(personen)
}

export default fetchPersonen
