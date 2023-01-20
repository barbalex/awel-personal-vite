import { getSnapshot } from 'mobx-state-tree'

export default (self) => {
  const { filterUser, filterFulltext } = self
  let users = getSnapshot(self.users)
  Object.keys(filterUser).forEach((key) => {
    if (filterUser[key] || filterUser[key] === 0) {
      users = users.filter((p) => {
        if (!filterUser[key]) return true
        if (!p[key]) return false
        return p[key]
          .toString()
          .toLowerCase()
          .includes(filterUser[key].toString().toLowerCase())
      })
    }
  })
  users = users.filter((p) => {
    if (!filterFulltext) return true
    // now check for any value if includes
    const userValues = Object.entries(p)
      .filter((e) => !['id', 'password'].includes(e[0]))
      .map((e) => e[1])
    return (
      [...userValues].filter((v) => {
        if (!v) return false
        if (!v.toString()) return false
        return v
          .toString()
          .toLowerCase()
          .includes(filterFulltext.toString().toLowerCase())
      }).length > 0
    )
  })
  return users
}
