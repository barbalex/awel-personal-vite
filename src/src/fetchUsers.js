const fetchUsers = async ({ store }) => {
  const { setUsers, addError } = store
  let users = []
  try {
    users = await window.electronAPI.query('SELECT * from users')
  } catch (error) {
    addError(error)
  }
  setUsers(users)
}

export default fetchUsers
