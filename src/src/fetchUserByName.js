// Not used any more
const fetchUserByName = async ({ store }) => {
  const { addError, userName } = store

  let result = []
  try {
    result = await window.electronAPI.queryWithParam(
      'SELECT * from users where name = ?',
      userName,
    )
  } catch (error) {
    addError(error)
  }

  const user = result?.[0]

  return user
}

export default fetchUserByName
