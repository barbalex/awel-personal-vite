const fetchUserByName = async ({ store }) => {
  const { addError, username } = store

  let result = []
  try {
    result = await window.electronAPI.queryWithParam(
      'SELECT * from users where name = ?',
      username,
    )
  } catch (error) {
    addError(error)
  }

  const user = result?.[0]

  return user
}

export default fetchUserByName
