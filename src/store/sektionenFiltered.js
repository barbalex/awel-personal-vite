import { getSnapshot } from 'mobx-state-tree'

export default self => {
  const { filterFulltext } = self
  let sektionen = getSnapshot(self.sektionen)
  const filterSektion = getSnapshot(self.filterSektion)
  Object.keys(filterSektion).forEach(key => {
    if (filterSektion[key] || filterSektion[key] === 0) {
      sektionen = sektionen.filter(p => {
        if (!filterSektion[key]) return true
        if (!p[key]) return false
        return p[key]
          .toString()
          .toLowerCase()
          .includes(filterSektion[key].toString().toLowerCase())
      })
    }
  })
  sektionen = sektionen
    .filter(p => {
      if (!self.showDeleted) return p.deleted === 0
      return true
    })
    .filter(p => {
      if (!filterFulltext) return true
      // now check for any value if includes
      const personValues = Object.entries(p)
        .filter(e => e[0] !== 'id')
        .map(e => e[1])
      return (
        [...personValues].filter(v => {
          if (!v) return false
          if (!v.toString()) return false
          return v
            .toString()
            .toLowerCase()
            .includes(filterFulltext.toString().toLowerCase())
        }).length > 0
      )
    })
  return sektionen
}
