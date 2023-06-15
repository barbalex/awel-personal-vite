const fetchMobileAbos = async ({ store }) => {
  const { setMobileAbos, addError } = store
  let mobileAbos = []
  try {
    mobileAbos = await window.electronAPI.query('SELECT * from mobileAbos')
  } catch (error) {
    addError(error)
  }
  mobileAbos && setMobileAbos(mobileAbos)
}

export default fetchMobileAbos
