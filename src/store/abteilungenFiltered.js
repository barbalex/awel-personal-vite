import { getSnapshot } from 'mobx-state-tree'

const abteilungenFiltered = (self) => {
  const { filterAbteilung, filterFulltext } = self
  let abteilungen = getSnapshot(self.abteilungen)
  Object.keys(filterAbteilung).forEach((key) => {
    if (filterAbteilung[key] || filterAbteilung[key] === 0) {
      abteilungen = abteilungen.filter((p) => {
        if (!filterAbteilung[key]) return true
        if (!p[key]) return false
        return p[key]
          .toString()
          .toLowerCase()
          .includes(filterAbteilung[key].toString().toLowerCase())
      })
    }
  })
  abteilungen = abteilungen
    .filter((p) => {
      if (!self.showDeleted) return p.deleted === 0
      return true
    })
    .filter((p) => {
      if (!filterFulltext) return true
      // now check for any value if includes
      const abteilungValues = Object.entries(p)
        .filter((e) => e[0] !== 'id')
        .map((e) => e[1])
      return (
        [...abteilungValues].filter((v) => {
          if (!v) return false
          if (!v.toString()) return false
          return v
            .toString()
            .toLowerCase()
            .includes(filterFulltext.toString().toLowerCase())
        }).length > 0
      )
    })
  return abteilungen
}

export default abteilungenFiltered
