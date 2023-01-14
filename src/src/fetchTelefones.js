const fetchTelefones = ({ store }) => {
  const { db, setTelefones, addError } = store
  let telefones = []
  try {
    telefones = db.prepare('SELECT * from telefones').all()
  } catch (error) {
    addError(error)
  }
  setTelefones(telefones)
}

export default fetchTelefones
