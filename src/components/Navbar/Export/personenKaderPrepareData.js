import pick from 'lodash/pick'
import uniq from 'lodash/uniq'
import { toJS } from 'mobx'

const fields = [
  'name',
  'vorname',
  'amt',
  'abteilung',
  'sektion',
  'bereich',
  'kaderFunktionen',
  'funktionen',
]

const personenKaderPrepareData = ({ store }) => {
  const { personenSorted, kaderFunktionen, etiketten } = store
  const kaderIds = uniq(
    kaderFunktionen.filter((f) => f.deleted === 0).map((f) => f.idPerson),
  )
  const etikettenKaderIds = uniq(
    etiketten
      .filter((f) => f.deleted === 0)
      .filter((e) =>
        ['Kadertreffen', 'Sektionsleitertreffen'].includes(e.etikett),
      )
      .map((f) => f.idPerson),
  )

  return (
    personenSorted
      // no deleted
      .filter((p) => p.deleted === 0)
      // only active
      .filter((f) => f.status === 'aktiv')
      .filter(
        (p) => kaderIds.includes(p.id) || etikettenKaderIds.includes(p.id),
      )
      .map((p) => toJS(p))
      .map((p) => {
        const amt = store.aemter.find((a) => a.id === p.amt) || {}
        delete p.amt
        p.amt = amt.name || ''
        return p
      })
      .map((p) => {
        const abteilung =
          store.abteilungen.find((a) => a.id === p.abteilung) || {}
        delete p.abteilung
        p.abteilung = abteilung.name || ''
        return p
      })
      .map((p) => {
        const sektion = store.sektionen.find((a) => a.id === p.sektion) || {}
        delete p.sektion
        p.sektion = sektion.name || ''
        return p
      })
      .map((p) => {
        const bereich = store.bereiche.find((a) => a.id === p.bereich) || {}
        delete p.bereich
        p.bereich = bereich.name || ''
        return p
      })
      .map((p) => {
        const kaderFunktionen = store.kaderFunktionen
          .filter((a) => a.idPerson === p.id)
          .map((f) => f.funktion)
          .join(', ')
        p.kaderFunktionen = kaderFunktionen
        return p
      })
      .map((p) => {
        const funktionen = store.funktionen
          .filter((a) => a.idPerson === p.id)
          .map((f) => f.funktion)
          .join(', ')
        p.funktionen = funktionen
        return p
      })
      .map((p) => pick(p, fields))
  )
}

export default personenKaderPrepareData
