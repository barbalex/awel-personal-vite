const fetchMobileAbos = ({ store }) => {
  const { setMobileAbos, addError } = store
  let mobileAbos = []
  try {
    mobileAbos = window.electronAPI.query('SELECT * from mobileAbos')
  } catch (error) {
    addError(error)
  }
  setMobileAbos(mobileAbos)
}

export default fetchMobileAbos
