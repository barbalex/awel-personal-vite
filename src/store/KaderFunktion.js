import { types } from 'mobx-state-tree'

export default types.model('KaderFunktion', {
  id: types.maybe(types.integer),
  deleted: types.optional(types.integer, 0),
  idPerson: types.maybe(types.union(types.integer, types.null)),
  funktion: types.maybe(types.union(types.string, types.integer, types.null)),
})
