const fetchLinks = async ({ store }) => {
  const { setLinks, addError } = store
  let links = []
  try {
    links = await window.electronAPI.query('SELECT * from links')
  } catch (error) {
    addError(error)
  }
  links && setLinks(links)
}

export default fetchLinks
