const fetchPersonen = ({ store }) => {
  const { setPersonen, addError } = store
  let personen = []
  try {
    personen = window.electronAPI.query('SELECT * from personen')
  } catch (error) {
    addError(error)
  }
  setPersonen(personen)
}

export default fetchPersonen
