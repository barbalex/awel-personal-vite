const fetchUser = async ({ store, id }) => {
  const { addError, setWatchMutations, setUser } = store

  let result = []
  try {
    result = await window.electronAPI.queryWithParam(
      'SELECT * from users where id = ?',
      id,
    )
  } catch (error) {
    addError(error)
  }

  const user = result?.[0]
  if (!user) return

  setWatchMutations(false)
  setUser(user)
  setWatchMutations(true)
}

export default fetchUser
