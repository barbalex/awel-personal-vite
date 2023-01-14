const sektionenPrepareData = ({ store }) =>
  store.sektionenFilteredSorted
    .slice()
    .map((pOrig) => {
      const p = { ...pOrig }
      const abteilung =
        store.abteilungen.find((a) => a.id === p.abteilung) || {}
      p.abteilung_id = abteilung.id || ''
      p.abteilung_name = abteilung.name || ''
      delete p.abteilung
      return p
    })
    .map((p) => {
      const leiter = store.personen.find((a) => a.id === p.leiter) || {}
      p.leiter_id = leiter.id || ''
      p.leiter_name = leiter.name || ''
      p.leiter_vorname = leiter.vorname || ''
      p.leiter_ort = leiter.ort || ''
      delete p.leiter
      return p
    })

export default sektionenPrepareData
