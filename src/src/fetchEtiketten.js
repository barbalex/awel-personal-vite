const fetchEtiketten = ({ store }) => {
  const { setEtiketten, addError } = store
  let etiketten = []
  try {
    etiketten = window.electronAPI.query('SELECT * from etiketten')
  } catch (error) {
    addError(error)
  }
  setEtiketten(etiketten)
}

export default fetchEtiketten
