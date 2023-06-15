const fetchTelefones = async ({ store }) => {
  const { setTelefones, addError } = store
  let telefones = []
  try {
    telefones = await window.electronAPI.query('SELECT * from telefones')
  } catch (error) {
    addError(error)
  }
  telefones && setTelefones(telefones)
}

export default fetchTelefones
