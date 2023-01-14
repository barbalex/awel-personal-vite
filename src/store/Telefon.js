import { types } from 'mobx-state-tree'

export default types.model('Telefon', {
  id: types.maybe(types.integer),
  deleted: types.optional(types.integer, 0),
  idPerson: types.maybe(types.union(types.integer, types.null)),
  nr: types.maybe(types.union(types.string, types.integer, types.null)),
  typ: types.maybe(types.union(types.string, types.integer, types.null)),
  bemerkungen: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
})
