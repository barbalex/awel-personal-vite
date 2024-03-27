// Not used any more
const fetchUserByName = async ({ store }) => {
  const { addError, userName } = store

  let result = []
  try {
    // windows usernames are case insensitive
    // thus: COLLATE NOCASE
    result = await window.electronAPI.queryWithParam(
      'SELECT * from users where name = ? COLLATE NOCASE',
      userName,
    )
  } catch (error) {
    addError(error)
  }

  const user = result?.[0]

  return user
}

export default fetchUserByName
