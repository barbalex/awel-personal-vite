const fetchLinks = ({ store }) => {
  const { setLinks, addError } = store
  let links = []
  try {
    links = window.electronAPI.query('SELECT * from links')
  } catch (error) {
    addError(error)
  }
  setLinks(links)
}

export default fetchLinks
