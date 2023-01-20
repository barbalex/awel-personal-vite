import { types, getParent } from 'mobx-state-tree'

export default types
  .model('Person', {
    id: types.maybe(types.integer),
    deleted: types.optional(types.integer, 0),
    mutationNoetig: types.optional(types.integer, 0),
    mutationFrist: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    mutationBemerkung: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    personalNr: types.maybe(types.union(types.integer, types.null)),
    name: types.maybe(types.union(types.string, types.integer, types.null)),
    vorname: types.maybe(types.union(types.string, types.integer, types.null)),
    titel: types.maybe(types.union(types.string, types.integer, types.null)),
    kurzzeichen: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    adresse: types.maybe(types.union(types.string, types.integer, types.null)),
    plz: types.maybe(types.union(types.integer, types.null)),
    ort: types.maybe(types.union(types.string, types.integer, types.null)),
    land: types.maybe(types.union(types.string, types.integer, types.null)),
    bildUrl: types.maybe(types.union(types.string, types.integer, types.null)),
    email: types.maybe(types.union(types.string, types.integer, types.null)),
    geburtDatum: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    amt: types.maybe(types.union(types.integer, types.null)),
    abteilung: types.maybe(types.union(types.integer, types.null)),
    sektion: types.maybe(types.union(types.integer, types.null)),
    bereich: types.maybe(types.union(types.integer, types.null)),
    bueroNr: types.maybe(types.union(types.string, types.integer, types.null)),
    standort: types.maybe(types.union(types.string, types.integer, types.null)),
    vorgesetztId: types.maybeNull(types.integer),
    eintrittDatum: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    austrittDatum: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    status: types.maybe(types.union(types.string, types.integer, types.null)),
    parkplatzNr: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    anrede: types.maybe(types.union(types.string, types.integer, types.null)),
    bemerkungen: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    beschaeftigungsgrad: types.maybe(types.union(types.integer, types.null)),
    mutationArt: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    telefonUebernommenVon: types.maybeNull(types.integer),
    rufnummer: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    schluesselNoetig: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    arbeitsplatzeroeffnungPer: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    benoetigteSoftware: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    standardabweichendeHardware: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    abmeldungArbeitsplatzPer: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    itMutationBemerkungen: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    letzteMutationZeit: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    letzteMutationUser: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
  })
  .views((self) => ({
    get kostenstelle() {
      const store = getParent(self, 2)
      const { bereiche, sektionen, abteilungen, aemter } = store
      if (self.bereich) {
        const bereich = bereiche.find((b) => b.id === self.bereich)
        if (bereich && bereich.kostenstelle) {
          return `${bereich.kostenstelle} (von Bereich ${bereich.name})`
        }
      }
      if (self.sektion) {
        const sektion = sektionen.find((b) => b.id === self.sektion)
        if (sektion && sektion.kostenstelle) {
          return `${sektion.kostenstelle} (von Sektion ${sektion.name})`
        }
      }
      if (self.abteilung) {
        const abteilung = abteilungen.find((b) => b.id === self.abteilung)
        if (abteilung && abteilung.kostenstelle) {
          return `${abteilung.kostenstelle} (von Abteilung ${abteilung.name})`
        }
      }
      if (self.amt) {
        const amt = aemter.find((b) => b.id === self.amt)
        if (amt && amt.kostenstelle) {
          return `${amt.kostenstelle} (von Amt ${amt.name})`
        }
      }
      return '(keine Kostenstelle)'
    },
  }))
