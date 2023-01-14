const aemterPrepareData = ({ store }) =>
  store.aemterFilteredSorted.slice().map((pOrig) => {
    const p = { ...pOrig }
    const leiter = store.personen.find((a) => a.id === p.leiter) || {}
    p.leiter_id = leiter.id || ''
    p.leiter_name = leiter.name || ''
    p.leiter_vorname = leiter.vorname || ''
    p.leiter_ort = leiter.ort || ''
    delete p.leiter
    return p
  })

export default aemterPrepareData
