import { types, getParent } from 'mobx-state-tree'

import ifIsNumericAsNumber from '../src/ifIsNumericAsNumber'

export default types
  .model('Abteilung', {
    id: types.maybe(types.integer),
    deleted: types.optional(types.integer, 0),
    mutationNoetig: types.optional(types.integer, 0),
    mutationFrist: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    sektion: types.maybeNull(types.integer),
    abteilung: types.maybeNull(types.integer),
    bereich: types.maybeNull(types.integer),
    name: types.maybe(types.union(types.string, types.integer, types.null)),
    kurzzeichen: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    telefonNr: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    email: types.maybe(types.union(types.string, types.integer, types.null)),
    standort: types.maybe(types.union(types.string, types.integer, types.null)),
    leiter: types.maybeNull(types.integer),
    kostenstelle: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    letzteMutationZeit: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    letzteMutationUser: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
  })
