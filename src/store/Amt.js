import { types, getParent } from 'mobx-state-tree'

import ifIsNumericAsNumber from '../src/ifIsNumericAsNumber'

export default types
  .model('Amt', {
    id: types.maybe(types.integer),
    deleted: types.optional(types.integer, 0),
    mutationNoetig: types.optional(types.integer, 0),
    mutationFrist: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
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
  .actions((self) => ({
    fetch() {
      // ensure data is always fresh
      const store = getParent(self, 2)
      const { addError, setWatchMutations } = store
      let amt = []
      try {
        amt = window.electronAPI.queryWithParam(
          'SELECT * from aemter where id = ?',
          self.id,
        )
      } catch (error) {
        addError(error)
      }
      setWatchMutations(false)
      Object.keys(amt).forEach((field) => {
        if (self[field] !== amt[field]) {
          self[field] = ifIsNumericAsNumber(amt[field])
        }
      })
      setWatchMutations(true)
    },
  }))
