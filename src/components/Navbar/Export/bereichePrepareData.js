const bereichePrepareData = ({ store }) =>
  store.bereicheFilteredSorted
    .slice()
    .map((pOrig) => {
      const p = { ...pOrig }
      const amt = store.aemter.find((a) => a.id === p.amt) || {}
      p.amt_id = amt.id || ''
      p.amt_name = amt.name || ''
      delete p.amt
      return p
    })
    .map((p) => {
      const abteilung =
        store.abteilungen.find((a) => a.id === p.abteilung) || {}
      p.abteilung_id = abteilung.id || ''
      p.abteilung_name = abteilung.name || ''
      delete p.abteilung
      return p
    })
    .map((p) => {
      const sektion = store.sektionen.find((a) => a.id === p.sektion) || {}
      p.sektion_id = sektion.id || ''
      p.sektion_name = sektion.name || ''
      delete p.sektion
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

export default bereichePrepareData
