import { types } from 'mobx-state-tree'

export default types.model('Anwesenheitstag', {
  id: types.maybe(types.integer),
  deleted: types.optional(types.integer, 0),
  idPerson: types.maybe(types.union(types.integer, types.null)),
  tag: types.maybe(types.union(types.string, types.integer, types.null)),
})
