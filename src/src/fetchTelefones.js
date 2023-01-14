const fetchTelefones = ({ store }) => {
  const { setTelefones, addError } = store
  let telefones = []
  try {
    telefones = window.electronAPI.query('SELECT * from telefones')
  } catch (error) {
    addError(error)
  }
  setTelefones(telefones)
}

export default fetchTelefones
