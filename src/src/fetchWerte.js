const fetchWerte = ({ table, store }) => {
  const { setWerte, addError } = store
  let values = []
  try {
    values = window.electronAPI.query(`SELECT * from ${table}`)
  } catch (error) {
    addError(error)
  }
  // TODO: this can be removed when historic field was removed
  values = values.filter((v) => {
    if (v.historic) return v.historic === 0
    return true
  })
  setWerte({ table, values })
}

export default fetchWerte
