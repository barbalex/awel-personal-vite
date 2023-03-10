import { getSnapshot } from 'mobx-state-tree'

export default self => {
  const { filterAmt, filterFulltext } = self
  let aemter = getSnapshot(self.aemter)
  Object.keys(filterAmt).forEach(key => {
    if (filterAmt[key] || filterAmt[key] === 0) {
      aemter = aemter.filter(p => {
        if (!filterAmt[key]) return true 
        if (!p[key]) return false
        return p[key]
          .toString()
          .toLowerCase()
          .includes(filterAmt[key].toString().toLowerCase())
      })
    }
  })
  aemter = aemter
    .filter(p => {
      if (!self.showDeleted) return p.deleted === 0
      return true
    })
    .filter(p => {
      if (!filterFulltext) return true
      // now check for any value if includes
      const amtValues = Object.entries(p)
        .filter(e => e[0] !== 'id')
        .map(e => e[1])
      return (
        [...amtValues].filter(v => {
          if (!v) return false
          if (!v.toString()) return false
          return v
            .toString()
            .toLowerCase()
            .includes(filterFulltext.toString().toLowerCase())
        }).length > 0
      )
    })
  return aemter
}
