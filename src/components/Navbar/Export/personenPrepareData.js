import omit from 'lodash/omit'
import { toJS } from 'mobx'

const mutationFields = [
  'mutationArt',
  'telefonUebernommenVon',
  'rufnummer',
  'schluesselNoetig',
  'arbeitsplatzeroeffnungPer',
  'benoetigteSoftware',
  'standardabweichendeHardware',
  'abmeldungArbeitsplatzPer',
  'bueroWechselPer',
  'kostenstellenAenderungPer',
  'itMutationBemerkungen',
]

const personenPrepareData = ({ store }) =>
  store.personenFilteredSorted
    .map((p) => toJS(p))
    .map((p) => {
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
      const bereich = store.bereiche.find((a) => a.id === p.bereich) || {}
      p.bereich_id = bereich.id || ''
      p.bereich_name = bereich.name || ''
      delete p.bereich
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
    .map((p) => {
      const etiketten = store.etiketten
        .filter((a) => a.idPerson === p.id)
        .map((f) => f.etikett)
        .join(', ')
      p.etiketten = etiketten
      return p
    })
    .map((p) => {
      const anwesenheitstage = store.anwesenheitstage
        .filter((a) => a.idPerson === p.id)
        .map((f) => f.tag)
        .join(', ')
      p.anwesenheitstage = anwesenheitstage
      return p
    })
    .map((p) => {
      const telefone = store.telefones
        .filter((a) => a.idPerson === p.id)
        .map((f) => `${f.nr || '(keine Nummer)'} (${f.typ || 'kein Typ'})`)
        .join(' | ')
      p.telefone = telefone
      return p
    })
    .map((p) => {
      const schluessel = store.schluessel
        .filter((a) => a.idPerson === p.id)
        .map(
          (f) =>
            `Typ: ${f.typ || '(kein)'}, Anlage: (${
              f.anlage || '(keine)'
            }), Nr. ${f.nr || '(keine)'}, Bezeichnung: ${
              f.bezeichnung || '(keine)'
            }`,
        )
        .join(' | ')
      p.schluessel = schluessel
      return p
    })
    .map((p) => {
      const mobileAbos = store.mobileAbos
        .filter((a) => a.idPerson === p.id)
        .map(
          (f) =>
            `Typ: ${f.typ || '(kein)'}, Kostenstelle: ${
              f.kostenstelle || '(keine)'
            }`,
        )
        .join(' | ')
      p.mobileAbos = mobileAbos
      return p
    })
    .map((p) => omit(p, mutationFields))

export default personenPrepareData
