const fetchEtiketten = async ({ store }) => {
  const { setEtiketten, addError } = store
  let etiketten = []
  try {
    etiketten = await window.electronAPI.query('SELECT * from etiketten')
  } catch (error) {
    addError(error)
  }
  etiketten && setEtiketten(etiketten)
}

export default fetchEtiketten
